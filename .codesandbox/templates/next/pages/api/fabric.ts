import { NextApiRequest, NextApiResponse } from 'next';
import * as fabric from 'fabric/node';

export default (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const canvas = new fabric.StaticCanvas(null, { width: 100, height: 100 });
    const rect = new fabric.Rect({ width: 20, height: 50, fill: '#ff0000' });
    const text = new fabric.Text('fabric.js', { fill: 'blue', fontSize: 24 });
    canvas.add(rect, text);
    canvas.renderAll();
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="fabric.png"');
    canvas.createPNGStream().pipe(res);
  } catch (err) {
    res.status(404).json({ statusCode: 404, message: err.message });
  }
};
