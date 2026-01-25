const fs = require('fs');
const path = require('path');

const root = path.join('src', 'html', 'portret-na-zakaz', 'style');
const files = fs.readdirSync(root).filter((f) => f.endsWith('.html'));
const missing = [];

for (const file of files) {
  const filePath = path.join(root, file);
  const html = fs.readFileSync(filePath, 'utf8');
  const imgRegex = /<img\b[^>]*>/gi;
  let match;
  while ((match = imgRegex.exec(html))) {
    const tag = match[0];
    const hasWidth = /\bwidth=/.test(tag);
    const hasHeight = /\bheight=/.test(tag);
    const hasLoading = /\bloading=/.test(tag);
    const hasDecoding = /\bdecoding=/.test(tag);
    if (!(hasWidth && hasHeight && hasLoading && hasDecoding)) {
      missing.push({ file, tag });
    }
  }
}

const grouped = missing.reduce((acc, { file, tag }) => {
  acc[file] = acc[file] || [];
  acc[file].push(tag);
  return acc;
}, {});

Object.keys(grouped).forEach((file) => {
  console.log(`\n${file}`);
  grouped[file].forEach((tag) => console.log(`  ${tag}`));
});

if (!missing.length) {
  console.log('OK: все img содержат width/height/loading/decoding');
}
