import { EndpointFound, PayloadReceivedInfo } from "expo-googlenearby-connection";
import { createContext, useContext } from "react";
import { ModeType } from "./types";

// Payloads Endpoints
export const EndpointsContext = createContext<EndpointFound[] | null>(null);
export const EndpointsReducer = createContext<any>(null);

export const EndpointsContextProvider = EndpointsContext.Provider;
export const EndpointsReducerProvider = EndpointsReducer.Provider;

export const useEndpointsContext = () => {
    const endpoints = useContext(EndpointsContext);
    const endpointsReducer = useContext(EndpointsReducer);

    return [endpoints, endpointsReducer] as const;
};

// Payloads Inbound
export const PayloadsInContext = createContext<PayloadReceivedInfo[] | null>(null);
export const PayloadsInReducer = createContext<any>(null);

export const PayloadsInContextProvider = PayloadsInContext.Provider;
export const PayloadsInReducerProvider = PayloadsInReducer.Provider;

export const usePayloadsInContext = () => {
    const payloadsIn = useContext(PayloadsInContext);
    const payloadsInReducer = useContext(PayloadsInReducer);

    return [payloadsIn, payloadsInReducer] as const;
};

// Payloads Outbound
export const PayloadsOutContext = createContext<string[] | null>(null);
export const PayloadsOutReducer = createContext<any>(null);

export const PayloadsOutContextProvider = PayloadsOutContext.Provider;
export const PayloadsOutReducerProvider = PayloadsOutReducer.Provider;

export const usePayloadsOutContext = () => {
    const payloadsOut = useContext(PayloadsOutContext);
    const payloadsOutReducer = useContext(PayloadsOutReducer);

    return [payloadsOut, payloadsOutReducer] as const;
};

// Connections
export const ConnectionsContext = createContext<string[] | null>(null);
export const ConnectionsReducer = createContext<any>(null);

export const ConnectionsContextProvider = ConnectionsContext.Provider;
export const ConnectionsReducerProvider = ConnectionsReducer.Provider;

export const useConnectionsContext = () => {
    const connections = useContext(ConnectionsContext);
    const connectionsReducer = useContext(ConnectionsReducer);

    return [connections, connectionsReducer] as const;
};

// Theme
export const ThemeContext = createContext<ModeType>("light");
export const SetTheme = createContext<any>(null);

export const ThemeContextProvider = ThemeContext.Provider;
export const SetThemeProvider = SetTheme.Provider;

export const useThemeContext = () => {
    const theme = useContext(ThemeContext);
    const setTheme = useContext(SetTheme);

    return [theme, setTheme] as const;
};
