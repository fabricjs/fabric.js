import { GLProbe } from './GLProbe';
/**
 * @todo GL rendering in node is possible:
 * - https://github.com/stackgl/headless-gl
 * - https://github.com/akira-cn/node-canvas-webgl
 */
export declare class NodeGLProbe extends GLProbe {
    queryWebGL(): void;
    isSupported(): boolean;
}
//# sourceMappingURL=NodeGLProbe.d.ts.map