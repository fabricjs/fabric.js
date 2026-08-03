import * as fabric from 'fabric';

export default function (id) {
    var canvas = new fabric.Canvas(id, {
        width: 500,
        height: 500,
    });

    const charMap = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}'
    .split('').reduce((acc, char, index) => {
      acc[char] = index + 31;
      return acc;
    }, {});

    class BitmapText extends fabric.Textbox {

        static type = 'BitmapText';

        static ownDefaults = {
            charWidth: 6,
            charHeight: 9,
            fontSize: 9,
            bitmap: '/article_assets/font.png',
            readyToRender: false,
        };

        static getDefaults() {
          return { ...super.getDefaults(), ...BitmapText.ownDefaults };
        }

        constructor(text, options) {
          super(text, options);
          var image = fabric.getEnv().document.createElement('img');
          image.onload = (function() {
            var canvas = fabric.getEnv().document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            canvas.getContext('2d').drawImage(image, 0, 0);
            this.bitmapResource = canvas;
            this.readyToRender = true;
            this.dirty = true;
            if (this.canvas) this.canvas.requestRenderAll();
          }).bind(this);
          image.src = this.bitmap;
        }
    
        // override: make it return a fixed box 6x9
        _measureChar(_char, charStyle, previousChar, prevCharStyle) {
          return { width: 6, kernedWidth: 6 };
        }

        // ovveride, just draw the bitmpa we have.
        _renderChar(method, ctx, lineIndex, charIndex, _char, left, top) {
          if (!this.readyToRender) return;
          var res = this.bitmapResource;
          _char.split('').forEach((singleChar) => {
            ctx.drawImage(res, charMap[singleChar] * 6, 0, 5, 9, left, top - 6, 5, 9);
            ctx.translate(6, 0);
          });
        }
      }

      fabric.classRegistry.setClass(BitmapText);
      // in order for your subclass to work with loadFromJSON you have to define this Static
      // methd `fromObject`.
      var text = new BitmapText('Hello i am a bitmap text', { scaleX: 5, scaleY: 5 });    
      canvas.add(text);
}