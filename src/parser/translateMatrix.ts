//@ts-nocheck

export function translateMatrix(matrix, args) {
    matrix[4] = args[0];
    if (args.length === 2) {
        matrix[5] = args[1];
    }
}
