import type { TextStyleDeclaration } from '../../Text/StyledText';
import type { IText } from '../IText';

export abstract class AbstractDataTransferManager<
  T extends ClipboardEvent | DragEvent
> {
  protected readonly target: IText;
  constructor(target: IText) {
    this.target = target;
  }

  protected abstract extractDataTransfer(e: T): DataTransfer | null;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types
   * @returns true if {@link DataTransfer} was set
   */
  abstract setData(e: T): boolean;

  abstract getData(e: T): {
    text?: string;
    styles?: TextStyleDeclaration[];
  };
}
