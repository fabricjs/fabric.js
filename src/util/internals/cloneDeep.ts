export const cloneDeep = <T extends object>(object: T): T =>
  JSON.parse(JSON.stringify(object));
