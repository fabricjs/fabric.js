const o="\n  precision highp float;\n  uniform sampler2D uTexture;\n  uniform float uBrightness;\n  varying vec2 vTexCoord;\n  void main() {\n    vec4 color = texture2D(uTexture, vTexCoord);\n    color.rgb += uBrightness;\n    gl_FragColor = color;\n  }\n";export{o as fragmentSource};
//# sourceMappingURL=brightness.min.mjs.map
