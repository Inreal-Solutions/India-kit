# Releasing india-kit packages

Recommended strategy:

- Use Conventional Commits for commit messages to enable automated changelog and semantic releases.
- Use `release-please` or `semantic-release` in CI to publish packages and create GitHub releases.
- Keep each package semantically versioned. Use a single-source release (monorepo) approach where a single change can bump multiple package versions.

Quick local publish steps (for a package):

1. Build:

```bash
pnpm --filter @india-kit/core build
pnpm --filter india-kit build
```

2. Verify `dist/` contains `cjs/` and `esm/` outputs and `index.d.ts`.
3. Publish:

```bash
cd packages/core
npm publish --access public
```

CI: configure GitHub Actions to run `pnpm -w build` then use release tool to publish artifacts to registries.
