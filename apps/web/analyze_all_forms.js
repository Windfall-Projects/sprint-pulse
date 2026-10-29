const fs = require('fs');
const path = require('path');

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        walk(path.join(dir, file), fileList);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const files = walk('apps/web/src');
const badFiles = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  if (content.includes('formData.get(') && !content.includes('z.object')) {
    badFiles.push(file);
  }
}

console.log(badFiles);
