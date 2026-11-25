# 2026 JJP Design Annual — official OpenSlide workspace

This directory is an isolated workspace for the official `open-slide/open-slide` React/TypeScript framework. It does NOT invoke openslide-python, python-pptx or the legacy `jjp-presentation/build.py` renderer.

- Upstream: https://github.com/open-slide/open-slide
- Slide source: `slides/architecture-of-care-2026/index.tsx` (15 React pages)
- JJP theme: `themes/jjp-architecture.md` and `themes/jjp-architecture.demo.tsx`
- Source brief: `../projects/jjp-annual-2026/brief.json`
- Six real JJP project photographs are missing and explicitly represented by `ImagePlaceholder` from `@open-slide/core`.

## Run in Codex or any machine with network + Node 22

```sh
cd jjp-open-slide
npm install
npm run dev
# open http://localhost:5173/s/architecture-of-care-2026
# press A for Agent Panel; press C for comments.
```

For a static HTML build use `npm run build`; the output is `dist/`.
The framework's browser UI supplies PDF/PPTX export; do not use external slide generators as a substitute. Verify the UI in a browser with the slide loaded, and inspect every page before claiming completion.

## QA

- Open `/s/architecture-of-care-2026/preview?p=1` through `?p=15` at 1920×1080.
- Check Chinese explicit title line breaks, no orphan characters, and all 6 project image placeholders.
- Verify browser Agent Panel is visible by pressing `A` (authentication to an external Codex CLI is environment-dependent).
- Use the official export UI for PDF/PPTX and check the output. The built static site is HTML and may be deployed separately.
- Honor JJP ownership of images: no substituted building photography.

## Verified CI result — 2026-11-25

GitHub Actions run: https://github.com/yanchitseng-glitch/map3d-road/actions/runs/45640117848

- Installed `@open-slide/core` and built with `npm run build`: **PASS**.
- Started the official `open-slide dev` server: **PASS**.
- Inspected `/s/architecture-of-care-2026/preview?p=1..15`: **15/15 READY**; no tagged text clipping or orphan one/two-character lines.
- OpenSlide browser HTML export: **PASS**.
- OpenSlide PDF print layout captured via Chromium `printToPDF`: **PASS**, 15 pages. The framework calls `window.print()`, so a headless browser does not emit a normal download event.
- OpenSlide PPTX export: **PASS**, 15 slides, with native editable text nodes.
- Agent Panel UI and `A` shortcut: **visible** in test; an authenticated interactive Codex CLI session was **not** verified.
- Six real project photos remain missing; `ImagePlaceholder` controls are visible and intentionally require approved JJP images.

The CI run artifact includes all screenshots, exported files and the QA summary.
