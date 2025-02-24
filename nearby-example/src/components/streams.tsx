import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { PayloadType, readStreamByteArray, removePayload } from "expo-googlenearby-connection";
import usePayload from "../hooks/usePayload";
import { uint8ArrayToString } from "../functions";
import { Group } from "./group";
import { ThemedText } from "./themedText";

const Streams = () => {
    const [receivedPayloads] = usePayload();
    const [streamData, setStreamData] = useState<Record<string, string>>({});

    useEffect(() => {
        const updateStreams = async () => {
            if (receivedPayloads) {
                for (const payload of receivedPayloads) {
                    if (payload!.type === PayloadType.STREAM) {
                        try {
                            let byteArray = await readStreamByteArray(payload!.payloadId, 0, 1024);
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

    return <Group name="Stream payloads">{streams}</Group>;
};

export default Streams;
