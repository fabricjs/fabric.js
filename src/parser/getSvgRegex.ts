export function getSvgRegex(arr: Array<string>): RegExp {
  return new RegExp('^(' + arr.join('|') + ')\\b', 'i');
}
