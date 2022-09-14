//@ts-nocheck

export function selectorMatches(element, selector) {
  let nodeName = element.nodeName,
    classNames = element.getAttribute('class'),
    id = element.getAttribute('id'),
    matcher,
    i;
  // i check if a selector matches slicing away part from it.
  // if i get empty string i should match
  matcher = new RegExp('^' + nodeName, 'i');
  selector = selector.replace(matcher, '');
  if (id && selector.length) {
    matcher = new RegExp('#' + id + '(?![a-zA-Z\\-]+)', 'i');
    selector = selector.replace(matcher, '');
  }
  if (classNames && selector.length) {
    classNames = classNames.split(' ');
    for (i = classNames.length; i--; ) {
      matcher = new RegExp('\\.' + classNames[i] + '(?![a-zA-Z\\-]+)', 'i');
      selector = selector.replace(matcher, '');
    }
  }
  return selector.length === 0;
}
