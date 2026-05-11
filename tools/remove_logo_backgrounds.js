const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const IMAGENES = path.join(__dirname, '..', 'Imagenes');

// Logos that need background removal
const TARGETS = [
  { input: 'DLH-Black-Transparent-Logo-e1721747961373.png', output: 'DLH-Black-Transparent-Logo-e1721747961373.png' },
  { input: 'mph-global-logo.png', output: 'mph-global-logo.png' },
  { input: 'the fresh market logo.jpg', output: 'the fresh market logo.png' },
];

// Flood fill from all edges to mark background pixels (white/near-white)
function floodFillBackground(data, width, height, threshold = 30) {
  const channels = 4;
  const visited = new Uint8Array(width * height);
  const queue = [];

  function isBackground(idx) {
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    return r >= (255 - threshold) && g >= (255 - threshold) && b >= (255 - threshold);
  }

  function enqueue(x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const i = y * width + x;
    if (visited[i]) return;
    const idx = i * channels;
    if (!isBackground(idx)) return;
    visited[i] = 1;
    queue.push([x, y]);
  }

  // Seed from all 4 edges
  for (let x = 0; x < width; x++) { enqueue(x, 0); enqueue(x, height - 1); }
  for (let y = 0; y < height; y++) { enqueue(0, y); enqueue(width - 1, y); }

  // BFS flood fill
  let head = 0;
  while (head < queue.length) {
    const [cx, cy] = queue[head++];
    enqueue(cx + 1, cy);
    enqueue(cx - 1, cy);
    enqueue(cx, cy + 1);
    enqueue(cx, cy - 1);
  }

  // Make all visited (background) pixels transparent
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (visited[y * width + x]) {
        const idx = (y * width + x) * channels;
        data[idx + 3] = 0;
      }
    }
  }
}

async function processLogo({ input, output }) {
  const inputPath = path.join(IMAGENES, input);
  const outputPath = path.join(IMAGENES, output);

  console.log(`Processing: ${input}`);

  const image = sharp(inputPath);
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  floodFillBackground(data, info.width, info.height, 30);

  await sharp(Buffer.from(data), {
    raw: { width: info.width, height: info.height, channels: 4 }
  })
    .png()
    .toFile(outputPath);

  console.log(`  Saved: ${output}`);
}

(async () => {
  for (const target of TARGETS) {
    await processLogo(target);
  }
  console.log('Done.');
})();
