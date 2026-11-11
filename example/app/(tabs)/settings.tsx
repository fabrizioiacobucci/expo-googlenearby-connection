import { Linking } from "react-native";
import { ConnectionType } from "expo-googlenearby-connection";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { usePermissionsContext } from "@/src/context";
import { Group } from "@/src/components/group";
import PermissionsBadge from "@/src/components/permissionsBadge";
import ThemedScrollView from "@/src/components/themedScrollView";
import { ThemedText } from "@/src/components/themedText";
import ThemeSwitcher from "@/src/components/themeSwitcher";
import { advertisingOptions, connectionOptions, discoveringOptions, endpointName, serviceId } from "@/src/options";

const nearbyOptions = [
    ["Service ID", serviceId],
    ["Advertising strategy", advertisingOptions.strategy],
    ["Advertising connection type", ConnectionType[advertisingOptions.connectionType]],
    ["Advertising low power mode", advertisingOptions.lowPowerMode ? "on" : "off"],
    ["Discovering strategy", discoveringOptions.strategy],
    ["Connection request name", endpointName],
    ["Connection request type", ConnectionType[connectionOptions.connectionType]],
    ["Connection request low power mode", connectionOptions.lowPowerMode ? "on" : "off"],
];

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
                <Group name="Nearby options">
                    {nearbyOptions.map(([label, value]) => (
                        <ThemedText key={label} className="mb-2">
                            <ThemedText className="font-bold">{label}:</ThemedText> {value}
                        </ThemedText>
                    ))}
                </Group>
            </VStack>
        </ThemedScrollView>
    );
}
