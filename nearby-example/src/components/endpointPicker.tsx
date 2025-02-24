import useConnections from "../hooks/useConnections";
import { Group } from "./group";
import {
    Select,
    SelectTrigger,
    SelectInput,
    SelectIcon,
    SelectPortal,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectItem,
} from "@/components/ui/select";
import { ChevronDownIcon } from "@/components/ui/icon";

export default function EndpointPicker({
    endpointId,
    onChange,
}: {
    endpointId: string;
    onChange: (endpointId: string) => void;
}) {
    const [connections] = useConnections();

    const isConnected = connections && connections.length > 0;

    return (
        <Group name="Endpoints">
            <Select
                isDisabled={isConnected ? false : true}
                selectedValue={endpointId ? endpointId : null}
                onValueChange={onChange}
            >
                <SelectTrigger variant="rounded" size="md">
                    <SelectInput
                        placeholder={isConnected ? "Select option" : "No active connections"}
                        className="flex-1"
                    />
                    <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                        <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        {isConnected ? (
                            connections.map((connection) => {
                                return <SelectItem key={connection} label={connection} value={connection} />;
                            })
                        ) : (
                            <SelectItem label="No active connections" value="no-connections" isDisabled={true} />
                        )}
                    </SelectContent>
                </SelectPortal>
            </Select>
        </Group>
    );
}
