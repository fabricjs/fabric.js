export type TFabricEvent<T> = FabricEvent<T> & T;

export class FabricEvent<T> {
  defaultPrevented = false;
  propagate = true;
  static init<T>(data?: T) {
    return new FabricEvent<T>(data) as TFabricEvent<T>;
  }
  private constructor(data?: T) {
    Object.assign(this, data || {});
  }
  preventDefault() {
    this.defaultPrevented = true;
  }
  stopPropagation() {
    this.propagate = false;
  }
}
