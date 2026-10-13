import fs from 'fs';
import zlib from 'zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  return table;
}

const crcTable = createCRC32Table();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(8 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  const crcVal = crc32(typeAndData);
  chunk.writeUInt32BE(crcVal, 8 + len);
  return chunk;
}

function renderBridgeImage(width, height) {
  // Render an anti-aliased bridge on an RGBA canvas buffer
  const buf = Buffer.alloc(width * height * 4);

  // Background: white with rounded corner alpha or solid white
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      buf[idx] = 255;     // R
      buf[idx + 1] = 255; // G
      buf[idx + 2] = 255; // B
      buf[idx + 3] = 255; // A
    }
  }

  // Draw bridge geometry scaled to width x height
  const scale = width / 64;
  
  function setPixel(x, y, r, g, b, a = 1) {
    const px = Math.round(x);
    const py = Math.round(y);
    if (px < 0 || px >= width || py < 0 || py >= height) return;
    const idx = (py * width + px) * 4;
    const currentA = buf[idx + 3] / 255;
    const blendA = a + currentA * (1 - a);
    buf[idx] = Math.round((r * a + buf[idx] * (1 - a)));
    buf[idx + 1] = Math.round((g * a + buf[idx + 1] * (1 - a)));
    buf[idx + 2] = Math.round((b * a + buf[idx + 2] * (1 - a)));
    buf[idx + 3] = Math.round(blendA * 255);
  }

  function drawThickLine(x0, y0, x1, y1, thickness, r, g, b) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.hypot(dx, dy);
    const steps = Math.max(Math.ceil(len * 2), 1);
    const halfThick = thickness / 2;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const cx = x0 + dx * t;
      const cy = y0 + dy * t;
      for (let ox = -halfThick; ox <= halfThick; ox += 0.5) {
        for (let oy = -halfThick; oy <= halfThick; oy += 0.5) {
          if (ox * ox + oy * oy <= halfThick * halfThick) {
            setPixel(cx + ox, cy + oy, r, g, b, 1);
          }
        }
      }
    }
  }

  // Primary Orange colors
  const orangeR = 234, orangeG = 88, orangeB = 12; // #EA580C
  const navyR = 15, navyG = 23, navyB = 42;         // #0F172A

  // 1. Arch
  const archSteps = 200;
  let prevAx = null, prevAy = null;
  for (let i = 0; i <= archSteps; i++) {
    const t = i / archSteps;
    // Cubic bezier from (7, 43) through (15, 18), (23, 12), (32, 12) to (57, 43)
    const p0x = 7, p0y = 43;
    const p1x = 18, p1y = 10;
    const p2x = 46, p2y = 10;
    const p3x = 57, p3y = 43;
    const cx = Math.pow(1 - t, 3) * p0x + 3 * Math.pow(1 - t, 2) * t * p1x + 3 * (1 - t) * t * t * p2x + Math.pow(t, 3) * p3x;
    const cy = Math.pow(1 - t, 3) * p0y + 3 * Math.pow(1 - t, 2) * t * p1y + 3 * (1 - t) * t * t * p2x * 0 + 3 * (1 - t) * t * t * p2y + Math.pow(t, 3) * p3y;
    // Better parabolic: y = 12 + 31 * ( (x - 32)/25 )^2
    const ax = 7 + t * 50;
    const normX = (ax - 32) / 25;
    const ay = 12 + 31 * normX * normX;
    const sx = ax * scale;
    const sy = ay * scale;
    if (prevAx !== null) {
      drawThickLine(prevAx, prevAy, sx, sy, 4.8 * scale, orangeR, orangeG, orangeB);
    }
    prevAx = sx;
    prevAy = sy;
  }

  // 2. Horizontal Deck
  drawThickLine(4 * scale, 34 * scale, 60 * scale, 34 * scale, 3.8 * scale, navyR, navyG, navyB);

  // 3. Vertical Suspension Cables
  const cableXs = [17, 24, 32, 40, 47];
  for (const cx of cableXs) {
    const normX = (cx - 32) / 25;
    const topY = 12 + 31 * normX * normX;
    drawThickLine(cx * scale, topY * scale, cx * scale, 34 * scale, 2.2 * scale, orangeR, orangeG, orangeB);
  }

  // 4. Piers
  drawThickLine(13 * scale, 34 * scale, 13 * scale, 48 * scale, 3.6 * scale, navyR, navyG, navyB);
  drawThickLine(51 * scale, 34 * scale, 51 * scale, 48 * scale, 3.6 * scale, navyR, navyG, navyB);

  // 5. Waterline
  drawThickLine(6 * scale, 49 * scale, 20 * scale, 49 * scale, 2.4 * scale, navyR, navyG, navyB);
  drawThickLine(44 * scale, 49 * scale, 58 * scale, 49 * scale, 2.4 * scale, navyR, navyG, navyB);
  drawThickLine(25 * scale, 49 * scale, 39 * scale, 49 * scale, 2.4 * scale, orangeR, orangeG, orangeB);

  return buf;
}

function createPng(width, height) {
  const rawRgba = renderBridgeImage(width, height);
  // Scanlines with filter byte 0x00
  const scanlines = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 4);
    scanlines[rowOffset] = 0; // Filter None
    rawRgba.copy(scanlines, rowOffset + 1, y * width * 4, (y + 1) * width * 4);
  }

  const deflated = zlib.deflateSync(scanlines);

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

// Generate files
import path from 'path';
const outDir = path.resolve('./public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), createPng(180, 180));
fs.writeFileSync(path.join(outDir, 'favicon-32x32.png'), createPng(32, 32));
fs.writeFileSync(path.join(outDir, 'favicon-16x16.png'), createPng(16, 16));
fs.writeFileSync(path.join(outDir, 'favicon.png'), createPng(32, 32));
console.log('PNG favicons generated successfully!');
