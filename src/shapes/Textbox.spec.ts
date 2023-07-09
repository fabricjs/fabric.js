import { Textbox } from './Textbox';

describe('textbox styles', () => {
  it('toObject with styles', () => {
    const ref = { fill: 'red' };
    const textbox = new Textbox('The quick \nbrown \nfox', {
      width: 120,
      styles: {
        '0': {
          '5': ref,
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
    expect(textbox.styleManager.styles[5] !== ref).toBe(true);
    expect(textbox.toObject()).toMatchSnapshot();
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
    expect(await Textbox.fromObject(textbox.toObject())).toEqual(
      textbox.toObject()
    );
  });
});
