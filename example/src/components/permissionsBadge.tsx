import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { CheckIcon, CloseIcon } from "@/components/ui/icon";
import { usePermissionsContext } from "../context";

/**
 * Shows whether the app holds the permissions it needs.
 *
 * @returns a badge that reads "Permissions granted" or "Permissions denied".
 * @example
 * <PermissionsBadge />
 */
export default function PermissionsBadge() {
    const [permissionsGranted] = usePermissionsContext();

    return (
        <Badge size="md" variant="solid" action="muted" className="flex-1 bg-transparent px-0">
            <BadgeText>{permissionsGranted ? "Permissions granted" : "Permissions denied"}</BadgeText>
            <BadgeIcon as={permissionsGranted ? CheckIcon : CloseIcon} className="ml-2" />
        </Badge>
    );
}
