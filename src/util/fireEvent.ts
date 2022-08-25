import { TransformEvent } from "../typedefs";


export const fireEvent = <T>(eventName: string, options: TransformEvent<T>) => {
    const target = options.transform.target,
        canvas = target.canvas;
    canvas && canvas.fire('object:' + eventName, Object.assign({}, options, { target: target }));
    target.fire(eventName, options);
}