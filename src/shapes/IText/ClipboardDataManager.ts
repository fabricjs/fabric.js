import { DataTransferManager } from './DataTransferManager';

export class ClipboardDataManager extends DataTransferManager<ClipboardEvent> {
  protected extractDataTransfer(e: ClipboardEvent): DataTransfer | null {
    return e.clipboardData;
  }

  setData(e: ClipboardEvent): boolean {
    e.preventDefault();
    return super.setData(e);
  }
}
