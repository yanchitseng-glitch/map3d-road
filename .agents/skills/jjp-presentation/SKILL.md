---
name: jjp-presentation
description: Create JJP architectural presentations using the official open-slide React framework.
---

# JJP Presentation — OpenSlide

Mandatory upstream: https://github.com/open-slide/open-slide. Do not install the unrelated openslide-python image reader or use python-pptx as the presentation engine.

1. Verify upstream README and current official docs https://open-slide.dev/docs. From repository root scaffold an isolated workspace using `npx @open-slide/cli init jjp-open-slide` if it does not already exist; follow generated instructions and bundled skills. Do not overwrite the road application or an existing workspace.
2. Use bundled create-theme and create-slide skills to implement JJP theme and decks as React pages on the official 1920 × 1080 canvas. Use warm paper #F4F2EB, ink #242824, olive #566449, rules #C4C8B9, Noto Serif TC display and Noto Sans TC body. Use editorial grid, generous margins, image-led pages, essays, full drawing sheets, evolution diagrams, comparison, cover and closing. Preserve complete drawing sheets and credits.
3. For Chinese typography, use semantic phrase wrapping and balanced line lengths; no isolated Chinese character or final line of one or two Chinese characters. Adjust width, copy and then font size. Verify actual rendered line boxes after fonts load; inspect all pages and correct overflow or orphan lines.
4. For the first deck use projects/jjp-annual-2026/brief.json. Create 15 React slides, six explicitly labeled image placeholders if assets are missing, and original conceptual diagrams. Never substitute unrelated architecture photos.
5. Run the official dev server and use the upstream documented export commands for HTML/PDF/PPTX. Check actual outputs and each rendered slide, including typography; report unsupported export features. Use Agent Panel (A) with Codex CLI where available and comment mode (C) for revisions. Do not claim install, render or export success without evidence.
6. Keep old Python files for reference only. Preserve source and assets; do not publish confidential material. Record commands and results.
