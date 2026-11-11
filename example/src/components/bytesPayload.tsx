import { sendPayloadToEndpoint, newPayloadBytes, sendPayloadToEndpoints } from "expo-googlenearby-connection";
import { View } from "react-native";
import { stringToUint8Array } from "../functions";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import withPayload from "./withPayload";

function BytesPayload({
    targetEndpoint,
    targetEndpoints,
    string,
    onChange,
    disabled,
}: {
    targetEndpoint: string;
    targetEndpoints?: string[];
    string: string;
    onChange: (file: string) => void;
    disabled: boolean;
}) {
    return (
        <View>
            <Input
                variant="rounded"
                size="md"
                isDisabled={disabled}
                isInvalid={false}
                isReadOnly={false}
                className="mb-4"
            >
                <InputField placeholder="Enter Text here..." onChangeText={onChange} multiline={true} />
            </Input>
            <Button
                size="md"
                variant="solid"
                action="primary"
                isDisabled={disabled}
                onPress={() => {
                    if (targetEndpoint) {
                        const payloadId = newPayloadBytes(stringToUint8Array(string));
                        console.log(`Sending bytes payload ${payloadId} to ${targetEndpoint}`);
                        sendPayloadToEndpoint(targetEndpoint, payloadId);
                    }

                    if (targetEndpoints) {
                        const payloadId = newPayloadBytes(stringToUint8Array(string));
                        console.log(`Sending bytes payload ${payloadId} to ${targetEndpoints.join(", ")}`);
                        sendPayloadToEndpoints(targetEndpoints, payloadId);
                    }
                }}
            >
                <ButtonText>Send text</ButtonText>
            </Button>
        </View>
    );
}

export default withPayload(BytesPayload);
