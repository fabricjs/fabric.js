//@ts-nocheck

export function scaleMatrix(matrix, args) {
  const multiplierX = args[0],
    multiplierY = args.length === 2 ? args[1] : args[0];

  matrix[0] = multiplierX;
  matrix[3] = multiplierY;
}
