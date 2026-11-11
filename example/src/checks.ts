import Nearby, {
    Exception,
    ExpoGoogleNearbyConnectionModuleEvents,
    getPayloadInfo,
    getPayloadList,
    newPayloadBytes,
    newPayloadStream,
    PayloadProperty,
    removePayload,
    removePayloadAll,
    setPayloadProperty,
} from "expo-googlenearby-connection";

export type CheckResult = { name: string; passed: boolean; detail: string };

const EVENT_TIMEOUT_MS = 2000;

/**
 * Waits for an event of the native module object, for a limited time.
 * @param {keyof ExpoGoogleNearbyConnectionModuleEvents} eventName - The name of the event.
 * @param {number} timeoutMs - How long to wait, in milliseconds.
 * @param {(data: unknown) => boolean} [matches] - Which events count; by default, every event of that name.
 * @returns {Promise<{ data: unknown } | null>} The data of the event, or null when it did not come in time.
 * @example
 * const removed = waitForEvent("PayloadRemovedAll", 2000);
 * removePayloadAll();
 * const cameInTime = (await removed) !== null;
 */
export function waitForEvent(
    eventName: keyof ExpoGoogleNearbyConnectionModuleEvents,
    timeoutMs: number,
    matches: (data: unknown) => boolean = () => true
): Promise<{ data: unknown } | null> {
    return new Promise((resolve) => {
        const listener = (data: unknown) => {
            if (!matches(data)) return;
            clearTimeout(timer);
            subscription.remove();
            resolve({ data });
        };
        const subscription = Nearby.addListener(
            eventName,
            listener as ExpoGoogleNearbyConnectionModuleEvents[typeof eventName]
        );
        const timer = setTimeout(() => {
            subscription.remove();
            resolve(null);
        }, timeoutMs);
    });
}

/**
 * Checks that getPayloadInfo returns the ID of a payload as the same string that newPayloadBytes returned.
 * @returns {Promise<CheckResult>} The result of the check.
 * @example
 * const result = await checkPayloadInfoId();
 */
export async function checkPayloadInfoId(): Promise<CheckResult> {
    const name = "getPayloadInfo returns the payload ID";
    const payloadId = newPayloadBytes(new Uint8Array([1, 2, 3]));
    const info = getPayloadInfo(payloadId);
    removePayload(payloadId);

    const actual: unknown = info?.id;
    return {
        name,
        passed: actual === payloadId,
        detail: `expected "${payloadId}", got ${typeof actual} ${String(actual)}`,
    };
}

/**
 * Checks that setPayloadProperty accepts OFFSET on a stream payload.
 * @returns {Promise<CheckResult>} The result of the check.
 * @example
 * const result = await checkStreamOffset();
 */
export async function checkStreamOffset(): Promise<CheckResult> {
    const name = "setPayloadProperty sets OFFSET on a stream payload";
    const payloadId = newPayloadStream();
    if (!payloadId) return { name, passed: false, detail: "newPayloadStream did not create the payload" };

    const invalidArguments = waitForEvent(
        "PayloadInvalidArguments",
        EVENT_TIMEOUT_MS,
        (data) => (data as Exception).data === payloadId
    );
    setPayloadProperty(payloadId, PayloadProperty.OFFSET, "0");
    const event = await invalidArguments;
    removePayload(payloadId);

    return {
        name,
        passed: event === null,
        detail: event === null ? "no error event" : "PayloadInvalidArguments: " + (event.data as Exception).error,
    };
}

/**
 * Checks that removePayloadAll removes two payloads and emits PayloadRemovedAll. It removes every payload of the queue.
 * @returns {Promise<CheckResult>} The result of the check.
 * @example
 * const result = await checkRemoveAll();
 */
export async function checkRemoveAll(): Promise<CheckResult> {
    const name = "removePayloadAll removes two payloads";
    newPayloadBytes(new Uint8Array([1]));
    newPayloadBytes(new Uint8Array([2]));

    const removedAll = waitForEvent("PayloadRemovedAll", EVENT_TIMEOUT_MS);
    try {
        removePayloadAll();
    } catch (error) {
        await removedAll;
        return { name, passed: false, detail: "removePayloadAll threw: " + String(error) };
    }
    const event = await removedAll;
    const left = getPayloadList().length;

    return {
        name,
        passed: event !== null && left === 0,
        detail: `PayloadRemovedAll ${event === null ? "not received" : "received"}, ${left} payloads left`,
    };
}

/**
 * Runs the payload checks one after the other, on this device only.
 * @returns {Promise<CheckResult[]>} The result of each check.
 * @example
 * const results = await runPayloadChecks();
 * results.forEach((result) => console.log(result.name, result.passed));
 */
export async function runPayloadChecks(): Promise<CheckResult[]> {
    const results: CheckResult[] = [];
    for (const check of [checkPayloadInfoId, checkStreamOffset, checkRemoveAll]) {
        results.push(await check());
    }
    return results;
}
