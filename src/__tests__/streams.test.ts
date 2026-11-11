import ExpoGoogleNearbyConnection from "../ExpoGoogleNearbyConnection";
import { flushStream, writeStreamByte, writeStreamByteArray, markStream, resetStream } from "../index";

jest.mock("../ExpoGoogleNearbyConnection", () => ({
    __esModule: true,
    default: {
        flushStream: jest.fn(),
        writeStreamByte: jest.fn(),
        writeStreamByteArray: jest.fn(),
        markStream: jest.fn(),
        resetStream: jest.fn(),
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

    it("writeStreamByte waits for the native write to complete", async () => {
        nativeModule.writeStreamByte.mockReturnValue(nativeOperationInProgress());

        expect(await settlesWithoutWaiting(writeStreamByte("1", 7))).toBe(false);
    });

    it("writeStreamByteArray waits for the native write to complete", async () => {
        nativeModule.writeStreamByteArray.mockReturnValue(nativeOperationInProgress());

        expect(await settlesWithoutWaiting(writeStreamByteArray("1", new Uint8Array([1, 2, 3])))).toBe(false);
    });

    it("markStream waits for the native mark to complete", async () => {
        nativeModule.markStream.mockReturnValue(nativeOperationInProgress());

        expect(await settlesWithoutWaiting(markStream("1", 16))).toBe(false);
    });

    it("resetStream waits for the native reset to complete", async () => {
        nativeModule.resetStream.mockReturnValue(nativeOperationInProgress());

        expect(await settlesWithoutWaiting(resetStream("1"))).toBe(false);
    });
});
