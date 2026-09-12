import * as fabric from 'fabric';

function disableCache(objects) {
    objects.forEach((obj) => {
        obj.objectCaching = false;
    });
}

export default function (id) {
    var canvas2 = new fabric.Canvas(id, { width: 350, height: 400 });
    fabric.loadSVGFromURL('/assets/176.svg').then(({objects, options}) => {
        disableCache(objects);
        const svg1 = fabric.util.groupSVGElements(objects, options);
        svg1.objectCaching = false;
        canvas2.add(svg1);
    });
    fabric.loadSVGFromURL('/assets/48.svg').then(({ objects, options }) => {
        disableCache(objects);
        const svg1 = fabric.util.groupSVGElements(objects, options);
        svg1.objectCaching = false;
        canvas2.add(svg1);
    });
    fabric.loadSVGFromURL('/assets/48.svg').then(({ objects, options }) => {
        disableCache(objects);
        const svg1 = fabric.util.groupSVGElements(objects, options);
        svg1.objectCaching = false;
        canvas2.add(svg1);
    });   
    fabric.loadSVGFromURL('/assets/48.svg').then(({ objects, options }) => {
        disableCache(objects);
        const svg1 = fabric.util.groupSVGElements(objects, options);
        svg1.objectCaching = false;
        canvas2.add(svg1);
    });
    fabric.loadSVGFromURL('/assets/171.svg').then(({ objects, options }) => {
        disableCache(objects);
        const svg1 = fabric.util.groupSVGElements(objects, options);
        svg1.objectCaching = false;
        svg1.scale(0.4);
        canvas2.add(svg1);
    });
}