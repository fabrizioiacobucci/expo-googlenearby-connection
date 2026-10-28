import { useCallback, useEffect, useReducer, useState } from "react";
import {
    ConnectionsContextProvider,
    ConnectionsReducerProvider,
    EndpointsContextProvider,
    EndpointsReducerProvider,
    PayloadsInContextProvider,
    PayloadsInReducerProvider,
    PayloadsOutContextProvider,
    PayloadsOutReducerProvider,
    PermissionsContextProvider,
    RequestPermissionsProvider,
    SetThemeProvider,
    ThemeContextProvider,
} from "../context";
import { arrayReducer, requestPermissions } from "../functions";
import { EndpointFound, PayloadReceivedInfo } from "expo-googlenearby-connection";
import { ModeType } from "../types";

export function Provider(props: { children: React.ReactNode }) {
    const [endpoints, endpointsReducer] = useReducer(arrayReducer<EndpointFound>, []);
    const [payloadsIn, payloadsInReducer] = useReducer(arrayReducer<PayloadReceivedInfo>, []);
    const [payloadsOut, payloadsOutReducer] = useReducer(arrayReducer<string>, []);
    const [connections, connectionsReducer] = useReducer(arrayReducer<string>, []);
    const [theme, setTheme] = useState<ModeType>("light");
    const [permissionsGranted, setPermissionsGranted] = useState(false);

    const updatePermissions = useCallback(async () => {
        setPermissionsGranted(await requestPermissions());
    }, []);

    useEffect(() => {
        updatePermissions();
    }, [updatePermissions]);

    return (
        <ThemeContextProvider value={theme}>
            <SetThemeProvider value={setTheme}>
                <EndpointsContextProvider value={endpoints}>
                    <EndpointsReducerProvider value={endpointsReducer}>
                        <PayloadsInContextProvider value={payloadsIn}>
                            <PayloadsInReducerProvider value={payloadsInReducer}>
                                <PayloadsOutContextProvider value={payloadsOut}>
                                    <PayloadsOutReducerProvider value={payloadsOutReducer}>
                                        <ConnectionsContextProvider value={connections}>
                                            <ConnectionsReducerProvider value={connectionsReducer}>
                                                <PermissionsContextProvider value={permissionsGranted}>
                                                    <RequestPermissionsProvider value={updatePermissions}>
                                                        {props.children}
                                                    </RequestPermissionsProvider>
                                                </PermissionsContextProvider>
                                            </ConnectionsReducerProvider>
                                        </ConnectionsContextProvider>
                                    </PayloadsOutReducerProvider>
                                </PayloadsOutContextProvider>
                            </PayloadsInReducerProvider>
                        </PayloadsInContextProvider>
                    </EndpointsReducerProvider>
                </EndpointsContextProvider>
            </SetThemeProvider>
        </ThemeContextProvider>
    );
}
