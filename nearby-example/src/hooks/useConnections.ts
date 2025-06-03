import Nearby, { ConnectionInitiated, ConnectionResult, EndpointEvent } from "expo-googlenearby-connection";
import { useReducer } from "react";
import { ToastAndroid } from "react-native";
import { arrayReducer } from "../functions";
import { useConnectionsContext } from "../context";
import { useEventListener } from "expo";

export default function useConnections() {
    const [connections, setConnections] = useConnectionsContext();
    const [connectionOut, setConnectionOut] = useReducer(arrayReducer<string>, []);
    const [connectionIn, setConnectionIn] = useReducer(arrayReducer<string>, []);

    useEventListener(Nearby, "StopAllEndpoints", () => {
        setConnections({ type: "EMPTY" });
        setConnectionOut({ type: "EMPTY" });
        setConnectionIn({ type: "EMPTY" });
    });

    useEventListener(Nearby, "ConnectionRequested", (event: EndpointEvent) => {
        setConnectionOut({ type: "ADD", element: event.endpointId });
        console.log("Connection requested: " + event.endpointId);
        ToastAndroid.show("Connection requested: " + event.endpointId, ToastAndroid.SHORT);
    });

    useEventListener(Nearby, "ConnectionInitiated", (event: ConnectionInitiated) => {
        if (event.isIncomingConnection) {
            setConnectionIn({ type: "ADD", element: event.endpointId });
            console.log("Connection Initiated: " + event.endpointId);
            ToastAndroid.show("Connection Initiated: " + event.endpointId, ToastAndroid.SHORT);
        }
    });

    useEventListener(Nearby, "ConnectionResult", (event: ConnectionResult) => {
        setConnectionOut({ type: "REMOVE", element: event.endpointId });
        setConnectionIn({ type: "REMOVE", element: event.endpointId });

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

    return [connections, connectionOut, connectionIn] as const;
}
