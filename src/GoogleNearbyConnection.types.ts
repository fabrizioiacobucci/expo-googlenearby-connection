/**
 * Enum representing the quality of bandwidth.
 */
export enum BandwidthQuality {
    UNKNOWN = 0,
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
}

/**
 * Type representing the connection type.
 */
export enum ConnectionType {
    BALANCED = 0,
    DISRUPTIVE = 1,
    NON_DISRUPTIVE = 2,
}

/**
 * Type representing the strategy for connection.
 */
export type Strategy = "P2P_CLUSTER" | "P2P_POINT_TO_POINT" | "P2P_STAR";

/**
 * Enum representing the type of payload.
 */
export enum PayloadType {
    BYTES = 1,
    FILE = 2,
    STREAM = 3,
}

/**
 * Enum representing the status of payload transfer update.
 */
export enum PayloadTransferUpdateStatus {
    SUCCESS = 1,
    FAILURE = 2,
    IN_PROGRESS = 3,
    CANCELED = 4,
}

/**
 * Type representing the information of a payload.
 *
 * @property id - The unique identifier of the payload.
 * @property type - The type of the payload.
 * @property offset - The offset of the payload.
 * @property uri - The URI of the payload (optional).
 * @property size - The size of the payload (optional).
 * @property bytes - The bytes of the payload (optional).
 */
export type PayloadInfo = {
    id: string;
    type: PayloadType;
    offset: number;
    uri?: string;
    size?: number;
    bytes?: Uint8Array;
};

/**
 * Enum representing the properties of a payload.
 *
 * @enum {string}
 * @property {string} OFFSET - Represents the offset property of the payload.
 * @property {string} FILENAME - Represents the filename property of the payload.
 * @property {string} PARENTFOLDER - Represents the parent folder property of the payload.
 * @property {string} SENSITIVE - Represents the sensitivity property of the payload.
 */
export enum PayloadProperty {
    OFFSET = "OFFSET",
    FILENAME = "FILENAME",
    PARENTFOLDER = "PARENTFOLDER",
    SENSITIVE = "SENSITIVE",
}
/**
 * Type representing the options for a connection.
 *
 * @property connectionType - The type of the connection.
 * @property lowPowerMode - Whether the connection is in low power mode.
 */
export type ConnectionOptions = {
    connectionType: ConnectionType;
    lowPowerMode: boolean;
};

/**
 * Type representing the options for advertising a connection.
 *
 * @property strategy - The strategy for the connection.
 */
export type AdvertisingOptions = ConnectionOptions & DiscoveringOptions;

/**
 * Type representing the options for discovering a connection.
 *
 * @property strategy - The strategy for the connection.
 */
export type DiscoveringOptions = {
    strategy: Strategy;
};

// Events
/**
 * @typedef EndpointEvent
 * @description Represents a basic event related to an endpoint.
 * @property {string} endpointId - The unique identifier of the endpoint.
 */
export type EndpointEvent = {
    endpointId: string;
};

/**
 * Represents an event that occurs at an endpoint and includes an error.
 *
 * This type combines the properties of `EndpointEvent` and `Error` to provide
 * detailed information about an error event at a specific endpoint.
 */
export type EndpointEventError = EndpointEvent & Error;

/**
 * @typedef EndpointFound
 * @description Represents an event when an endpoint is found.
 * @property {Uint8Array} endpointInfo - Information about the found endpoint.
 * @property {string} serviceId - The service ID associated with the endpoint.
 */
export type EndpointFound = EndpointEvent & {
    endpointInfo: Uint8Array;
    serviceId: string;
};

/**
 * @typedef ConnectionInitiated
 * @description Represents an event when a connection is initiated.
 * @property {string} endpointId - The unique identifier of the endpoint.
 * @property {String} authenticationDigits - Authentication digits for the connection.
 * @property {number} authenticationStatus - Status of the authentication.
 * @property {Uint8Array} endpointInfo - Information about the endpoint.
 * @property {String} endpointName - Name of the endpoint.
 * @property {Uint8Array} rawAuthenticationToken - Raw authentication token.
 * @property {Boolean} isIncomingConnection - Indicates if the connection is incoming.
 */
export type ConnectionInitiated = {
    endpointId: string;
    authenticationDigits: string;
    authenticationStatus: number;
    endpointInfo: Uint8Array;
    endpointName: string;
    rawAuthenticationToken: Uint8Array;
    isIncomingConnection: boolean;
};

/**
 * @typedef ConnectionResult
 * @description Represents the result of a connection attempt.
 * @property {string} endpointId - The unique identifier of the endpoint.
 * @property {string} status - The status of the connection attempt.
 */
export type ConnectionResult = {
    endpointId: string;
    status: string;
};

/**
 * @typedef BandwidthChanged
 * @description Represents an event when the bandwidth quality changes.
 * @property {string} endpointId - The unique identifier of the endpoint.
 * @property {BandwidthQuality} quality - The new bandwidth quality.
 */
export type BandwidthChanged = {
    endpointId: string;
    quality: BandwidthQuality;
};

/**
 * @typedef PayloadEvent
 * @description Represents a basic event related to a payload.
 * @property {string} payloadId - The unique identifier of the payload.
 */
export type PayloadEvent = {
    payloadId: string;
};

/**
 * @typedef Exception
 * @description Represents an exception event.
 * @property {string} error - The error message.
 * @property {string} stackTrace - The stack trace of the error.
 * @property {string | number} data - Additional data related to the exception.
 */
export type Exception = {
    error: string;
    stackTrace: string;
    data: string;
};

/**
 * @typedef PayloadReceivedInfo
 * @description Represents information about a received payload.
 * @property {PayloadType} type - The type of the payload.
 * @property {string} payloadId - The unique identifier of the payload.
 * @property {string} endpointId - The unique identifier of the endpoint.
 * @property {Uint8Array | string} data - The data of the payload.
 */
export type PayloadReceivedInfo = null | {
    endpointId: string;
    payloadId: string;
    type: PayloadType;
    data: Uint8Array | string;
};

/**
 * @typedef PayloadTransferUpdate
 * @description Represents an update on the transfer status of a payload.
 * @property {string} payloadId - The unique identifier of the payload.
 * @property {PayloadTransferUpdateStatus} status - The status of the payload transfer.
 * @property {number} bytesTransferred - The number of bytes transferred so far.
 * @property {number} totalBytes - The total number of bytes to be transferred.
 */
export type PayloadTransferUpdate = {
    payloadId: string;
    status: PayloadTransferUpdateStatus;
    bytesTransferred: number;
    totalBytes: number;
};

/**
 * @typedef PayloadSend
 * @description Represents an event when a payload is sent.
 * @property {string[] | string} endpointIds - The unique identifiers of the endpoints.
 * @property {string} payloadId - The unique identifier of the payload.
 */
export type PayloadSend = {
    endpointIds: string[] | string;
    payloadId: string;
};
