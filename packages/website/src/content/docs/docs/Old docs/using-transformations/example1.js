import * as fabric from 'fabric';

export default function (id) {
    var canvas = new fabric.Canvas(id, {
        width: 350,
        height: 400,
    });
    var boss = new fabric.Rect({ width: 150, height: 200, fill: 'red' });
    var minion1 = new fabric.Rect({ width: 40, height: 40, fill: 'blue' });
    var minion2 = new fabric.Rect({ width: 40, height: 40, fill: 'blue' });

    canvas.add(boss, minion1, minion2);

    boss.on('moving', updateMinions);
    boss.on('rotating', updateMinions);
    boss.on('scaling', updateMinions);

    var multiply = fabric.util.multiplyTransformMatrices;
    var invert = fabric.util.invertTransform;

    function updateMinions() {
        var minions = canvas.getObjects().filter(o => o !== boss);
        minions.forEach(o => {
            if (!o.relationship) {
                return;
            }
            var relationship = o.relationship;
            var newTransform = multiply(boss.calcTransformMatrix(), relationship);
            var opt = fabric.util.qrDecompose(newTransform);
            o.set({
                flipX: false,
                flipY: false,
            });
            o.setPositionByOrigin({ x: opt.translateX, y: opt.translateY }, 'center', 'center');
            o.set(opt);
            o.setCoords();
        });
    }

    document.getElementById('bind').onclick = function() {
        var minions = canvas.getObjects().filter(o => o !== boss);
        var bossTransform = boss.calcTransformMatrix();
        var invertedBossTransform = fabric.util.invertTransform(bossTransform);
        minions.forEach(o => {
            var desiredTransform = multiply(invertedBossTransform, o.calcTransformMatrix());
            // save the desired relation here.
            o.relationship = desiredTransform;
        });
    }
}
