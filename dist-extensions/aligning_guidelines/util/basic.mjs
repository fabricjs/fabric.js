function getDistance(a, b) {
  return Math.abs(a - b);
}
function setPositionDir(target, pos, dir) {
  const center = target.translateToCenterPoint(pos, 'center', 'center');
  const position = target.translateToOriginPoint(center, target.originX, target.originY);
  if (dir == 'x') target.setX(position.x);else target.setY(position.y);
}

export { getDistance, setPositionDir };
//# sourceMappingURL=basic.mjs.map
