import { PermissionResponse, createPermissionHook } from "expo-modules-core";
import {
    AdvertisingOptions,
    ConnectionOptions,
    DiscoveringOptions,
    PayloadInfo,
    PayloadProperty,
} from "./GoogleNearbyConnection.types";

import ExpoGoogleNearbyConnection from "./ExpoGoogleNearbyConnection";

// Permissions
/**
 * Requests permissions for using Google Nearby Connections.
 * @returns {Promise<PermissionResponse>} A promise that resolves to the permission response.
 */
export async function requestPermissionsAsync(): Promise<PermissionResponse> {
    return await ExpoGoogleNearbyConnection.requestPermissionsAsync();
}

/**
 * Gets the current permissions status for Google Nearby Connections.
 * @returns {Promise<PermissionResponse>} A promise that resolves to the permission response.
 */
export async function getPermissionsAsync(): Promise<PermissionResponse> {
    return await ExpoGoogleNearbyConnection.getPermissionsAsync();
}

export const usePermissions = createPermissionHook({
    getMethod: getPermissionsAsync,
    requestMethod: requestPermissionsAsync,
});

/**
 * Starts advertising with a given endpoint name and service ID.
 * @param {string} endpointName - The name of the endpoint.
 * @param {string} serviceId - The service ID.
 * @param {AdvertisingOptions} advertisingOptions - The advertising options.
 */
export function startAdvertisingName(endpointName: string, serviceId: string, advertisingOptions: AdvertisingOptions) {
    ExpoGoogleNearbyConnection.startAdvertisingName(endpointName, serviceId, advertisingOptions);
}

/**
 * Starts advertising with a given endpoint info and service ID.
 * @param {Uint8Array} endpointInfo - The information of the endpoint.
 * @param {string} serviceId - The service ID.
 * @param {AdvertisingOptions} advertisingOptions - The advertising options.
 */
export function startAdvertisingInfo(
    endpointInfo: Uint8Array,
    serviceId: string,
    advertisingOptions: AdvertisingOptions
) {
    ExpoGoogleNearbyConnection.startAdvertisingInfo(endpointInfo, serviceId, advertisingOptions);
}

/**
 * Starts discovering endpoints with a given service ID.
 * @param {string} serviceId - The service ID.
 * @param {DiscoveringOptions} discoveringOptions - The discovering options.
 */
export function startDiscovering(serviceId: string, discoveringOptions: DiscoveringOptions) {
    ExpoGoogleNearbyConnection.startDiscovering(serviceId, discoveringOptions);
}

/**
 * Stops advertising.
 */
export function stopAdvertising() {
    ExpoGoogleNearbyConnection.stopAdvertising();
}

/**
 * Stops discovering endpoints.
 */
export function stopDiscovering() {
    ExpoGoogleNearbyConnection.stopDiscovering();
}

/**
 * Stops all endpoints.
 */
export function stopAllEndpoints() {
    ExpoGoogleNearbyConnection.stopAllEndpoints();
}

/**
 * Requests a connection with a given endpoint name and ID.
 * @param {string} endpointName - The name of the endpoint.
 * @param {string} endpointId - The ID of the endpoint to connect with.
 * @param {ConnectionOptions} [connectionOptions] - The connection options.
 */
export function requestConnectionName(endpointName: string, endpointId: string, connectionOptions?: ConnectionOptions) {
    ExpoGoogleNearbyConnection.requestConnectionName(endpointName, endpointId, connectionOptions);
}

/**
 * Requests a connection with a given endpoint info and ID.
 * @param {Uint8Array} endpointInfo - The information of the endpoint.
 * @param {string} endpointId - The ID of the endpoint to connect with.
 * @param {ConnectionOptions} [connectionOptions] - The connection options.
 */
export function requestConnectionInfo(
    endpointInfo: Uint8Array,
    endpointId: string,
    connectionOptions?: ConnectionOptions
) {
    ExpoGoogleNearbyConnection.requestConnectionInfo(endpointInfo, endpointId, connectionOptions);
}

/**
 * Accepts a connection with a given endpoint ID.
 * @param {string} endpointId - The ID of the endpoint.
 */
