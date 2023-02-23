import { newlineRegExp } from '../../constants';
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
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types
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
    dataTransfer.setData(
      'text/html',
      DataTransferManager.toHTML(this.target, selectionStart, selectionEnd)
    );
    dataTransfer.setData('text/svg+xml', `<svg>${this.target.toSVG()}</svg>`);
    dataTransfer.setData('text/plain', this.target.getSelectedText());
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
    const textLines = target.text.substring(from, to).split(target._reNewline);
    const topLevelStyles = textStylesToCSS(target);
    let charIndex = from;
    return `<html>
    <body>
    <!--StartFragment-->
    <meta charset="utf-8">
    ${textLines
      .map((text) => {
        const spans: {
          text: string;
          style: TextStyleDeclaration;
        }[] = [];
        for (let index = 0; index < text.length; index++) {
          const style = target.getStyleAtPosition(charIndex++, true);
          if (
            index === 0 ||
            hasStyleChanged(spans[spans.length - 1].style, style, true)
          ) {
            spans.push({ text: text[index], style });
          } else {
            spans[spans.length - 1].text += text[index];
          }
        }
        return `<p style="${topLevelStyles}">${spans
          .map(
            ({ text, style }) =>
              `<span style="${textStylesToCSS({
                ...style,
                visible: true,
              })}">${text}</span>`
          )
          .join('')}</p>`;
      })
      .join('')}
    <!--EndFragment-->
    </body>
    </html>`;
  }

  static parseHTML(html = '') {
    let text = '';
    const styles: TextStyleDeclaration[] = [];
    const sandbox = getDocument().createElement('iframe');
    Object.assign(sandbox.style, {
      position: 'fixed',
      left: `${-sandbox.clientWidth}px`,
    });
    getDocument().body.append(sandbox);
    const sandboxDoc =
      sandbox.contentDocument || sandbox.contentWindow!.document;
    sandboxDoc.open();
    sandboxDoc.write(html);
    sandboxDoc.close();
    const walker = sandboxDoc.createTreeWalker(
      sandboxDoc.body,
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
        const value = (walker.currentNode.textContent || '')
          // TODO: investigate why line breaks are added while parsing
          .replace(newlineRegExp, '');
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
    sandbox.remove();
    return {
      text,
      styles,
    };
  }
}
