#!/usr/bin/env node
/**
 * optimize-bagets.js — конвертация текстур багетов в WebP с ресайзом.
 *
 * Для каждой папки в src/html/img/bagets/{id}/:
 *   1.jpeg/png (strip) → 1.webp  (150px по короткой стороне, quality 80)
 *   2.jpeg/png (corner) → 2.webp (150×150, quality 80)
 *
 * Использование:  node scripts/optimize-bagets.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const BAGETS_DIR = path.join(__dirname, '..', 'src', 'html', 'img', 'bagets');
const STRIP_SHORT_SIDE = 150;   // px — короткая сторона strip
const CORNER_SIZE = 150;        // px — corner квадрат
const WEBP_QUALITY = 80;

async function processFile(dirPath, srcName, outName, resizeOpts) {
  const inPath = path.join(dirPath, srcName);
  const outPath = path.join(dirPath, outName);
  const inSize = fs.statSync(inPath).size;
  const meta = await sharp(inPath).metadata();

  let pipeline = sharp(inPath);
  // Only downscale, never upscale
  if (resizeOpts.width && meta.width > resizeOpts.width) {
    pipeline = pipeline.resize(resizeOpts);
  } else if (resizeOpts.height && meta.height > resizeOpts.height) {
    pipeline = pipeline.resize(resizeOpts);
  }

  await pipeline.webp({ quality: WEBP_QUALITY }).toFile(outPath);

  const outSize = fs.statSync(outPath).size;

  // If WebP is larger — delete it and keep original
  if (outSize >= inSize) {
    fs.unlinkSync(outPath);
    return {
      src: srcName, kept: srcName,
      inKB: (inSize / 1024).toFixed(1),
      outKB: (inSize / 1024).toFixed(1),
      saved: '0', dims: `${meta.width}×${meta.height}`,
      skipped: true
    };
  }

  return {
    src: srcName, kept: outName,
    inKB: (inSize / 1024).toFixed(1),
    outKB: (outSize / 1024).toFixed(1),
    saved: (((inSize - outSize) / inSize) * 100).toFixed(0),
    dims: `${meta.width}×${meta.height}`,
    skipped: false
  };
}

async function processDir(dirPath, dirName) {
  const files = fs.readdirSync(dirPath);
  const stripSrc = files.find(f => /^1\.(jpe?g|png)$/i.test(f));
  const cornerSrc = files.find(f => /^2\.(jpe?g|png)$/i.test(f));
  const results = { id: dirName, strip: null, corner: null };

  if (stripSrc) {
    const meta = await sharp(path.join(dirPath, stripSrc)).metadata();
    const isVertical = meta.height > meta.width;
    const resizeOpts = isVertical
      ? { width: STRIP_SHORT_SIDE }
      : { height: STRIP_SHORT_SIDE };
    results.strip = await processFile(dirPath, stripSrc, '1.webp', resizeOpts);
  }

  if (cornerSrc) {
    results.corner = await processFile(dirPath, cornerSrc, '2.webp',
      { width: CORNER_SIZE, height: CORNER_SIZE, fit: 'cover' });
  }

  return results;
}

async function main() {
  const dirs = fs.readdirSync(BAGETS_DIR).filter(d =>
    fs.statSync(path.join(BAGETS_DIR, d)).isDirectory()
  );

  console.log(`\n🖼  Оптимизация текстур багетов → WebP (${dirs.length} папок)\n`);
  console.log('  ID             | Strip                           | Corner');
  console.log('  ───────────────┼─────────────────────────────────┼──────────────────────────');

  let totalIn = 0, totalOut = 0, processed = 0, skipped = 0;
  const mapping = {};  // id → { strip: '1.webp'|'1.jpeg', corner: '2.webp'|'2.jpeg' }

  for (const dir of dirs) {
    const r = await processDir(path.join(BAGETS_DIR, dir), dir);
    mapping[r.id] = { strip: null, corner: null };

    const fmtInfo = (info) => {
      if (!info) return '—';
      if (info.skipped) return `${info.dims} KEPT ${info.src} (webp larger)`;
      return `${info.dims} ${info.inKB}→${info.outKB} KB (−${info.saved}%)`;
    };

    console.log(`  ${r.id.padEnd(15)}| ${fmtInfo(r.strip).padEnd(32)}| ${fmtInfo(r.corner)}`);

    if (r.strip) {
      mapping[r.id].strip = r.strip.kept;
      totalIn += parseFloat(r.strip.inKB);
      totalOut += parseFloat(r.strip.outKB);
      processed++;
      if (r.strip.skipped) skipped++;
    }
    if (r.corner) {
      mapping[r.id].corner = r.corner.kept;
      totalIn += parseFloat(r.corner.inKB);
      totalOut += parseFloat(r.corner.outKB);
      processed++;
      if (r.corner.skipped) skipped++;
    }
  }

  console.log('\n  ─────────────────────────────────────────────────────────────');
  console.log(`  Итого: ${processed} файлов (${skipped} оставлены как оригинал)`);
  console.log(`  До:    ${totalIn.toFixed(0)} KB`);
  console.log(`  После: ${totalOut.toFixed(0)} KB`);
  console.log(`  Экономия: ${(totalIn - totalOut).toFixed(0)} KB (−${(((totalIn - totalOut) / totalIn) * 100).toFixed(0)}%)`);

  // Write mapping file for reference
  const mapPath = path.join(__dirname, '..', 'src', 'html', 'img', 'bagets', '_mapping.json');
  fs.writeFileSync(mapPath, JSON.stringify(mapping, null, 2));
  console.log(`\n  Маппинг сохранён: ${mapPath}\n`);
}

main().catch(err => { console.error('Ошибка:', err); process.exit(1); });
