import '../../jest.extend';
import { Textbox } from './Textbox';

describe('Textbox', () => {
  it('fromObject', async () => {
    const textbox = await Textbox.fromObject({
      text: 'The quick \nbrown \nfox',
    });
    expect(textbox).toMatchObjectSnapshot();
    expect(textbox).toMatchObjectSnapshot({ includeDefaultValues: false });
  });

  it('toObject with styles', () => {
    const textbox = new Textbox('The quick \nbrown \nfox', {
      width: 120,
      styles: {
        '0': {
          '5': { fill: 'red' },
          '6': { fill: 'red' },
          '7': { fill: 'red' },
          '8': { fill: 'red' },
        },
        '1': {
          '3': { underline: true },
          '4': { underline: true },
          '5': { underline: true },
        },
        '2': {
          '0': { underline: true },
          '1': { underline: true },
        },
      },
    });
    expect(textbox).toMatchObjectSnapshot();
  });

  it('stylesToArray edge case', () => {
    const textbox = new Textbox('The quick \nbrown \nfox', {
      width: 120,
      styles: {
        '0': {
          '5': { fill: 'red' },
          '6': { fill: 'red' },
          '7': { fill: 'red' },
          '8': { fill: 'red' },
          '9': { fill: 'red' },
          '10': { fill: 'red' },
        },
        '2': {
          '0': { fill: 'red' },
        },
      },
    });
    expect(textbox.toObject().styles).toMatchSnapshot();
  });

  it('fromObject with styles', async () => {
    const textbox = new Textbox('The quick \nbrown \nfox', {
      width: 120,
      styles: {
        '0': {
          '5': { fill: 'red' },
          '6': { fill: 'red' },
          '7': { fill: 'red' },
          '8': { fill: 'red' },
        },
        '1': {
          '3': { underline: true },
          '4': { underline: true },
          '5': { underline: true },
        },
        '2': {
          '0': { underline: true },
          '1': { underline: true },
        },
      },
    });
    const textbox2 = await Textbox.fromObject(textbox.toObject());
    expect(textbox2.toObject()).toEqual(textbox.toObject());
    expect(textbox2.styles !== textbox.styles).toBeTruthy();
    for (const a in textbox2.styles) {
      for (const b in textbox2.styles[a]) {
        expect(textbox2.styles[a][b] !== textbox.styles[a][b]).toBeTruthy();
        expect(textbox2.styles[a][b]).toEqual(textbox.styles[a][b]);
      }
    }
  });
});
