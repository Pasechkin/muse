const fs = require('fs');
const path = require('path');
const { optimize } = require('svgo');

const rootDir = process.argv[2] || path.join('src', 'html');
const excludeFiles = new Set(['icons_new.html', 'social-icons-demo.html']);
const excludeDirs = new Set(['css', 'js', '_drafts', '_draft', 'draft', 'reports']);

const svgRegex = /<svg\b[^>]*>[\s\S]*?<\/svg>/gi;
const svgoConfig = {
  multipass: true,
  plugins: ['preset-default']
};

function walk(dir, files) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (excludeDirs.has(entry.name)) {
        continue;
      }
      walk(path.join(dir, entry.name), files);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const filePath = path.join(dir, entry.name);
    if (path.extname(filePath) !== '.html') {
      continue;
    }

    if (excludeFiles.has(path.basename(filePath))) {
      continue;
    }

    files.push(filePath);
  }
}

function optimizeInlineSvgs(html) {
  let count = 0;
  let hadError = false;
  const updated = html.replace(svgRegex, (match) => {
    count += 1;
    try {
      const result = optimize(match, svgoConfig);
      if (result.error) {
        hadError = true;
        return match;
      }
      return result.data;
    } catch (error) {
      hadError = true;
      return match;
    }
  });

  return { updated, count, hadError };
}

const htmlFiles = [];
walk(rootDir, htmlFiles);

let filesChanged = 0;
let svgsOptimized = 0;
let filesWithErrors = 0;

for (const filePath of htmlFiles) {
  const original = fs.readFileSync(filePath, 'utf8');
  if (!svgRegex.test(original)) {
    continue;
  }

  svgRegex.lastIndex = 0;
  const { updated, count, hadError } = optimizeInlineSvgs(original);

  if (hadError) {
    filesWithErrors += 1;
  }

  if (updated !== original) {
    fs.writeFileSync(filePath, updated, 'utf8');
    filesChanged += 1;
    svgsOptimized += count;
  }
}

console.log(`Optimized inline SVGs in ${filesChanged} file(s).`);
console.log(`Total SVGs processed: ${svgsOptimized}.`);
if (filesWithErrors > 0) {
  console.log(`Files with optimization errors: ${filesWithErrors}.`);
}
