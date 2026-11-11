import { getDocumentAsync } from "expo-document-picker";
import { newPayloadFile, sendPayloadToEndpoint, sendPayloadToEndpoints } from "expo-googlenearby-connection";
import { View } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { ThemedText } from "./themedText";
import withPayload from "./withPayload";

function FilePayload({
    targetEndpoint,
    targetEndpoints,
    fileUri,
    onPicked,
    disabled,
}: {
    targetEndpoint: string;
    targetEndpoints?: string[];
    fileUri: string;
    onPicked: (file: string) => void;
    disabled: boolean;
}) {
    const pickFile = () => {
        getDocumentAsync().then((res) => {
            console.log("getDocumentAsync - File: ", res);
            if (res && res.assets) onPicked(res.assets[0].uri);
        });
    };

    return (
        <View>
            <ThemedText className="mb-4">
                <ThemedText className="font-bold">URI:</ThemedText> {fileUri ? fileUri : "No file selected"}
            </ThemedText>
            <Button
                size="md"
                variant="solid"
                action="secondary"
                onPress={pickFile}
                className="mb-4"
                isDisabled={disabled}
            >
                <ButtonText>Pick file</ButtonText>
            </Button>
            <Button
                size="md"
                variant="solid"
                action="primary"
                isDisabled={disabled}
                onPress={() => {
                    if (targetEndpoint) {
                        const payload = newPayloadFile(fileUri, false, fileUri.split("/").pop());

                        if (payload) sendPayloadToEndpoint(targetEndpoint, payload);
                    }

                    if (targetEndpoints) {
                        const payload = newPayloadFile(fileUri, false, fileUri.split("/").pop());

                        if (payload) sendPayloadToEndpoints(targetEndpoints, payload);
                    }
                }}
            >
                <ButtonText>Send file</ButtonText>
            </Button>
        </View>
    );
}

export default withPayload(FilePayload);