export function acceptConnection(endpointId: string) {
    ExpoGoogleNearbyConnection.acceptConnection(endpointId);
}

/**
 * Rejects a connection with a given endpoint ID.
 * @param {string} endpointId - The ID of the endpoint.
 */
export function rejectConnection(endpointId: string) {
    ExpoGoogleNearbyConnection.rejectConnection(endpointId);
}

/**
 * Disconnects from a given endpoint ID.
 * @param {string} endpointId - The ID of the endpoint.
 */
export function disconnectFromEndpoint(endpointId: string) {
    ExpoGoogleNearbyConnection.disconnectFromEndpoint(endpointId);
}

/**
 * Creates a new payload with byte data.
 * @param {Uint8Array} data - The byte data.
 * @returns {string} The payload ID.
 */
export function newPayloadBytes(data: Uint8Array): string {
    return ExpoGoogleNearbyConnection.newPayloadBytes(data);
}

/**
 * Creates a new payload with file data.
 * @param {string} data - The file data.
 * @param {boolean} [isSensitive] - Indicates if the file is sensitive.
 * @param {string} [fileName] - The name of the file.
 * @param {string} [parentFolder] - The parent folder.
 * @returns {string} The payload ID.
 */
export function newPayloadFile(
    data: string,
    isSensitive?: boolean,
    fileName?: string,
    parentFolder?: string
): string | null {
    return ExpoGoogleNearbyConnection.newPayloadFile(data, isSensitive, fileName, parentFolder);
}

/**
 * Creates a new payload with a stream of a given size.
 * @param {number} size - The size of the stream.
 * @returns {string} The payload ID.
 */
export function newPayloadStream(size?: number) {
    return ExpoGoogleNearbyConnection.newPayloadStream(size);
}

/**
 * Sends a payload to given endpoint ID.
 * @param {string[]} endpointId - The ID of the endpoint.
 * @param {string} payloadId - The ID of the payload.
 */
export function sendPayloadToEndpoint(endpointId: string, payloadId: string) {
    ExpoGoogleNearbyConnection.sendPayloadToEndpoint(endpointId, payloadId);
}

/**
 * Sends a payload to given endpoint IDs.
 * @param {string[]} endpointIds - The IDs of the endpoints.
 * @param {string} payloadId - The ID of the payload.
 */
export function sendPayloadToEndpoints(endpointIds: string[], payloadId: string) {
    ExpoGoogleNearbyConnection.sendPayloadToEndpoints(endpointIds, payloadId);
}

/**
 * Gets information about a payload with a given ID.
 * @param {string} payloadId - The ID of the payload.
 * @returns {PayloadInfo} The payload information.
 */
export function getPayloadInfo(payloadId: string): PayloadInfo {
    return ExpoGoogleNearbyConnection.getPayloadInfo(payloadId);
}

/**
 * Gets a list of all payload information.
 * @returns {PayloadInfo[]} The list of payload information.
 */
export function getPayloadInfoList(): PayloadInfo[] {
    return ExpoGoogleNearbyConnection.getPayloadInfoList();
}

/**
 * Gets a list of all payload IDs.
 * @returns {string[]} The list of payload IDs.
 */
export function getPayloadList(): string[] {
    return ExpoGoogleNearbyConnection.getPayloadList();
}

/**
 * Checks if a payload exists by its ID.
 * @returns {boolean} True if the payload exists, False otherwise.
 */
export function payloadExists(payloadId: string): boolean {
    return ExpoGoogleNearbyConnection.payloadExists(payloadId);
}

/**
 * Sets a property of a payload with a given name, ID, and value.
 * @param {string} payloadId - The ID of the payload.
 * @param {string} name - The name of the property.
 * @param {string} value - The value of the property.
 */
export function setPayloadProperty(payloadId: string, name: PayloadProperty, value: string) {
    ExpoGoogleNearbyConnection.setPayloadProperty(payloadId, name, value);
}

/**
 * Removes a payload with a given ID.
 * @param {string} payloadId - The ID of the payload.
 */
export function removePayload(payloadId: string) {
    ExpoGoogleNearbyConnection.removePayload(payloadId);
}

