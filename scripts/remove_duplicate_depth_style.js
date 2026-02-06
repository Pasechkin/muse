const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..", "src", "html");
const duplicate = 'style="--depth: 30px;" style="--depth: 30px;"';
const single = 'style="--depth: 30px;"';

function collectHtmlFiles(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectHtmlFiles(fullPath, results);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".html")) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = collectHtmlFiles(rootDir);
let changedFiles = 0;

for (const filePath of files) {
  const original = fs.readFileSync(filePath, "utf8");
  if (!original.includes(duplicate)) {
    continue;
  }
  const updated = original.split(duplicate).join(single);
  fs.writeFileSync(filePath, updated, "utf8");
  changedFiles += 1;
}

console.log(`Updated ${changedFiles} file(s).`);
