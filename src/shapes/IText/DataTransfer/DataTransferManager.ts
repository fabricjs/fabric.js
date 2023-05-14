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

export abstract class DataTransferManager<
  T extends ClipboardEvent | DragEvent
> {
  static types: DataTransferResolver<ClipboardEvent | DragEvent>[] = [
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
            text: target.getSelectedText(),
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

  protected readonly target: IText;

  constructor(target: IText) {
    this.target = target;
  }

  get types(): DataTransferResolver<T>[] {
    return (this.constructor as typeof DataTransferManager).types;
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
