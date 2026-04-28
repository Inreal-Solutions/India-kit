const fs = require('fs');
const path = require('path');
const out = path.resolve(__dirname, '..', 'dist', 'index.d.ts');
if (!fs.existsSync(out)) {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, "export * from '@india-kit/core';\n", 'utf8');
  console.log('Generated', out);
} else {
  console.log('Types already present:', out);
}
