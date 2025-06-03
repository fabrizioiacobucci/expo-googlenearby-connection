import { Stack } from "expo-router";

import "@/global.css";
import { Provider } from "@/src/components/provider";

export default function RootLayout() {
    return (
        <Provider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </Provider>
    );
}
