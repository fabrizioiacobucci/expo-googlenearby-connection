import { ToastAndroid } from "react-native";
import useConnections from "../../src/hooks/useConnections";
import ConnectionsInOut from "../../src/components/connectionsInOut";
import Nearby, { BandwidthChanged, disconnectFromEndpoint } from "expo-googlenearby-connection";
import { useEffect } from "react";
import { VStack } from "@/components/ui/vstack";
import ThemedScrollView from "@/src/components/themedScrollView";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Group } from "@/src/components/group";
import { ThemedText } from "@/src/components/themedText";
import { useEventListener } from "expo";

export default function Connections() {
    const [connections, connectionsOut, connectionsIn] = useConnections();

    useEventListener(Nearby, "BandwidthChanged", (event: BandwidthChanged) => {
        console.log("Bandwidth Changed: " + event.endpointId + " to " + event.quality);
        ToastAndroid.show("Bandwidth Changed: " + event.endpointId + " to " + event.quality, ToastAndroid.SHORT);
    });

    return (
        <ThemedScrollView>
            <VStack>
                <Group name="Active connections">
                    {connections && connections.length ? (
                        connections.map((value) => (
                            <HStack className="my-2" key={value} style={{ flexDirection: "row" }}>
                                <ThemedText className="flex-1">{value}</ThemedText>
                                <Button
                                    onPress={() => {
                                        disconnectFromEndpoint(value);
                                    }}
                                >
                                    <ButtonText>Disconnect</ButtonText>
                                </Button>
                            </HStack>
                        ))
                    ) : (
                        <ThemedText>No connections</ThemedText>
                    )}
                </Group>
                <ConnectionsInOut type="OUT" connections={connectionsOut} />
                <ConnectionsInOut type="IN" connections={connectionsIn} />
            </VStack>
        </ThemedScrollView>
    );
}
