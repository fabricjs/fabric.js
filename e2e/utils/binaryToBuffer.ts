export const binaryToBuffer = (binary: string) => {
  const [type, content] = binary
    .replace(/^data:image\/([^;]+);([^,]+),(.+)/, '$2 $3')
    .split(' ') as [BufferEncoding, string];
  return Buffer.from(content, type);
};
