const fs = require('fs');
const path = require('path');
const out = path.resolve(__dirname, '..', 'dist', 'index.d.ts');
const coreDts = path.resolve(__dirname, '..', '..', 'core', 'dist', 'index.d.ts');

if (fs.existsSync(coreDts)) {
  const content = fs.readFileSync(coreDts, 'utf8');
  fs.writeFileSync(out, content, 'utf8');
  console.log('Inlined core types into', out);
} else {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, "export * from '@india-kit/core';\n", 'utf8');
  console.log('Fallback: generated re-export types at', out);
}
