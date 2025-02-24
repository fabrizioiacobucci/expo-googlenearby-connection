import Nearby, { EndpointFound, EndpointEvent } from "expo-googlenearby-connection";
import { useState } from "react";
import { ToastAndroid } from "react-native";
import { endpointComparator, uint8ArrayToString } from "../functions";
import { useEndpointsContext } from "../context";
import { useEventListener } from "expo";

export default function useEndpointsFound() {
    const [endpointsFound, setEndpointsFound] = useEndpointsContext();
    const [lastEndpointFound, setLastEndpointFound] = useState<EndpointFound | null>(null);

    useEventListener(Nearby, "StopAllEndpoints", () => {
        setEndpointsFound({ type: "EMPTY" });
        console.log(`All endpoints stopped`);
        ToastAndroid.show("All endpoints stopped", ToastAndroid.SHORT);
    });

    useEventListener(Nearby, "EndpointFound", (event: EndpointFound) => {
        setEndpointsFound({ type: "ADD", element: event, comparator: endpointComparator });
        setLastEndpointFound(event);

        const info = uint8ArrayToString(event.endpointInfo);
        console.log(`Endpoint found: ${info}`);
        ToastAndroid.show(`Endpoint found: ${info}`, ToastAndroid.SHORT);
    });

    useEventListener(Nearby, "EndpointLost", (event: EndpointEvent) => {
        setEndpointsFound({ type: "REMOVE", element: event, comparator: endpointComparator });
        console.log("Endpointslost: ", endpointsFound);
        console.log(`Endpoint lost: ${event.endpointId}`);
        ToastAndroid.show(`Endpoint lost: ${event.endpointId}`, ToastAndroid.SHORT);
    });

    return [lastEndpointFound, endpointsFound] as const;
}
