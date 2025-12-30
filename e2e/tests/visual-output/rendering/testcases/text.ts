import { FabricNamespace, renderTestType } from '../../../types';

function registerUbuntuFonts() {
  if (typeof window === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { registerFont } = require('canvas');
    const path = require('node:path');
    const dir = path.resolve(__dirname + '/../../../../../test/fixtures/');
    registerFont(path.join(dir, 'Ubuntu-Regular.ttf'), {
      family: 'Ubuntu',
      weight: 'regular',
      style: 'normal',
    });
    registerFont(path.join(dir, 'Ubuntu-Bold.ttf'), {
      family: 'Ubuntu',
      weight: 'bold',
      style: 'normal',
    });
    registerFont(path.join(dir, 'Ubuntu-Italic.ttf'), {
      family: 'Ubuntu',
      weight: 'regular',
      style: 'italic',
    });
    registerFont(path.join(dir, 'Ubuntu-BoldItalic.ttf'), {
      family: 'Ubuntu',
      weight: 'bold',
      style: 'italic',
    });
  }
}

registerUbuntuFonts();

const LOREM_IPSUM_TEXT_OPTS: Record<PropertyKey, any> = {
  objectCaching: false,
  fontFamily: 'Arial',
  styles: {
    0: {
      0: { fill: 'red', fontSize: 20 },
      1: { fill: 'red', fontSize: 30 },
      2: { fill: 'red', fontSize: 40 },
      3: { fill: 'red', fontSize: 50 },
      4: { fill: 'red', fontSize: 60 },
      6: { textBackgroundColor: 'yellow' },
      7: {
        textBackgroundColor: 'yellow',
        textDecoration: ' line-through',
        linethrough: true,
      },
      8: {
        textBackgroundColor: 'yellow',
        textDecoration: ' line-through',
        linethrough: true,
      },
      9: { textBackgroundColor: 'yellow' },
    },
    1: {
      0: { textDecoration: 'underline' },
      1: { textDecoration: 'underline' },
      2: {
        fill: 'green',
        fontStyle: 'italic',
        textDecoration: 'underline',
      },
      3: {
        fill: 'green',
        fontStyle: 'italic',
        textDecoration: 'underline',
      },
      4: {
        fill: 'green',
        fontStyle: 'italic',
        textDecoration: 'underline',
      },
    },
    2: {
      0: { fill: 'blue', fontWeight: 'bold' },
      1: { fill: 'blue', fontWeight: 'bold' },
      2: { fill: 'blue', fontWeight: 'bold', fontSize: 63 },
      4: {
        fontFamily: 'Courier',
        textDecoration: ' underline',
        underline: true,
      },
      5: {
        fontFamily: 'Courier',
        textDecoration: ' underline',
        underline: true,
      },
      6: {
        fontFamily: 'Courier',
        textDecoration: ' overline',
        overline: true,
      },
      7: {
        fontFamily: 'Courier',
        textDecoration: ' overline',
        overline: true,
      },
      8: {
        fontFamily: 'Courier',
        textDecoration: ' overline',
        overline: true,
      },
    },
    3: {
      0: { fill: '#666', textDecoration: 'line-through' },
      1: { fill: '#666', textDecoration: 'line-through' },
      2: { fill: '#666', textDecoration: 'line-through' },
      3: { fill: '#666', textDecoration: 'line-through' },
      4: { fill: '#666', textDecoration: 'line-through' },
      7: { textDecoration: ' underline', underline: true },
      8: { stroke: '#ff1e15', strokeWidth: 2 },
      9: { stroke: '#ff1e15', strokeWidth: 2 },
    },
  },
};

function createTextBoxSubclass(fabric: FabricNamespace) {
  class TestTextbox extends fabric.Textbox {
    __calledInitDimensions = 0;

    constructor(text: string, opts: any) {
      super(text, {
        ...opts,
        objectCaching: false,
      });
    }

    initDimensions() {
      super.initDimensions();
      this.initialized && this.__calledInitDimensions++;
    }
  }

  return TestTextbox;
}

