import { useCallback, useEffect, useReducer, useState } from "react";
import { AppState } from "react-native";
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
import { arrayReducer, checkPermissions, requestPermissions } from "../functions";
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
        const result = await requestPermissions();
        setPermissionsGranted(result.granted);

        return result;
    }, []);

    useEffect(() => {
        updatePermissions();
    }, [updatePermissions]);

    // Granting a permission in the Android settings does not restart the app, unlike revoking one
    useEffect(() => {
        const subscription = AppState.addEventListener("change", async (state) => {
            if (state === "active") {
                setPermissionsGranted((await checkPermissions()).granted);
            }
        });

        return () => subscription.remove();
    }, []);

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