/**
 * Removes all Payloads.
 */
export function removePayloadAll() {
    ExpoGoogleNearbyConnection.removePayloadAll();
}

/**
 * Cancels a payload with a given ID.
 * @param {string} payloadId - The ID of the payload.
 */
export function cancelPayload(payloadId: string) {
    ExpoGoogleNearbyConnection.cancelPayload(payloadId);
}

/**
 * Flushes the stream for a given payload ID.
 * @param {string} payloadId - The ID of the payload.
 */
export async function flushStream(payloadId: string) {
    ExpoGoogleNearbyConnection.flushStream(payloadId);
}

/**
 * Writes a byte to the stream for a given payload ID.
 * @param {string} payloadId - The ID of the payload.
 * @param {number} byte - The byte to write.
 */
export async function writeStreamByte(payloadId: string, byte: number) {
    ExpoGoogleNearbyConnection.writeStreamByte(payloadId, byte);
}

/**
 * Writes a byte array to the stream for a given payload ID.
 * @param {string} payloadId - The ID of the payload.
 * @param {Uint8Array} byteArray - The byte array to write.
 * @param {number} [offset=0] - The offset to start writing from.
 * @param {number} [length=byteArray.length] - The number of bytes to write.
 */
export async function writeStreamByteArray(
    payloadId: string,
    byteArray: Uint8Array,
    offset: number = 0,
    length: number = byteArray.length
) {
    ExpoGoogleNearbyConnection.writeStreamByteArray(payloadId, byteArray, offset, length);
}

/**
 * Reads a byte from the stream for a given payload ID.
 * @param {string} payloadId - The ID of the payload.
 * @returns {Promise<number>} The byte read from the stream.
 */
export async function readStreamByte(payloadId: string): Promise<number> {
    return ExpoGoogleNearbyConnection.readStreamByte(payloadId);
}

/**
 * Reads a byte array from the stream for a given payload ID.
 * @param {string} payloadId - The ID of the payload.
 * @param {number} offset - The offset to start reading from.
 * @param {number} length - The number of bytes to read.
 * @returns {Promise<Uint8Array>} The byte array read from the stream.
 */
export async function readStreamByteArray(payloadId: string, offset: number, length: number): Promise<Uint8Array> {
    return ExpoGoogleNearbyConnection.readStreamByteArray(payloadId, offset, length);
}

/**
 * Gets the number of bytes available in the stream for a given payload ID.
 * @param {string} payloadId - The ID of the payload.
 * @returns {Promise<number>} The number of bytes available.
 */
export async function availableStream(payloadId: string): Promise<number> {
    return ExpoGoogleNearbyConnection.availableStream(payloadId);
}

/**
 * Marks the current position in the stream for a given payload ID.
 * @param {string} payloadId - The ID of the payload.
 * @param {number} readLimit - The maximum limit of bytes that can be read before the mark position becomes invalid.
 */
export async function markStream(payloadId: string, readLimit: number) {
    ExpoGoogleNearbyConnection.markStream(payloadId, readLimit);
}

/**
 * Checks if mark and reset are supported in the stream for a given payload ID.
 * @param {string} payloadId - The ID of the payload.
 * @returns {boolean} True if mark and reset are supported, false otherwise.
 */
export function isMarkSupportedStream(payloadId: string): boolean {
    return ExpoGoogleNearbyConnection.isMarkSupportedStream(payloadId);
}

/**
 * Resets the stream to the most recent mark for a given payload ID.
 * @param {string} payloadId - The ID of the payload.
 */
export async function resetStream(payloadId: string) {
    ExpoGoogleNearbyConnection.resetStream(payloadId);
}

/**
 * Skips over and discards a specified number of bytes in the stream for a given payload ID.
 * @param {string} payloadId - The ID of the payload.
 * @param {number} amount - The number of bytes to skip.
 * @returns {Promise<number>} The actual number of bytes skipped.
 */
export async function skipStream(payloadId: string, amount: number): Promise<number> {
    return ExpoGoogleNearbyConnection.skipStream(payloadId, amount);
}
