export async function addTextbox(page, objectId, text, properties) {
  await page.evaluate(
    ({ objectId, text, properties }) => {
      const textbox = new fabric.Textbox(text, {
        ...properties,
        id: objectId,
      });
      fabricCanvas.add(textbox);
    },
    { objectId, text, properties }
  );
}

export async function getObjectCenter(page, objectId) {
  return page.evaluate(
    ({ objectId }) => {
      const obj = fabricCanvas.getObjects().find((obj) => obj.id === objectId);
      return obj.getCenterPoint();
    },
    { objectId }
  );
}

export async function clickCanvas(page, clickProperties) {
  await page.click('canvas.upper-canvas', clickProperties);
}

export async function getObjectControlPoint(page, objectId, controlName) {
  return await page.evaluate(
    ({ objectId, controlName }) => {
      const obj = fabricCanvas.getObjects().find((obj) => obj.id === objectId);
      return obj.oCoords[controlName];
    },
    { objectId, controlName }
  );
}
