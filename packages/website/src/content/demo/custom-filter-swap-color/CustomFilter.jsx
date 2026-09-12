import { useEffect } from "react";
import * as fabric from 'fabric';
import { SwapColor } from './colorSwapFilter';

export const InputEventAttacher = () => {
    
  useEffect(() => {      

    let globalImage;
    const swapColorFilter = new SwapColor();
    const canvas = new fabric.Canvas('canvas');

    fabric.FabricImage.fromURL('/assets/mononoke.jpg', { crossOrigin: 'anonymous' }).then((image) => {
      globalImage = image;
      image.filters = [swapColorFilter];
      image.scaleToWidth(480);
      image.applyFilters();
      canvas.add(image);
    });

    const colorSourceHandler = function(evt) {
      swapColorFilter.colorSource = evt.target.value;
      globalImage.applyFilters();
      canvas.requestRenderAll();
    };
    document.getElementById('colorSource').addEventListener('change', colorSourceHandler);

    const colorDestinationDark = function(evt) {
      swapColorFilter.colorDestination = evt.target.value;
      globalImage.applyFilters();
      canvas.requestRenderAll();
    };
    document.getElementById('colorDestination').addEventListener('change', colorDestinationDark);

    return () => {
      document.getElementById('colorSource').removeEventListener('change', colorSourceHandler);
      document.getElementById('colorDestination').removeEventListener('change', colorDestinationDark);
      canvas.dispose();
    }
  }, []);

  return null;
}