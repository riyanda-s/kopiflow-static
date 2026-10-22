# Repeatable scroll motion and cinematic timing

## Scope

This revision improves the existing editorial motion layer without redesigning the site. Product records, 23 images, names, prices, availability, options, asset evidence, cart calculations and checkout implementation remain unchanged. Demo ordering remains disabled. No dependencies, deployment, commit or push were introduced.

The pre-existing local change to `package.json` (development host `0.0.0.0`) was preserved and is not part of this revision.

## Old versus new timing

| Effect | Previous | Current |
| --- | --- | --- |
| Hero headline | 800ms | 1200ms; second line delayed 120ms |
| Hero image | 1100ms | 1800ms |
| Hero CTA | 700ms after 220ms | 1100ms after 240ms |
| Scroll reveal / image fade | 650ms | 1100ms |
| Sibling stagger | 70ms, maximum 210ms | 120ms, maximum 360ms |
| Product image hover | 650ms | 450ms |
| Gallery image hover | 650ms | 650ms |
| Product dialog | 260ms | 400ms |
| Navbar / mobile menu | 240ms | 350ms |
| Button transform transition | 180ms | 450ms |

Easing remains `cubic-bezier(.22, 1, .36, 1)`. The 1400ms hero accent stays finite; there are no continuous decorative animations. Filters remain immediate. Gallery captions retain their restrained 350ms transition. Cart presentation timing and all ordering behavior are preserved.

## Observer state transitions

The old WeakSet/unobserve-on-first-entry approach is replaced by a bounded map with three phases: **armed**, **running**, **settled**. Two shared IntersectionObservers handle all reveal targets; the existing navigation observer remains separate.

- Initial targets are armed. The entry observer starts a reveal at an 8% intersection threshold, with a -24px bottom margin.
- Armed -> running adds the existing `motion-enter` class. A running or settled target ignores further entry callbacks.
- Running -> settled occurs at completion. Text never fades; only images receive the existing .75-to-1 opacity treatment.
- A genuine full vertical exit, more than 64px beyond either viewport edge, cancels any outstanding entrance and re-arms the target. The outer observer uses a +64px vertical margin. Its gap from the entry boundary is greater than the 12px reveal transform.
- Re-entry from either direction can then play a new entrance. Small threshold crossings inside the outer boundary do not re-arm the target.
- Hiding or restoring a filtered card settles it. Filtering does not count as an exit, and hidden cards cannot start an entrance. Subsequent genuine scroll exits can re-arm visible cards normally.
- A target containing the active control, or under an appropriate hover pointer, skips its new entrance. Keyboard-visible focus settles an in-flight reveal without changing focus or tab order.
- On persisted `pageshow`, visible content settles while genuinely offscreen targets re-arm. History restoration does not construct duplicate observers.
- Reduced-motion changes disconnect both reveal observers and settle presentation. Returning to normal motion reuses the same observers, keeps visible content stable, and re-arms offscreen content.

No scroll listener, animation loop, per-card observer, animation library, hidden pending state, persistent `will-change`, or layout-property animation was added. The map holds only the fixed page targets; observer instances are reused.

## Accessibility and input safeguards

Content remains visible outside the viewport, before initialization, without JavaScript, and without IntersectionObserver. Disclaimers retain full opacity and contrast. Hover effects are optional and gated by pointer capability. Native dialog semantics, keyboard focus, Escape, reduced motion and mobile navigation remain intact.

The previous active-button scale of .97 could shrink a 44px target to 42.68px. It is replaced by an inset press indicator that preserves target dimensions. A held-pointer browser test measures the real pressed rectangle against the unchanged 44px minimum. Dialog animation remains translation-only. No accessibility assertions were removed or thresholds weakened.

## Changed files

- `src/scripts/motion.ts`: repeatable state machine, full-exit hysteresis, filter cancellation, preference changes and page restoration.
- `src/styles/motion.css`: requested timing changes and non-shrinking press feedback.
- `tests/e2e/motion.spec.ts`: bidirectional replay, boundary jitter, restored-page replay, pressed target dimensions and revised timing captures.
- `MOTION-EXPERIENCE-REPORT.md`: this revision report.

## Browser evidence

Evidence is generated locally under ignored `qa-artifacts/motion-repeat/` and `test-results/`. At each of 320, 390, 768, 1024, 1440 and 1920 CSS px, desktop and mobile Chromium projects exercise initial downward entry, a complete exit above the viewport, upward re-entry, tiny threshold crossings without replay, a complete exit below the viewport, and downward re-entry. Tests count actual `kf-reveal` animation-start events, then test filtering, pointer/touch, keyboard, dialogs, cart feedback and back/forward restoration.

Hero screenshots seek real CSS animations to 0ms, 600ms and 2200ms for deterministic initial/middle/settled comparisons. Scroll replay screenshots and WebM recordings run with native timing. The six rendered comparison sheets were opened and inspected; hero crops, story text, sticky navigation and responsive composition remain intact. Separate selection, benefits, gallery, visit, menu and cart evidence is captured by the existing matrix.

## Preserved behavior and limits

The catalogue/configuration/storefront/assets/evidence preservation check (`git diff --exit-code HEAD -- src/data src/config src/scripts/storefront.ts src/utils public assets/evidence ASSET-LICENSES.md`) passes. The build still contains 39 intended static files, including seven HTML pages; no backend or runtime service was added. `git diff --check` passes. QA screenshots, recordings, `test-results/`, `.env` and `dist/` remain ignored.

