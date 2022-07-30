import { getNodeCanvas } from '../util';

export function NodeCanvasStreamsMixinGenerator<T extends new (...args: any[]) => any>(Klass: T) {
    return class NodeCanvasStreamsMixin extends Klass {
        getNodeCanvas() {
            return getNodeCanvas(this.lowerCanvasEl);
        }
        createPNGStream() {
            var impl = this.getNodeCanvas();
            return impl && impl.createPNGStream();
        };
        createJPEGStream(opts) {
            var impl = this.getNodeCanvas();
            return impl && impl.createJPEGStream(opts);
        };
    }
}