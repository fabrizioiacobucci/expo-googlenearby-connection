package expo.modules.googlenearbyconnection

import android.content.ContentResolver
import android.net.Uri
import android.os.Bundle
import androidx.core.os.bundleOf
import com.google.android.gms.nearby.connection.ConnectionsClient
import com.google.android.gms.nearby.connection.Payload
import com.google.android.gms.tasks.Task
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import java.io.IOException
import java.io.InputStream
import java.io.OutputStream
import java.io.PipedInputStream
import java.io.PipedOutputStream
import java.util.concurrent.ConcurrentHashMap

/**
 * Handles creation, management, and lifecycle of Google Nearby Payloads.
 */
object PayloadHandler {

    // Map of active payloads indexed by their ID.
    private val _payloads: MutableMap<Long, Payload> = mutableMapOf()

    // Map of stream payloads and their associated streams.
    private val _streams: ConcurrentHashMap<Long, StreamsRecord> = ConcurrentHashMap()

    /**
     * Creates a new Payload based on the provided PayloadData.
     * @param data The data to be encapsulated in the Payload.
     * @param contentResolver Optional ContentResolver for file URIs.
     * @return The ID of the created Payload.
     */
    fun new(data: PayloadData, contentResolver: ContentResolver? = null): String {
        val payload = when (data) {

            is PayloadData.Bytes -> Payload.fromBytes(data.data)

            is PayloadData.File -> {
                contentResolver?.let { resolver ->
                    val fileDescriptor = resolver.openFileDescriptor(data.uri, "r")
                        ?: throw IllegalArgumentException("Invalid Uri: ${data.uri}")

                    val payload = Payload.fromFile(fileDescriptor)
                    data.isSensitive?.let { payload.setSensitive(it) }
                    data.fileName?.let { payload.setFileName(it) }
                    data.parentFolder?.let { payload.setParentFolder(it) }
                    payload

                } ?: throw IllegalArgumentException("File payload creation attempt but ContentResolver is null")
            }

            is PayloadData.Stream -> {
                val pipedOutputStream = PipedOutputStream()
                val pipedInputStream = PipedInputStream(pipedOutputStream, data.size)
                val payload = Payload.fromStream(pipedInputStream)
                _streams.putIfAbsent(payload.id, StreamsRecord.Output(Mutex(), pipedOutputStream))
                payload
            }
        }

        add(payload)
        return payload.id.toString()
    }

    /**
     * Adds a Payload to the internal map.
     * @param payload The Payload to add.
     */
    fun add(payload: Payload) {
        _payloads.putIfAbsent(payload.id, payload)
        if (payload.type == Payload.Type.STREAM) {
            _streams.putIfAbsent(payload.id, StreamsRecord.Input(Mutex(), payload.asStream()!!.asInputStream()))
        }
    }

    /**
     * Removes a Payload by its ID.
     * @param payloadId The ID of the Payload to remove.
     */
    fun remove(payloadId: Long) {
        val payload = get(payloadId)

        payload.close()
        val streams = _streams[payloadId]
        streams?.let { if (it is StreamsRecord.Input) it.inputStream.close() }
        streams?.let { if (it is StreamsRecord.Output) it.outputStream.close() }

        _payloads.remove(payloadId)
        _streams.remove(payloadId)
    }

    /**
     * Removes all Payloads.
     */
    fun removeAll() {
        _payloads.forEach { (_, payload) -> remove(payload.id) }
    }

    /**
     * Retrieves a Payload by its ID.
     * @param payloadId The ID of the Payload.
     * @return The retrieved Payload.
     */
    private fun get(payloadId: Long): Payload {
        return _payloads[payloadId]
            ?: throw PayloadNotFoundException(payloadId)
    }

    /**
     * Retrieves stream-related information for a Payload.
     * @param payloadId The ID of the Payload.
     * @return The associated StreamsRecord.
     */
    private fun getStreams(payloadId: Long): StreamsRecord {
        return _streams[payloadId]
            ?: throw PayloadNotFoundException(payloadId)
    }

