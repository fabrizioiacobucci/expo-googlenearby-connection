package expo.modules.googlenearbyconnection

import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.IntentSender
import android.location.LocationManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.util.Log
import androidx.core.os.bundleOf
import com.google.android.gms.common.api.ResolvableApiException
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.LocationSettingsRequest
import com.google.android.gms.nearby.Nearby
import com.google.android.gms.nearby.connection.AdvertisingOptions
import com.google.android.gms.nearby.connection.BandwidthInfo
import com.google.android.gms.nearby.connection.ConnectionInfo
import com.google.android.gms.nearby.connection.ConnectionLifecycleCallback
import com.google.android.gms.nearby.connection.ConnectionOptions
import com.google.android.gms.nearby.connection.ConnectionResolution
import com.google.android.gms.nearby.connection.ConnectionsClient
import com.google.android.gms.nearby.connection.ConnectionsStatusCodes
import com.google.android.gms.nearby.connection.DiscoveredEndpointInfo
import com.google.android.gms.nearby.connection.DiscoveryOptions
import com.google.android.gms.nearby.connection.EndpointDiscoveryCallback
import com.google.android.gms.nearby.connection.Payload
import com.google.android.gms.nearby.connection.PayloadCallback
import com.google.android.gms.nearby.connection.PayloadTransferUpdate
import com.google.android.gms.nearby.connection.Strategy
import expo.modules.core.interfaces.ActivityEventListener
import expo.modules.interfaces.permissions.Permissions
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.Promise
import expo.modules.kotlin.functions.Coroutine
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.IOException
import java.util.Locale

class ExpoGoogleNearbyConnectionModule : Module(), ActivityEventListener {

    // Null safe activity and context objects
    private val _safeAppContext: AppContext
        get() = appContext ?: throw IllegalStateException("AppContext is not initialized!")

    private val _safeCurrentActivity: Activity
        get() = appContext.currentActivity ?: throw IllegalStateException("CurrentActivity is not initialized!")

    private val _safeReactContext: Context
        get() = appContext.reactContext ?: throw IllegalStateException("ReactContext is not initialized!")

    private lateinit var _connectionsClient: ConnectionsClient

