import { selectors, test } from '@playwright/test';

test.beforeAll(async () => {
  await selectors.register('canvas_wrapper', () => {
    return {
      query(root: Document, selector: string) {
        return root.querySelector(selector).parentElement;
      },

      queryAll(root: Document, selector: string) {
        return Array.from(root.querySelectorAll(selector)).map(
          (el) => el.parentElement
        );
      },
    };
  });

  await selectors.register('canvas_top', () => {
    return {
      query(root: Document, selector: string) {
        return root
          .querySelector(selector)
          .parentElement.querySelector('canvas.upper-canvas');
      },

      queryAll(root: Document, selector: string) {
        return Array.from(root.querySelectorAll(selector)).map((el) =>
          el.parentElement.querySelector('canvas.upper-canvas')
        );
      },
    };
  });
});
