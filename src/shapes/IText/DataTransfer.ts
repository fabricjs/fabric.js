import type { TextStyleDeclaration } from '../Text/StyledText';
import type { IText } from './IText';

export const enum DataTransferTypes {
  fabric = 'application/fabric',
  text = 'text/plain',
}

export type TransferredData = {
  text: string;
  styles: TextStyleDeclaration[];
};

export const getData = (
  e: ClipboardEvent | DragEvent
): Partial<TransferredData> | void => {
  const dataTransfer =
    (e as ClipboardEvent).clipboardData || (e as DragEvent).dataTransfer;
  if (!dataTransfer) {
    return;
  }
  const types = [...dataTransfer.types];
  if (types.includes(DataTransferTypes.fabric)) {
    return JSON.parse(dataTransfer.getData(DataTransferTypes.fabric));
  } else if (types.includes(DataTransferTypes.text)) {
    return { text: dataTransfer.getData(DataTransferTypes.text) };
  }
  return;
};

export const setData = (
  e: ClipboardEvent | DragEvent,
  data: TransferredData
) => {
  const dataTransfer =
    (e as ClipboardEvent).clipboardData || (e as DragEvent).dataTransfer;
  if (!dataTransfer) {
    return;
  }
  dataTransfer.clearData();
  // The order in which the {@link DataTransfer} is get/set
  // @see https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#drag_data
  dataTransfer.setData(DataTransferTypes.fabric, JSON.stringify(data));
  dataTransfer.setData(DataTransferTypes.text, data.text);
};

/**
 * we must prevent default for `DataTransfer#setData` to have an effect
 * see https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event
 */
export const setClipboardData = (e: ClipboardEvent, target: IText) => {
  e.preventDefault();
  setData(e, {
    text: target.getSelectedText(),
    styles: target.getSelectionStyles(
      target.selectionStart,
      target.selectionEnd,
      true
    ),
  });
};