    // Expo module definition
    override fun definition() = ModuleDefinition {
        Name("ExpoGoogleNearbyConnection")

        Constants(
            "MAX_BYTES_DATA_SIZE" to ConnectionsClient.MAX_BYTES_DATA_SIZE
        )

        OnCreate{
            _connectionsClient = Nearby.getConnectionsClient(_safeCurrentActivity)
        }

        // region Events
        Events(
            "EndpointFound",
            "EndpointLost",
            "AdvertisingStarted",
            "DiscoveringStarted",
            "AdvertisingStopped",
            "DiscoveringStopped",
            "AdvertisingFailed",
            "DiscoveringFailed",

            "BandwidthChanged",
            "ConnectionRequested",
            "ConnectionRequestFailed",
            "ConnectionAccepted",
            "ConnectionAcceptFailed",
            "ConnectionRejected",
            "ConnectionRejectFailed",
            "ConnectionInitiated",
            "ConnectionResult",
            "DisconnectFromEndpoint",
            "EndpointDisconnection",
            "StopAllEndpoints",

            "PayloadReceived",
            "PayloadTransferUpdate",
            "PayloadSend",
            "PayloadSendFailed",
            "PayloadRemoved",
            "PayloadRemovedAll",
            "PayloadRemoveFailed",
            "PayloadCanceled",
            "PayloadCancelFailed",
            "PayloadNotFound",
            "PayloadInvalidArguments",
            "PayloadIOException",
            "PayloadException",

            "LocationRequestApproved",
            "LocationRequestDenied",
            "LocationRequestUnknown",
            "LocationSettingsChangedToEnabled",
            "LocationSettingsChangedToDisabled",
            "LocationPromptAccepted",
            "LocationPromptRejected"
        )
        // endregion Events

        // region Functions
        // Permissions
        AsyncFunction("requestPermissionsAsync") {
            promise: Promise ->
            Permissions.askForPermissionsWithPermissionsManager(
                _safeAppContext.permissions,
                promise,
                *getPermissions()
            )
        }

        AsyncFunction("getPermissionsAsync") {
            promise: Promise ->
            Permissions.getPermissionsWithPermissionsManager(
                _safeAppContext.permissions,
                promise,
                *getPermissions()
            )
        }

        // Advertising and discovering
        Function("startAdvertisingName") {
            endpointName: String,
            serviceId: String,
            jsAdvertisingOptions: JSAdvertisingOptions ->
                startAdvertising(endpointName, serviceId, jsAdvertisingOptions)
        }

        Function("startAdvertisingInfo") {
            endpointInfo: ByteArray,
            serviceId: String,
            jsAdvertisingOptions: JSAdvertisingOptions ->
                startAdvertising(endpointInfo, serviceId, jsAdvertisingOptions)
        }

        Function("startDiscovering") {
            serviceId: String,
            jsDiscoveringOptions: JSDiscoveringOptions ->
                startDiscovering(serviceId, jsDiscoveringOptions)
        }

        Function("stopAdvertising") {
            stopAdvertising()
        }

        Function("stopDiscovering") {
            stopDiscovering()
        }

        Function("stopAllEndpoints") {
            stopAllEndpoints()
        }

        // Connection
        Function("requestConnectionName") {
            endpointName: String,
            endpointId: String,
            connectionOptions: JSConnectionOptions? ->
                requestConnection(endpointName, endpointId, connectionOptions)
        }

        Function("requestConnectionInfo") {
            endpointInfo: ByteArray,
            endpointId: String,
            connectionOptions: JSConnectionOptions? ->
                requestConnection(endpointInfo, endpointId, connectionOptions)
        }

        Function("acceptConnection") {
            endpointId: String ->
                acceptConnection(endpointId)
        }

        Function("rejectConnection") {
            endpointId: String ->
                rejectConnection(endpointId)
        }

        Function("disconnectFromEndpoint") {
            endpointId: String ->
                disconnectFromEndpoint(endpointId)
        }

        // Payload
        Function("newPayloadBytes") {
            data: ByteArray ->
                return@Function PayloadHandler.new(PayloadData.Bytes(data))
        }

        Function("newPayloadFile") {
            data: Uri,
            isSensitive: Boolean?,
            fileName: String?,
            parentFolder: String? ->
                withPayloadHandler<String>(payloadId = null) {
                    return@Function PayloadHandler.new(
                        PayloadData.File(data, isSensitive, fileName, parentFolder),
                        _safeReactContext.contentResolver
                    )
                }
        }

        Function("newPayloadStream") {
            size: Int? ->
                withPayloadHandler<String>(payloadId = null) {
                    return@Function PayloadHandler.new(PayloadData.Stream(size ?: 1024))
                }
        }

        Function("sendPayloadToEndpoint") {
            endpointId: String,
            payloadId: String ->
                Log.d("sendPayloadToEndpoint", "endpointId: $endpointId, payloadId: $payloadId")
                withPayloadHandler(payloadId) {
                    val data = bundleOf(
                        "endpointIds" to endpointId,
                        "payloadId" to it
                    )
                    val payloadTask =
                        PayloadHandler.send(_connectionsClient, endpointId, payloadId.toLong())

                    payloadTask
                        .addOnSuccessListener {
                            sendEvent("PayloadSend", data)
                        }
                        .addOnFailureListener { e ->
                            sendError("PayloadSendFailed", e, it)
                        }
                }
        }

        Function("sendPayloadToEndpoints") {
            endpointIds: List<String>,
            payloadId: String ->
                withPayloadHandler(payloadId) {
                    val data = bundleOf(
                        "endpointIds" to endpointIds,
                        "payloadId" to it
                    )
                    val payloadTask =
                        PayloadHandler.send(_connectionsClient, endpointIds, payloadId.toLong())

                    payloadTask
                        .addOnSuccessListener {
                            sendEvent("PayloadSend", data)
                        }
                        .addOnFailureListener { e ->
                            sendError("PayloadSendFailed", e, it)
                        }
                }
        }

        Function("getPayloadInfo") {
            payloadId: String ->
                withPayloadHandler<Bundle>(payloadId) {
                    return@Function PayloadHandler.getInfo(payloadId.toLong())
                }
        }

        Function("getPayloadInfoList") {
            return@Function PayloadHandler.getInfoList()
        }

        Function("payloadExists") {
            payloadId: String ->
                return@Function PayloadHandler.exists(payloadId.toLong())
        }

        Function("getPayloadList")  {
            return@Function PayloadHandler.getList()
        }

        Function("setPayloadProperty") {
            payloadId: String,
            name: String,
            value: String ->
                withPayloadHandler(payloadId) {
                    PayloadHandler.setProperty(payloadId.toLong(), name, value)
                }
        }

        Function("removePayload") {
            payloadId: String ->
                try {
                    withPayloadHandler(payloadId) {
                        PayloadHandler.remove(payloadId.toLong())
                    }
                    ?.let { sendEvent("PayloadRemoved", bundleOf("payloadId" to payloadId)) }
                } catch (e: Exception) {
                    sendError("PayloadRemoveFailed", e, payloadId)
                }
        }

        Function("removePayloadAll") {
            PayloadHandler.removeAll()
            sendEvent("PayloadRemovedAll")
        }

        Function("cancelPayload") {
            payloadId: String ->
                withPayloadHandler(payloadId) {
                    PayloadHandler.cancel(_connectionsClient, payloadId.toLong())
                    .addOnSuccessListener {
                        sendEvent("PayloadCanceled", bundleOf("payloadId" to payloadId))
                    }
                    .addOnFailureListener { e ->
                        sendError("PayloadCancelFailed", e, payloadId)
                    }
                }
        }

        // Stream payload
        AsyncFunction("flushStream") Coroutine {
            payloadId: String ->
                withPayloadHandler(payloadId) {
                    PayloadHandler.flushStream(payloadId.toLong())
                }
        }

        AsyncFunction("writeStreamByte") Coroutine {
            payloadId: String,
            byte: Int ->
                withPayloadHandler(payloadId) {
                    PayloadHandler.writeStreamByte(payloadId.toLong(), byte)
                }
        }

        AsyncFunction("writeStreamByteArray") Coroutine {
            payloadId: String,
            byteArray: ByteArray,
            offset: Int,
            length: Int ->
                withPayloadHandler(payloadId) {
                    PayloadHandler.writeStreamByteArray(payloadId.toLong(), byteArray, offset, length)
                }
        }

        AsyncFunction("readStreamByte") Coroutine {
            payloadId: String ->
                withPayloadHandler<Int>(payloadId) {
                    return@Coroutine PayloadHandler.readStreamByte(payloadId.toLong())
                }
        }

        AsyncFunction("readStreamByteArray") Coroutine {
            payloadId: String,
            offset: Int,
            length: Int ->
                withPayloadHandler<ByteArray>(payloadId) {
                    return@Coroutine PayloadHandler.readStreamByteArray(
                        payloadId.toLong(),
                        offset,
                        length
                    )
                }
        }

        AsyncFunction("availableStream") Coroutine {
            payloadId: String ->
                withPayloadHandler<Int>(payloadId) {
                    return@Coroutine PayloadHandler.availableStream(payloadId.toLong())
                }
        }

        AsyncFunction("markStream") Coroutine {
            payloadId: String,
            readLimit: Int ->
                withPayloadHandler(payloadId) {
                    PayloadHandler.markStream(payloadId.toLong(), readLimit)
                }
        }

        Function("isMarkSupportedStream") {
            payloadId: String ->
                withPayloadHandler<Boolean>(payloadId) {
                    return@Function PayloadHandler.isMarkSupportedStream(payloadId.toLong())
                }
        }

        AsyncFunction("resetStream") Coroutine {
            payloadId: String ->
                withPayloadHandler(payloadId) {
                    PayloadHandler.resetStream(payloadId.toLong())
                }
        }

        AsyncFunction("skipStream") Coroutine {
            payloadId: String,
            amount: Long ->
                withPayloadHandler<Long>(payloadId) {
                    return@Coroutine PayloadHandler.skipStream(payloadId.toLong(), amount)
                }
        }
        // endregion Functions
    }

