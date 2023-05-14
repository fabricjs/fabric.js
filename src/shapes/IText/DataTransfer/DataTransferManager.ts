import type { IText } from '../IText';
import { AbstractDataTransferManager } from './AbstractDataTransferManager';

export abstract class DataTransferManager<
  T extends ClipboardEvent | DragEvent
> extends AbstractDataTransferManager<T> {
  constructor(target: IText) {
    super(target);
    this.types = [
      {
        type: 'application/fabric',
        getData(e, dataTransfer) {
          return dataTransfer.types.includes(this.type)
            ? JSON.parse(dataTransfer.getData(this.type))
            : undefined;
        },
        setData(e, dataTransfer, target) {
          dataTransfer.setData(
            this.type,
            JSON.stringify({
              value: target.getSelectedText(),
              styles: target.getSelectionStyles(
                target.selectionStart,
                target.selectionEnd,
                true
              ),
            })
          );
        },
      },
      {
        type: 'text/svg+xml',
        getData() {
          return;
        },
        setData(e, dataTransfer, target) {
          dataTransfer.setData(this.type, `<svg>${target.toSVG()}</svg>`);
        },
      },
      {
        type: 'text/plain',
        getData(e, dataTransfer, target) {
          return {
            text: dataTransfer
              .getData(this.type)
              .replace(target._reNewline, '\n'),
          };
        },
        setData(e, dataTransfer, target) {
          dataTransfer.setData(this.type, target.getSelectedText());
        },
      },
    ];
  }
}
