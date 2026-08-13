import * as fs from 'fs';

const schemasContent = fs.readFileSync('packages/shared/src/schemas/index.ts', 'utf-8');
const dbContent = fs.readFileSync('packages/shared/src/database.types.ts', 'utf-8');

const schemaNames = [...schemasContent.matchAll(/export const ([A-Za-z0-9_]+Schema) =/g)].map(m => m[1]);

console.log(schemaNames);
