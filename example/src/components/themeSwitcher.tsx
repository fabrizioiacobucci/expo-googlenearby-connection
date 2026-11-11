import { Button, ButtonIcon } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@/components/ui/icon";
import { useColorScheme } from "react-native";
import { getColorSchemeName } from "../functions";
import { useThemeContext } from "../context";

export default function ThemeSwitcher() {
    const [theme, setTheme] = useThemeContext();
    const schemeName = useColorScheme();
    const colorScheme = getColorSchemeName(schemeName, theme);

    return (
        <Button
            size="md"
            className="bg-transparent z-9999 rounded-full px-2"
            onPress={() => {
                setTheme(colorScheme === "light" ? "dark" : "light");
            }}
        >
            <ButtonIcon
                className={colorScheme === "light" ? "text-typography-black" : "text-typography-white"}
                as={colorScheme === "light" ? MoonIcon : SunIcon}
            />
        </Button>
    );
}
