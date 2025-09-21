import { reNum } from '../../parser/constants';
import { normalizeWs } from './normalizeWhiteSpace';

const regex = new RegExp(`(${reNum})`, 'gi');

export const cleanupSvgAttribute = (attributeValue: string) =>
  normalizeWs(
    attributeValue
      .replace(regex, ' $1 ')
      // replace annoying commas and arbitrary whitespace with single spaces
      .replace(/,/gi, ' '),
  );
