export const binaryToBuffer = (binary: string) => {
  const [type, content] = binary
    .replace(/^data:image\/([^;]+);([^,]+),(.+)/, '$2 $3')
    .split(' ') as [BufferEncoding, string];
  return new Uint8Array(Buffer.from(content, type).buffer);
};
