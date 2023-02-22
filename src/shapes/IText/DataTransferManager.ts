import { getDocument, getWindow } from '../../env';
import { hasStyleChanged } from '../../util';
import { textStylesFromCSS, textStylesToCSS } from '../../util/misc/CSSParsing';
import { TextStyleDeclaration } from '../Text/StyledText';
import type { IText } from './IText';

export abstract class DataTransferManager<
  T extends ClipboardEvent | DragEvent
> {
  protected readonly target: IText;
  constructor(target: IText) {
    this.target = target;
  }

  protected abstract extractDataTransfer(e: T): DataTransfer | null;

  /**
   * @returns true if {@link DataTransfer} was set
   */
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
    dataTransfer.setData('text/plain', this.target.getSelectedText());
    dataTransfer.setData(
      'text/html',
      DataTransferManager.toHTML(this.target, selectionStart, selectionEnd)
    );
    dataTransfer.setData('text/svg+xml', `<svg>${this.target.toSVG()}</svg>`);
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
    const data = dataTransfer.getData('text/html');
    if (data) {
      return DataTransferManager.parseHTML(data);
    }
    return {
      text: dataTransfer
        .getData('text/plain')
        .replace(this.target._reNewline, '\n'),
    };
  }

  static toHTML(target: IText, from = 0, to = target.text.length) {
    const text = target.text.substring(from, to); //.split(target._reNewline);
    const styles = target.getSelectionStyles(from, to, true);
    const spans = styles.reduce<
      { text: string; style: TextStyleDeclaration }[]
    >(
      (spans, style, index) => {
        if (hasStyleChanged(spans[spans.length - 1].style, style, true)) {
          spans.push({ text: text[index], style });
        } else {
          spans[spans.length - 1].text += text[index];
        }
        return spans;
      },
      [{ text: '', style: styles[0] }]
    );
    return `<html>
    <body>
    <!--StartFragment-->
    <meta charset="utf-8"><p style="${textStylesToCSS(target)}">${spans
      .map(
        ({ text, style }) =>
          `<span style="${textStylesToCSS({
            ...style,
            visible: true,
          })}">${text}</span>`
      )
      .join('')}</p>
      <!--EndFragment-->
      </body>
      </html>`;
  }

  static parseHTML(html = '') {
    const parser = new (getWindow().DOMParser)() as DOMParser,
      doc = parser.parseFromString(html.trim(), 'text/html');
    let text = '';
    const styles: TextStyleDeclaration[] = [];
    const container = doc.createElement('div');
    container.append(...doc.body.children);
    Object.assign(container.style, {
      position: 'fixed',
      left: `${-container.clientWidth}px`,
    });
    const body = getDocument().body;
    // append for computed styles
    body.append(container);
    const walker = getDocument().createTreeWalker(
      container,
      NodeFilter.SHOW_ALL,
      {
        acceptNode(node) {
          return node instanceof HTMLDivElement ||
            node instanceof HTMLParagraphElement ||
            node.nodeType === Node.TEXT_NODE
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
        },
      }
    );
    let parent: Node | undefined;
    while (walker.nextNode()) {
      if (
        walker.currentNode instanceof HTMLDivElement ||
        walker.currentNode instanceof HTMLParagraphElement
      ) {
        if (parent) {
          styles.push({});
          text += '\n';
        }
        parent = walker.currentNode;
      } else if (walker.currentNode.nodeType === Node.TEXT_NODE) {
        const value = walker.currentNode.textContent || '';
        if (value.length > 0) {
          const parentEl = walker.currentNode.parentElement;
          const style = parentEl
            ? textStylesFromCSS(getWindow().getComputedStyle(parentEl))
            : {};
          for (let index = 0; index < value.length; index++) {
            styles.push(style);
          }
          text += value;
        }
      }
    }
    container.remove();
    return {
      text,
      styles,
    };
  }
}