    /**
     * Retrieves detailed information about a Payload as a Bundle.
     * @param payloadId The ID of the Payload.
     * @return A Bundle containing the Payload's details.
     */
    fun getInfo(payloadId: Long): Bundle {
        val payload = get(payloadId)

        val info = bundleOf(
            "id" to payload.id,
            "type" to payload.type,
            "offset" to payload.offset
        )

        when (payload.type) {
            Payload.Type.FILE -> info.putString("uri", payload.asFile()?.asUri().toString())
            Payload.Type.BYTES -> {
                info.putAll(
                    bundleOf(
                        "size" to payload.asBytes()?.size,
                        "bytes" to payload.asBytes()
                    )
                )
            }
        }

        return info
    }

    /**
     * Retrieves a list of Payload IDs.
     * @return A list of Payload IDs as strings.
     */
    fun getList(): List<String> {
        return _payloads.values.map { payload -> payload.id.toString() }
    }

    /**
     * Retrieves detailed information about all Payloads as a list of Bundles.
     * @return A list of Bundles containing Payload details.
     */
    fun getInfoList(): List<Bundle> {
        return _payloads.values.map { payload -> getInfo(payload.id) }
    }

    /**
     * Checks if a Payload exists.
     * @param payloadId The ID of the Payload.
     * @return True if the Payload exists, false otherwise.
     */
    fun exists(payloadId: Long): Boolean {
        return _payloads.containsKey(payloadId)
    }

    /**
     * Sends a Payload to specified endpoint IDs using the ConnectionsClient.
     * @param connectionsClient The ConnectionsClient instance to use for sending the Payload.
     * @param endpointIds The list of endpoint ID(s) to send the Payload to. It can be a String or a List<String>.
     * @param payloadId The ID of the Payload to send.
     * @throws IllegalArgumentException If endpointIds is invalid.
     * @return A Task representing the result of the send operation.
     */
    fun send(connectionsClient: ConnectionsClient, endpointIds: Any, payloadId: Long): Task<Void> {
        val payload = get(payloadId)

        return when(endpointIds) {
            is String -> connectionsClient.sendPayload(endpointIds, payload)
            is List<*> -> {
                val endpointIdsStrings: List<String> = endpointIds.filterIsInstance<String>()
                connectionsClient.sendPayload(endpointIdsStrings, payload)
            }
            else -> throw IllegalArgumentException("endpointIds must be a String or a List<String>")
        }
    }

    /**
     * Sets a property on a Payload by its ID.
     * @param payloadId The ID of the Payload.
     * @param name The name of the property to set.
     * @param value The value to set for the property.
     * @throws IllegalArgumentException If the property is invalid or the value is incorrectly formatted.
     */
    fun setProperty(payloadId: Long, name: String, value: String) {
        val payload = get(payloadId)

        if (payload.type != Payload.Type.FILE && name != "offset")
            throw IllegalArgumentException("Property $name is only supported on Payloads of type File")

        if(PayloadProperty.entries.map { it.prop }.contains(name).not())
            throw IllegalArgumentException("Invalid property name: $name")

        try {
            when (name) {
                PayloadProperty.OFFSET.toString() -> payload.offset = value.toLong()
                PayloadProperty.FILENAME.toString() -> payload.setFileName(value)
                PayloadProperty.PARENTFOLDER.toString() -> payload.setParentFolder(value)
                else -> payload.setSensitive(value.lowercase().toBooleanStrict())
            }
        } catch (e: Exception) {
            throw IllegalArgumentException("Value $value of type ${value::class} is not in the correct format for property $name")
        }
    }

    /**
     * Cancels an ongoing Payload transfer using its ID.
     * @param connectionsClient The ConnectionsClient instance to use for canceling the Payload.
     * @param payloadId The ID of the Payload to cancel.
     * @return A Task representing the result of the cancel operation.
     */
    fun cancel(connectionsClient: ConnectionsClient, payloadId: Long): Task<Void> {
        get(payloadId)
        return connectionsClient.cancelPayload(payloadId)
    }

    // region Stream Payload

    /**
     * Flushes the output stream associated with a stream Payload.
     * @param payloadId The ID of the stream Payload.
     * @throws IOException If an error occurs during flushing.
     */
    suspend fun flushStream(payloadId: Long) {
        val streamsRecord = getStreams(payloadId)

        if (streamsRecord !is StreamsRecord.Output)
            throw IllegalArgumentException("Cannot write to an input stream")

        withContext(Dispatchers.IO) {
            streamsRecord.mutex.withLock {
                streamsRecord.outputStream.flush()
            }
        }
    }

