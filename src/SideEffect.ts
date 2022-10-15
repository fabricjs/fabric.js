export abstract class SideEffect<T, K extends keyof T> {
  abstract name: string;
  abstract keys: K[] | '*';
  enable = true;

  abstract onChange(key: K, value: T[K], prevValue: T[K]): void;

  invoke(key: K, value: T[K], prevValue: T[K]) {
    this.enable &&
      (this.keys === '*' || this.keys.includes(key)) &&
      value !== prevValue &&
      this.onChange(key, value, prevValue);
  }
}
