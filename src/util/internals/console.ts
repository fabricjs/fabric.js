export const log = (
  severity: 'log' | 'warn' | 'error',
  ...optionalParams: any[]
) =>
  // eslint-disable-next-line no-restricted-syntax
  console[severity]('fabric', ...optionalParams);

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
