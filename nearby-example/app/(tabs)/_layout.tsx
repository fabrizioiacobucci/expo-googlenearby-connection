import { Tabs } from "expo-router";
import React from "react";
import { Platform, SafeAreaView } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { defaultBgDark, defaultBgLight } from "@/src/options";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Constants from "expo-constants";
import useTheme from "@/src/hooks/useTheme";

export default function TabLayout() {
    const [theme, setTheme] = useTheme();

    return (
        <GluestackUIProvider mode={theme ?? "system"}>
            <StatusBar
                style={theme == "light" ? "dark" : "light"}
                backgroundColor={theme == "light" ? defaultBgLight : defaultBgDark}
            />
            <SafeAreaProvider className="h-full">
                <SafeAreaView
                    className="dark:bg-background-dark h-full"
                    style={{ paddingTop: Constants.statusBarHeight }}
                >
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
                                    backgroundColor: theme == "light" ? defaultBgLight : defaultBgDark,
                                },
                            }),
                        }}
                    >
                        <Tabs.Screen
                            name="index"
                            options={{
                                title: "Home",
                                tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                            }}
                        />
                        <Tabs.Screen
                            name="connections"
                            options={{
                                title: "Connections",
                                tabBarIcon: ({ color }) => <FontAwesome size={28} name="wifi" color={color} />,
                            }}
                        />
                        <Tabs.Screen
                            name="payloads"
                            options={{
                                title: "Payloads",
                                tabBarIcon: ({ color }) => <FontAwesome size={28} name="paper-plane" color={color} />,
                            }}
                        />
                    </Tabs>
                </SafeAreaView>
            </SafeAreaProvider>
        </GluestackUIProvider>
    );
}
