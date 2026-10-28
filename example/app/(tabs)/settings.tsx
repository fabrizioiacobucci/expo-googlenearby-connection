import { Linking } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { usePermissionsContext } from "@/src/context";
import { Group } from "@/src/components/group";
import PermissionsBadge from "@/src/components/permissionsBadge";
import ThemedScrollView from "@/src/components/themedScrollView";

export default function Settings() {
    const [, requestPermissions] = usePermissionsContext();

    /**
     * Requests the permissions again, and opens the settings of the app when Android no longer shows the
     * permission dialog, because the user denied a permission for good.
     *
     * @example
     * <Button onPress={requestPermissionsAgain} />
     */
    async function requestPermissionsAgain() {
        const { granted, canAskAgain } = await requestPermissions();

        if (!granted && !canAskAgain) {
            await Linking.openSettings();
        }
    }

    return (
        <ThemedScrollView>
            <VStack>
                <Group name="Permissions">
                    <PermissionsBadge />
                    <Button
                        size="md"
                        variant="solid"
                        action="secondary"
                        onPress={requestPermissionsAgain}
                        className="mt-6">
                        <ButtonText>Request permissions</ButtonText>
                    </Button>
                </Group>
            </VStack>
        </ThemedScrollView>
    );
}
