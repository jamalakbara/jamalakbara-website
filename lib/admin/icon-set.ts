// Renders the stamp app-icon set from public/icon.svg (favicon.ico with
// 16/32/48 PNG entries, apple-icon 180, manifest 192/512). Server-only.
import sharp from "sharp";

const SOURCE_SIZE = 108; // icon.svg viewBox

async function png(svg: Buffer, size: number): Promise<Buffer> {
  return sharp(svg, { density: Math.ceil((size / SOURCE_SIZE) * 72) })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** ICO container whose entries are PNGs (supported by every current browser). */
function ico(entries: { size: number; data: Buffer }[]): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);
  let offset = 6 + entries.length * 16;
  const dir = entries.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...dir, ...entries.map((e) => e.data)]);
}

export async function renderIconSet(svgText: string): Promise<Record<string, Buffer>> {
  const svg = Buffer.from(svgText, "utf8");
  const [i16, i32, i48, apple, i192, i512] = await Promise.all([16, 32, 48, 180, 192, 512].map((s) => png(svg, s)));
  return {
    "app/favicon.ico": ico([
      { size: 16, data: i16 },
      { size: 32, data: i32 },
      { size: 48, data: i48 },
    ]),
    "public/apple-icon.png": apple,
    "public/icon-192.png": i192,
    "public/icon-512.png": i512,
  };
}
