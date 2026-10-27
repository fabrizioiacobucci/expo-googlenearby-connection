import { ToastAndroid } from "react-native";
import usePayload from "../../src/hooks/usePayload";
import { useEffect, useState } from "react";
import FilePayload from "../../src/components/filePayload";
import BytesPayload from "../../src/components/bytesPayload";
import StreamPayload from "../../src/components/streamPayload";
import { Group } from "../../src/components/group";
import Nearby, { Exception, PayloadReceivedInfo, removePayload } from "expo-googlenearby-connection";
import Streams from "../../src/components/streams";
import { VStack } from "@/components/ui/vstack";
import ThemedScrollView from "@/src/components/themedScrollView";
import { Button, ButtonText } from "@/components/ui/button";
import { ThemedText } from "@/src/components/themedText";
import { HStack } from "@/components/ui/hstack";
import EndpointPicker from "@/src/components/endpointPicker";
import { useEventListener } from "expo";

export default function Payloads() {
    const [payloadsIn, payloadsOut] = usePayload();
    const [bytesPayload, setBytesPayload] = useState("");
    const [filePayload, setFilePayload] = useState("");
    const [endpointId, setEndpointId] = useState("");

    useEventListener(Nearby, "StopAllEndpoints", () => {
        setEndpointId("");
        setBytesPayload("");
        setFilePayload("");
    });

    const payloadsInbound =
        payloadsIn && payloadsIn.length > 0 ? (
            payloadsIn.map((payload: PayloadReceivedInfo) => {
                return (
                    <HStack key={payload!.payloadId} className="mb-2">
                        <ThemedText className="flex-1">{payload!.payloadId}</ThemedText>
                        <Button
                            size="md"
                            variant="solid"
                            action="secondary"
                            onPress={() => removePayload(payload!.payloadId)}
                        >
                            <ButtonText>Remove</ButtonText>
                        </Button>
                    </HStack>
                );
            })
        ) : (
            <ThemedText key="0">No payloads received</ThemedText>
        );

    const payloadsOutbound =
        payloadsOut && payloadsOut.length > 0 ? (
            payloadsOut.map((payload: string) => {
                return (
                    <HStack key={payload} className="mb-2">
                        <ThemedText className="flex-1">{payload}</ThemedText>
                        <Button size="md" variant="solid" action="secondary" onPress={() => removePayload(payload)}>
                            <ButtonText>Remove</ButtonText>
                        </Button>
                    </HStack>
                );
            })
        ) : (
            <ThemedText key="0">No payloads sent</ThemedText>
        );

    useEventListener(Nearby, "PayloadNotFound", (event: Exception) => {
        console.log("PayloadNotFound: ", event.error);
        console.log("PayloadNotFound: ", event.stackTrace);
        console.log("PayloadNotFound: ", event.data);
        ToastAndroid.show("Payload not found - " + event.error, ToastAndroid.SHORT);
    });

    useEventListener(Nearby, "PayloadInvalidArguments", (event: Exception) => {
        console.log("PayloadInvalidArguments: ", event.error);
        console.log("PayloadInvalidArguments: ", event.stackTrace);
        console.log("PayloadInvalidArguments: ", event.data);
        ToastAndroid.show("Payload invalid arguments - " + event.error, ToastAndroid.SHORT);
    });

    useEventListener(Nearby, "PayloadIOException", (event: Exception) => {
        console.log("PayloadIOException: ", event.error);
        console.log("PayloadIOException: ", event.stackTrace);
        console.log("PayloadIOException: ", event.data);
        ToastAndroid.show("Payload IO exception - " + event.error, ToastAndroid.SHORT);
    });

    useEventListener(Nearby, "PayloadException", (event: Exception) => {
        console.log("PayloadException: ", event.error);
        console.log("PayloadException: ", event.stackTrace);
        console.log("PayloadException: ", event.data);
        ToastAndroid.show("Payload exception - " + event.error, ToastAndroid.SHORT);
    });

    return (
        <ThemedScrollView>
            <VStack>
                <EndpointPicker endpointId={endpointId} onChange={setEndpointId} />
                <Group name="Bytes">
                    <BytesPayload
                        string={bytesPayload}
                        onChange={setBytesPayload}
                        targetEndpoint={endpointId as string}
                    />
                </Group>
                <Group name="File">
                    <FilePayload
                        fileUri={filePayload}
                        onPicked={setFilePayload}
                        targetEndpoint={endpointId as string}
                    />
                </Group>
                <Group name="Stream">
                    <StreamPayload streamStart="[STREAM]" targetEndpoint={endpointId as string} />
                </Group>
                <Group name="Payloads inbound">{payloadsInbound}</Group>
                <Group name="Payloads outbound">{payloadsOutbound}</Group>
                <Streams />
            </VStack>
        </ThemedScrollView>
    );
}
