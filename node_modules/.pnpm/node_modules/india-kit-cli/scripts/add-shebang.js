const fs = require('fs');
const path = require('path');
const out = path.resolve(__dirname, '..', 'dist', 'bin.js');
if (fs.existsSync(out)) {
  const content = fs.readFileSync(out, 'utf8');
  if (!content.startsWith('#!')) {
    fs.writeFileSync(out, '#!/usr/bin/env node\n' + content, 'utf8');
    console.log('Shebang added to', out);
  } else {
    console.log('Shebang already present');
  }
} else {
  console.error('Built file not found:', out);
  process.exit(1);
}