    // region  Advertising
    /**
     * Starts advertising the device to enable nearby connections.
     *
     * @param endpoint The endpoint to advertise. Can be a String or a ByteArray.
     * @param serviceId The service ID to advertise.
     * @param jsAdvertisingOptions Advertising options to configure the advertising process.
     *
     * @throws IllegalArgumentException If the provided endpoint type is not supported.
     */
    private fun startAdvertising(endpoint: Any, serviceId: String, jsAdvertisingOptions: JSAdvertisingOptions) {

        val advertisingOptions = AdvertisingOptions.Builder()
            .setConnectionType(jsAdvertisingOptions.connectionType)
            .setLowPower(jsAdvertisingOptions.lowPowerMode)
            .setStrategy(jsAdvertisingOptions.strategy.toStrategy())
            .build()

        try {
            val advertisingTask = when (endpoint) {
                is String -> _connectionsClient.startAdvertising(
                    endpoint,
                    serviceId,
                    _connectionLifecycleCallback,
                    advertisingOptions
                )

                is ByteArray -> _connectionsClient.startAdvertising(
                    endpoint,
                    serviceId,
                    _connectionLifecycleCallback,
                    advertisingOptions
                )

                else -> throw IllegalArgumentException("Unsupported endpoint type: ${endpoint::class}")
            }

            advertisingTask
                .addOnSuccessListener {
                    sendEvent("AdvertisingStarted")
                }
                .addOnFailureListener { e ->
                    sendError("AdvertisingFailed", e, endpoint)
                }

        } catch (e: IllegalArgumentException) {
            sendError("AdvertisingFailed", e, endpoint)
        }
    }

