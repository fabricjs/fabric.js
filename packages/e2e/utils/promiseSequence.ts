export const promiseSequence = <T>(tasks: (() => Promise<T>)[]) =>
  tasks.reduce((prev, curr) => prev.finally(curr), Promise.resolve());
