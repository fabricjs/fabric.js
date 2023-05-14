import type { TextStyleDeclaration } from '../../Text/StyledText';
import type { IText } from '../IText';

export interface DataTransferResolver<
  T extends ClipboardEvent | DragEvent = ClipboardEvent | DragEvent
> {
  type: string;
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types
   */
  setData(e: T, dataTransfer: DataTransfer, target: IText): void;

  getData(
    e: T,
    dataTransfer: DataTransfer,
    target: IText
  ): {
    text: string;
    styles?: TextStyleDeclaration[];
  } | void;
}

export abstract class AbstractDataTransferManager<
  T extends ClipboardEvent | DragEvent
> {
  protected readonly target: IText;
  types: DataTransferResolver<T>[];

  constructor(target: IText) {
    this.target = target;
  }

  protected abstract extractDataTransfer(e: T): DataTransfer | null;

  setData(e: T): boolean {
    const dataTransfer = this.extractDataTransfer(e);
    if (!dataTransfer) {
      return false;
    }
    const { selectionStart, selectionEnd } = this.target;
    if (selectionStart === selectionEnd) {
      dataTransfer.clearData();
      return false;
    }
    this.types.forEach((resolver) =>
      resolver.setData(e, dataTransfer, this.target)
    );
    return true;
  }

  getData(e: T): {
    text?: string;
    styles?: TextStyleDeclaration[];
  } {
    const dataTransfer = this.extractDataTransfer(e);
    if (!dataTransfer) {
      return {};
    }
    for (let index = 0; index < this.types.length; index++) {
      const data = this.types[index].getData(e, dataTransfer, this.target);
      if (data) {
        return data;
      }
    }
    return {};
  }
}
