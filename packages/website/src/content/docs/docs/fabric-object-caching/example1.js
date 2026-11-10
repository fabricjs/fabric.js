import * as fabric from 'fabric';

export default function (id) {
    var canvas1 = new fabric.Canvas(id, { width: 350, height: 400 });

    fabric.loadSVGFromURL('/assets/176.svg').then(({objects, options}) => {
        const svg1 = fabric.util.groupSVGElements(objects, options);
        canvas1.add(svg1);
    });
    fabric.loadSVGFromURL('/assets/48.svg').then(({ objects, options }) => {
        const svg1 = fabric.util.groupSVGElements(objects, options);
        canvas1.add(svg1);
    });
    fabric.loadSVGFromURL('/assets/48.svg').then(({ objects, options }) => {
        const svg1 = fabric.util.groupSVGElements(objects, options);
        canvas1.add(svg1);
    });   
    fabric.loadSVGFromURL('/assets/48.svg').then(({ objects, options }) => {
        const svg1 = fabric.util.groupSVGElements(objects, options);
        canvas1.add(svg1);
    });
    fabric.loadSVGFromURL('/assets/171.svg').then(({ objects, options }) => {
        const svg1 = fabric.util.groupSVGElements(objects, options);
        svg1.scale(0.4);
        canvas1.add(svg1);
    });
}