import { ScrollView, ScrollViewProps } from "react-native";

export default function ThemedScrollView({ children, className, ...rest }: ScrollViewProps) {
    return (
        <ScrollView className={className + " dark:bg-background-dark h-full p-6"} {...rest}>
            {children}
        </ScrollView>
    );
}
