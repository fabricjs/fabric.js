export class SideEffect<
  T,
  K extends keyof T,
  P extends Partial<Record<K, T[K]>>,
  C extends (key: K, value: P[K], prevValue?: P[K]) => void
> {
  id: string;
  private keys: K[] | '*';
  private callback: C;
  private enabled = true;
  private persistance: P;

  constructor(id: string, keys: K[] | '*', callback: C, initialValue?: P) {
    this.id = id;
    this.keys = keys;
    this.callback = callback;
    this.persistance = initialValue || ({} as P);
  }

  isEqual(incoming: P) {
    for (const key in incoming) {
      if (this.persistance[key] !== incoming[key]) {
        return false;
      }
    }
    return true;
  }

  invoke(key: K, value: P[K]) {
    const prevValue = this.persistance[key];
    if (
      this.enabled &&
      (this.keys === '*' || this.keys.includes(key)) &&
      value !== prevValue
    ) {
      this.callback(key, value, prevValue);
      this.persist(key, value);
    }
  }

  persist(key: K, value: P[K]) {
    this.persistance[key] = value;
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
