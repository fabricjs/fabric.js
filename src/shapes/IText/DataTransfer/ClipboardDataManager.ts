import { DataTransferManager } from './DataTransferManager';
import type { ParsedDataTransfer } from './typedefs';

export class ClipboardDataManager extends DataTransferManager<ClipboardEvent> {
  getData(e: ClipboardEvent): ParsedDataTransfer {
    return e.clipboardData ? super.getData(e, e.clipboardData) : {};
  }
  setData(e: ClipboardEvent) {
    // we must prevent default for `DataTransfer#setData`, see https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event
    e.preventDefault();
    e.clipboardData && super.setData(e, e.clipboardData);
  }
}
