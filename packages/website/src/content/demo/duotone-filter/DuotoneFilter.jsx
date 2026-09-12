

import { useEffect } from "react";
import * as fabric from 'fabric';

export const InputEventAttacher = () => {
    
  useEffect(() => {      

    let globalImage;
    const duotoneFilter = new fabric.filters.Composed({
        subFilters: [
          new fabric.filters.Grayscale({ mode: 'luminosity' }), // make it black and white
          new fabric.filters.BlendColor({ color: '#00ff36' }), // apply light color
          new fabric.filters.BlendColor({ color: '#23278a', mode: 'lighten' }), // apply a darker color
        ]
      });
    const canvas = new fabric.Canvas('canvas');

    fabric.FabricImage.fromURL('/assets/pug.jpg', { crossOrigin: 'anonymous' }).then((image) => {
      globalImage = image;
      image.filters = [duotoneFilter];
      image.scaleToWidth(480);
      image.applyFilters();
      canvas.add(image);
    });

    const colorLightHandler = function(evt) {
      duotoneFilter.subFilters[1].color = evt.target.value;
      globalImage.applyFilters();
      canvas.requestRenderAll();
    };
    document.getElementById('colorLight').addEventListener('change', colorLightHandler);

    const colorDarkHandler = function(evt) {
      duotoneFilter.subFilters[2].color = evt.target.value;
      globalImage.applyFilters();
      canvas.requestRenderAll();
    };
    document.getElementById('colorDark').addEventListener('change', colorDarkHandler);

    return () => {
      document.getElementById('colorLight').removeEventListener('change', colorLightHandler);
      document.getElementById('colorDark').removeEventListener('change', colorDarkHandler);
      canvas.dispose();
    }
  }, []);

  return null;
}