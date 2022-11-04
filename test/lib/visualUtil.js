(function(exports) {



  async function getImage(src) {
    return new Promise((resolve, reject) => {
      const img = fabric.document.createElement('img');
      img.onload = function () {
        img.onerror = null;
        img.onload = null;
        resolve(img);
      };
      img.onerror = function (err) {
        img.onerror = null;
        img.onload = null;
        reject(err);
      };
      img.src = src;
    });
  }

  exports.getImage = getImage;
})(typeof window === 'undefined' ? exports : this);
