# india-kit — The Definitive Indian Dev Toolkit

Monorepo scaffold for the india-kit project. This workspace contains a TypeScript core package, a small JS wrapper, and a CLI prototype. It includes two identity validators (PAN and Aadhaar) as a starting point.

Quick start (requires pnpm):

```bash
pnpm install
pnpm run build
node packages/cli/dist/bin.js validate pan ABCDE1234F
node packages/cli/dist/bin.js validate aadhaar 234512345123
```
