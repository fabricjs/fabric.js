import { getFabricWindow } from '../../env/index.mjs';

function requestAnimFrame(callback) {
  return getFabricWindow().requestAnimationFrame(callback);
}
function cancelAnimFrame(handle) {
  return getFabricWindow().cancelAnimationFrame(handle);
}

export { cancelAnimFrame, requestAnimFrame };
//# sourceMappingURL=AnimationFrameProvider.mjs.map
