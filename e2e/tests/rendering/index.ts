/**
 * Runs in the **BROWSER**
 */

import * as fabric from 'fabric';
import { renderTests } from './renderingCases';
import { beforeRenderTest } from '../test';

beforeRenderTest(
  (canvas) => {
    const boundTests = renderTests.map((renderTest) => {
      return {
        boundFunction: () => renderTest.renderFunction(canvas, fabric),
        title: renderTest.title,
      };
    });
    return boundTests;
  },
  {
    enableRetinaScaling: false,
  }
);
