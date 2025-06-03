import { useReducer, useState } from "react";
import {
    ConnectionsContextProvider,
    ConnectionsReducerProvider,
    EndpointsContextProvider,
    EndpointsReducerProvider,
    PayloadsInContextProvider,
    PayloadsInReducerProvider,
    PayloadsOutContextProvider,
    PayloadsOutReducerProvider,
    SetThemeProvider,
    ThemeContextProvider,
} from "../context";
import { arrayReducer } from "../functions";
import { EndpointFound, PayloadReceivedInfo } from "expo-googlenearby-connection";
import { ModeType } from "../types";

export function Provider(props: { children: React.ReactNode }) {
    const [endpoints, endpointsReducer] = useReducer(arrayReducer<EndpointFound>, []);
    const [payloadsIn, payloadsInReducer] = useReducer(arrayReducer<PayloadReceivedInfo>, []);
    const [payloadsOut, payloadsOutReducer] = useReducer(arrayReducer<string>, []);
    const [connections, connectionsReducer] = useReducer(arrayReducer<string>, []);
    const [theme, setTheme] = useState<ModeType>("light");

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
                                                {props.children}
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
