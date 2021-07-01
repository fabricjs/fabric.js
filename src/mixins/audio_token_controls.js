// implementation taken from http://fabricjs.com/controls-api
// and http://fabricjs.com/controls-api

(function() {

  // eslint-disable-next-line
  var deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

  var deleteIconX = -0.5;
  var deleteIconY = -0.5;
  var deleteIconOffsetX = -25;
  var deleteIconOffsetY = 50;
  var deleteimg = document.createElement('img');
  deleteimg.src = deleteIcon;

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
      // delete icon x position relative to audio_token
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
      // We overwrite RENDER with a new implementation for rendering active (clicked) state of the control
      //
      // mouseDownHandler: function (eventData, target) {
      //   target.controls.playControl.render = function (ctx, left, top, styleOverride, target) {
      //     var scale = target.scaleX;
      //     var size = target.controls.playControl.cornerSize * scale;
      //     var activeStateImg = target.isPlaying
      //       ? target.clickedPauseControlImage
      //       : target.clickedPlayControlImage;
      //     target.controls.playControl.y = playIconY;
      //     target.controls.playControl.offsetX = playIconOffsetX * scale;
      //     target.controls.playControl.offsetY = playIconOffsetY * scale;
      //
      //     ctx.save();
      //     ctx.translate(left, top);
      //     ctx.drawImage(activeStateImg, -size / 2, -size / 2, size, size);
      //     ctx.restore();
      //   };
      // },
      mouseUpHandler: function (eventData, target) {
        var canvas = target.canvas;

        target.playControlPressed && target.playControlPressed(eventData);
        canvas.requestRenderAll();
      },
      render: function (ctx, left, top, styleOverride, fabricObject) {
        // fabricObject.scale is the 'base' scale, scaleX and scaleY are identical, and control the actual drawing scale
        var scale = fabricObject.scaleX;
        var size = this.cornerSize * scale;
        var controlImg;

        // draw either the default icons or the ones defined by parent (audio_token)
        if (fabricObject === fabricObject.canvas._indicatedObject) {
          controlImg = fabricObject.isPlaying ?
            fabricObject.hoveredPauseControlImage :
            fabricObject.hoveredPlayControlImage;
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
