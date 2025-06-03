import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { requestPermissionsAsync } from "expo-googlenearby-connection";

export default function usePermissions() {
    const [permissionsGranted, setPermissionsGranted] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            const statusNearby = await requestPermissionsAsync();
            console.log("Location permissions status: " + status);
            console.log("Nearby permissions status: " + statusNearby.granted);
            const permissionsGranted = status === "granted" && statusNearby.granted;
            setPermissionsGranted(permissionsGranted);
        })();
    }, []);

    return permissionsGranted;
}
