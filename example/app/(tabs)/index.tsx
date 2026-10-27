import { ToastAndroid } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import Nearby, {
    Exception,
    startAdvertisingName,
    startDiscovering,
    stopAdvertising,
    stopAllEndpoints,
    stopDiscovering,
} from "expo-googlenearby-connection";
import { useEffect } from "react";
import { uint8ArrayToString } from "../../src/functions";
import usePermissions from "../../src/hooks/usePermissions";
import { EndpointsFound } from "../../src/components/endpointsFound";
import useEndpointsFound from "../../src/hooks/useEndpointsFound";
import { serviceId, discoveringOptions, advertisingOptions, endpointName } from "../../src/options";
import "@/global.css";
import { HStack } from "@/components/ui/hstack";
import { ThemedText } from "@/src/components/themedText";
import ThemeSwitcher from "@/src/components/themeSwitcher";
import { VStack } from "@/components/ui/vstack";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { CheckIcon, CloseIcon } from "@/components/ui/icon";
import ThemedScrollView from "@/src/components/themedScrollView";
import { Group } from "@/src/components/group";
import useLocation from "@/src/hooks/useLocation";
import { useEventListener } from "expo";
const haversine = require("haversine");

export default function index() {
    const permissionsGranted = usePermissions();
    const [lastEndpoint, endpointsFound] = useEndpointsFound();
    const location = useLocation();
    const advertisingText =
        '{"latitude": ' + location?.coords.latitude + ', "longitude": ' + location?.coords.longitude + "}";

    useEffect(() => {
        if (lastEndpoint && location) {
            const target = JSON.parse(uint8ArrayToString(lastEndpoint.endpointInfo));
            console.log("Target: ", target);
            console.log("Current location before distance: ", location);
            const distance = haversine(
                { latitude: location?.coords.latitude, longitude: location?.coords.longitude },
                { latitude: target.latitude, longitude: target.longitude },
                { unit: "meter" }
            );
            console.log(`Distance: ${distance}`);
        }
    }, [endpointsFound]);

    useEventListener(Nearby, "AdvertisingStarted", () => {
        console.log("AdvertisingStarted");
        ToastAndroid.show("AdvertisingStarted", ToastAndroid.SHORT);
    });

    useEventListener(Nearby, "AdvertisingFailed", (e: Exception) => {
        console.log("AdvertisingFailed " + e.error);
        ToastAndroid.show("AdvertisingFailed " + e.error, ToastAndroid.SHORT);
    });

    useEventListener(Nearby, "DiscoveringFailed", (e: Exception) => {
        console.log("DiscoveringFailed " + e.error);
        ToastAndroid.show("DiscoveringFailed " + e.error, ToastAndroid.SHORT);
    });

    useEventListener(Nearby, "DiscoveringStarted", () => {
        console.log("DiscoveringStarted");
        ToastAndroid.show("DiscoveringStarted", ToastAndroid.SHORT);
    });

    return (
        <ThemedScrollView>
            <VStack>
                <Group>
                    <HStack>
                        <Badge size="md" variant="solid" action="muted" className="flex-1 bg-transparent px-0">
                            <BadgeText>{permissionsGranted ? "Permissions granted" : "Permissions denied"}</BadgeText>
                            <BadgeIcon as={permissionsGranted ? CheckIcon : CloseIcon} className="ml-2" />
                        </Badge>
                        <ThemeSwitcher />
                    </HStack>
                </Group>
                <Group name="Controls">
                    <Button
                        size="md"
                        variant="solid"
                        action="secondary"
                        onPress={() => startDiscovering(serviceId, discoveringOptions)}
                        className="my-6"
                    >
                        <ButtonText>Start discovering</ButtonText>
                    </Button>
                    <Button
                        size="md"
                        variant="solid"
                        action="secondary"
                        onPress={() => {
                            startAdvertisingName(advertisingText, serviceId, advertisingOptions);
                        }}
                    >
                        <ButtonText>Start advertising</ButtonText>
                    </Button>
                    <Button size="md" variant="solid" action="secondary" onPress={stopDiscovering} className="my-6">
                        <ButtonText>Stop discovering</ButtonText>
                    </Button>
                    <Button size="md" variant="solid" action="secondary" onPress={stopAdvertising}>
                        <ButtonText>Stop advertising</ButtonText>
                    </Button>
                    <Button size="md" variant="solid" action="negative" onPress={stopAllEndpoints} className="my-6">
                        <ButtonText>Stop all</ButtonText>
                    </Button>
                    <ThemedText>
                        <ThemedText className="font-bold">Location:</ThemedText> {JSON.stringify(location)}
                    </ThemedText>
                </Group>
                <Group name="Endpoints">
                    <EndpointsFound endpointName={endpointName} />
                </Group>
            </VStack>
        </ThemedScrollView>
    );
}
