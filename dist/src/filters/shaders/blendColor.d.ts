export declare const blendColorFragmentSource: {
    readonly multiply: "gl_FragColor.rgb *= uColor.rgb;\n";
    readonly screen: "gl_FragColor.rgb = 1.0 - (1.0 - gl_FragColor.rgb) * (1.0 - uColor.rgb);\n";
    readonly add: "gl_FragColor.rgb += uColor.rgb;\n";
    readonly difference: "gl_FragColor.rgb = abs(gl_FragColor.rgb - uColor.rgb);\n";
    readonly subtract: "gl_FragColor.rgb -= uColor.rgb;\n";
    readonly lighten: "gl_FragColor.rgb = max(gl_FragColor.rgb, uColor.rgb);\n";
    readonly darken: "gl_FragColor.rgb = min(gl_FragColor.rgb, uColor.rgb);\n";
    readonly exclusion: "gl_FragColor.rgb += uColor.rgb - 2.0 * (uColor.rgb * gl_FragColor.rgb);\n";
    readonly overlay: "\n    if (uColor.r < 0.5) {\n      gl_FragColor.r *= 2.0 * uColor.r;\n    } else {\n      gl_FragColor.r = 1.0 - 2.0 * (1.0 - gl_FragColor.r) * (1.0 - uColor.r);\n    }\n    if (uColor.g < 0.5) {\n      gl_FragColor.g *= 2.0 * uColor.g;\n    } else {\n      gl_FragColor.g = 1.0 - 2.0 * (1.0 - gl_FragColor.g) * (1.0 - uColor.g);\n    }\n    if (uColor.b < 0.5) {\n      gl_FragColor.b *= 2.0 * uColor.b;\n    } else {\n      gl_FragColor.b = 1.0 - 2.0 * (1.0 - gl_FragColor.b) * (1.0 - uColor.b);\n    }\n    ";
    readonly tint: "\n    gl_FragColor.rgb *= (1.0 - uColor.a);\n    gl_FragColor.rgb += uColor.rgb;\n    ";
};
//# sourceMappingURL=blendColor.d.ts.map