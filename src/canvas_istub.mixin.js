(function(){
  var Canvas = this.Canvas || (this.Canvas = { });
  Canvas.IStub = {
    /**
     * @method initStub
     * @param {Function} callback
     * @return {Canvas.IStub} 
     * @chainable true
     */
    initStub: function(callback) {
      if (this.stub) return;
      var _this = this;
      this.cloneAsImage(function(o, orig) {
        
        if (callback) {
          callback();
        }
        
        o.set('flipX', _this.get('flipX'));
        o.set('flipY', _this.get('flipY'));
        
        _this.stub = o;
        
        _this.stub.orig = {
          scaleX: _this.get('scaleX'),
          scaleY: _this.get('scaleY')
        }
        
        // restore original properties
        _this
          .set('width', _this.getWidth())
          .set('height', _this.getHeight())
          .set('scaleX', 1)
          .set('scaleY', 1)
          .set('angle', orig.angle)
          .set('flipX', orig.flipX)
          .set('flipY', orig.flipY)
      });
      return this;
    },
    removeStub: function() {
      return this.setPropsFromStub(this, this);
    },
    setPropsFromStub: function(source, dest) {
      var s = source.stub;
      if (s && s.orig) {
        var scaleX = s.orig.scaleX * s.scaleX;
        var scaleY = s.orig.scaleY * s.scaleY;
        dest.set('scaleX', scaleX);
        dest.set('scaleY', scaleY);
        dest.set('width', this.width / scaleX);
        dest.set('height', this.height / scaleY);
        delete source.stub;
      }
      return source;
    },
    renderStub: function(ctx) {
      if (!this.stub) return;
      ctx.save();
      this.transform(ctx);
      this.stub.render(ctx, true /* no transform */ );
      if (this.active) {
        this.drawBorders(ctx);
        this.drawCorners(ctx);
      }
      ctx.restore();
    }
  }
})();