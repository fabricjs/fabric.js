// implementation taken from http://fabricjs.com/controls-api
// and http://fabricjs.com/controls-api

(function() {

  var deleteIconX = -0.5;
  var deleteIconY = -0.5;
  var deleteIconOffsetX = -25;
  var deleteIconOffsetY = 50;
  var deleteimg = document.createElement('img');
  deleteimg.src = deleteIconSrc;

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
        // events are not yet implemented but this will eventually go here
        // sendTextboxEvent(WORKSHEET_EVENT.DELETED_AUDIO_TOKEN, target.width, target.height)
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
        ctx.drawImage(deleteimg, -size / 2, -size / 2, size, size);
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
      render: function (ctx, left, top, styleOverride, fabricObject) {
        // fabricObject.scale is the 'base' scale, scaleX and scaleY are identical, and control the actual drawing scale
        var scale = fabricObject.scaleX;
        var size = this.cornerSize * scale;
        var controlImg;

        // draw either the default icons or the ones defined by parent (audio_token)
        if (fabricObject === fabricObject.canvas.getIndicatedObject()) {
          if (fabricObject.controls.playControl.heldDown) {
            controlImg = fabricObject.isPlaying ?
              fabricObject.clickedPauseControlImage
              : fabricObject.clickedPlayControlImage;
          }
          else {
            controlImg = fabricObject.isPlaying ?
              fabricObject.hoveredPauseControlImage :
              fabricObject.hoveredPlayControlImage;
          }
        }
        else {
          controlImg = fabricObject.isPlaying ?
            fabricObject.pauseControlImage :
            fabricObject.playControlImage;
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
