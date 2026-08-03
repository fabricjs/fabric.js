import { useEffect } from "react";
import * as fabric from 'fabric';

export const TextOnPath = () => {
    
  useEffect(() => {      
    const canvas = new fabric.Canvas('canvas', {
      isDrawingMode: true,
      freeDrawingBrush: new fabric.PencilBrush({ decimate: 8 }),
    });

    canvas.freeDrawingBrush.canvas = canvas;

    canvas.on('before:path:created', function(opt) {
      const path = opt.path;
      const pathInfo = fabric.util.getPathSegmentsInfo(path.path);
      path.segmentsInfo = pathInfo;
      const pathLength = pathInfo[pathInfo.length - 1].length;
      const text = 'This is a demo of text on a path. This text should be small enough to fit in what you drawn.';
      const fontSize = 2.5 * pathLength / text.length;
      const fText = new fabric.FabricText(text, { fontSize: fontSize, path: path, top: path.top, left: path.left });
      canvas.add(fText);
    });
    
    canvas.on('path:created', function(opt) {
      canvas.remove(opt.path);
    });
    return () => {
      canvas.dispose();
    }
  }, []);

  return null;
}