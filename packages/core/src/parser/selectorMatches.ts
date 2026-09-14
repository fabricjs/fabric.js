export function selectorMatches(
  element: HTMLElement | SVGElement,
  selector: string,
) {
  const nodeName = element.nodeName;
  const classNames = element.getAttribute('class');
  const id = element.getAttribute('id');
  // negative lookahead ensuring the matched id/class name is not merely a
  // prefix of a longer name. CSS identifiers can continue with letters,
  // digits, hyphens or underscores, so all of them must be excluded here
  // (previously digits and underscores were missing, so `.st1` wrongly
  // matched inside `.st12`).
  const azAz = '(?![\\w\\-])';
  let matcher;
  // i check if a selector matches slicing away part from it.
  // if i get empty string i should match
  matcher = new RegExp('^' + nodeName, 'i');
  selector = selector.replace(matcher, '');
  if (id && selector.length) {
    matcher = new RegExp('#' + id + azAz, 'i');
    selector = selector.replace(matcher, '');
  }
  if (classNames && selector.length) {
    const splitClassNames = classNames.split(' ');
    for (let i = splitClassNames.length; i--; ) {
      matcher = new RegExp('\\.' + splitClassNames[i] + azAz, 'i');
      selector = selector.replace(matcher, '');
    }
  }
  return selector.length === 0;
}
