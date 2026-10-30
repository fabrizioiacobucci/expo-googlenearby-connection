import Nearby, { ConnectionInitiated, ConnectionResult, EndpointEvent, Exception } from "expo-googlenearby-connection";
import { useReducer, useState } from "react";
import { ToastAndroid } from "react-native";
import { arrayReducer } from "../functions";
import { useConnectionsContext } from "../context";
import { useEventListener } from "expo";

/**
 * Builds the listener of an event that reports a failed connection operation, which logs the error and shows it.
 *
 * @param operation - the operation that failed, as the user reads it.
 * @returns the listener of the event.
 * @example
 * useEventListener(Nearby, "ConnectionAcceptFailed", showFailure("Accepting the connection"));
 */
function showFailure(operation: string) {
    return (event: Exception) => {
        console.log(`${operation} failed for ${event.data}: ${event.error}`);
        ToastAndroid.show(`${operation} failed: ${event.error}`, ToastAndroid.SHORT);
    };
}

export default function useConnections() {
    const [connections, setConnections] = useConnectionsContext();
    const [connectionOut, setConnectionOut] = useReducer(arrayReducer<string>, []);
    const [connectionIn, setConnectionIn] = useReducer(arrayReducer<string>, []);
    // Keyed by endpoint ID, since ConnectionRequested and ConnectionInitiated can arrive in either order
    const [authenticationDigits, setAuthenticationDigits] = useState<Record<string, string>>({});

    useEventListener(Nearby, "StopAllEndpoints", () => {
        setConnections({ type: "EMPTY" });
        setConnectionOut({ type: "EMPTY" });
        setConnectionIn({ type: "EMPTY" });
        setAuthenticationDigits({});
    });

    useEventListener(Nearby, "ConnectionRequested", (event: EndpointEvent) => {
        setConnectionOut({ type: "ADD", element: event.endpointId });
        console.log("Connection requested: " + event.endpointId);
        ToastAndroid.show("Connection requested: " + event.endpointId, ToastAndroid.SHORT);
    });

    useEventListener(Nearby, "ConnectionRequestFailed", showFailure("Requesting the connection"));
    useEventListener(Nearby, "ConnectionAcceptFailed", showFailure("Accepting the connection"));
    useEventListener(Nearby, "ConnectionRejectFailed", showFailure("Rejecting the connection"));

    useEventListener(Nearby, "ConnectionInitiated", (event: ConnectionInitiated) => {
        setAuthenticationDigits((digits) => ({ ...digits, [event.endpointId]: event.authenticationDigits }));
        if (event.isIncomingConnection) {
            setConnectionIn({ type: "ADD", element: event.endpointId });
            console.log("Connection Initiated: " + event.endpointId);
            ToastAndroid.show("Connection Initiated: " + event.endpointId, ToastAndroid.SHORT);
        }
    });

    useEventListener(Nearby, "ConnectionResult", (event: ConnectionResult) => {
        setConnectionOut({ type: "REMOVE", element: event.endpointId });
        setConnectionIn({ type: "REMOVE", element: event.endpointId });
        setAuthenticationDigits(({ [event.endpointId]: _removed, ...digits }) => digits);

        if (event.status.includes("SUCCESS")) {
            setConnections({ type: "ADD", element: event.endpointId });
            console.log("Connection Established: " + event.endpointId);
            ToastAndroid.show("Connection Established: " + event.endpointId, ToastAndroid.SHORT);
        }
    });

    useEventListener(Nearby, "EndpointDisconnection", (event: EndpointEvent) => {
        setConnections({ type: "REMOVE", element: event.endpointId });
        console.log("Endpoint Disconnection: " + event.endpointId);
        ToastAndroid.show("Endpoint Disconnection: " + event.endpointId, ToastAndroid.SHORT);
    });

    return [connections, connectionOut, connectionIn, authenticationDigits] as const;
}
