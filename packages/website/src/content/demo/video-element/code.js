const canvas = new fabric.Canvas(canvasEl);
const video1El = document.createElement('video');
const video2El = document.createElement('video');

const video1source = document.createElement('source');
const video2source = document.createElement('source');

const webcamEl = document.createElement('video');

// FabricImage requires the width and height attributes to be set
video1El.width = 480;
video1El.height = 360;
video1El.id = 'video1'
video1El.muted = true;
video1El.appendChild(video1source);
video1source.src = '/site_assets/dizzy.mp4';
video1El.onended = () => video1El.play();

video2El.width = 1280;
video2El.height = 720;
video2El.id = 'video2'
video2El.muted = true;
video2El.appendChild(video2source);
video2source.src = '/site_assets/big-buck-bunny.mp4';
video2El.onended = () => video2El.play();

webcamEl.width = 500;
webcamEl.height = 360;
webcamEl.id = 'webcam'
webcamEl.muted = true;

const video1 = new fabric.FabricImage(video1El, {
  left: 200,
  top: 300,
  angle: -15,
  originX: 'center',
  originY: 'center',
  objectCaching: false,
});

const video2 = new fabric.FabricImage(video2El, {
  left: 700,
  top: 200,
  angle: 15,
  originX: 'center',
  originY: 'center',
  objectCaching: false,
  scaleX: 0.5,
  scaleY: 0.5
});

var webcam = new fabric.FabricImage(webcamEl, {
  left: 539,
  top: 328,
  angle: 94.5,
  originX: 'center',
  originY: 'center',
  objectCaching: false,
});

canvas.add(video1, video2);
canvas.add(webcam);
video1El.play();
video2El.play();

// Older browsers might not implement mediaDevices at all, so we set an empty object first
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}

if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function(constraints) {

    // First get ahold of the legacy getUserMedia, if present
    var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    // Some browsers just don't implement it - return a rejected promise with an error
    // to keep a consistent interface
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }

    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
    return new Promise(function(resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  }
}


// adding webcam video element
if (window.location.protocol === 'https:') {
    navigator.mediaDevices.getUserMedia({video: true})
    .then(function getWebcamAllowed(localMediaStream) {
        webcamEl.srcObject = localMediaStream;

        canvas.add(webcam);
        webcam.moveTo(0); // move webcam element to back of zIndex stack
        webcam.getElement().play();
    }).catch(function getWebcamNotAllowed(e) {
        // block will be hit if user selects "no" for browser "allow webcam access" prompt
        console.error(e);
        console.warn('webcam was not allowed')
    });
}


fabric.util.requestAnimFrame(function render() {
  canvas.renderAll();
  fabric.util.requestAnimFrame(render);
});
