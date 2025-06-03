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
    console.log("Bytes Payload - Target Endpoint: " + targetEndpoint);
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
                    if (targetEndpoint)
                        sendPayloadToEndpoint(targetEndpoint, newPayloadBytes(stringToUint8Array(string)));

                    if (targetEndpoints)
                        sendPayloadToEndpoints(targetEndpoints, newPayloadBytes(stringToUint8Array(string)));
                }}
            >
                <ButtonText>Send text</ButtonText>
            </Button>
        </View>
    );
}

export default withPayload(BytesPayload);
