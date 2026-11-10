import * as fabric from 'fabric';

export default function (id) {
    var canvas3 = new fabric.Canvas(id, { width: 300, height: 300 });
    fabric.loadSVGFromURL('/assets/171.svg').then(({ objects, options }) => {
        var svg1 = fabric.util.groupSVGElements(objects, options);
        svg1.noScaleCache = true;
        svg1.scale(0.05);
        canvas3.add(svg1);
    });
}