    /**
     * Writes a single byte to the output stream of a stream Payload.
     * @param payloadId The ID of the stream Payload.
     * @param byte The byte to write.
     * @throws IOException If an error occurs during writing.
     */
    suspend fun writeStreamByte(payloadId: Long, byte: Int) {
        val streamsRecord = getStreams(payloadId)

        if (streamsRecord !is StreamsRecord.Output)
            throw IllegalArgumentException("Cannot write to an input stream")

        withContext(Dispatchers.IO) {
            streamsRecord.mutex.withLock {
                streamsRecord.outputStream.write(byte)
            }
        }
    }

    /**
     * Writes a byte array to the output stream of a stream Payload.
     * @param payloadId The ID of the stream Payload.
     * @param byteArray The byte array to write.
     * @param offset The starting offset in the array.
     * @param length The number of bytes to write.
     * @throws IOException If an error occurs during writing.
     */
    suspend fun writeStreamByteArray(payloadId: Long, byteArray: ByteArray, offset: Int, length: Int) {
        val streamsRecord = getStreams(payloadId)

        if (streamsRecord !is StreamsRecord.Output)
            throw IllegalArgumentException("Cannot write to an input stream")

        withContext(Dispatchers.IO) {
            streamsRecord.mutex.withLock {
                streamsRecord.outputStream.write(byteArray, offset, length)
            }
        }
    }

    /**
     * Reads a single byte from the input stream of a stream Payload.
     * @param payloadId The ID of the stream Payload.
     * @return The read byte.
     * @throws IOException If an error occurs during reading.
     */
    suspend fun readStreamByte(payloadId: Long): Int {
        val streamsRecord = getStreams(payloadId)

        if (streamsRecord !is StreamsRecord.Input)
            throw IllegalArgumentException("Cannot read from an output stream")

        return withContext(Dispatchers.IO) {
             streamsRecord.mutex.withLock {
                streamsRecord.inputStream.read()
            }
        }
    }

    /**
     * Reads a portion of a byte array from the input stream of a stream Payload.
     * @param payloadId The ID of the stream Payload.
     * @param offset The starting offset in the array to write to.
     * @param length The number of bytes to read.
     * @return The byte array filled with read data.
     * @throws IOException If an error occurs during reading.
     */
    suspend fun readStreamByteArray(payloadId: Long, offset: Int, length: Int): ByteArray {
        val streamsRecord = getStreams(payloadId)
        val byteArray = ByteArray(length)

        if (streamsRecord !is StreamsRecord.Input)
            throw IllegalArgumentException("Cannot read from an output stream")

        withContext(Dispatchers.IO) {
            streamsRecord.mutex.withLock {
                streamsRecord.inputStream.read(byteArray, offset, length)
            }
        }

        return byteArray
    }

    /**
     * Gets the number of available bytes in the input stream of a stream Payload.
     * @param payloadId The ID of the stream Payload.
     * @return The number of available bytes.
     * @throws IOException If an error occurs during the operation.
     */
    suspend fun availableStream(payloadId: Long): Int {
        val streamsRecord = getStreams(payloadId)

        if (streamsRecord !is StreamsRecord.Input)
            throw IllegalArgumentException("Cannot read available bytes from an output stream")

        return withContext(Dispatchers.IO) {
            streamsRecord.mutex.withLock {
                streamsRecord.inputStream.available()
            }
        }
    }

    /**
     * Marks the current position in the input stream of a stream Payload.
     * @param payloadId The ID of the stream Payload.
     * @param readLimit The maximum number of bytes to read before the mark becomes invalid.
     */
    suspend fun markStream(payloadId: Long, readLimit: Int) {
        val streamsRecord = getStreams(payloadId)

        if (streamsRecord !is StreamsRecord.Input)
            throw IllegalArgumentException("Cannot mark an output stream")

        if (streamsRecord.inputStream.markSupported())
            withContext(Dispatchers.IO) {
                streamsRecord.mutex.withLock {
                    streamsRecord.inputStream.mark(readLimit)
                }
            }
    }

