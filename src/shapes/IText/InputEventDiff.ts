import { config } from '../../config';
import { getEnv } from '../../env';
import type { TextStyle, TextStyleDeclaration } from '../Text/StyledText';
import type { ITextKeyBehavior } from './ITextKeyBehavior';

type SelectionDiff = {
  before: {
    selectionStart: number;
    selectionEnd: number;
  };
  after: {
    selectionStart: number;
    selectionEnd: number;
  };
};

type TextDiff = {
  before: string[];
  after: string[];
  diff: {
    removedFrom: number;
    removed: string[];
    added: string[];
  };
};

export class InputEventDiff {
  static build(target: ITextKeyBehavior, e: InputEvent) {
    return new this(target).build(e);
  }

  private constructor(readonly target: ITextKeyBehavior) {}

  private getSelectionDiff(e: InputEvent): SelectionDiff {
    const {
      selectionStart: prevSelectionStart,
      selectionEnd: prevSelectionEnd,
    } = this.target;
    const {
      selectionStart: start,
      selectionEnd: end,
      value,
    } = this.target.hiddenTextarea!;
    const {
      selectionStart: nextSelectionStart,
      selectionEnd: nextSelectionEnd,
    } = this.target.fromStringToGraphemeSelection(start, end, value);

    return {
      before: {
        selectionStart: prevSelectionStart,
        selectionEnd: prevSelectionEnd,
      },
      after: {
        selectionStart: nextSelectionStart,
        selectionEnd: nextSelectionEnd,
      },
    };
  }

  private getTextDiff(
    { inputType }: InputEvent,
    {
      before: {
        selectionStart: prevSelectionStart,
        selectionEnd: prevSelectionEnd,
      },
      after: { selectionEnd: nextSelectionEnd },
    }: SelectionDiff
  ): TextDiff {
    const target = this.target;
    const prevText = target._text.slice(),
      // TODO: optimize this call
      { graphemeText: nextText } = target._splitTextIntoLines(
        this.target.hiddenTextarea!.value
      );
    const charDiff =
      nextText.length -
      prevText.length +
      (prevSelectionEnd - prevSelectionStart);
    const insertedText = nextText.slice(
      nextSelectionEnd - charDiff,
      nextSelectionEnd
    );
    let removedText: string[], removedFrom: number;
    if (prevSelectionStart === prevSelectionEnd) {
      const delta =
        inputType === 'deleteContentBackward'
          ? -1
          : inputType === 'deleteContentForward'
          ? 1
          : 0;
      removedFrom = Math.min(prevSelectionStart, prevSelectionStart + delta);
      removedText = prevText.slice(
        removedFrom,
        Math.max(prevSelectionStart, prevSelectionStart + delta)
      );
    } else {
      removedFrom = prevSelectionStart;
      removedText = prevText.slice(removedFrom, prevSelectionEnd);
    }

    return {
      before: prevText,
      after: nextText,
      diff: {
        removedFrom,
        removed: removedText,
        added: insertedText,
      },
    };
  }

  /**
   * @todo refactor to use {@link DataTransfer}
   */
  private getStylesFromDataTransfer(
    e: InputEvent,
    selectionDiff: SelectionDiff,
    { diff: { added } }: TextDiff
  ) {
    const { copyPasteData } = getEnv();
    if (
      // @ts-expect-error private flag
      this.target.fromPaste &&
      !config.disableStyleCopyPaste &&
      copyPasteData.copiedTextStyle &&
      added.join('') === copyPasteData.copiedText
    ) {
      return copyPasteData.copiedTextStyle;
    }
  }

  private getFallbackStyles(
    { inputType }: InputEvent,
    { before: { selectionStart: index } }: SelectionDiff,
    { diff: { added } }: TextDiff
  ) {
    if (
      inputType !== 'deleteContentBackward' &&
      inputType !== 'deleteContentForward'
    ) {
      const selectionStartStyle = this.target.getStyleAtPosition(index);
      return new Array(added.length).fill(undefined).map(() => ({
        ...selectionStartStyle,
      }));
    }
  }

  private getStyles(
    e: InputEvent,
    selectionDiff: SelectionDiff,
    textDiff: TextDiff
  ) {
    return (
      this.getStylesFromDataTransfer(e, selectionDiff, textDiff) ||
      this.getFallbackStyles(e, selectionDiff, textDiff) ||
      []
    );
  }

  /**
   * styles is poorly designed
   * it correlates to the unwrapped lines instead of to the split text
   * target causes too many problems, input diff being one of them
   * target code it an attempt to workaround the poor design without refactoring text
   * @todo revisit once styles are refactored
   */
  private getStyleDiff(
    e: InputEvent,
    selectionDiff: SelectionDiff,
    textDiff: TextDiff
  ) {
    const stylesArr: (TextStyleDeclaration | undefined | false)[] = [];
    this.target._unwrappedTextLines.forEach((line, lineIndex) => {
      line.forEach((char, charIndex) =>
        stylesArr.push(this.target.styles[lineIndex]?.[charIndex])
      );
      stylesArr.push(false);
    });
    const stylesToAdd = this.getStyles(e, selectionDiff, textDiff);
    const removedStyles = stylesArr.splice(
      textDiff.diff.removedFrom,
      textDiff.diff.removed.length,
      ...stylesToAdd
    );
    const { styles: nextStyles } = textDiff.after.reduce(
      ({ lineIndex, charIndex, styles }, char, index) => {
        if (char === '\n') {
          return {
            lineIndex: lineIndex + 1,
            charIndex: 0,
            styles,
          };
        } else {
          const style = stylesArr[index];
          if (style && Object.keys(style).length > 0) {
            (styles[lineIndex] || (styles[lineIndex] = {}))[charIndex] = {
              ...style,
            };
          }
          return {
            lineIndex,
            charIndex: charIndex + 1,
            styles,
          };
        }
      },
      {
        lineIndex: 0,
        charIndex: 0,
        styles: {} as TextStyle,
      }
    );

    return {
      before: this.target.styles,
      after: nextStyles,
      diff: {
        added: stylesToAdd,
        removed: removedStyles,
      },
    };
  }

  private build(e: InputEvent) {
    const selectionDiff = this.getSelectionDiff(e);
    const textDiff = this.getTextDiff(e, selectionDiff);
    const styleDiff = this.getStyleDiff(e, selectionDiff, textDiff);

    return {
      before: {
        ...selectionDiff.before,
        value: textDiff.before,
        styles: styleDiff.before,
      },
      after: {
        ...selectionDiff.after,
        value: textDiff.after,
        styles: styleDiff.after,
      },
      diff: {
        ...textDiff.diff,
        styles: styleDiff.diff,
      },
    };
  }
}
