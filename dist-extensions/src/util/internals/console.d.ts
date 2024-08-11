export declare const log: (severity: "log" | "warn" | "error", ...optionalParams: any[]) => void;
export declare class FabricError extends Error {
    constructor(message?: string, options?: ErrorOptions);
}
export declare class SignalAbortedError extends FabricError {
    constructor(context: string);
}
//# sourceMappingURL=console.d.ts.map