    /**
     * Checks if marking the input stream of a stream Payload is supported.
     * @param payloadId The ID of the stream Payload.
     * @return True if marking is supported, false otherwise.
     */
    fun isMarkSupportedStream(payloadId: Long): Boolean {
        val streamsRecord = getStreams(payloadId)

        if (streamsRecord !is StreamsRecord.Input)
            throw IllegalArgumentException("Cannot mark or reset an output stream")

        return streamsRecord.inputStream.markSupported()
    }

    /**
     * Resets the input stream of a stream Payload to the last marked position.
     * @param payloadId The ID of the stream Payload.
     * @throws IOException If an error occurs during the reset operation.
     */
    suspend fun resetStream(payloadId: Long) {
        val streamsRecord = getStreams(payloadId)

        if (streamsRecord !is StreamsRecord.Input)
            throw IllegalArgumentException("Cannot reset an output stream")

        withContext(Dispatchers.IO) {
            streamsRecord.mutex.withLock {
                streamsRecord.inputStream.reset()
            }
        }
    }

    /**
     * Skips a specified number of bytes in the input stream of a stream Payload.
     * @param payloadId The ID of the stream Payload.
     * @param amount The number of bytes to skip.
     * @throws IOException If an error occurs during skipping.
     */
    suspend fun skipStream(payloadId: Long, amount: Long): Long {
        val streamsRecord = getStreams(payloadId)

        if (streamsRecord !is StreamsRecord.Input)
            throw IllegalArgumentException("Cannot skip an output stream")

        return withContext(Dispatchers.IO) {
            streamsRecord.mutex.withLock {
                streamsRecord.inputStream.skip(amount)
            }
        }
    }
}
// endregion Stream Payload

/**
 * Represents the data types that can be used to create a Payload.
 */
sealed class PayloadData {
    /**
     * Represents a byte array to be sent as a Payload.
     * @property data The byte array data.
     */
    data class Bytes(val data: ByteArray) : PayloadData()

    /**
     * Represents a file to be sent as a Payload.
     * @property uri The URI of the file.
     * @property isSensitive Whether the file is sensitive.
     * @property fileName The name of the file.
     * @property parentFolder The parent folder of the file.
     */
    data class File(
        val uri: Uri,
        val isSensitive: Boolean? = null,
        val fileName: String? = null,
        val parentFolder: String? = null
    ) : PayloadData()

    /**
     * Represents a stream to be sent as a Payload.
     * @property size The size of the stream buffer.
     */
    data class Stream(val size: Int) : PayloadData()
}

/**
 * Represents the result of a Payload operation.
 */
sealed class PayloadResult {
    /**
     * Represents the successful retrieval of byte data from a Payload.
     * @property data The byte array data.
     */
    data class Bytes(val data: ByteArray) : PayloadResult()

    /**
     * Represents the successful retrieval of a file from a Payload.
     * @property uri The URI of the file.
     */
    data class File(val uri: Uri) : PayloadResult()

    /**
     * Represents an error that occurred during a Payload operation.
     */
    data object Error : PayloadResult()
}

/**
 * Exception thrown when a Payload with a specified ID cannot be found.
 * @property payloadId The ID of the missing Payload.
 */
class PayloadNotFoundException(private val payloadId: Long) : IllegalArgumentException() {
    override val message: String
        get() = "Payload with id '$payloadId' was not found"
}

enum class PayloadProperty(val prop: String) {
    OFFSET("OFFSET"),
    FILENAME("FILENAME"),
    PARENTFOLDER("PARENTFOLDER"),
    SENSITIVE("SENSITIVE")
}

/**
 * Represents a record for managing input and output streams of a stream Payload.
 * @property mutex The Mutex used to synchronize stream operations.
 * @property inputStream The InputStream for the Payload.
 * @property outputStream The OutputStream for the Payload.
 */
sealed class StreamsRecord {
    data class Input(val mutex: Mutex, val inputStream: InputStream) : StreamsRecord()
    data class Output(val mutex: Mutex, val outputStream: OutputStream) : StreamsRecord()
}
