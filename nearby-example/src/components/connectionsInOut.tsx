import { acceptConnection, rejectConnection } from "expo-googlenearby-connection";
import { HStack } from "@/components/ui/hstack";
import { ThemedText } from "./themedText";
import { Button, ButtonText } from "@/components/ui/button";
import { Group } from "./group";

export default function ConnectionsInOut({ type, connections }: { type: "IN" | "OUT"; connections: string[] }) {
    return (
        <Group name={"Connections " + type.toLowerCase()}>
            {connections && connections.length ? (
                connections.map((value) => (
                    <HStack className="mb-2" key={value} style={{ flexDirection: "row" }}>
                        <ThemedText className="flex-1">{value}</ThemedText>
                        <Button
                            action="positive"
                            className="mr-2"
                            onPress={() => {
                                acceptConnection(value);
                            }}
                        >
                            <ButtonText>Accept</ButtonText>
                        </Button>
                        <Button
                            action="negative"
                            onPress={() => {
                                rejectConnection(value);
                            }}
                        >
                            <ButtonText>Reject</ButtonText>
                        </Button>
                    </HStack>
                ))
            ) : (
                <ThemedText>No connections</ThemedText>
            )}
        </Group>
    );
}
