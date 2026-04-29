#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getCommitsForPath(pkgPath) {
  try {
    const gitCmd = `git log --no-merges --pretty=format:%H%n%s%n%b%n==END== -- ${pkgPath}`;
    const out = execSync(gitCmd, { encoding: 'utf8' });
    return out.split('\n==END==\n').map(s => s.trim()).filter(Boolean);
  } catch (e) {
    return [];
  }
}

function parseCommit(raw) {
  const lines = raw.split('\n').map(l => l.replace(/\r$/, ''));
  const hash = lines[0] || '';
  const header = lines[1] || lines[0] || '';
  const body = lines.slice(2).join('\n');
  const m = header.match(/^(\w+)(?:\([^)]*\))?(!)?:\s*(.*)$/);
  const type = m ? m[1] : null;
  const breaking = Boolean(m && m[2]) || /BREAKING CHANGE|BREAKING-CHANGE|BREAKING:/i.test(body);
  const description = m ? m[3] : header;
  return { hash, header, type, description, breaking, body };
}

function bumpVersion(curr, level) {
  const parts = curr.split('.').map(n => parseInt(n, 10));
  while (parts.length < 3) parts.push(0);
  let [maj, min, pat] = parts;
  if (level === 'major') { maj += 1; min = 0; pat = 0; }
  else if (level === 'minor') { min += 1; pat = 0; }
  else if (level === 'patch') { pat += 1; }
  return `${maj}.${min}.${pat}`;
}

function analyze(commits) {
  const parsed = commits.map(parseCommit);
  let level = null; // major, minor, patch
  const groups = { feat: [], fix: [], perf: [], chore: [], docs: [], refactor: [], test: [], other: [] };
  for (const c of parsed) {
    if (c.breaking) level = 'major';
    if (!level) {
      if (c.type === 'feat') level = 'minor';
      else if (c.type === 'fix') level = 'patch';
    }
    if (groups[c.type]) groups[c.type].push(c);
    else groups.other.push(c);
  }
  return { parsed, level: level || null, groups };
}

function formatNotes(nextVersion, groups) {
  const lines = [];
  if (groups.feat.length) {
    lines.push('### Features');
    groups.feat.forEach(c => lines.push(`- ${c.description}`));
    lines.push('');
  }
  if (groups.fix.length) {
    lines.push('### Bug Fixes');
    groups.fix.forEach(c => lines.push(`- ${c.description}`));
    lines.push('');
  }
  if (groups.perf.length) {
    lines.push('### Performance');
    groups.perf.forEach(c => lines.push(`- ${c.description}`));
    lines.push('');
  }
  if (groups.other.length) {
    lines.push('### Other changes');
    groups.other.forEach(c => lines.push(`- ${c.header.split('\n')[0]}`));
    lines.push('');
  }
  if (lines.length === 0) return `### No user-facing changes\n`;
  return lines.join('\n');
}

function genChangelogEntry(version, notes) {
  const date = new Date().toISOString().split('T')[0];
  return `## ${version} (${date})\n\n${notes}\n`;
}

function runForPackage(pkgRelPath) {
  const pkgJsonPath = path.join(pkgRelPath, 'package.json');
  let pkg;
  try { pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8')); } catch (e) { pkg = { version: '0.0.0' }; }
  const commits = getCommitsForPath(pkgRelPath);
  const { parsed, level, groups } = analyze(commits);
  const recommended = level || 'no-release';
  const nextVersion = recommended === 'no-release' ? pkg.version : bumpVersion(pkg.version, recommended);
  const notes = formatNotes(nextVersion, groups);
  const changelog = genChangelogEntry(nextVersion, notes);
  return { pkg: pkgJsonPath, currentVersion: pkg.version, recommended, nextVersion, commits: parsed, notes, changelog };
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node compute-release.js packages/core');
    process.exit(2);
  }
  for (const pkg of args) {
    console.log('---');
    console.log('Package:', pkg);
    const res = runForPackage(pkg);
    console.log('Current Version:', res.currentVersion);
    console.log('Recommended bump:', res.recommended);
    console.log('Predicted nextVersion:', res.nextVersion);
    console.log('\nCommit analysis:');
    if (res.commits.length === 0) console.log('  No commits affecting this package.');
    else res.commits.forEach(c => {
      console.log(`- ${c.header.split('\n')[0]}${c.breaking ? ' [BREAKING]' : ''}`);
    });
    console.log('\nGenerated release notes:\n');
    console.log(res.notes);
    console.log('Predicted changelog entry:\n');
    console.log(res.changelog);
  }
}

main();