    /**
     * Stops advertising the device, ending the ability for nearby devices to discover it.
     */
    private fun stopAdvertising() {
        _connectionsClient.stopAdvertising()
        sendEvent("AdvertisingStopped")
    }
    // endregion Advertising

    // region Discovering
    /**
     * Starts discovering nearby devices advertising the specified service ID.
     *
     * @param serviceId The service ID to discover.
     * @param jsDiscoveringOptions Discovering options to configure the discovery process.
     *
     * @throws IllegalStateException If location is not enabled on devices with Android R or lower.
     */
    private fun startDiscovering(serviceId: String, jsDiscoveringOptions: JSDiscoveringOptions) {

        // For testing. Location permission will be handled externally with Expo Location module
        if(Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
            if(!isLocationEnabled()) {
                Log.w("startDiscovering", "Location is not enabled")
                promptEnableLocation()
                return
            }
        }

        val discoveryOptions = DiscoveryOptions.Builder().setStrategy(
            jsDiscoveringOptions.strategy.toStrategy()
        ).build()

        _connectionsClient.startDiscovery(
                serviceId,
                _endpointDiscoveryCallback,
                discoveryOptions
            )
            .addOnSuccessListener {
                sendEvent("DiscoveringStarted")
            }
            .addOnFailureListener {
                e: Exception ->
                    sendError("DiscoveringFailed", e)
            }
    }

    /**
     * Stops the discovery process, preventing further discovery of nearby devices.
     */
    private fun stopDiscovering() {
        _connectionsClient.stopDiscovery()
        sendEvent("DiscoveringStopped")
    }

    /**
     * Stops all active endpoints, disconnecting any established connections.
     */
    private fun stopAllEndpoints() {
        _connectionsClient.stopAllEndpoints()
        sendEvent("StopAllEndpoints")
    }
    // endregion Discovering

    // region Connections
    /**
     * Requests a connection to a nearby device.
     *
     * @param endpoint The endpoint information to share when connecting. Can be a String or a ByteArray.
     * @param endpointId The ID of the endpoint to connect to.
     * @param jsConnectionOptions Optional connection options to configure the connection.
     *
     * @throws IllegalArgumentException If the provided endpoint type is not supported.
     */
    private fun requestConnection(endpoint: Any, endpointId: String, jsConnectionOptions: JSConnectionOptions?) {
        val connectionOptions = jsConnectionOptions?.let {
            ConnectionOptions.Builder()
                .setConnectionType(jsConnectionOptions.connectionType)
                .setLowPower(jsConnectionOptions.lowPowerMode)
                .build()
        }

        try {
            val connectionTask = when {
                endpoint is String && connectionOptions == null -> _connectionsClient.requestConnection(
                    endpoint,
                    endpointId,
                    _connectionLifecycleCallback
                )

                endpoint is ByteArray && connectionOptions == null -> _connectionsClient.requestConnection(
                    endpoint,
                    endpointId,
                    _connectionLifecycleCallback
                )

                endpoint is String && connectionOptions != null -> _connectionsClient.requestConnection(
                    endpoint,
                    endpointId,
                    _connectionLifecycleCallback,
                    connectionOptions
                )

                endpoint is ByteArray && connectionOptions != null -> _connectionsClient.requestConnection(
                    endpoint,
                    endpointId,
                    _connectionLifecycleCallback,
                    connectionOptions
                )

                else -> throw IllegalArgumentException("Unsupported endpoint type: ${endpoint::class}")
            }

            connectionTask
                .addOnSuccessListener {
                    sendEvent("ConnectionRequested", bundleOf("endpointId" to endpointId))
                }
                .addOnFailureListener { e ->
                    sendError("ConnectionRequestFailed", e, endpoint)
                }
        } catch (e: IllegalArgumentException) {
            sendError("ConnectionRequestFailed", e, endpoint)
        }
    }

