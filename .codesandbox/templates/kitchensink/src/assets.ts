// https://parceljs.org/features/dependency-resolution/#glob-specifiers
import SVGAssets from '../assets/*/*.svg';
import imageAssets from '../assets/images/*.(png|jpg|jpeg)';

const images: typeof imageAssets = {};
for (const key in imageAssets) {
    const resolved = imageAssets[key];
    const ext = Object.keys(resolved)[0];
    images[key] = resolved[ext];
}

export { images, SVGAssets as SVG }