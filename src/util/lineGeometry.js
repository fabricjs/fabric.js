(function() {

    //This function returns the coordinates of the two line endpoints in the canvas coordinate system.
    //The line has an x1, x2, y1, y2 set of properties, but they are all lies.
    //They're only true when you first set them, but moving the line adjusts
    //left/top without adjusting x1 & frineds; they therefore get out of sync.
    //This method returns a real x1/x2/y1/y2 relative to the canvas origin.
    //See the diagram in the documentation repo for reference.
    function getRealEndpointsForLine(line, noSwapping) {
        //This guy returns x1/x2/y1/y2 relative to the line center.
        var lineCoords = line.calcLinePoints();
        var centerPoint = line.getCenterPoint();

        //Take flipping into account by swapping around coordinates
        //See step 1 of the diagram
        if (line.flipY) {
            var ty = lineCoords.y1;
            lineCoords.y1 = lineCoords.y2;
            lineCoords.y2 = ty;
        }
        if (line.flipX) {
            var tx = lineCoords.x1;
            lineCoords.x1 = lineCoords.x2;
            lineCoords.x2 = tx;
        }

        //rotate the coords appropriately too
        //We need to rotate the line's coordinate system to eliminate line.angle from
        //the equation. See step 2 of the diagram
        var origin = new fabric.Point(0, 0);
        var point1 = new fabric.Point(lineCoords.x1, lineCoords.y1);
        var point2 = new fabric.Point(lineCoords.x2, lineCoords.y2);
        var angle = fabric.util.degreesToRadians(line.angle);
        var rotatedPoint1 = fabric.util.rotatePoint(point1, origin, angle);
        var rotatedPoint2 = fabric.util.rotatePoint(point2, origin, angle);

        //Now translate the line coordinate system to equal the canvas system.
        //This now gives us x1/x2/y1/y2 in canvas space.
        //See step 3 of the diagram.
        var canvasRelativeCoords = {
            x1: centerPoint.x + rotatedPoint1.x,
            y1: centerPoint.y + rotatedPoint1.y,
            x2: centerPoint.x + rotatedPoint2.x,
            y2: centerPoint.y + rotatedPoint2.y,
        };

        //Enforce a particular quardant: make x1 < x2 always; we operate in Q1 or Q4
        if (canvasRelativeCoords.x1 > canvasRelativeCoords.x2 && !noSwapping) {
            canvasRelativeCoords = {
                x1: canvasRelativeCoords.x2,
                y1: canvasRelativeCoords.y2,
                x2: canvasRelativeCoords.x1,
                y2: canvasRelativeCoords.y1,
            };
        }

        canvasRelativeCoords.point1 = new fabric.Point(canvasRelativeCoords.x1, canvasRelativeCoords.y1);
        canvasRelativeCoords.point2 = new fabric.Point(canvasRelativeCoords.x2, canvasRelativeCoords.y2);
        return canvasRelativeCoords;
    }


    //Accepts a proposed width and height (which may be negative)
    function getSnappedArea(xdiff, ydiff) {
        var lineAngle= Math.atan2(ydiff, xdiff);
        var area = {};
        //round to 45 degree increments
        var roundedAngle = (Math.round((lineAngle*4) / Math.PI)/4)*180;

        var distance = (Math.abs(xdiff) + Math.abs(ydiff))/2;

        area.width = distance;
        area.height = distance;

        //handle vertical cases
        if(Math.abs(roundedAngle) === 90) {
            area.width = 0;
            area.height = distance*2;
        }

        //handle horizontal cases
        if(Math.abs(roundedAngle) === 180 || roundedAngle === 0) {
            area.height = 0;
            area.width = distance*2;
        }

        if(xdiff < 0) {
            area.width = -area.width;
        }
        if(ydiff < 0) {
            area.height = -area.height;
        }
        return area;
    }

    fabric.util.lineGeometry = {
        getSnappedArea: getSnappedArea,
        getRealEndpointsForLine: getRealEndpointsForLine,
    };
})();