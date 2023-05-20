import type { IText } from '../IText';
import type { DataTransferResolver, ParsedDataTransfer } from './typedefs';
import { DataTransferTypes } from './typedefs';

export class DataTransferManager<T extends ClipboardEvent | DragEvent> {
  /**
   * The default order in which the {@link DataTransfer} is get/set
   */
  static priority = [
    DataTransferTypes.fabric,
    /**
     * html is opt-in
     */
    DataTransferTypes.html,
    DataTransferTypes.svg,
    DataTransferTypes.text,
  ];

  /**
   * In order to opt-in to the html type call {@link pluginHTML}
   */
  static types: Partial<
    Record<DataTransferTypes, DataTransferResolver<ClipboardEvent | DragEvent>>
  > = {
    [DataTransferTypes.fabric]: {
      getData(e, dataTransfer) {
        return JSON.parse(dataTransfer.getData(DataTransferTypes.fabric));
      },
      setData(e, dataTransfer, target) {
        dataTransfer.setData(
          DataTransferTypes.fabric,
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
    [DataTransferTypes.svg]: {
      getData() {
        return;
      },
      setData(e, dataTransfer, target) {
        dataTransfer.setData(
          DataTransferTypes.svg,
          `<svg>${target.toSVG()}</svg>`
        );
      },
    },
    [DataTransferTypes.text]: {
      getData(e, dataTransfer, target) {
        return {
          text: dataTransfer
            .getData(DataTransferTypes.text)
            .replace(target._reNewline, '\n'),
        };
      },
      setData(e, dataTransfer, target) {
        dataTransfer.setData(DataTransferTypes.text, target.getSelectedText());
      },
    },
  };

  /**
   * Call this method to opt-in to the html type
   */
  static async pluginHTML() {
    this.types[DataTransferTypes.html] = (
      await import('./HTMLDataTransfer')
    ).HTMLResolver;
  }

  protected readonly target: IText;

  types: Record<string, DataTransferResolver<T>>;

  /**
   * The order in which the {@link DataTransfer} is get/set
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#drag_data
   */
  priority: string[];

  constructor(
    target: IText,
    types = DataTransferManager.types,
    priority = DataTransferManager.priority
  ) {
    this.target = target;
    this.types = types;
    this.priority = priority;
  }

  setData(e: T, dataTransfer: DataTransfer): void {
    dataTransfer.clearData();

    const { selectionStart, selectionEnd } = this.target;
    if (selectionStart === selectionEnd) {
      return;
    }

    this.priority.forEach(
      (type) =>
        this.types[type] &&
        this.types[type].setData(e, dataTransfer, this.target)
    );
  }

  getData(e: T, dataTransfer: DataTransfer): ParsedDataTransfer {
    const dataTransferTypes = [...dataTransfer.types];
    for (let index = 0; index < this.priority.length; index++) {
      const type = this.priority[index];
      if (!dataTransferTypes.includes(type) || !this.types[type]) {
        continue;
      }
      const data = this.types[type].getData(e, dataTransfer, this.target);
      if (data) {
        return data;
      }
    }
    return {};
  }
}
