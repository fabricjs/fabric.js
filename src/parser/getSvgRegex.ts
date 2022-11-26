//@ts-nocheck

export function getSvgRegex(arr) {
  return new RegExp('^(' + arr.join('|') + ')\\b', 'i');
}
