import React from "react";
import { config } from "./config";
import { useColorScheme, View, ViewProps } from "react-native";
import { OverlayProvider } from "@gluestack-ui/overlay";
import { ToastProvider } from "@gluestack-ui/toast";
import { colorScheme as colorSchemeNW } from "nativewind";
import { getColorSchemeName } from "@/src/functions";
import { ModeType } from "@/src/types";

export function GluestackUIProvider({
    mode = "dark",
    ...props
}: {
    mode?: ModeType;
    children?: React.ReactNode;
    style?: ViewProps["style"];
}) {
    const colorScheme = useColorScheme();

    const colorSchemeName = getColorSchemeName(colorScheme, mode);

    colorSchemeNW.set(mode);

    return (
        <View
            style={[
                config[colorSchemeName],
                // eslint-disable-next-line react-native/no-inline-styles
                { flex: 1, height: "100%", width: "100%" },
                props.style,
            ]}
        >
            <OverlayProvider>
                <ToastProvider>{props.children}</ToastProvider>
            </OverlayProvider>
        </View>
    );
}
