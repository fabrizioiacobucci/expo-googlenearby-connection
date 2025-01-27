import { NativeModule } from "expo";
import {
    EndpointFound,
    EndpointEvent,
    Exception,
    BandwidthChanged,
    ConnectionInitiated,
    ConnectionResult,
    PayloadReceivedInfo,
    PayloadTransferUpdate,
    PayloadSend,
    PayloadEvent,
} from "./GoogleNearbyConnection.types";

/**
 * @file Events.ts
 * @description This file contains type definitions and event interfaces for the Expo Google Nearby Connection module.
 */

/**
 * @interface ExpoGoogleNearbyConnectionModuleEvents
 * @description Interface defining the events for the Expo Google Nearby Connection module.
 */
export type ExpoGoogleNearbyConnectionModuleEvents = {
    // #region Endpoint events
    /**
     * @function EndpointFound
     * @description Called when an endpoint is found.
     * @param {EndpointFound} event - The event data.
     */
    EndpointFound(event: EndpointFound): void;

    /**
     * @function EndpointLost
     * @description Called when an endpoint is lost.
     * @param {EndpointEvent} event - The event data.
     */
    EndpointLost(event: EndpointEvent): void;

    // Advertising and discovering events
    /**
     * @function AdvertisingStarted
     * @description Called when advertising starts.
     */
    AdvertisingStarted(): void;

    /**
     * @function DiscoveringStarted
     * @description Called when discovering starts.
     */
    DiscoveringStarted(): void;

    /**
     * @function AdvertisingStopped
     * @description Called when advertising stops.
     */
    AdvertisingStopped(): void;

    /**
     * @function DiscoveringStopped
     * @description Called when discovering stops.
     */
    DiscoveringStopped(): void;

    /**
     * @function AdvertisingFailed
     * @description Called when advertising fails.
     * @param {Exception} event - The event data.
     */
    AdvertisingFailed(event: Exception): void;

    /**
     * @function DiscoveringFailed
     * @description Called when discovering fails.
     * @param {Exception} event - The event data.
     */
    DiscoveringFailed(event: Exception): void;
    // #endregion Endpoint events

    // #region Connection events
    /**
     * @function BandwidthChanged
     * @description Called when the bandwidth quality changes.
     * @param {BandwidthChanged} event - The event data.
     */
    BandwidthChanged(event: BandwidthChanged): void;

    /**
     * @function ConnectionRequested
     * @description Called when a connection is requested.
     * @param {EndpointEvent} event - The event data.
     */
    ConnectionRequested(event: EndpointEvent): void;

    /**
     * @function ConnectionRequestFailed
     * @description Called when a connection request fails.
     * @param {Exception} event - The event data.
     */
    ConnectionRequestFailed(event: Exception): void;

    /**
     * @function ConnectionAccepted
     * @description Called when a connection is accepted.
     * @param {EndpointEvent} event - The event data.
     */
    ConnectionAccepted(event: EndpointEvent): void;

    /**
     * @function ConnectionAcceptFailed
     * @description Called when a connection acceptance fails.
     * @param {EndpointEvent} event - The event data.
     */
    ConnectionAcceptFailed(event: Exception): void;

    /**
     * @function ConnectionRejected
     * @description Called when a connection is rejected.
     * @param {EndpointEvent} event - The event data.
     */
    ConnectionRejected(event: EndpointEvent): void;

    /**
     * @function ConnectionRejectFailed
     * @description Called when a connection rejection fails.
     * @param {Exception} event - The event data.
     */
    ConnectionRejectFailed(event: Exception): void;

    /**
     * @function ConnectionInitiated
     * @description Called when a connection is initiated.
     * @param {ConnectionInitiated} event - The event data.
     */
    ConnectionInitiated(event: ConnectionInitiated): void;

    /**
     * @function ConnectionResult
     * @description Called when a connection result is received.
     * @param {ConnectionResult} event - The event data.
     */
    ConnectionResult(event: ConnectionResult): void;

    /**
     * @function DisconnectFromEndpoint
     * @description Called when disconnected from an endpoint.
     * @param {EndpointEvent} event - The event data.
     */
    DisconnectFromEndpoint(event: EndpointEvent): void;

    /**
     * @function EndpointDisconnection
     * @description Called when an endpoint is disconnected.
     * @param {EndpointEvent} event - The event data.
     */
    EndpointDisconnection(event: EndpointEvent): void;

    /**
     * @function StopAllEndpoints
     * @description Called when all endpoints are stopped.
     */
    StopAllEndpoints(): void;
    // #endregion Connection events

    // #region Payload events
    /**
     * @function PayloadReceived
     * @description Called when a payload is received.
     * @param {PayloadReceivedInfo} event - The event data.
     */
    PayloadReceived(event: PayloadReceivedInfo): void;

    /**
     * @function PayloadTransferUpdate
     * @description Called when there is an update on the payload transfer.
     * @param {PayloadTransferUpdate} event - The event data.
     */
    PayloadTransferUpdate(event: PayloadTransferUpdate): void;

    /**
     * @function PayloadSend
     * @description Called when a payload is sent.
     * @param {PayloadSend} event - The event data.
     */
    PayloadSend(event: PayloadSend): void;

    /**
     * @function PayloadSendFailed
     * @description Called when a payload send fails.
     * @param {Exception} event - The event data.
     */
    PayloadSendFailed(event: Exception): void;

    /**
     * @function PayloadRemoved
     * @description Called when a payload is removed.
     * @param {PayloadEvent} event - The event data.
     */
    PayloadRemoved(event: PayloadEvent): void;

    /**
     * @function PayloadRemovedAll
     * @description Called when all payloads are removed.
     */
    PayloadRemovedAll(): void;

    /**
     * @function PayloadRemoveFailed
     * @description Called when a payload remove fails.
     * @param {Exception} event - The event data.
     */
    PayloadRemoveFailed(event: Exception): void;

    /**
     * @function PayloadCanceled
     * @description Called when a payload is canceled.
     * @param {PayloadEvent} event - The event data.
     */
    PayloadCanceled(event: PayloadEvent): void;

    /**
     * @function PayloadCancelFailed
     * @description Called when a payload cancelation fails.
     * @param {Exception} event - The event data.
     */
    PayloadCancelFailed(event: Exception): void;

    /**
     * @function PayloadNotFound
     * @description Called when a payload is not found.
     * @param {Exception} event - The event data.
     */
    PayloadNotFound(event: Exception): void;

    /**
     * @function PayloadInvalidArguments
     * @description Called when a invalid arguments have been passed.
     * @param {Exception} event - The event data.
     */
    PayloadInvalidArguments(event: Exception): void;

    /**
     * @function PayloadIOException
     * @description Called when an IOException occurs.
     * @param {Exception} event - The event data.
     */
    PayloadIOException(event: Exception): void;

    /**
     * @function PayloadException
     * @description Called when a generic Exception occurs.
     * @param {Exception} event - The event data.
     */
    PayloadException(event: Exception): void;
    // #endregion Payload events

    // #region Location events
    /**
     * @function LocationRequestApproved
     * @description Called when the location request is approved.
     */
    LocationRequestApproved(): void;

    /**
     * @function LocationRequestDenied
     * @description Called when the location request is denied.
     */
    LocationRequestDenied(): void;

    /**
     * @function LocationRequestUnknown
     * @description Called when the location request status is unknown.
     */
    LocationRequestUnknown(): void;

    /**
     * @function LocationPromptAccepted
     * @description Called when the location prompt is accepted.
     */
    LocationPromptAccepted(): void;

    /**
     * @function LocationPromptRejected
     * @description Called when the location prompt is rejected.
     */
    LocationPromptRejected(): void;
    // #endregion Location events
};

/**
 * @class ExpoGoogleNearbyConnectionModuleClass
 * @extends NativeModule<ExpoGoogleNearbyConnectionModuleEvents>
 * @description Class representing the Expo Google Nearby Connection module.
 */
export class ExpoGoogleNearbyConnectionModuleClass extends NativeModule<ExpoGoogleNearbyConnectionModuleEvents> {}
