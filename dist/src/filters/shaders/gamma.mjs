const fragmentSource = "\n  precision highp float;\n  uniform sampler2D uTexture;\n  uniform vec3 uGamma;\n  varying vec2 vTexCoord;\n  void main() {\n    vec4 color = texture2D(uTexture, vTexCoord);\n    vec3 correction = (1.0 / uGamma);\n    color.r = pow(color.r, correction.r);\n    color.g = pow(color.g, correction.g);\n    color.b = pow(color.b, correction.b);\n    gl_FragColor = color;\n    gl_FragColor.rgb *= color.a;\n  }\n";

export { fragmentSource };
//# sourceMappingURL=gamma.mjs.map
