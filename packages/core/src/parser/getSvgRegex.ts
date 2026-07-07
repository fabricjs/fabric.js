export function getSvgRegex(arr: string[]) {
  return new RegExp('^(' + arr.join('|') + ')\\b', 'i');
}
