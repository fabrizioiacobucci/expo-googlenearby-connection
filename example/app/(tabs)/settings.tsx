import { Linking } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { usePermissionsContext } from "@/src/context";
import { Group } from "@/src/components/group";
import PermissionsBadge from "@/src/components/permissionsBadge";
import ThemedScrollView from "@/src/components/themedScrollView";
import { ThemedText } from "@/src/components/themedText";
import ThemeSwitcher from "@/src/components/themeSwitcher";

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
                <Group name="Theme">
                    <HStack className="items-center">
                        <ThemedText className="flex-1">Switch between the light and the dark theme</ThemedText>
                        <ThemeSwitcher />
                    </HStack>
                </Group>
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