const cases: renderTestType[] = [
  {
    title: 'Simple text test',
    golden: 'text1.png',
    percentage: 0.06,
    size: [300, 300],
    async renderFunction(canvas, fabric) {
      fabric.FabricObject.ownDefaults.objectCaching = false;

      const text = new fabric.FabricText('Kerning: VAVAWA', {
        fontSize: 20,
        objectCaching: false,
        strokeWidth: 0,
      });

      const text2 = new fabric.FabricText(
        'multi line\ntext\nwith lot of space on some lines',
        {
          fontSize: 20,
          objectCaching: false,
          angle: 45,
          top: 40,
          left: 40,
          strokeWidth: 0,
        },
      );

      const text3 = new fabric.FabricText(
        'multi line\ntext\nwith lot of space on some lines',
        {
          fontSize: 20,
          objectCaching: false,
          angle: -45,
          top: 200,
          left: 0,
          textAlign: 'right',
          strokeWidth: 0,
        },
      );

      canvas.add(text, text2, text3);
    },
  },

  {
    title: 'Text with trailing spaces',
    golden: 'text2.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const text4 = new fabric.FabricText(
        '2 spaces trailing  \nno trailing spance\n5 spaces trailing     ',
        {
          fontSize: 20,
          objectCaching: false,
          top: 200,
          left: 0,
          textAlign: 'right',
          strokeWidth: 0,
        },
      );
      text4.positionByLeftTop(new fabric.Point(0, 200));

      const rect = new fabric.Rect({
        width: text4.width,
        height: text4.height,
        strokeWidth: 2,
        stroke: 'blue',
        fill: 'rgba(255, 255, 0, 0.4)',
        top: text4.top,
        left: text4.left,
      });
      rect.positionByLeftTop(new fabric.Point(text4.left, text4.top));

      const text5 = new fabric.FabricText(
        '  2 spaces both sides  \nno trailing spance\n     5 spaces both sides     ',
        {
          fontSize: 20,
          objectCaching: false,
          top: 250,
          angle: -90,
          left: 200,
          strokeWidth: 0,
        },
      );
      text5.positionByLeftTop(new fabric.Point(200, 250));

      const rect2 = new fabric.Rect({
        width: text5.width,
        height: text5.height,
        strokeWidth: 2,
        stroke: 'green',
        fill: 'rgba(255, 0, 255, 0.4)',
        top: text5.top,
        left: text5.left,
        angle: text5.angle,
      });
      rect2.positionByLeftTop(new fabric.Point(text5.left, text5.top));

      const text = new fabric.FabricText(
        'text with all decorations\nmultiline',
        {
          underline: true,
          overline: true,
          linethrough: true,
          fontSize: 30,
          strokeWidth: 0,
        },
      );
      rect.positionByLeftTop(new fabric.Point(0, 0));

      canvas.add(rect, text4, rect2, text5, text);
    },
  },

  {
    title: 'Text with styles',
    golden: 'text3.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const text = new fabric.FabricText(
        'lorem ipsum\ndolor\nsit Amet2\nconsectgetur',
        LOREM_IPSUM_TEXT_OPTS,
      );
      text.positionByLeftTop(new fabric.Point(0, 0));

      canvas.add(text);
    },
  },

  {
    title: 'Text on a transformed canvas',
    golden: 'text4.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const text = new fabric.FabricText(
        'lorem ipsum\ndolor\nsit Amet2\nconsectgetur',
        {
          fontSize: 30,
          scaleX: 20,
          scaleY: 30,
          skewX: 30,
          skewY: 15,
          angle: 25,
        },
      );
      text.positionByLeftTop(new fabric.Point(0, 0));

      const matrix = text.calcTransformMatrix();
      canvas.viewportTransform = fabric.util.invertTransform(matrix);
      canvas.viewportTransform[4] = 0;
      canvas.viewportTransform[5] = 0;

      canvas.add(text);
    },
  },

  {
    title: 'Text with strokeWidths',
    golden: 'text5.png',
    percentage: 0.15,
    disabled: true,
    size: [300, 300],
    async renderFunction(canvas, fabric) {
      const text = new fabric.FabricText('Scaling', {
        fontSize: 10,
        scaleX: 2,
        scaleY: 2,
        fill: 'rgba(0,0,255,0.4)',
        strokeWidth: 0,
      });
      text.positionByLeftTop(new fabric.Point(0, 0));

      const text2 = new fabric.FabricText('Scaling', {
        fontSize: 10,
        scaleX: 3,
        scaleY: 3,
        fill: 'rgba(0,0,255,0.4)',
        top: 10,
        strokeWidth: 0,
      });
      text2.positionByLeftTop(new fabric.Point(0, 10));

      const text3 = new fabric.FabricText('Scaling', {
        fontSize: 10,
        scaleX: 4,
        scaleY: 4,
        fill: 'rgba(0,0,255,0.4)',
        top: 20,
        strokeWidth: 0,
      });
      text3.positionByLeftTop(new fabric.Point(0, 20));

      const text4 = new fabric.FabricText('Scaling', {
        fontSize: 10,
        scaleX: 5,
        scaleY: 5,
        fill: 'rgba(0,0,255,0.4)',
        top: 30,
        strokeWidth: 0,
      });
      text4.positionByLeftTop(new fabric.Point(0, 30));

      const text5 = new fabric.FabricText('Scaling', {
        fontSize: 10,
        scaleX: 6,
        scaleY: 6,
        fill: 'rgba(0,0,255,0.4)',
        top: 40,
        strokeWidth: 0,
      });
      text5.positionByLeftTop(new fabric.Point(0, 40));

      const text6 = new fabric.FabricText('Scaling', {
        fontSize: 10,
        scaleX: 7,
        scaleY: 7,
        fill: 'rgba(0,0,255,0.4)',
        top: 50,
        strokeWidth: 0,
      });
      text6.positionByLeftTop(new fabric.Point(0, 50));

      const text7 = new fabric.FabricText('A', {
        fontSize: 80,
        scaleX: 1,
        scaleY: 1,
        fill: 'rgb(0,0,255)',
        left: 190,
        strokeWidth: 12,
        stroke: 'rgba(255,0,0,0.2)',
      });
      text7.positionByLeftTop(new fabric.Point(190, 0));

      const text8 = new fabric.FabricText('A', {
        fontSize: 65,
        scaleX: 8,
        scaleY: 8,
        fill: 'rgb(0,0,255)',
        top: -100,
        left: -100,
        strokeWidth: 12,
        stroke: 'rgba(255,0,0,0.2)',
      });
      text8.positionByLeftTop(new fabric.Point(-100, -100));

      canvas.add(text8, text, text2, text3, text4, text5, text6, text7);
    },
  },

  {
    title: 'Text with custom fonts',
    golden: 'text6.png',
    percentage: 0.06,
    disabled: 'browser',
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const text = new fabric.FabricText('regular', {
        left: 0,
        top: 0,
        fontFamily: 'Ubuntu',
      });
      text.positionByLeftTop(new fabric.Point(0, 0));
      canvas.add(text);

      const text2 = new fabric.FabricText('bold', {
        left: 0,
        top: 50,
        fontFamily: 'Ubuntu',
        fontWeight: 'bold',
      });
      text2.positionByLeftTop(new fabric.Point(0, 50));

      canvas.add(text2);

      const text3 = new fabric.FabricText('italic', {
        left: 0,
        top: 100,
        fontFamily: 'Ubuntu',
        fontStyle: 'italic',
      });
      text3.positionByLeftTop(new fabric.Point(0, 100));

      canvas.add(text3);

      const text4 = new fabric.FabricText('bold italic', {
        left: 0,
        top: 150,
        fontFamily: 'Ubuntu',
        fontWeight: 'bold',
        fontStyle: 'italic',
      });
      text4.positionByLeftTop(new fabric.Point(0, 150));

      canvas.add(text4);
    },
  },

  {
    title: 'Text percentage gradient',
    golden: 'text7.png',
    percentage: 0.04,
    size: [350, 150],
    async renderFunction(canvas, fabric) {
      const gradient = new fabric.Gradient({
        coords: {
          x1: 0,
          y1: 0,
          x2: 1,
          y2: 0,
        },
        gradientUnits: 'percentage',
        colorStops: [
          {
            offset: 0,
            color: 'red',
          },
          {
            offset: 1,
            color: 'blue',
          },
        ],
      });

      const text = new fabric.FabricText(
        'PERCENT GRADIENT\nPERCENT GRADIENT\nPERCENT GRADIENT',
        {
          left: 0,
          top: 0,
          fontSize: 32,
          fill: gradient,
        },
      );
      text.positionByLeftTop(new fabric.Point(0, 0));
      canvas.add(text);
    },
  },

  {
    title: 'Text with negative scaling',
    golden: 'text8.png',
    percentage: 0.06,
    disabled: true,
    size: [400, 150],
    async renderFunction(canvas, fabric) {
      const text = new fabric.FabricText('Scaling down', {
        left: 10,
        top: 10,
        fill: 'red',
        fontSize: 300,
        scaleX: 0.2,
        scaleY: 0.2,
      });
      text.positionByLeftTop(new fabric.Point(10, 10));
      canvas.add(text);
    },
  },

  {
    title: 'Text with pattern and gradient',
    golden: 'text9.png',
    percentage: 0.1,
    size: [480, 190],
    async renderFunction(canvas, fabric) {
      const canvasP = fabric.util.createCanvasElement();
      canvasP.width = 10;
      canvasP.height = 10;
      const ctx = canvasP.getContext('2d')!;
      ctx.fillStyle = 'blue';
      ctx.fillRect(0, 0, 5, 5);
      ctx.fillStyle = 'red';
      ctx.fillRect(5, 5, 5, 5);
      ctx.fillStyle = 'yellow';
      ctx.fillRect(5, 0, 5, 5);
      ctx.fillStyle = 'purple';
      ctx.fillRect(0, 5, 5, 5);

      const pattern = new fabric.Pattern({
        source: canvasP,
        patternTransform: [1, 0.3, 0.6, 0.8, 0, 0],
      });

      const relGradient = new fabric.Gradient({
        coords: {
          x1: 0,
          y1: 0,
          x2: 1,
          y2: 0,
        },
        gradientUnits: 'percentage',
        colorStops: [
          {
            offset: 0,
            color: 'red',
          },
          {
            offset: 1,
            color: 'blue',
          },
        ],
      });

      const text = new fabric.FabricText('TEST', {
        left: 5,
        top: 5,
        fontSize: 180,
        fontFamily: 'Arial',
        paintFirst: 'stroke',
        strokeWidth: 12,
        strokeLineJoin: 'round',
        strokeLineCap: 'round',
        stroke: relGradient,
        fill: pattern,
      });
      text.positionByLeftTop(new fabric.Point(5, 5));
      canvas.add(text);
    },
  },

  {
    title: 'Text on a path',
    golden: 'text10.png',
    percentage: 0.06,
    size: [220, 220],
    async renderFunction(canvas, fabric) {
      const path = new fabric.Path(
        'M5 100 a95,95 0 1,0 190,0 a95,95 0 1,0 -190,0 z',
        {
          visible: false,
        },
      );

      const test = new fabric.FabricText(
        'this is a long text we need to wrap around a shape. - BETA feature -',
        {
          left: 10,
          top: 10,
          fontSize: 16,
          fontFamily: 'Arial',
          paintFirst: 'stroke',
          strokeWidth: 4,
          strokeLineJoin: 'round',
          strokeLineCap: 'round',
          fill: 'blue',
          stroke: 'red',
          path: path,
        },
      );
      test.positionByLeftTop(new fabric.Point(10, 10));
      canvas.add(test);
    },
  },

  {
    title: 'Text and underline color',
    golden: 'text11.png',
    percentage: 0.01,
    size: [350, 100],
    async renderFunction(canvas, fabric) {
      const itext = new fabric.FabricText('hello\nworld', {
        left: 4,
        top: 4,
        fontFamily: 'Arial',
        fill: 'purple',
        lineHeight: 1.1,
        styles: {
          0: {
            0: {
              fill: 'red',
              underline: true,
              linethrough: true,
            },
            1: {
              fill: 'blue',
              underline: true,
              linethrough: true,
            },
            2: {
              fill: 'blue',
              underline: true,
              linethrough: true,
            },
            3: {
              fill: 'yellow',
              underline: true,
              linethrough: true,
            },
          },
        },
      });
      itext.positionByLeftTop(new fabric.Point(4, 4));
      const itext2 = new fabric.FabricText('Version 4.2.0', {
        left: 105,
        top: 4,
        fontFamily: 'Arial',
        fill: 'blue',
        lineHeight: 1.1,
        styles: {
          0: {
            0: {
              underline: true,
              linethrough: true,
            },
            1: {
              fill: 'red',
              underline: true,
              linethrough: true,
            },
            2: {
              fill: 'red',
              underline: true,
              linethrough: true,
            },
            3: {
              fill: 'red',
              underline: true,
              linethrough: true,
            },
            4: {
              fill: 'red',
              underline: true,
              linethrough: true,
            },
            5: {
              fill: 'red',
              underline: true,
              linethrough: true,
            },
            6: {
              fill: 'red',
              underline: true,
              linethrough: true,
            },
          },
        },
      });
      itext2.positionByLeftTop(new fabric.Point(105, 4));
      canvas.add(itext);
      canvas.add(itext2);
    },
  },

  {
    title: 'Text with direction RTL',
    golden: 'text12.png',
    percentage: 0.095,
    disabled: 'node',
    enableGLFiltering: false,
    size: [400, 150],
    async renderFunction(canvas, fabric) {
      const text = await fabric.FabricText.fromObject(
        JSON.parse(
          '{"type":"IText","version":"4.4.0","left":1.28,"top":0.19,"width":740.57,"height":150.06,"fill":"#e38644","scaleX":0.48,"scaleY":0.48,"angle":0.2,"text":"השועל החום והזריז קופץ מעל הכלב העצלן\\nהשועל החום והזר33יז  קופץ מעל הכל העצלן\\nשלום עולם","fontWeight":"normal","fontFamily":"Arial","textAlign":"right","textBackgroundColor":"#d72323","direction":"rtl","styles":{"0":{"6":{"fill":"red"},"7":{"fill":"red"},"8":{"fill":"red","linethrough":true},"9":{"fill":"red","linethrough":true},"10":{"linethrough":true,"textBackgroundColor":"red"},"11":{"linethrough":true,"textBackgroundColor":"green"},"12":{"linethrough":true},"13":{"linethrough":true}},"1":{"8":{"underline":true},"9":{"underline":true},"10":{"underline":true},"11":{"underline":true},"12":{"underline":true},"13":{"underline":true,"fontSize":22},"14":{"underline":true,"fontSize":22},"15":{"underline":true,"fontSize":22},"16":{"underline":true,"fontSize":22},"17":{"fontSize":22},"18":{"fontSize":22},"19":{"fontSize":22},"20":{"fontSize":22},"21":{"fontSize":22},"22":{"fontSize":22,"textBackgroundColor":"blue"}}},"path":null}',
        ),
      );
      text.positionByLeftTop(new fabric.Point(1.28, 0.19));
      canvas.add(text);
    },
  },

  {
    title: 'Text with direction RTL and underline, single render',
    golden: 'text13.png',
    percentage: 0.092,
    disabled: 'node',
    enableGLFiltering: false,
    size: [232, 255],
    async renderFunction(canvas, fabric) {
      fabric.FabricObject.ownDefaults.objectCaching = false;
      canvas.backgroundColor = 'transparent';
      const text = await fabric.Textbox.fromObject(
        JSON.parse(
          '{"type":"Textbox","version":"4.5.0","left":0.94,"top":0.46,"width":231.02,"height":254.93,"scaleX":0.9,"scaleY":0.9,"angle":0.19,"text":"اگر شما یک طراح هستین و یا با طراحی های گرافیکی سروکار دارید.","fontFamily":"Arial","underline":true,"linethrough":true,"textAlign":"right","direction":"rtl","minWidth":20,"splitByGrapheme":false,"styles":{},"path":null}',
        ),
      );
      text.positionByLeftTop(new fabric.Point(0.94, 0.46));
      canvas.add(text);
      canvas.renderAll();
      return canvas.lowerCanvasEl.toDataURL();
    },
  },

  {
    title: 'Draggable text drag image',
    golden: 'drag-image.png',
    percentage: 0.01,
    disabled: 'node',
    enableGLFiltering: false,
    size: [110, 250],
    async renderFunction(canvas, fabric) {
      return new Promise((resolve) => {
        const text = new fabric.Textbox(
          'lorem ipsum\ndolor\nsit Amet2\nconsectgetur',
          LOREM_IPSUM_TEXT_OPTS,
        );

        canvas.add(text);

        const dragEventStub = {
          clientX: 0,
          clientY: 0,
          dataTransfer: {
            setDragImage(imageSource: CanvasImageSource) {
              canvas.getContext().drawImage(imageSource, 0, 0);
              resolve(canvas.lowerCanvasEl.toDataURL());
            },
          },
          target: canvas.upperCanvasEl,
        };

        // @ts-expect-error -- protected method
        text.draggableTextDelegate.setDragImage(dragEventStub, {
          selectionStart: 3,
          selectionEnd: 20,
        });
      });
    },
  },
  {
    title: 'Draggable text drag image + vpt',
    golden: 'drag_image_vpt.png',
    percentage: 0.01,
    disabled: 'node',
    enableGLFiltering: false,
    size: [220, 250],
    async renderFunction(canvas, fabric) {
      return new Promise((resolve) => {
        const text = new fabric.Textbox(
          'lorem ipsum\ndolor\nsit Amet2\nconsectgetur',
          LOREM_IPSUM_TEXT_OPTS,
        );
        canvas.add(text);
        canvas.viewportTransform = [2, 0, 0, 1, 250, -250];
        const dragEventStub = {
          clientX: 0,
          clientY: 0,
          dataTransfer: {
            setDragImage(imageSource: CanvasImageSource) {
              canvas.getContext().drawImage(imageSource, 0, 0);
              resolve(canvas.lowerCanvasEl.toDataURL());
            },
          },
          target: canvas.upperCanvasEl,
        };
        // @ts-expect-error -- protected method
        text.draggableTextDelegate.setDragImage(dragEventStub, {
          selectionStart: 3,
          selectionEnd: 20,
        });
      });
    },
  },

  {
    title: 'Draggable text drag image + vpt + retina',
    golden: 'drag_image_vpt.png',
    percentage: 0.01,
    disabled: 'node',
    enableGLFiltering: false,
    size: [220, 250],
    async renderFunction(canvas, fabric) {
      return new Promise((resolve) => {
        canvas.viewportTransform = [2, 0, 0, 1, 250, -250];
        canvas.enableRetinaScaling = true;

        const text = new fabric.Textbox(
          'lorem ipsum\ndolor\nsit Amet2\nconsectgetur',
          LOREM_IPSUM_TEXT_OPTS,
        );

        canvas.add(text);

        const dragEventStub = {
          clientX: 0,
          clientY: 0,
          dataTransfer: {
            setDragImage(imageSource: CanvasImageSource) {
              canvas.getContext().drawImage(imageSource, 0, 0);
              resolve(canvas.lowerCanvasEl.toDataURL());
            },
          },
          target: canvas.upperCanvasEl,
        };
        // @ts-expect-error -- protected method
        text.draggableTextDelegate.setDragImage(dragEventStub, {
          selectionStart: 3,
          selectionEnd: 20,
        });
      });
    },
  },

  {
    title: 'Overlapping draggable text effects',
    golden: 'overlapping_draggable_text_effects.png',
    percentage: 0.05,
    disabled: 'node',
    size: [270, 120],
    async renderFunction(canvas, fabric) {
      const source = new fabric.IText('A draggable text\nSecond line');
      const target = new fabric.Textbox('A draggable textbox, Second line', {
        width: 200,
        fill: 'red',
      });
      source.positionByLeftTop(new fabric.Point(0, 0));
      target.positionByLeftTop(new fabric.Point(20, 20));
      canvas.add(source, target);
      canvas.setActiveObject(source);
      source.enterEditing();
      source.selectAll();

      // @ts-expect-error -- partial mock of TPointerEvent
      canvas._onMouseDown({
        clientX: 5,
        clientY: 5,
        target: canvas.upperCanvasEl,
      });

      // @ts-expect-error -- private method
      canvas._onDragStart({
        clientX: 5,
        clientY: 5,
        target: canvas.upperCanvasEl,
        preventDefault() {},
        stopPropagation() {},
        dataTransfer: {
          setData() {},
          setDragImage() {},
        },
      });

      // @ts-expect-error -- partial mock of DragEvent
      canvas._onDragOver({
        clientX: 25,
        clientY: 25,
        target: canvas.upperCanvasEl,
        preventDefault() {},
        stopPropagation() {},
      });

      canvas.getContext().drawImage(canvas.upperCanvasEl, 0, 0);
    },
  },

  {
    title: 'Text selection clearing edge cases: transform',
    golden: 'textSelectionClearing.png',
    percentage: 0.02,
    disabled: 'node',
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      canvas.backgroundColor = 'transparent';
      const text = new (createTextBoxSubclass(fabric))(
        'lorem ipsum dolor sit Amet consectgetur',
        {
          width: 200,
          centeredRotation: true,
        },
      );
      text.positionByLeftTop(new fabric.Point(0, 0));
      canvas.add(text);
      canvas.setActiveObject(text);
      text.enterEditing();
      text.selectAll();
      canvas.renderAll();
      text.rotate(90);
      text.scale(0.8);
      canvas.centerObject(text);
      canvas.renderAll();
      if (text.__calledInitDimensions !== 0) {
        throw new Error('initDimensions was not called');
      }
      canvas.getContext().drawImage(canvas.upperCanvasEl, 0, 0);
      return canvas.lowerCanvasEl.toDataURL();
    },
  },

  {
    title:
      'Text selection clearing edge cases: changing width, `initDimensions`',
    golden: 'textSelectionClearing2.png',
    percentage: 0.02,
    disabled: 'node',
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const TestTextboxClass = createTextBoxSubclass(fabric);
      const text = new TestTextboxClass('lorem ipsum dolor sit Amet sit Amet', {
        width: 200,
      });
      canvas.add(text);
      canvas.renderAll();
      canvas.setActiveObject(text);
      text.enterEditing();
      text.selectAll();

      // if (!canvas.contextTopDirty) {
      //   throw new Error(
      //     'Assertion failed: canvas.contextTopDirty should have been true after selectAll',
      //   );
      // }
      canvas.renderAll();

      text.width = 150;
      // @ts-expect-error -- _forceClearCache is a protected member
      text._forceClearCache = true;
      canvas.renderAll();
      text.setPositionByOrigin(new fabric.Point(0, 0), 'left', 'top');
      canvas.renderAll();

      if (text.__calledInitDimensions !== 1) {
        throw new Error(
          `Assertion failed: initDimensions was called ${text.__calledInitDimensions} times, expected 1`,
        );
      }

      canvas.getContext().drawImage(canvas.upperCanvasEl, 0, 0);
      return canvas.lowerCanvasEl.toDataURL();
    },
  },

  {
    title: 'Text selection clearing edge cases: vpt',
    golden: 'textSelectionClearing3.png',
    percentage: 0.03,
    disabled: 'node',
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const TestTextboxClass = createTextBoxSubclass(fabric);
      const text = new TestTextboxClass(
        'lorem ipsum dolor sit Amet consectgetur',
        {
          width: 200,
        },
      );
      text.positionByLeftTop(new fabric.Point(0, 0));
      canvas.add(text);
      canvas.setActiveObject(text);
      text.enterEditing();
      text.selectAll();
      canvas.renderAll();

      canvas.setViewportTransform([0.8, 0, 0, 1, 0, 0]);
      canvas.renderAll();

      if (text.__calledInitDimensions !== 0) {
        throw new Error(
          `Assertion failed: initDimensions was called ${text.__calledInitDimensions} times, expected 0`,
        );
      }

      canvas.getContext().drawImage(canvas.upperCanvasEl, 0, 0);
      return canvas.lowerCanvasEl.toDataURL();
    },
  },
  {
    title: 'Text and varying decorations',
    golden: 'textDecorationChanges.png',
    percentage: 0.03,
    disabled: false,
    size: [500, 230],
    async renderFunction(canvas, fabric) {
      const text2 = new fabric.FabricText('abcdefOOO\nfghilmOOO', {
        objectCaching: false,
        fontFamily: 'Arial',
        underline: true,
        strokeWidth: 1,
        stroke: 'orange',
        linethrough: true,
        fontSize: 30,
        scaleX: 3,
        scaleY: 3,
        styles: {
          0: {
            0: { fill: 'red', textDecorationThickness: 90 },
            1: { fill: 'red', textDecorationThickness: 90 },
            2: { fill: 'blue', overline: true, textDecorationThickness: 90 },
            3: { fill: 'blue', overline: true, textDecorationThickness: 140 },
            4: { fill: 'green', overline: true, textDecorationThickness: 140 },
            5: { fill: 'green', textDecorationThickness: 190 },
            6: { fill: 'black', textDecorationThickness: 20 },
            7: { fill: 'black', textDecorationThickness: 20 },
            8: { fill: 'yellow', textDecorationThickness: 20 },
          },
          1: {
            0: { fill: 'red', textDecorationThickness: 90 },
            1: { fill: 'red', textDecorationThickness: 90 },
            2: { fill: 'blue', overline: true, textDecorationThickness: 90 },
            3: { fill: 'blue', overline: true, textDecorationThickness: 140 },
            4: { fill: 'green', overline: true, textDecorationThickness: 140 },
            5: { fill: 'purple', overline: true, textDecorationThickness: 190 },
          },
        },
      });
      text2.positionByLeftTop(new fabric.Point(0, 0));
      canvas.add(text2);
    },
  },
  {
    title: 'Text with edge case lineHeight values (0 and 0.01)',
    golden: 'textLineHeightEdgeCases.png',
    percentage: 0.03,
    size: [400, 300],
    async renderFunction(canvas, fabric) {
      // overlaps letters because of small line height
      const text1 = new fabric.Textbox('x\nd\ng\no', {
        lineHeight: 0.01,
        fill: 'blue',
        fontSize: 60,
        textBackgroundColor: 'rgba(255,0,0,0.1)',
      });
      text1.positionByLeftTop(new fabric.Point(0, 5));

      // Reproducer of the bug: text with lineHeight 0 disappears
      // letters should also overlap
      const text2 = new fabric.Textbox('x\nd\ng\no', {
        lineHeight: 0,
        fill: 'red',
        fontSize: 60,
        textBackgroundColor: 'rgba(0,255,0,0.1)',
      });
      text2.positionByLeftTop(new fabric.Point(100, 5));

      // reference text with normal lineHeight for comparison
      const text3 = new fabric.Textbox('x\nd\ng\no', {
        lineHeight: 1.16,
        fill: 'green',
        fontSize: 60,
        textBackgroundColor: 'rgba(0,255,255,0.1)',
      });
      text3.positionByLeftTop(new fabric.Point(250, 5));

      const text4 = new fabric.Textbox('x\nd\ng', {
        lineHeight: 2.5,
        fill: 'red',
        fontSize: 60,
        textBackgroundColor: 'rgba(0,255,0,0.1)',
      });
      text4.positionByLeftTop(new fabric.Point(175, 5));

      const text5 = new fabric.Textbox('o\no\no\no\no\no', {
        lineHeight: 0,
        fill: 'rgba(255,0,0,0.1)',
        fontSize: 60,
        textBackgroundColor: 'rgba(0,255,0,0.1)',
      });
      text5.positionByLeftTop(new fabric.Point(0, 95));

      canvas.add(text1, text2, text3, text4, text5);
    },
  },
];

export const textRenderingTests: renderTestType[] = cases.map((testCase) => ({
  ...testCase,
  snapshotSuffix: 'text',
}));
