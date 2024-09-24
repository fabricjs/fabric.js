import type { TBlendImageMode } from '../BlendImage';
export declare const fragmentSource: Record<TBlendImageMode, string>;
export declare const vertexSource: "\n    attribute vec2 aPosition;\n    varying vec2 vTexCoord;\n    varying vec2 vTexCoord2;\n    uniform mat3 uTransformMatrix;\n    void main() {\n      vTexCoord = aPosition;\n      vTexCoord2 = (uTransformMatrix * vec3(aPosition, 1.0)).xy;\n      gl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);\n    }\n    ";
//# sourceMappingURL=blendImage.d.ts.map