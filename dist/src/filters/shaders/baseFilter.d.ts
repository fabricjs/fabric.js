export declare const highPsourceCode = "precision highp float";
export declare const identityFragmentShader = "\n    precision highp float;\n    varying vec2 vTexCoord;\n    uniform sampler2D uTexture;\n    void main() {\n      gl_FragColor = texture2D(uTexture, vTexCoord);\n    }";
export declare const vertexSource = "\n    attribute vec2 aPosition;\n    varying vec2 vTexCoord;\n    void main() {\n      vTexCoord = aPosition;\n      gl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);\n    }";
//# sourceMappingURL=baseFilter.d.ts.map