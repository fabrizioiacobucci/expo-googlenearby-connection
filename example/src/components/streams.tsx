import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { PayloadType, readStreamByteArray, removePayload } from "expo-googlenearby-connection";
import { usePayloadsInContext } from "../context";
import { uint8ArrayToString } from "../functions";
import { Group } from "./group";
import { ThemedText } from "./themedText";

const READ_LENGTH = 1024;
const OFFSET_CHECK = 2;

const Streams = () => {
    const [receivedPayloads] = usePayloadsInContext();
    const [streamData, setStreamData] = useState<Record<string, string>>({});
    // The offset check runs inside the polling below, since a separate read would wait for the lock that a
    // blocked read of the polling holds until more data arrives.
    const offsetCheckPending = useRef(false);
    const [offsetCheck, setOffsetCheck] = useState("not run");

    useEffect(() => {
        const updateStreams = async () => {
            if (receivedPayloads) {
                for (const payload of receivedPayloads) {
                    if (payload!.type === PayloadType.STREAM) {
                        const offset = offsetCheckPending.current ? OFFSET_CHECK : 0;
                        offsetCheckPending.current = false;
                        try {
                            const read = await readStreamByteArray(payload!.payloadId, offset, READ_LENGTH);
                            if (offset > 0) {
                                const passed =
                                    read !== null &&
                                    read.length === offset + READ_LENGTH &&
                                    read[0] === 0 &&
                                    read[1] === 0;
                                setOffsetCheck(passed ? "pass" : "fail");
                                console.log(
                                    `Check ${passed ? "pass" : "fail"}: readStreamByteArray with offset ${offset}`
                                );
                            }
                            const byteArray = read?.slice(offset);
                            if (!byteArray) continue;

                            if (byteArray[0] == -1) {
                                setStreamData((prev) => {
                                    const newData = { ...prev };
                                    delete newData[payload!.payloadId];
                                    return newData;
                                });
                                removePayload(payload!.payloadId);
                            }
                            const string = uint8ArrayToString(byteArray).replace("[STREAM]", "");
                            if (string) {
                                setStreamData((prev) => ({
                                    ...prev,
                                    [payload!.payloadId]: (prev[payload!.payloadId] || "") + string,
                                }));
                            }
                        } catch (error) {
                            if (offset > 0) setOffsetCheck("fail");
                            console.error(`Error in reading stream ${payload}:`, error);
                        }
                    }
                }
            }
        };

        const interval = setInterval(updateStreams, 500);
        return () => clearInterval(interval);
    }, [receivedPayloads]);

    const streams =
        receivedPayloads && receivedPayloads.length > 0 ? (
            receivedPayloads
                ?.filter((p) => p?.type === PayloadType.STREAM)
                .map((stream) => {
                    return (
                        <View className="p-4 border-b-1 border-b-[#ccc]" key={stream?.payloadId}>
                            <ThemedText>📡 Payload ID: {stream!.payloadId}</ThemedText>
                            <ThemedText>🔗 Endpoint: {stream!.endpointId}</ThemedText>
                            <ThemedText>📥 Received data: {streamData[stream!.payloadId] || "Waiting..."}</ThemedText>
                        </View>
                    );
                })
        ) : (
            <ThemedText>No streams</ThemedText>
        );

    return (
        <Group name="Stream payloads">
            {streams}
            <Button
                size="md"
                variant="solid"
                action="secondary"
                className="mt-4 mb-2"
                onPress={() => {
                    offsetCheckPending.current = true;
                    setOffsetCheck("waiting for data");
                }}>
                <ButtonText>Read with offset</ButtonText>
            </Button>
            <ThemedText>Read with offset: {offsetCheck}</ThemedText>
        </Group>
    );
};

export default Streams;
