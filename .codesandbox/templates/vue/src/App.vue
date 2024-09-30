<template>
  <canvas ref="canvas"></canvas>
</template>

<script>
import * as fabric from 'fabric';

export default {
  name: 'Canvas',
  mounted() {
    // Do we need to use https://vuejs.org/api/reactivity-advanced.html#markraw?
    const canvas = new fabric.Canvas(this.$refs.canvas, {
      width: 500,
      height: 500,
    });

    const textValue = 'fabric.js sandbox';
    const text = new fabric.Textbox(textValue, {
      originX: 'center',
      splitByGrapheme: true,
      width: 200,
      top: 20,
      styles: fabric.util.stylesFromArray(
        [
          {
            style: {
              fontWeight: 'bold',
              fontSize: 64,
            },
            start: 0,
            end: 9,
          },
        ],
        textValue,
      ),
    });
    canvas.add(text);
    canvas.centerObjectH(text);
  },
};
</script>
