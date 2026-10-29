const fs = require('fs');

const file = fs.readFileSync('packages/shared/src/schemas/index.ts', 'utf8');

function findSchema(name) {
  const match = file.match(new RegExp(`export const ${name} = z\\.object\\(\\{([\\s\\S]*?)\\}\\);`));
  if (match) {
    return match[1].trim();
  }
  return 'Not found';
}

console.log('--- AccountSchema ---');
console.log(findSchema('AccountSchema'));
