//@ts-nocheck


export function parseStyleString(style, oStyle) {
    var attr, value;
    style.replace(/;\s*$/, '').split(';').forEach(function (chunk) {
        var pair = chunk.split(':');

        attr = pair[0].trim().toLowerCase();
        value = pair[1].trim();

        oStyle[attr] = value;
    });
}
