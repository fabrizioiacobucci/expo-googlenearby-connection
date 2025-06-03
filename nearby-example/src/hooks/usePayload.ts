import Nearby, { PayloadEvent, PayloadReceivedInfo, PayloadSend } from "expo-googlenearby-connection";
import { ToastAndroid } from "react-native";
import { usePayloadsInContext, usePayloadsOutContext } from "../context";
import { payloadComparator } from "../functions";
import { useEventListener } from "expo";

export default function usePayload() {
    const [payloadsIn, setPayloadsIn] = usePayloadsInContext();
    const [payloadsOut, setPayloadsOut] = usePayloadsOutContext();

    useEventListener(Nearby, "StopAllEndpoints", () => {
        setPayloadsIn({ type: "EMPTY" });
        setPayloadsOut({ type: "EMPTY" });
    });

    useEventListener(Nearby, "PayloadReceived", (event: PayloadReceivedInfo) => {
        console.log("Payload Received: " + event?.payloadId);
        ToastAndroid.show("Payload Received: " + event?.payloadId, ToastAndroid.SHORT);
        setPayloadsIn({ type: "ADD", element: event, comparator: payloadComparator });
    });

    useEventListener(Nearby, "PayloadSend", (event: PayloadSend) => {
        console.log("Payload Sent: " + event.payloadId);
        ToastAndroid.show("Payload Sent: " + event.payloadId, ToastAndroid.SHORT);
        setPayloadsOut({ type: "ADD", element: event.payloadId });
    });

    useEventListener(Nearby, "PayloadRemoved", (event: PayloadEvent) => {
        setPayloadsIn({ type: "REMOVE", element: event, comparator: payloadComparator });
        setPayloadsOut({ type: "REMOVE", element: event.payloadId });
    });

    return [payloadsIn, payloadsOut] as const;
}
