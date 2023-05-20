import type { TextStyleDeclaration } from '../../Text/StyledText';
import type { IText } from '../IText';

export const enum DataTransferTypes {
  fabric = 'application/fabric',
  html = 'text/html',
  svg = 'text/svg+xml',
  text = 'text/plain',
}

export type ParsedDataTransfer = {
  text?: string;
  styles?: TextStyleDeclaration[];
};

export interface DataTransferResolver<
  T extends ClipboardEvent | DragEvent = ClipboardEvent | DragEvent
> {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types
   */
  setData(e: T, dataTransfer: DataTransfer, target: IText): void;

  getData(
    e: T,
    dataTransfer: DataTransfer,
    target: IText
  ): ParsedDataTransfer | void;
}
