const fs = require('fs');
const path = require('path');
function walk(dir){
  if(!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.svg')).map(f => ({path: path.join(dir,f), size: fs.statSync(path.join(dir,f)).size}));
}
const srcDir = path.join(__dirname, '..', 'src', 'icons');
const optDir = path.join(srcDir, 'optimized');
const srcFiles = walk(srcDir);
const optFiles = walk(optDir);
const sum = arr => arr.reduce((s,i)=>s+i.size,0);
const srcSum = sum(srcFiles);
const optSum = sum(optFiles);
const srcCount = srcFiles.length;
const optCount = optFiles.length;
console.log('SRC_COUNT=', srcCount, 'SRC_BYTES=', srcSum);
console.log('OPT_COUNT=', optCount, 'OPT_BYTES=', optSum);
if (srcSum && optSum) {
  const diff = srcSum - optSum;
  const pct = Math.round((diff/srcSum)*10000)/100;
  console.log('SAVED_BYTES=', diff, 'SAVED_PCT=', pct + '%');
}
else {
  console.log('Unable to compute diff (one set may be empty)');
}
