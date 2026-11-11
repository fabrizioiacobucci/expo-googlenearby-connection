import useTheme from "../hooks/useTheme";
import { Text, type TextProps } from "react-native";
import { TextType } from "../types";

export type ThemedTextProps = TextProps & {
    type?: TextType;
};

export function ThemedText({ style, className, type = "default", ...rest }: ThemedTextProps) {
    const [theme] = useTheme();

    let textClasses = (theme == "light" ? "text-typography-black " : "text-typography-white ") + className + " ";
    if (type) {
        textClasses +=
            type === "default"
                ? "text-base leading-[24px]"
                : type === "title"
                ? "text-4xl leading-[32px] font-bold"
                : type === "defaultSemiBold"
                ? "text-base leading-[24px] font-semibold"
                : type === "subtitle"
                ? "text-xl font-bold"
                : type === "link"
                ? "text-base leading-[30px]"
                : "";
    }

    return <Text className={textClasses} style={style} {...rest} />;
}
