import { DataTransferManager } from './DataTransferManager';

export class ClipboardDataManager extends DataTransferManager<ClipboardEvent> {
  protected extractDataTransfer(e: ClipboardEvent): DataTransfer | null {
    return e.clipboardData;
  }

  setData(e: ClipboardEvent): boolean {
    // we must prevent default for `DataTransfer#setData`, see https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event
    e.preventDefault();
    return super.setData(e);
  }
}
