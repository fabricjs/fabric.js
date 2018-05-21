import { Object, ObjectOptions } from "./object";
import { TextOptions, Text } from "./text";


export interface ITextOptions extends TextOptions, ObjectOptions {
}

export interface IText extends Text, Object, ITextOptions { }
export class IText {
    constructor(text?: string, options?: ITextOptions);
    selectAll(): any; // todo
    enterEditing(): any; // todo  
    exitEditing(): any; // todo  
    initHiddenTextarea(): any; // todo
}
