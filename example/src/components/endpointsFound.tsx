import { EndpointFound, requestConnectionName } from "expo-googlenearby-connection";
import { Link } from "expo-router";
import { Button, ButtonText } from "@/components/ui/button";
import { connectionOptions } from "../options";
import "@/global.css";
import { ThemedText } from "./themedText";
import { useEndpointsContext } from "../context";

export function EndpointsFound(props: { endpointName: string }) {
    const [endpoints] = useEndpointsContext();

    const endpointsItems =
        endpoints && endpoints.length > 0 ? (
            endpoints!.map((value: EndpointFound) => (
                <Link className="mb-2" asChild key={value.endpointId} href="/(tabs)/connections">
                    <Button
                        onPress={() => requestConnectionName(props.endpointName, value.endpointId, connectionOptions)}
                    >
                        <ButtonText>{value.endpointId}</ButtonText>
                    </Button>
                </Link>
            ))
        ) : (
            <ThemedText>No endpoints found yet</ThemedText>
        );

    return endpointsItems;
}
