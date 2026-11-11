import { useState } from "react";
import { Button, ButtonText } from "@/components/ui/button";
import { CheckResult, runPayloadChecks } from "../checks";
import { Group } from "./group";
import { ThemedText } from "./themedText";

/**
 * Runs the payload checks of `checks.ts` on this device, and shows the result of each.
 * @returns {JSX.Element} The "Checks" group.
 * @example
 * <PayloadChecks />
 */
const PayloadChecks = () => {
    const [results, setResults] = useState<CheckResult[]>([]);
    const [running, setRunning] = useState(false);

    return (
        <Group name="Checks">
            <ThemedText className="mb-4">Runs on this device only, and removes every payload of the queue.</ThemedText>
            <Button
                size="md"
                variant="solid"
                action="secondary"
                className="mb-4"
                isDisabled={running}
                onPress={async () => {
                    setRunning(true);
                    try {
                        const checkResults = await runPayloadChecks();
                        checkResults.forEach((result) =>
                            console.log(`Check ${result.passed ? "pass" : "fail"}: ${result.name} (${result.detail})`)
                        );
                        setResults(checkResults);
                    } finally {
                        setRunning(false);
                    }
                }}>
                <ButtonText>Run checks</ButtonText>
            </Button>
            {results.map((result) => (
                <ThemedText key={result.name} className="mb-2">
                    {result.passed ? "pass" : "fail"}: {result.name} ({result.detail})
                </ThemedText>
            ))}
        </Group>
    );
};

export default PayloadChecks;
