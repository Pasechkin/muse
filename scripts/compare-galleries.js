const fs = require('fs');
const aPath = 'src/icons/gallery.html';
const bPath = 'src/icons/gallery-optimized.html';
if (!fs.existsSync(aPath) || !fs.existsSync(bPath)) {
  console.error('One of files not found');
  process.exit(2);
}
const aRaw = fs.readFileSync(aPath, 'utf8');
const bRaw = fs.readFileSync(bPath, 'utf8');
const a = aRaw.split(/\r?\n/);
const b = bRaw.split(/\r?\n/);
console.log('FILE A:', aPath);
console.log(' -> bytes:', Buffer.byteLength(aRaw));
console.log(' -> lines:', a.length);
console.log('FILE B:', bPath);
console.log(' -> bytes:', Buffer.byteLength(bRaw));
console.log(' -> lines:', b.length);
console.log('--- DIFF (first 20 differing lines) ---');
let diffCount = 0;
for (let i = 0; i < Math.max(a.length, b.length); i++) {
  const la = a[i] === undefined ? '' : a[i];
  const lb = b[i] === undefined ? '' : b[i];
  if (la !== lb) {
    diffCount++;
    if (diffCount <= 20) {
      console.log(`L${i+1}: A> ${la}`);
      console.log(`    B> ${lb}`);
    }
  }
}
console.log('Total differing lines:', diffCount);
