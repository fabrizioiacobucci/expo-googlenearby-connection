import ExpoGoogleNearbyConnection from "../ExpoGoogleNearbyConnection";
import { flushStream } from "../index";

jest.mock("../ExpoGoogleNearbyConnection", () => ({
    __esModule: true,
    default: {
        flushStream: jest.fn(),
    },
}));

const nativeModule = jest.mocked(ExpoGoogleNearbyConnection);

/**
 * Tells whether a promise settles before the next task of the event loop, that is, without waiting for anything
 * but the microtasks already queued.
 *
 * @param promise - the promise to observe.
 * @returns true if the promise resolved or rejected, false if it is still pending.
 * @example
 * expect(await settlesWithoutWaiting(flushStream("1"))).toBe(false);
 */
async function settlesWithoutWaiting(promise: Promise<unknown>) {
    const pending = Symbol("pending");
    const nextTask = new Promise((resolve) => setTimeout(() => resolve(pending), 0));
    const settled = promise.then(
        () => true,
        () => true
    );

    return (await Promise.race([settled, nextTask])) !== pending;
}

/**
 * Builds a native operation that has not completed yet.
 *
 * @returns a promise that never settles.
 * @example
 * nativeModule.flushStream.mockReturnValue(nativeOperationInProgress());
 */
function nativeOperationInProgress() {
    return new Promise<void>(() => {});
}

describe("stream payloads", () => {
    it("flushStream waits for the native flush to complete", async () => {
        nativeModule.flushStream.mockReturnValue(nativeOperationInProgress());

        expect(await settlesWithoutWaiting(flushStream("1"))).toBe(false);
    });
});
