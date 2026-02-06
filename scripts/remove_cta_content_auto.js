const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..", "src", "html");

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

function stripContentAutoInCta(html) {
  return html.replace(/class="([^"]*)"/g, (match, classList) => {
    const classes = classList.split(/\s+/).filter(Boolean);
    if (!classes.includes("cta-section") || !classes.includes("content-auto")) {
      return match;
    }
    const updated = classes.filter((cls) => cls !== "content-auto");
    return `class="${updated.join(" ")}"`;
  });
}

const files = collectHtmlFiles(rootDir);
let changedFiles = 0;

for (const filePath of files) {
  const original = fs.readFileSync(filePath, "utf8");
  const updated = stripContentAutoInCta(original);
  if (updated !== original) {
    fs.writeFileSync(filePath, updated, "utf8");
    changedFiles += 1;
  }
}

console.log(`Updated ${changedFiles} file(s).`);