    /**
     * Accepts an incoming connection request from a nearby device.
     *
     * @param endpointId The ID of the endpoint to accept the connection from.
     */
    private fun acceptConnection(endpointId: String) {
        _connectionsClient.acceptConnection(
            endpointId,
            _payloadCallback
        )
        .addOnSuccessListener {
            sendEvent("ConnectionAccepted", bundleOf("endpointId" to endpointId))
        }
        .addOnFailureListener {
            e ->
                sendError("ConnectionAcceptFailed", e, endpointId)
        }
    }

    /**
     * Rejects an incoming connection request from a nearby device.
     *
     * @param endpointId The ID of the endpoint to reject the connection from.
     */
    private fun rejectConnection(endpointId: String) {
        _connectionsClient.rejectConnection(endpointId)
        .addOnSuccessListener {
            sendEvent("ConnectionRejected", bundleOf("endpointId" to endpointId))
        }
        .addOnFailureListener {
            e ->
                sendError("ConnectionRejectFailed", e, endpointId)
        }
    }

    /**
     * Disconnects from a connected endpoint.
     *
     * @param endpointId The ID of the endpoint to disconnect from.
     */
    private fun disconnectFromEndpoint(endpointId: String) {
        _connectionsClient.disconnectFromEndpoint(endpointId)
        sendEvent("DisconnectFromEndpoint", bundleOf("endpointId" to endpointId))
    }

    // endregion Connections

    // region Callbacks
    /**
     * Callback object that handles events related to the connection lifecycle.
     * This includes connection initiation, connection results, disconnections, and bandwidth changes.
     */
    private val _connectionLifecycleCallback: ConnectionLifecycleCallback =
        object : ConnectionLifecycleCallback() {
            override fun onConnectionInitiated(endpointId: String, connectionInfo: ConnectionInfo) {
                sendEvent(
                    "ConnectionInitiated",
                    bundleOf(
                        "endpointId" to endpointId,
                        "authenticationDigits" to connectionInfo.authenticationDigits,
                        "authenticationStatus" to connectionInfo.authenticationStatus,
                        "endpointInfo" to connectionInfo.endpointInfo,
                        "endpointName" to connectionInfo.endpointName,
                        "rawAuthenticationToken" to connectionInfo.rawAuthenticationToken,
                        "isIncomingConnection" to connectionInfo.isIncomingConnection
                    )
                )
            }

            override fun onConnectionResult(endpointId: String, result: ConnectionResolution) {

                val status = String.format(
                    Locale.US,
                    "[%d]%s",
                    result.status.statusCode,
                    result.status.statusMessage ?: ConnectionsStatusCodes.getStatusCodeString(result.status.statusCode)
                )

                sendEvent("ConnectionResult", bundleOf(
                    "endpointId" to endpointId,
                    "status" to status
                ))
            }

            override fun onDisconnected(endpointId: String) {
                sendEvent("EndpointDisconnection", bundleOf("endpointId" to endpointId))
            }

            override fun onBandwidthChanged(endpointId: String, bandwidthInfo: BandwidthInfo) {
                super.onBandwidthChanged(endpointId, bandwidthInfo)

                sendEvent("BandwidthChanged", bundleOf(
                    "endpointId" to endpointId,
                    "quality" to bandwidthInfo.quality
                ))
            }
        }

    /**
     * Callback object that handles events related to endpoint discovery.
     * This includes finding and losing nearby endpoints.
     */
    private val _endpointDiscoveryCallback: EndpointDiscoveryCallback =
        object : EndpointDiscoveryCallback() {
            override fun onEndpointFound(endpointId: String, info: DiscoveredEndpointInfo) {
                sendEvent("EndpointFound", bundleOf(
                    "endpointId" to endpointId,
                    "endpointInfo" to info.endpointInfo,
                    "serviceId" to info.serviceId
                ))
            }

