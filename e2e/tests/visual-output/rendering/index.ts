/**
 * Runs in the **BROWSER**
 */

import * as fabric from 'fabric';
import { renderTests } from './renderingCases';
import { beforeRenderTest } from '../../test';

beforeRenderTest(
  (canvas) => {
    return renderTests.map((renderTest) => {
      return {
        async boundFunction() {
          if (renderTest.hasOwnProperty('enableGLFiltering')) {
            fabric.config.configure({
              enableGLFiltering: renderTest.enableGLFiltering,
            });
          }
          canvas.clear();
          canvas.setZoom(1);
          canvas.backgroundColor = 'white';
          canvas.setDimensions({
            width: renderTest.size[0],
            height: renderTest.size[1],
          });
          return await renderTest.renderFunction(canvas, fabric);
        },
        title: renderTest.title,
      };
    });
  },
  {
    enableRetinaScaling: false,
  },
);
