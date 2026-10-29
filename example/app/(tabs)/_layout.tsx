import { DarkTheme, DefaultTheme, Tabs, ThemeProvider } from "expo-router";
import React from "react";
import { ColorValue, Platform, SafeAreaView } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { defaultBgDark, defaultBgLight } from "@/src/options";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Constants from "expo-constants";
import useTheme from "@/src/hooks/useTheme";

/**
 * Builds the `tabBarIcon` option of a tab, showing a FontAwesome glyph in the tab's tint color.
 *
 * @param name - the FontAwesome glyph to show.
 * @returns the function that renders the icon of the tab.
 * @example
 * <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: renderTabBarIcon("home") }} />
 */
function renderTabBarIcon(name: React.ComponentProps<typeof FontAwesome>["name"]) {
    // expo-router types the tint color as ColorValue, while @expo/vector-icons accepts only
    // string | OpaqueColorValue; the tab bar passes a color of the navigation theme, which is a string.
    return ({ color }: { color: ColorValue }) => <FontAwesome size={28} name={name} color={color as string} />;
}

export default function TabLayout() {
    const [theme, setTheme] = useTheme();

    return (
        <GluestackUIProvider mode={theme ?? "system"}>
            <StatusBar style={theme == "light" ? "dark" : "light"} />
            <SafeAreaProvider className="h-full">
                <SafeAreaView
                    className="dark:bg-background-dark h-full"
                    style={{ paddingTop: Constants.statusBarHeight }}
                >
                    <ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
                        <Tabs
                            screenOptions={{
                                headerShown: false,
                                lazy: false,
                                tabBarStyle: Platform.select({
                                    ios: {
                                        // Use a transparent background on iOS to show the blur effect
                                        position: "absolute",
                                    },
                                    default: {
                                        // Use a solid background on Android to show the ripple effect
                                        backgroundColor:
                                            theme == "light"
                                                ? defaultBgLight
                                                : defaultBgDark,
                                    },
                                }),
                            }}
                        >
                            <Tabs.Screen
                                name="index"
                                options={{
                                    title: "Home",
                                    tabBarIcon: renderTabBarIcon("home"),
                                }}
                            />
                            <Tabs.Screen
                                name="connections"
                                options={{
                                    title: "Connections",
                                    tabBarIcon: renderTabBarIcon("wifi"),
                                }}
                            />
                            <Tabs.Screen
                                name="payloads"
                                options={{
                                    title: "Payloads",
                                    tabBarIcon: renderTabBarIcon("paper-plane"),
                                }}
                            />
                            <Tabs.Screen
                                name="settings"
                                options={{
                                    title: "Settings",
                                    tabBarIcon: renderTabBarIcon("gear"),
                                }}
                            />
                        </Tabs>
                    </ThemeProvider>
                </SafeAreaView>
            </SafeAreaProvider>
        </GluestackUIProvider>
    );
}
