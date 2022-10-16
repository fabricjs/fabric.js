export class SideEffect<
  T,
  K extends keyof T,
  C extends (key: K, value: T[K], prevValue: T[K]) => void
> {
  id: string;
  private keys: K[] | '*';
  private callback: C;
  private enabled = true;

  constructor(id: string, keys: K[] | '*', callback: C) {
    this.id = id;
    this.keys = keys;
    this.callback = callback;
  }

  invoke(key: K, value: T[K], prevValue: T[K]) {
    this.enabled &&
      (this.keys === '*' || this.keys.includes(key)) &&
      value !== prevValue &&
      this.callback(key, value, prevValue);
  }

  isEnabled() {
    return this.enabled;
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }
}
