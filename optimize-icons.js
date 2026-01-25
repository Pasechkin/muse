const fs = require('fs');
const path = require('path');
const { optimize } = require('svgo');

const ROOT = path.join(__dirname);
const ICONS_DIR = path.join(ROOT, 'src', 'icons');
const OUT_DIR = path.join(ICONS_DIR, 'optimized');
const SPRITE_PATH = path.join(ICONS_DIR, 'sprite-common.svg');

// List of common icons to include into small sprite (adjust as needed)
const COMMON = ['icon-1','icon-25','icon-26','icon-5','icon-6'];


if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const svgoConfig = require(path.join(ROOT, 'svgo.config.js'));

function detectColors(svg) {
  const fills = new Set();
  const reAttr = /(?:fill|stroke)\s*=\s*"([^"#][^"]*|#?[^\"]+)"/g;
  let m;
  while ((m = reAttr.exec(svg)) !== null) {
    const v = m[1].trim();
    if (v && v !== 'none' && v !== 'currentColor') fills.add(v);
  }
  const reStyle = /style\s*=\s*"([^"]*)"/g;
  while ((m = reStyle.exec(svg)) !== null) {
    const content = m[1];
    const re = /(fill|stroke)\s*:\s*([^;]+)/g;
    let n;
    while ((n = re.exec(content)) !== null) {
      const v = n[2].trim();
      if (v && v !== 'none' && v !== 'currentColor') fills.add(v);
    }
  }
  return Array.from(fills);
}

function toCurrentColor(svg) {
  // replace fill/stroke attributes with currentColor where appropriate
  svg = svg.replace(/(fill|stroke)\s*=\s*"([^"']+)"/g, (m, p, v) => {
    if (v === 'none' || v === 'currentColor') return `${p}="${v}"`;
    return `${p}="currentColor"`;
  });
  // remove inline fill/stroke in style attributes
  svg = svg.replace(/style\s*=\s*"([^"]*)"/g, (m, content) => {
    const cleaned = content.split(';').map(s => s.trim()).filter(s => !/^((fill|stroke)\s*:)/.test(s)).join(';');
    return cleaned ? `style="${cleaned}"` : '';
  });
  return svg;
}

const files = fs.readdirSync(ICONS_DIR).filter(f => f.endsWith('.svg'));
const spriteSymbols = [];

files.forEach(file => {
  const full = path.join(ICONS_DIR, file);
  const name = path.basename(file, '.svg');
  const raw = fs.readFileSync(full, 'utf8');
  const result = optimize(raw, { path: full, ...svgoConfig });
  let optimized = result.data;

  const colors = detectColors(optimized);
  if (colors.length <= 1) {
    optimized = toCurrentColor(optimized);
  }

  fs.writeFileSync(path.join(OUT_DIR, file), optimized, 'utf8');

  if (COMMON.includes(name)) {
    const vb = (optimized.match(/viewBox="([^"]+)"/) || [])[1] || '0 0 24 24';
    const inner = optimized.replace(/^<svg[^>]*>/i, '').replace(/<\/svg>\s*$/i, '');
    spriteSymbols.push({ id: name, viewBox: vb, inner });
  }
});

if (spriteSymbols.length) {
  const parts = ['<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:none">'];
  spriteSymbols.forEach(s => {
    parts.push(`<symbol id="${s.id}" viewBox="${s.viewBox}">${s.inner}</symbol>`);
  });
  parts.push('</svg>');
  fs.writeFileSync(SPRITE_PATH, parts.join('\n'), 'utf8');
  console.log('Wrote sprite to', SPRITE_PATH);
}

console.log('Optimized SVGs written to', OUT_DIR);
