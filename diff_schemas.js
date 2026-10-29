const fs = require('fs');
const ts = require('typescript');

const code = fs.readFileSync('test_type_eq.ts', 'utf8');

const program = ts.createProgram(['test_type_eq.ts'], {
  noEmit: true,
  target: ts.ScriptTarget.ES2015,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  allowImportingTsExtensions: true,
  lib: ["lib.es2015.d.ts"]
});
const checker = program.getTypeChecker();
const sourceFile = program.getSourceFile('test_type_eq.ts');

function findTypeAliases(node) {
  const aliases = [];
  function visit(node) {
    if (ts.isTypeAliasDeclaration(node) && node.name.text.endsWith('Equal')) {
      aliases.push(node);
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return aliases;
}

const aliases = findTypeAliases(sourceFile);

aliases.forEach(alias => {
  // node structure: type X = Expect<Equal<T1, T2>>
  if (alias.type.typeArguments && alias.type.typeArguments.length > 0) {
    const equalNode = alias.type.typeArguments[0];
    if (equalNode.typeArguments && equalNode.typeArguments.length === 2) {
      const type1 = checker.getTypeFromTypeNode(equalNode.typeArguments[0]);
      const type2 = checker.getTypeFromTypeNode(equalNode.typeArguments[1]);

      const str1 = checker.typeToString(type1, undefined, ts.TypeFormatFlags.NoTruncation);
      const str2 = checker.typeToString(type2, undefined, ts.TypeFormatFlags.NoTruncation);

      if (str1 !== str2) {
        console.log(`Mismatch in ${alias.name.text}:`);
        console.log(`Zod: ${str1}`);
        console.log(`DB:  ${str2}`);
        console.log('---');
      }
    }
  }
});