            override fun onEndpointLost(endpointId: String) {
                sendEvent("EndpointLost", bundleOf("endpointId" to endpointId))
            }
        }

    /**
     * Callback object that handles events related to payload transfers.
     * This includes receiving payloads and updates on payload transfer progress.
     */
    private val _payloadCallback: PayloadCallback =
        object : PayloadCallback() {
            override fun onPayloadReceived(endpointId: String, payload: Payload) {
                val payloadData = bundleOf(
                    "endpointId" to endpointId,
                    "payloadId" to payload.id.toString(),
                    "type" to payload.type
                )

                payloadData.putAll(
                    when(payload.type) {
                        Payload.Type.BYTES -> bundleOf(
                            "data" to payload.asBytes()
                        )
                        Payload.Type.FILE -> bundleOf(
                            "data" to payload.asFile()!!.asUri()
                        )
                        else -> bundleOf(
                            "data" to "Stream received"
                        )
                    }
                )

                PayloadHandler.add(payload)
                sendEvent("PayloadReceived", payloadData)
            }

            override fun onPayloadTransferUpdate(
                endpointId: String,
                payloadTransferUpdate: PayloadTransferUpdate
            ) {
                val payloadTransferUpdateData = bundleOf(
                    "payloadId" to payloadTransferUpdate.payloadId.toString(),
                    "status" to payloadTransferUpdate.status,
                    "bytesTransferred" to payloadTransferUpdate.bytesTransferred,
                    "totalBytes" to payloadTransferUpdate.totalBytes
                )

                sendEvent("PayloadTransferUpdate", payloadTransferUpdateData)
            }
        }

    /**
     * Handles activity results, specifically for location settings requests.
     * If the request code matches `REQUEST_CHECK_SETTINGS`, it processes the result
     * and sends an event indicating whether the location request was approved, denied,
     * or resulted in an unexpected outcome.
     *
     * @param activity The activity that received the result.
     * @param requestCode The request code associated with the result.
     * @param resultCode The result code returned by the activity.
     * @param data An Intent containing any additional data returned by the activity.
     */
    override fun onActivityResult(
        activity: Activity?,
        requestCode: Int,
        resultCode: Int,
        data: Intent?
    ) {
        if (requestCode == REQUEST_CHECK_SETTINGS) {
            when (resultCode) {
                Activity.RESULT_OK -> {
                    sendEvent("LocationRequestApproved")
                }
                Activity.RESULT_CANCELED -> {
                    sendEvent("LocationRequestDenied")
                }
                else -> {
                    Log.w("ActivityResult", "Unexpected result code: $resultCode")
                    sendEvent("LocationRequestUnknown")
                }
            }
        }
    }

    /**
     * Handles new intents received by the module.
     * If the intent action is "android.settings.LOCATION_SOURCE_SETTINGS",
     * it checks the current location status and sends an event indicating
     * whether location settings were changed to enabled or disabled.
     *
     * @param intent The new intent received by the module.
     */
    override fun onNewIntent(intent: Intent?) {
        intent?.let {
            if (it.action == "android.settings.LOCATION_SOURCE_SETTINGS") {
                if (isLocationEnabled()) {
                    sendEvent("LocationSettingsChangedToEnabled")
                } else {
                    sendEvent("LocationSettingsChangedToDisabled")
                }
            }
        }
    }

    // endregion Callbacks