Replay deliberately requires a full exit beyond the 64px buffer. A section that remains partially visible, or leaves by only a few pixels, stays settled. A hovered/focused target skips its entrance to protect the active interaction. Filtering restores cards visibly without replaying their entrance; a later genuine scroll cycle can animate them again.

History tests use actual back/forward navigation plus an explicit persisted-pageshow event to exercise restoration handling. They do not establish that every tested history transition used the browser back-forward cache. No-JavaScript content/navigation stays readable; search, customization and the client-side cart continue to require JavaScript, as disclosed by the existing menu notice.

Mobile testing uses Chromium emulation, not physical Android/iOS devices. Safari/Firefox and real-device frame rates were not measured. Local Lighthouse measurements are single-run simulated-mobile lab results, not field Core Web Vitals or an INP guarantee. The intentional fictional-demo `noindex` policy remains unchanged.

The public demo is not updated by these changes. No deployment, commit, push, real WhatsApp message or external-account operation was performed.

## Final regression

Validated locally on 22?23 October 2026. All required commands pass; no test was skipped or accessibility assertion removed.

| Command | Actual final result |
| --- | --- |
| `npm run check` | 53 files; zero errors, warnings or hints |
| `npm run lint` | Passed |
| `npm test` | 51 tests across 3 files passed |
| `npm run test:e2e` | All 60 tests passed, desktop and mobile Chromium, 6.0 minutes |
| `npm run build` | Passed; seven HTML pages plus sitemap, robots, headers and assets; static output |
| `npm run test:client` | Passed; config/data-only customer fixture, pricing, cart retention and decoded QR; popup stub prevents real messages |
| `npm audit` | Zero vulnerabilities reported |

The earlier full 58-test run also passed. The final run includes the additional pressed-target test in both projects and extended restored-page replay checks. Initial sandbox process-spawn failures were rerun with permission; an initial typecheck collision with `window.stop` was corrected by naming the helper `settleTarget`.

| CSS viewport | Desktop down / up / down | Touch-emulated down / up / down | Boundary jitter |
| --- | --- | --- | --- |
| 320px | Passed | Passed | No extra starts |
| 390px | Passed | Passed | No extra starts |
| 768px | Passed | Passed | No extra starts |
| 1024px | Passed | Passed | No extra starts |
| 1440px | Passed | Passed | No extra starts |
| 1920px | Passed | Passed | No extra starts |

All twelve `states.json` files record exactly two measured replay starts after the initial entrance, with no boundary-jitter replay. Actual history restoration also permits a subsequent entrance. Filtered cards have no stale entrance class; restored cards do not replay merely because their filter changed. Reduced-motion configurations have no active presentation animations; no-JavaScript and missing-observer configurations keep content and navigation visible. Existing axe AA checks, responsive long-copy alignment, overflow, search, product customization, totals, persistence, QR and demo restrictions pass.

Evidence index:

- `qa-artifacts/motion-repeat/{desktop,mobile}/{width}/`: hero states, upward/downward story replay, settled sections, interactions and `states.json`.
- `qa-artifacts/motion-repeat/comparisons/{width}.png`: six-width hero/replay comparison sheets, inspected as rendered images.
- `qa-artifacts/motion-repeat/recordings/`: twelve six-width project recordings and extracted representative 390px mobile / 1440px desktop contact sheets, inspected visually. Videos use a fixed 960x700 recording canvas and may contain letterboxing; screenshots preserve the requested CSS viewport.
- `test-results/`: original Playwright WebM attachments.

## Performance and release decision

The saved before/after production-preview Lighthouse runs use the same simulated-mobile configuration, with the final measurement taken after the browser regression finished. Full reports and environment/settings are in `qa-artifacts/motion-repeat/before/` and `after/`.

| Measurement | Before | After |
| --- | --- | --- |
| Performance, both routes | 100 | 100 |
| Accessibility, both routes | 100 | 100 |
| Best Practices, both routes | 100 | 100 |
| SEO, both routes | 69 | 69 |
| Home LCP | 1440ms | 1444ms |
| Menu LCP | 1459ms | 1228ms |
| Home Total blocking time | 73ms | 71ms |
| Menu Total blocking time | 30ms | 0ms |
| Home CLS | 0 | 0 |
| Menu CLS | 0 | 0 |

The intentional demo `noindex` explains the unchanged SEO limitation. No SEO 90 claim is made. These single-run differences include normal lab variability and do not prove a causal speed improvement. Both LCP measurements remain below the 2.5-second lab target, and measured CLS remains zero. No field INP, physical-device FPS or real-user Core Web Vitals were collected.

Final delivered bundles: JavaScript 27,226 bytes / 10,111 gzip; CSS 52,645 bytes / 11,858 gzip (`qa-artifacts/motion-repeat/bundle-sizes.json`). Replay adds an exit observer and bounded state bookkeeping without continuous scroll work, extra dependencies or permanent compositing hints. Only currently intersecting, armed targets start a reveal; offscreen running entrances are cancelled on full exit.

**GO for the local motion demo and client presentation in the tested configurations.** Repeat animation works in both scroll directions at all six widths, all required regressions pass, and no local release blocker was found. Remaining validation is real-device and Safari/Firefox testing; it is not represented as completed. Public deployment remains a separate, explicitly authorized action. This work does not change the existing live demo or enable real checkout.
