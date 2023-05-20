import type { TextStyleDeclaration } from '../Text/StyledText';
import { IText } from './IText';

export const enum DataTransferTypes {
  fabric = 'application/fabric',
  text = 'text/plain',
}

export type TransferredData = {
  text: string;
  styles: TextStyleDeclaration[];
};

export const getData = (
  dataTransfer: DataTransfer
): Partial<TransferredData> | void => {
  const types = [...dataTransfer.types];
  if (types.includes(DataTransferTypes.fabric)) {
    return JSON.parse(dataTransfer.getData(DataTransferTypes.fabric));
  } else if (types.includes(DataTransferTypes.text)) {
    return { text: dataTransfer.getData(DataTransferTypes.text) };
  }
  return;
};

export const setData = (dataTransfer: DataTransfer, data: TransferredData) => {
  dataTransfer.clearData();
  // The order in which the {@link DataTransfer} is get/set
  // @see https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#drag_data
  dataTransfer.setData(DataTransferTypes.fabric, JSON.stringify(data));
  dataTransfer.setData(DataTransferTypes.text, data.text);
};

export const getClipboardData = (e: ClipboardEvent) => {
  const dataTransfer = e.clipboardData;
  return dataTransfer && getData(dataTransfer);
};

export const setClipboardData = (e: ClipboardEvent, data: TransferredData) => {
  // we must prevent default for `DataTransfer#setData`
  // see https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event
  e.preventDefault();
  const dataTransfer = e.clipboardData;
  dataTransfer && setData(dataTransfer, data);
};

export const handleClipboardEvent = (e: ClipboardEvent, target: IText) =>
  setClipboardData(e, {
    text: target.getSelectedText(),
    styles: target.getSelectionStyles(
      target.selectionStart,
      target.selectionEnd,
      true
    ),
  });

export const getDragData = (e: DragEvent) => {
  const dataTransfer = e.dataTransfer;
  return dataTransfer && getData(dataTransfer);
};

export const setDragData = (e: DragEvent, data: TransferredData) => {
  const dataTransfer = e.dataTransfer;
  dataTransfer && setData(dataTransfer, data);
};
