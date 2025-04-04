/**
 * Runs in the **BROWSER**
 */

import * as fabric from 'fabric';
import { renderTests } from './renderingCases';
import { beforeRenderTest } from '../../test';

beforeRenderTest(
  (canvas) => {
    const boundTests = renderTests.map((renderTest) => {
      return {
        boundFunction: async () => {
          canvas.clear();
          canvas.setZoom(1);
          canvas.backgroundColor = 'white';
          canvas.setDimensions({
            width: renderTest.size[0],
            height: renderTest.size[1],
          });
          await renderTest.renderFunction(canvas, fabric);
        },
        title: renderTest.title,
      };
    });
    return boundTests;
  },
  {
    enableRetinaScaling: false,
  },
);
