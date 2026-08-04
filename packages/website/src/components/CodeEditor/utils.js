export const functionToCodeString = (fn) =>
  fn.toString().match(/function[^{]+\{[\n]*([\s\S]*)\}$/)[1];
