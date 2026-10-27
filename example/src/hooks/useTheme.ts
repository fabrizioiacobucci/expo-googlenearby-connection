import { useColorScheme } from "react-native";
import { useThemeContext } from "../context";
import { getColorSchemeName } from "../functions";

export default function useTheme() {
    const [theme, setTheme] = useThemeContext();
    const schemeName = useColorScheme();
    const colorScheme = getColorSchemeName(schemeName, theme);

    return [colorScheme, setTheme] as const;
}
