//@ts-nocheck

export function parseStyleString(style, oStyle) {
  let attr, value;
  style
    .replace(/;\s*$/, '')
    .split(';')
    .forEach(function (chunk) {
      const pair = chunk.split(':');

      attr = pair[0].trim().toLowerCase();
      value = pair[1].trim();

      oStyle[attr] = value;
    });
}
