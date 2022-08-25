// This file will be used when deployed to codesandbox for 2 reasons:
// 1. glob importing isn't supported since parcelrc is not read by codesandbox (at 08/2022)
// 2. assets are too heavy

const BASE_URL ='https://cdn.jsdelivr.net/gh/fabricjs/fabric.js/.codesandbox/templates/kitchensink/assets/images';

export const images = {
    ladybug: `${BASE_URL}/ladybug.png`,
    honey_im_subtle: `${BASE_URL}/honey_im_subtle.png`
};

export const SVG = {};