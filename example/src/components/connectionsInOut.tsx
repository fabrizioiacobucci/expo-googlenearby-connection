import { acceptConnection, rejectConnection } from "expo-googlenearby-connection";
import { HStack } from "@/components/ui/hstack";
import { ThemedText } from "./themedText";
import { Button, ButtonText } from "@/components/ui/button";
import { Group } from "./group";

/**
 * Lists the connections in one direction, each with the code that both devices show, and the buttons to accept or
 * reject it; a connection can be accepted only once its code has arrived.
 *
 * @param type - "IN" for the connections that other endpoints requested, "OUT" for the ones this device requested.
 * @param connections - the endpoint IDs of the connections.
 * @param authenticationDigits - the code of each connection, keyed by endpoint ID.
 * @returns the group of the connections.
 * @example
 * <ConnectionsInOut type="IN" connections={connectionsIn} authenticationDigits={authenticationDigits} />
 */
export default function ConnectionsInOut({
    type,
    connections,
    authenticationDigits,
}: {
    type: "IN" | "OUT";
    connections: string[];
    authenticationDigits: Record<string, string>;
}) {
    return (
        <Group name={"Connections " + type.toLowerCase()}>
            {connections && connections.length ? (
                connections.map((value) => (
                    <HStack className="mb-2" key={value} style={{ flexDirection: "row" }}>
                        <ThemedText className="flex-1">
                            {value}
                            {authenticationDigits[value] ? `, code: ${authenticationDigits[value]}` : ""}
                        </ThemedText>
                        <Button
                            action="positive"
                            className="mr-2"
                            isDisabled={!authenticationDigits[value]}
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