    // region Location request
    /**
     * Checks if location services are enabled on the device.
     *
     * @return `true` if location services are enabled, `false` otherwise.
     */
    private fun isLocationEnabled(): Boolean {
        val locationManager = _safeReactContext.getSystemService(Context.LOCATION_SERVICE) as LocationManager
        return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER) ||
                locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)
    }

    /**
     * Prompts the user to enable location services if they are disabled.
     * If the user accepts the prompt, an event "LocationPromptAccepted" is sent.
     * If the user rejects the prompt or an error occurs, an event "LocationPromptRejected" is sent.
     */
    private fun promptEnableLocation() {

        val locationRequest = LocationRequest.Builder(10000).build()
        val builder = LocationSettingsRequest.Builder().addLocationRequest(locationRequest)

        val client = LocationServices.getSettingsClient(_safeCurrentActivity)
        val task = client.checkLocationSettings(builder.build())

        task.addOnSuccessListener {
            sendEvent("LocationPromptAccepted")
        }
        .addOnFailureListener { exception ->
            if (exception is ResolvableApiException) {
                try {
                    exception.startResolutionForResult(_safeCurrentActivity,
                        REQUEST_CHECK_SETTINGS
                    )
                } catch (e: IntentSender.SendIntentException) {
                    sendError("LocationPromptRejected", e)
                }
            } else {
                sendError("LocationPromptRejected", exception)
            }
        }
    }
    // endregion Location request

    /**
     * Retrieves the required permissions for the module to function.
     * The permissions vary depending on the Android version.
     *
     * @return An array of permission strings.
     */
    private fun getPermissions(): Array<String> {
        val permissions: MutableList<String> = mutableListOf(
            Manifest.permission.ACCESS_WIFI_STATE,
            Manifest.permission.CHANGE_WIFI_STATE,
            Manifest.permission.ACCESS_COARSE_LOCATION
        )
        when {
            Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
                permissions.addAll(
                    listOf(
                        Manifest.permission.BLUETOOTH_SCAN,
                        Manifest.permission.BLUETOOTH_ADVERTISE,
                        Manifest.permission.BLUETOOTH_CONNECT
                    )
                )
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU)
                    permissions.add(Manifest.permission.NEARBY_WIFI_DEVICES)
            }
            else ->
                permissions.addAll(
                    listOf(
                        Manifest.permission.BLUETOOTH,
                        Manifest.permission.BLUETOOTH_ADMIN
                    )
                )
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q)
            permissions.add(Manifest.permission.ACCESS_FINE_LOCATION)

        return permissions.toTypedArray<String>()
    }

    /**
     * Converts a string representation of a strategy to a `Strategy` enum value.
     *
     * @param this The string representation of the strategy.
     * @return The corresponding `Strategy` enum value.
     * @throws IllegalArgumentException If the provided string is not a valid strategy.
     */
    private fun String.toStrategy(): Strategy {
        return when (this) {
            "P2P_CLUSTER" -> Strategy.P2P_CLUSTER
            "P2P_POINT_TO_POINT" -> Strategy.P2P_POINT_TO_POINT
            "P2P_STAR" -> Strategy.P2P_STAR
            else -> throw IllegalArgumentException("Invalid strategy: $this")
        }
    }

    /**
     * Retrieves the stack trace of a Throwable as a string.
     *
     * @param e The Throwable to get the stack trace from.
     * @return The stack trace as a string.
     */
    private fun getStackTrace(e: Throwable): String {
        val stackTrace = e.stackTrace

        val sb = StringBuilder()
        for (element in stackTrace) {
            sb.append(element.toString() + "\n")
        }

        return sb.toString()
    }

    /**
     * Sends an error event with details about the exception.
     *
     * @param event The name of the error event.
     * @param e The Throwable representing the error.
     * @param data Optional data associated with the error.
     */
    private fun sendError(event: String, e: Throwable, data: Any? = null) {
        Log.e(event, "${e.message}: ${getStackTrace(e)}")
        sendEvent(event,
            bundleOf(
                "error" to e.message,
                "stackTrace" to getStackTrace(e),
                "data" to data.toString()
            )
        )
    }

    /**
     * Executes a block of code with a payload handler, handling potential exceptions.
     *
     * @param payloadId The ID of the payload to handle.
     * @param block The block of code to execute.
     * @return The result of the block, or `null` if an exception occurred.
     */
    private inline fun <T> withPayloadHandler(payloadId: String?, block: (String?) -> T): T? {
        return try {
            block(payloadId)
        } catch (e: Exception) {
            when (e) {
                is PayloadNotFoundException -> sendError("PayloadNotFound", e, payloadId)
                is IllegalArgumentException -> sendError("PayloadInvalidArguments", e, payloadId)
                is IOException -> sendError("PayloadIOException", e, payloadId)
                else -> sendError("PayloadException", e, payloadId)
            }
            null
        }
    }

    companion object {
        private val REQUEST_CHECK_SETTINGS = 1
    }
}