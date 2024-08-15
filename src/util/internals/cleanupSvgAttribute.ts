import { reNum } from '../../parser/constants';

const regex = new RegExp(`(${reNum})`, 'gi');

export const cleanupSvgAttribute = (attributeValue: string) =>
  attributeValue
    .replace(regex, ' $1 ')
    // replace annoying commas and arbitrary whitespace with single spaces
    .replace(/,/gi, ' ')
    .replace(/\s+/gi, ' ');
