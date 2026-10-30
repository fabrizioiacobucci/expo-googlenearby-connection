import { ColorSchemeName } from "react-native";
import { ArrayReducerActions, Characters, ModeType, PermissionsResult } from "./types";
import {
    EndpointEvent,
    getPermissionsAsync,
    PayloadEvent,
    requestPermissionsAsync,
} from "expo-googlenearby-connection";
import * as Location from "expo-location";
import { PermissionResponse } from "expo";

export function stringToUint8Array(str: string) {
    const encoder = new TextEncoder();
    return encoder.encode(str);
}

export function uint8ArrayToString(arr: Uint8Array) {
    const decoder = new TextDecoder();
    return decoder.decode(arr);
}

export const delay = (delayInms: number) => {
    return new Promise((resolve) => setTimeout(resolve, delayInms));
};

export function arrayReducer<T>(
    state: T[],
    action: { type: ArrayReducerActions; element?: T; comparator?: (a: T, b: T) => boolean }
): T[] {
    switch (action.type) {
        case "ADD": {
            return state.some((item) =>
                action.comparator ? action.comparator(item, action.element!) : item === action.element
            )
                ? state
                : [...state, action.element as T];
        }
        case "EMPTY": {
            return [];
        }
        case "REMOVE": {
            return state.filter(
                (value) => !(action.comparator ? action.comparator(value, action.element!) : value === action.element)
            );
        }
        default: {
            throw Error("Unknown action: " + action.type);
        }
    }
}

/**
 * Resolves the theme mode of the app to the color scheme to show.
 *
 * @param colorScheme the color scheme of the system, or `null` when the system does not report one.
 * @param [mode] the theme mode of the app; `"system"`, or none, follows the color scheme of the system.
 * @returns `mode` when it is `"light"` or `"dark"`; otherwise the color scheme of the system, or `"light"` when the
 * system does not report one.
 * @example
 * getColorSchemeName(useColorScheme(), "system"); // "dark" on a device in dark mode
 */
export const getColorSchemeName = (colorScheme: ColorSchemeName | null, mode?: ModeType): ColorSchemeName => {
    if (!mode || mode === "system") {
        return colorScheme ?? "light";
    }
    return mode;
};

export function getRandomId(length: number) {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += Characters.charAt(Math.floor(Math.random() * Characters.length));
    }
    return result;
}

export function endpointComparator<T extends EndpointEvent>(a: T, b: T) {
    return a.endpointId === b.endpointId;
}

export function payloadComparator<T extends PayloadEvent>(a: T, b: T) {
    return a.payloadId === b.payloadId;
}

/**
 * Requests the foreground location permission and the permissions of Nearby Connections.
 *
 * @returns whether both are granted, and whether Android can still show the dialog of each permission denied.
 * @example
 * const { granted, canAskAgain } = await requestPermissions();
 */
export async function requestPermissions(): Promise<PermissionsResult> {
    const location = await Location.requestForegroundPermissionsAsync();
    const nearby = await requestPermissionsAsync();
    console.log("Location permissions status: " + location.status);
    console.log("Nearby permissions status: " + nearby.granted);

    return combinePermissions(location, nearby);
}

/**
 * Reads the status of the foreground location permission and of the permissions of Nearby Connections, without
 * showing any dialog.
 *
 * @returns whether both are granted, and whether Android can still show the dialog of each permission denied.
 * @example
 * const { granted } = await checkPermissions();
 */
export async function checkPermissions(): Promise<PermissionsResult> {
    return combinePermissions(await Location.getForegroundPermissionsAsync(), await getPermissionsAsync());
}

/**
 * Combines the status of the location permission and of the permissions of Nearby Connections.
 *
 * @param location - the status of the foreground location permission.
 * @param nearby - the status of the permissions of Nearby Connections.
 * @returns whether both are granted, and whether Android can still show the dialog of each permission denied.
 * @example
 * combinePermissions(await Location.getForegroundPermissionsAsync(), await getPermissionsAsync());
 */
function combinePermissions(location: PermissionResponse, nearby: PermissionResponse): PermissionsResult {
    return {
        granted: location.granted && nearby.granted,
        canAskAgain: location.canAskAgain && nearby.canAskAgain,
    };
}
