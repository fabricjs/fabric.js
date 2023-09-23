export const log = (
  severity: 'log' | 'warn' | 'error',
  message: string | Error
) => console[severity]('fabric', message);

export class FabricError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(`fabric: ${message}`, options);
  }
}

export class SignalAbortedError extends FabricError {
  constructor(context: string) {
    super(`${context} 'options.signal' is in 'aborted' state`);
  }
}
