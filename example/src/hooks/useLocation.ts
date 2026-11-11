import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { usePermissionsContext } from "../context";

export default function useLocation() {
    const [permissionsGranted] = usePermissionsContext();
    const [location, setLocation] = useState<Location.LocationObject | null>(null);

    async function getCurrentLocation() {
        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
        console.log("Current location: ", location);
        setLocation(location);
    }

    useEffect(() => {
        if (permissionsGranted) {
            getCurrentLocation();
        }
    }, [permissionsGranted]);

    return location;
}
