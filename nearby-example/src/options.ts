import {
    DiscoveringOptions,
    AdvertisingOptions,
    ConnectionType,
    ConnectionOptions,
} from "expo-googlenearby-connection";
import { getRandomId } from "./functions";

export const discoveringOptions: DiscoveringOptions = {
    strategy: "P2P_CLUSTER",
};

export const advertisingOptions: AdvertisingOptions = {
    strategy: "P2P_CLUSTER",
    connectionType: ConnectionType.BALANCED,
    lowPowerMode: false,
};

export const connectionOptions: ConnectionOptions = {
    connectionType: ConnectionType.BALANCED,
    lowPowerMode: false,
};

export const endpointName = getRandomId(8);
export const serviceId = "nearby-example";

export const defaultBgLight = "#fbfbfb";
export const defaultBgDark = "#121212";
