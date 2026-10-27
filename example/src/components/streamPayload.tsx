import {
    removePayload,
    newPayloadStream,
    sendPayloadToEndpoint,
    sendPayloadToEndpoints,
    writeStreamByteArray,
} from "expo-googlenearby-connection";
import { useRef, useState } from "react";
import { View } from "react-native";
import { stringToUint8Array } from "../functions";
import { ThemedText } from "./themedText";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import withPayload from "./withPayload";

function StreamPayload({
    targetEndpoint,
    targetEndpoints,
    streamStart,
    disabled,
}: {
    targetEndpoint: string;
    targetEndpoints?: string[];
    streamStart: string;
    disabled: boolean;
}) {
    const [streamPayload, setStreamPayload] = useState("");
    const [streamData, setStreamData] = useState("");
    let sent = useRef(false);

    return (
        <View>
            <ThemedText className="mb-4">
                <ThemedText className="font-bold">Stream id:</ThemedText>{" "}
                {streamPayload ? streamPayload : "No stream started"}
            </ThemedText>
            <Button
                size="md"
                variant="solid"
                action="secondary"
                className="mb-4"
                isDisabled={disabled}
                onPress={async () => {
                    const payload = newPayloadStream();
                    setStreamPayload(payload);
                    await writeStreamByteArray(payload, stringToUint8Array(streamStart));
                    sent.current = false;
                }}
            >
                <ButtonText>Init stream</ButtonText>
            </Button>
            <Input
                variant="rounded"
                size="md"
                isDisabled={disabled}
                isInvalid={false}
                isReadOnly={false}
                className="mb-4"
            >
                <InputField
                    placeholder="Enter text here..."
                    onChangeText={setStreamData}
                    value={streamData}
                    multiline={true}
                />
            </Input>
            <Button
                size="md"
                variant="solid"
                action="primary"
                className="mb-4"
                isDisabled={disabled}
                onPress={() => {
                    if (!sent.current && (targetEndpoint || targetEndpoints) && streamPayload) {
                        if (targetEndpoint) sendPayloadToEndpoint(targetEndpoint, streamPayload);

                        if (targetEndpoints) sendPayloadToEndpoints(targetEndpoints, streamPayload);

                        sent.current = true;
                    }
                    writeStreamByteArray(streamPayload, stringToUint8Array(streamData));
                }}
            >
                <ButtonText>Send stream</ButtonText>
            </Button>
            <Button
                size="md"
                variant="solid"
                action="primary"
                isDisabled={disabled}
                onPress={() => {
                    removePayload(streamPayload);
                    sent.current = false;
                }}
            >
                <ButtonText>Close stream</ButtonText>
            </Button>
        </View>
    );
}

export default withPayload(StreamPayload);
