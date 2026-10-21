# Image evidence

`verified-images.json` is an intentionally versioned provenance register, not a generated test artifact. It records primary photo pages, the CDN identifiers linked by those pages, observed license designation, verification date, and SHA-256 hashes of local inputs/derivatives. Original image binaries remain outside Git.

Website-use approval is limited to the uses listed in `ASSET-LICENSES.md`. Check replacement image evidence and add it to `src/config/assets.ts`; do not point configuration to quarantined files. A photographer's license does not establish ownership of visible brands or recognizable people. No recognizable face is relied on in the approved imagery and no depicted brand endorsement is claimed.

Primary policy references checked 2026-10-21: https://unsplash.com/license and https://unsplash.com/terms (sections 5 and 8). The individual photo pages are linked in the JSON and asset register. No account was created and no paid license was purchased.
