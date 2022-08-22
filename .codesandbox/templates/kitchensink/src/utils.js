import { fabric } from "fabric";

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function pad(str, length) {
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
}

export const getRandomInt = fabric.util.getRandomInt;

export function getRandomColor() {
  return (
    pad(getRandomInt(0, 255).toString(16), 2) +
    pad(getRandomInt(0, 255).toString(16), 2) +
    pad(getRandomInt(0, 255).toString(16), 2)
  );
}

export function getRandomNum(min, max) {
  return Math.random() * (max - min) + min;
}

export function getRandomLeftTop() {
  var offset = 50;
  return {
    left: getRandomInt(0 + offset, 700 - offset),
    top: getRandomInt(0 + offset, 500 - offset)
  };
}

// function supportsInputOfType(type) {
//     return function () {
//     var el = document.createElement('input');
//     try {
//       el.type = type;
//     }
//     catch (err) { }
//     return el.type === type;
//   };
// };

// var supportsSlider = supportsInputOfType('range'),
//   supportsColorpicker = supportsInputOfType('color');



