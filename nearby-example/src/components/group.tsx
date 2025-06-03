import { View } from "react-native";
import { ThemedText } from "./themedText";

export function Group(props: { name?: string; children: React.ReactNode; viewStyle?: any; textStyle?: any }) {
    return (
        <View className="mb-12 p-6 bg-white dark:bg-black rounded-lg">
            {props.name ? (
                <ThemedText className="mb-4" type="title">
                    {props.name}
                </ThemedText>
            ) : null}
            {props.children}
        </View>
    );
}
