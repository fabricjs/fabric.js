const urlMap = {
  VT323:
    'url(https://fonts.gstatic.com/s/vt323/v17/pxiKyp0ihIEF2isfFJXUdVNF.woff2)',
  Pacifico:
    'url(https://fonts.gstatic.com/s/pacifico/v22/FwZY7-Qmy14u9lezJ-6H6MmBp0u-.woff2)',
  Lato100:
    'url(https://fonts.gstatic.com/s/lato/v24/S6u8w4BMUTPHh30AXC-qNiXg7Q.woff2)',
  Lato900:
    'url(https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh50XSwiPGQ3q5d0.woff2)',
};
const canvas = new fabric.Canvas(canvasEl);
// correctly instantiate new Fontfaces
const fontVT323 = new FontFace('VT323', urlMap.VT323, {
  style: 'normal',
  weight: 'normal',
});
const fontPacifico = new FontFace('Pacifico', urlMap.Pacifico, {
  style: 'normal',
  weight: 'normal',
});

const Lato100 = new FontFace('Lato', urlMap.Lato100, {
  style: 'normal',
  weight: '100',
});

const Lato900 = new FontFace('Lato', urlMap.Lato900, {
  style: 'normal',
  weight: '900',
});
// wait for them to load
Promise.all([
  fontVT323.load(),
  fontPacifico.load(),
  Lato100.load(),
  Lato900.load(),
]).then(() => {
  // add the css to the document for those loaded fonts
  document.fonts.add(fontPacifico);
  document.fonts.add(fontVT323);
  document.fonts.add(Lato100);
  document.fonts.add(Lato900);
  // create the textboxes
  const pacifico = new fabric.Textbox('Correctly loaded Pacifico', {
    left: 50,
    top: 10,
    width: 200,
    fontSize: 60,
    fontFamily: 'Pacifico',
  });
  const vt323 = new fabric.Textbox('Correctly loaded VT323', {
    left: 350,
    top: 10,
    width: 200,
    fontSize: 60,
    fontFamily: 'VT323',
  });
  const lato100 = new fabric.Textbox('Correctly loaded lato100', {
    left: 350,
    top: 310,
    width: 200,
    fontSize: 60,
    fontWeight: '100',
    fontFamily: 'Lato',
  });
  const lato900 = new fabric.Textbox('Correctly loaded lato900', {
    left: 50,
    top: 310,
    width: 200,
    fontSize: 60,
    fontWeight: '900',
    fontFamily: 'Lato',
  });
  canvas.add(pacifico, vt323, lato100, lato900);
});
