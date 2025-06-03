import { useEffect, useState } from "react";
import * as Location from "expo-location";
import usePermissions from "../../src/hooks/usePermissions";

export default function useLocation() {
    const permissionsGranted = usePermissions();
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
