import { Color } from 'fabric/node';
import { newlineRegExp } from '../../constants';
import { getDocument, getWindow } from '../../env';
import { hasStyleChanged, pick } from '../../util';
import { textStylesFromCSS, textStylesToCSS } from '../../util/CSSParsing';
import { TextStyleDeclaration } from '../Text/StyledText';
import { textDefaultValues } from '../Text/Text';
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
      const { text, styles } = DataTransferManager.parseHTML(data);
      return {
        text,
        styles: styles.map((style) =>
          (
            Object.entries(style) as [
              keyof TextStyleDeclaration,
              TextStyleDeclaration[keyof TextStyleDeclaration]
            ][]
          ).reduce((style, [key, value]) => {
            if (value && this.target[key] !== value) {
              style[key] = value;
            }
            return style;
          }, {} as TextStyleDeclaration)
        ),
      };
    }
    return {
      text: dataTransfer
        .getData('text/plain')
        .replace(this.target._reNewline, '\n'),
    };
  }

  static toHTML(target: IText, from = 0, to = target.text.length) {
    const text = target._text.slice(from, to);
    const textLines = text.join('').split(target._reNewline);
    const styles = target
      .getSelectionStyles(from, to)
      .filter((value, index) => !target._reNewline.test(text[index]));
    const { cssText: topLevelStyles } = textStylesToCSS(target);
    let charIndex = 0;
    const markup = textLines
      .map((text) => {
        const spans: {
          text: string;
          style: TextStyleDeclaration;
        }[] = [];
        for (let index = 0; index < text.length; index++) {
          const style = styles[charIndex++];
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
          .map(({ text, style }) => {
            const { cssText } = textStylesToCSS(target, {
              ...style,
              visible: true,
            });
            return `<span style="${cssText}">${text}</span>`;
          })
          .join('')}</p>`;
      })
      .join('');

    return `<html><body><!--StartFragment--><meta charset="utf-8">${markup}<!--EndFragment--></body></html>`;
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
      if (parent && !parent.contains(walker.currentNode)) {
        parent = undefined;
        styles.push({});
        text += '\n';
      }
      if (
        walker.currentNode instanceof HTMLDivElement ||
        walker.currentNode instanceof HTMLParagraphElement
      ) {
        parent = walker.currentNode;
      } else if (walker.currentNode.nodeType === Node.TEXT_NODE) {
        const value = (walker.currentNode.textContent || '')
          // TODO: investigate why line breaks are added while parsing
          .replace(newlineRegExp, '');
        if (value.length > 0) {
          const parentEl = walker.currentNode.parentElement;
          const style = parentEl
            ? pick(
                textStylesFromCSS(getWindow().getComputedStyle(parentEl)),
                textDefaultValues._styleProperties
              )
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
