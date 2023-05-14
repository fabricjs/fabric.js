import { newlineRegExp } from '../../../constants';
import { hasStyleChanged, pick } from '../../../util';
import { textStylesFromCSS, textStylesToCSS } from '../../../util/CSSParsing';
import {
  getDocumentFromElement,
  getWindowFromElement,
} from '../../../util/dom_misc';
import type { TextStyleDeclaration } from '../../Text/StyledText';
import type { IText, ITextProps, SerializedITextProps } from '../IText';
import type { ITextEvents } from '../ITextBehavior';
import type { DataTransferResolver } from './AbstractDataTransferManager';

export class HTMLDataTransfer implements DataTransferResolver {
  type = 'text/html';

  setData(
    e: ClipboardEvent | DragEvent,
    dataTransfer: DataTransfer,
    target: IText<ITextProps, SerializedITextProps, ITextEvents>
  ): void {
    const { selectionStart: from, selectionEnd: to } = target;
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

    const html = `<html><body><!--StartFragment--><meta charset="utf-8">${markup}<!--EndFragment--></body></html>`;

    dataTransfer.setData(this.type, html);
  }

  getData(
    e: ClipboardEvent | DragEvent,
    dataTransfer: DataTransfer,
    target: IText<ITextProps, SerializedITextProps, ITextEvents>
  ): { text: string; styles?: TextStyleDeclaration[] } | void {
    if (dataTransfer.types.includes(this.type)) {
      return;
    }
    const el = (e.target || target.hiddenTextarea)! as HTMLElement;
    const doc = getDocumentFromElement(el)!;
    const win = getWindowFromElement(el)!;
    const html = dataTransfer.getData(this.type);
    let text = '';
    const styles: TextStyleDeclaration[] = [];
    const sandbox = doc.createElement('iframe');
    Object.assign(sandbox.style, {
      position: 'fixed',
      left: `${-sandbox.clientWidth}px`,
    });
    doc.body.append(sandbox);
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
                textStylesFromCSS(win.getComputedStyle(parentEl)),
                (target.constructor as typeof IText)._styleProperties
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
      styles: styles.map((style) =>
        (
          Object.entries(style) as [
            keyof TextStyleDeclaration,
            TextStyleDeclaration[keyof TextStyleDeclaration]
          ][]
        ).reduce((style, [key, value]) => {
          if (value && target[key] !== value) {
            style[key] = value;
          }
          return style;
        }, {} as TextStyleDeclaration)
      ),
    };
  }
}
