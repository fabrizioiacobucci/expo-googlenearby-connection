import { ColorSchemeName } from "react-native";
import { ArrayReducerActions, Characters, ModeType } from "./types";
import { EndpointEvent, PayloadEvent } from "expo-googlenearby-connection";

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

export const getColorSchemeName = (colorScheme: ColorSchemeName, mode?: ModeType): ModeType => {
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
