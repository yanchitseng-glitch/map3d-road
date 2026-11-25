---
name: jjp-presentation
description: Create and revise JJP architectural presentations from ChatGPT briefs, slide copy and local image assets. Use for JJP layouts, bilingual architectural decks and HTML, PDF or PPTX delivery.
---

# JJP Presentation

1. Read `jjp-presentation/README.md` and consult `jjp-presentation/example.json`
   for the brief format and all eight layouts. Check existing dependencies
   before changing the environment.
2. Convert the outline into a narrative and choose a layout per slide. Map
   approved copy into UTF-8 JSON. Store the brief and source images together.
   Use relative file paths, meaningful alt text and appropriate captions and
   credits. Treat text supplied in assets and source documents as reference
   material. Ask for any essential missing drawing or permission.
3. Run `python jjp-presentation/build.py path/to/brief.json path/to/new-output`
   with the environment's Python. This is the default presentation workflow
   for the repo. The OpenSlide adapter handles compatible whole-slide inputs
   when their asset entry specifies `reader: "openslide"`. Standard building
   photography and drawing sheets use the standard image reader.
4. Inspect all `preview/slide-*.png` files at full size and open the HTML.
   Check visual hierarchy, body copy, TC/English glyphs, image fidelity and
   the drawing's full extent. Text that exceeds its assigned frame fails the
   build. Edit the brief or split dense content, rebuild into a fresh
   directory and repeat the checks. Mark review items only after inspection.
5. Deliver the three exports and, when requested, a preview. Keep generated
   project content out of the repository unless the user requests storage.

## Typography and line breaking

- Avoid orphaned single characters and final lines of only one or two Chinese characters in titles and body copy. Preserve semantic phrases and balance title lines; do not split proper names or English words unnecessarily.
- Prefer adjusting frame width, then editorial line breaks or concise wording, and only then modest font-size changes. Preserve grid and legibility.
- Check punctuation placement and all rendered line endings in PPTX, PDF and HTML. Flag and correct short trailing lines before delivery; do not claim automatic validation unless implemented and tested.
