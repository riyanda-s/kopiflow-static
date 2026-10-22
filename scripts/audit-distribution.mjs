import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { gzipSync } from 'node:zlib';
async function files(root, prefix = '') {
  const entries = await readdir(`${root}/${prefix}`, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? files(root, `${prefix}${entry.name}/`) : `${prefix}${entry.name}`))).flat();
}
const publicFiles = await files('public');
const builtFiles = await files('dist');
const routes = ['index.html', '404.html', 'about/index.html', 'menu/index.html', 'visit/index.html', 'qr/index.html', 'privacy/index.html', 'robots.txt', 'sitemap.xml'];
const unexpected = builtFiles.filter(file => !publicFiles.includes(file) && !routes.includes(file) && !/^_astro\/[\w.-]+\.(css|js)$/.test(file));
assert.deepEqual(unexpected, [], 'Unexpected files in production distribution');
const forbidden = builtFiles.filter(file => /(?:^|\/)(?:\.env|\.git|src|tests|qa-artifacts|assets|node_modules)(?:[/.]|$)|\.(?:map|md|ts|astro)$/.test(file));
assert.deepEqual(forbidden, [], 'Private source, documentation or source maps were published');
for (const file of builtFiles.filter(file => /\.(?:html|js|css|txt|xml)$/.test(file))) {
  const text = await readFile(`dist/${file}`, 'utf8');
  assert.ok(!/sourceMappingURL|github\.com\/riyanda-s|-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----|(?:ghp_|github_pat_)[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}/.test(text), `Exposed source map, repository URL or credential signature in ${file}`);
}
assert.deepEqual(await readFile('dist/_headers'), await readFile('public/_headers'));
const preserved = execFileSync('git', ['diff', '--name-only', 'HEAD', '--', 'src/data', 'src/config/assets.ts', 'src/config/business.ts', 'src/scripts', 'src/utils', 'public', 'assets/evidence', 'ASSET-LICENSES.md'], { encoding: 'utf8', windowsHide: true }).trim();
assert.equal(preserved, '', 'Protected business data, logic or asset evidence changed');
const assets = await Promise.all(publicFiles.map(async file => ({ file, sha256: createHash('sha256').update(await readFile(`public/${file}`)).digest('hex') })));
const bundles = await Promise.all(builtFiles.filter(file => /^_astro\/.+\.(js|css)$/.test(file)).map(async file => { const bytes = await readFile(`dist/${file}`); return { file, bytes: bytes.length, gzipBytes: gzipSync(bytes).length }; }));
const report = { generatedAt: new Date().toISOString(), builtFiles, unexpected, forbidden, sourceMaps: 0, credentialSignatureMatches: 0, protectedFilesUnchangedFromHEAD: true, headersPreserved: true, assets, bundles, caveat: 'Signature scanning is not proof that arbitrary secrets never existed; only intended public files are allowed. Repository visibility requires authenticated verification.' };
await mkdir('qa-artifacts/premium', { recursive: true });
await writeFile('qa-artifacts/premium/distribution-audit.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify({ files: builtFiles.length, unexpected, forbidden, protectedFilesUnchangedFromHEAD: true, bundles }, null, 2));
