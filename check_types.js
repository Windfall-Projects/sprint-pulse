const fs = require('fs');
const ts = require('typescript');

// we want to ensure `z.infer<typeof Schema>` matches the type from database.types.ts
// we can generate a test file that asserts type equality.

const schemaFile = 'packages/shared/src/schemas/index.ts';
const schemaContent = fs.readFileSync(schemaFile, 'utf8');

// just regex to find exported schemas ending with Schema
const schemaNames = [];
const regex = /export const (\w+)Schema =/g;
let match;
while ((match = regex.exec(schemaContent)) !== null) {
  schemaNames.push(match[1]);
}

console.log('Found schemas:', schemaNames.join(', '));
