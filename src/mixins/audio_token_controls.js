// implementation taken from http://fabricjs.com/controls-api
// and http://fabricjs.com/controls-api

(function() {

  var deleteIconX = -0.5;
  var deleteIconY = -0.5;
  var deleteIconOffsetX = -25;
  var deleteIconOffsetY = 50;
  var deleteImg = document.createElement('img');
  deleteImg.src = deleteIconSrc;

  var playIconX = -0.5;
  var playIconY = -0.5;
  var playIconOffsetX = 50;
  var playIconOffsetY = 50;

  if (fabric.Audio_token) {

    var audioTokenControls = fabric.Audio_token.prototype.controls = { };
    // create custom audio_token control for delete icon
    audioTokenControls.deleteControl = new fabric.Control({
      // delete icon x position relative to audio_token
      x: deleteIconX,

      // delete icon y position relative to audio_token
      y: deleteIconY,

      // delete icon x offset position
      // relative to audio_token to display outside
      // of the audio_token
      offsetX: deleteIconOffsetX,

      // delete icon Y offset position
      // relative to audio_token to display outside
      // of the audio_token
      offsetY: deleteIconOffsetY,

      //touch area of the control
      cornerSize: 32,

      cursorStyle: 'pointer',
      mouseUpHandler: function (eventData, target) {
        var canvas = target.canvas;
        canvas.remove(target);
        canvas.requestRenderAll();
      },
      render: function (ctx, left, top, styleOverride, fabricObject) {
        // fabricObject.scale is the 'base' scale NOT affected by canvas size,
        // scaleX and scaleY are identical, and control the actual drawing scale
        var scale = fabricObject.scaleX;
        var size = this.cornerSize * scale;

        this.y = deleteIconY;
        this.offsetX = deleteIconOffsetX * scale;
        this.offsetY = deleteIconOffsetY * scale;

        ctx.save();
        ctx.translate(left, top);
        ctx.drawImage(deleteImg, -size / 2, -size / 2, size, size);
        ctx.restore();
      },
    });

    // custom play/pause control for the audio_token
    audioTokenControls.playControl = new fabric.Control({
      // play icon x position relative to audio_token
      x: playIconX,

      // play icon y position relative to audio_token
      y: playIconY,

      // play icon x offset position
      // relative to audio_token to display outside
      // of the audio_token
      offsetX: playIconOffsetX,

      // play icon Y offset position
      // relative to audio_token to display outside
      // of the audio_token
      offsetY: playIconOffsetY,

      // these determine the touch-area of the control
      // TODO: determine why this isn't changing the touch-size (currently too small!)
      cornerSize: 64,
      touchCornerSize: 64,

      cursorStyle: 'pointer',
      mouseDownHandler: function (eventData, target) {
        target.controls.playControl.heldDown = true;
      },
      mouseUpHandler: function (eventData, target) {
        var canvas = target.canvas;
        target.controls.playControl.heldDown = false;
        target.playControlPressed && target.playControlPressed(eventData);
        canvas.requestRenderAll();
      },
      render: function (ctx, left, top, styleOverride, fabricObject, forceRender) {
        // This control has a special render flow, we want to be sure we dont render it 2x in one frame
        // if it is the 'active' object - it is _always_ rendered along with it's parent unlike other controls
        if (!forceRender) {
          return;
        }

        // fabricObject.scale is the 'base' scale, scaleX and scaleY are identical, and control the actual drawing scale
        var scale = fabricObject.scaleX;
        // the size doesn't need scaling applied (the position still does though)
        var size = this.cornerSize;
        var controlImg;

        // draw either the default icons or the ones defined by parent (audio_token)
        if (fabricObject === fabricObject.canvas.getIndicatedObject() && !fabricObject.isMoving) {
          if (fabricObject.controls.playControl.heldDown) {
            controlImg = fabricObject.isPlaying
              ? fabricObject.clickedPauseControlImage
              : fabricObject.clickedPlayControlImage;
          }
          else {
            controlImg = fabricObject.isPlaying
              ? fabricObject.hoveredPauseControlImage
              : fabricObject.hoveredPlayControlImage;
          }
        }
        else if (fabricObject.isGrayScaleEnabled) {
          controlImg = fabricObject.isPlaying
            ? null
            : fabricObject.grayScalePlayControlImage;
        }
        else {
          fabricObject.controls.playControl.heldDown = false;
          controlImg = fabricObject.isPlaying
            ? fabricObject.pauseControlImage
            : fabricObject.playControlImage;
        }

        this.y = playIconY;
        this.offsetX = playIconOffsetX * scale;
        this.offsetY = playIconOffsetY * scale;
        ctx.save();
        ctx.translate(left, top);
        ctx.drawImage(controlImg, -size / 2, -size / 2, size, size);
        ctx.restore();
      },
    });
  }
})();
