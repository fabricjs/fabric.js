
import { getImage } from './common.mjs';


  export const getFixture = async function(name, original, callback) {
    callback(await getImage(getFixtureName(name), original));
  };

  export const getAsset = function(name, callback) {
  fabric.util.request(getAssetName(name), {
        onComplete: function(xhr) {
          callback(null, xhr.responseText);
        }
      });
  };

export   function getAssetName(filename, ext='.svg') {
   return `/assets/${filename}${ext}`;
  }

  export function getGoldenName(filename) {
    return `/golden/${filename}`;
  }

 export function getFixtureName(filename) {
    return  `/fixtures/${filename}`;
  }

 export function generateGolden(filename, original) {
      return new Promise((resolve, reject) => {
        return original.toBlob(blob => {
          const formData = new FormData();
          formData.append('file', blob, filename);
          formData.append('filename', filename);
          const request = new XMLHttpRequest();
          request.open('POST', '/goldens', true);
          request.onreadystatechange = () => {
            if (request.readyState === XMLHttpRequest.DONE) {
              const status = request.status;
              if (status === 0 || (status >= 200 && status < 400)) {
                resolve();
              } else {
                reject();
              }
            }
          };
          request.send(formData);
        });     
      }, 'image/png');
}


  