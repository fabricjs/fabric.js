export const blendColorFragmentSource = {
  multiply: 'gl_FragColor.rgb *= uColor.rgb;\n',
  screen:
    'gl_FragColor.rgb = 1.0 - (1.0 - gl_FragColor.rgb) * (1.0 - uColor.rgb);\n',
  add: 'gl_FragColor.rgb += uColor.rgb;\n',
  difference: 'gl_FragColor.rgb = abs(gl_FragColor.rgb - uColor.rgb);\n',
  subtract: 'gl_FragColor.rgb -= uColor.rgb;\n',
  lighten: 'gl_FragColor.rgb = max(gl_FragColor.rgb, uColor.rgb);\n',
  darken: 'gl_FragColor.rgb = min(gl_FragColor.rgb, uColor.rgb);\n',
  exclusion:
    'gl_FragColor.rgb += uColor.rgb - 2.0 * (uColor.rgb * gl_FragColor.rgb);\n',
  overlay: `
    if (uColor.r < 0.5) {
      gl_FragColor.r *= 2.0 * uColor.r;
    } else {
      gl_FragColor.r = 1.0 - 2.0 * (1.0 - gl_FragColor.r) * (1.0 - uColor.r);
    }
    if (uColor.g < 0.5) {
      gl_FragColor.g *= 2.0 * uColor.g;
    } else {
      gl_FragColor.g = 1.0 - 2.0 * (1.0 - gl_FragColor.g) * (1.0 - uColor.g);
    }
    if (uColor.b < 0.5) {
      gl_FragColor.b *= 2.0 * uColor.b;
    } else {
      gl_FragColor.b = 1.0 - 2.0 * (1.0 - gl_FragColor.b) * (1.0 - uColor.b);
    }
    `,
  tint: `
    gl_FragColor.rgb *= (1.0 - uColor.a);
    gl_FragColor.rgb += uColor.rgb;
    `,
} as const;
