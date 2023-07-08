import { Page, expect } from '@playwright/test';

export async function accessObject<T extends Record<string, unknown>>(
  page: Page,
  objectId: string,
  cb: object
) {
  const snapshot = await page.evaluate(
    ({ objectId }) => {
      return fabricCanvas.getObjects().find((obj) => obj.id === objectId);
    },
    { objectId }
  );
  expect(snapshot).toMatchObject(expected);
}

export async function expectObjectToMatch<T extends Record<string, unknown>>(
  page: Page,
  objectId: string,
  expected: T
) {
  const snapshot = await page.evaluate(
    ({ objectId }) => {
      return fabricCanvas.getObjects().find((obj) => obj.id === objectId);
    },
    { objectId }
  );
  expect(snapshot).toMatchObject(expected);
}

export function addTextbox(
  page: Page,
  objectId: string,
  text: string,
  properties
) {
  return page.evaluate(
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

export function getObjectCenter(page: Page, objectId: string) {
  return page.evaluate(
    ({ objectId }) => {
      const obj = fabricCanvas.getObjects().find((obj) => obj.id === objectId);
      return obj.getCenterPoint();
    },
    { objectId }
  );
}

export function clickCanvas(
  page: Page,
  clickProperties: Parameters<Page['click']>[1]
) {
  return page.click('canvas.upper-canvas', clickProperties);
}

export function getObjectControlPoint(
  page: Page,
  objectId: string,
  controlName: string
) {
  return page.evaluate(
    ({ objectId, controlName }) => {
      const obj = fabricCanvas.getObjects().find((obj) => obj.id === objectId);
      return obj.oCoords[controlName];
    },
    { objectId, controlName }
  );
}
