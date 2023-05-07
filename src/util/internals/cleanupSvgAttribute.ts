import { reNum } from '../../parser/constants';

export const cleanupSvgAttribute = (attributeValue: string) =>
  attributeValue
    .replace(new RegExp(`(${reNum})`, 'gi'), ' $1 ')
    // replace annoying commas and arbitrary whitespace with single spaces
    .replace(/,/gi, ' ')
    .replace(/\s+/gi, ' ');
