import { Object, ObjectOptions } from "./object";


export interface TextOptions extends ObjectOptions {
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
  underline?: boolean;
  overline?: boolean;
  linethrough?: boolean;
  textAlign?: string;
  fontStyle?: string;
  lineHeight?: number;
  textBackgroundColor?: string;
  stroke?: string;
  shadow?: any; // todo
  offsets?: {
    underline: number;
    linethrough: number;
    overline: number;
  };
  charSpacing?: number;
  styles?: any; // todo
}

export interface Text extends Object, TextOptions {}
export class Text {
  constructor(text?: string, options?: TextOptions);
  getMeasuringContext(): any; // todo
  initDimensions(): void;
  enlargeSpaces(): void;
  isEndOfWrapping(): void;
  calcTextWidth(): number;
  getFontCache(decl: any): any; // todo
  getHeightOfChar(l: any, c: any): number; // todo
  measureLine(lineIndex: number): number;
  getHeightOfLine(lineIndex: number): number;
  calcTextHeight(): number;
  getLineWidth(lineIndex: number): number;
  getValueOfPropertyAt(lineIndex: any, charIndex: any, property: any): any; // todo
}
