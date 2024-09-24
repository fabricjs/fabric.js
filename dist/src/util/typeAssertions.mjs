const isFiller = filler => {
  return !!filler && filler.toLive !== undefined;
};
const isSerializableFiller = filler => {
  return !!filler && typeof filler.toObject === 'function';
};
const isPattern = filler => {
  return !!filler && filler.offsetX !== undefined && 'source' in filler;
};
const isTextObject = fabricObject => {
  return !!fabricObject && typeof fabricObject._renderText === 'function';
};
const isPath = fabricObject => {
  // we could use instanceof but that would mean pulling in Text code for a simple check
  // @todo discuss what to do and how to do
  return !!fabricObject && typeof fabricObject._renderPathCommands === 'function';
};
const isActiveSelection = fabricObject => !!fabricObject && 'multiSelectionStacking' in fabricObject;

export { isActiveSelection, isFiller, isPath, isPattern, isSerializableFiller, isTextObject };
//# sourceMappingURL=typeAssertions.mjs.map
