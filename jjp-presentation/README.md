# JJP Presentation

This repository's default presentation workflow produces a matching 16:9 deck
in self-contained HTML, PDF and PPTX. The same frame definitions place assets
and text in each format. PPTX text, rules and image positions remain editable.

## Run

Use Python 3.10+ with Pillow and python-pptx. The PDF and page previews use
LibreOffice, Poppler (`pdfinfo` and `pdftoppm`), and Fontconfig (`fc-match`).
Use Noto Sans CJK TC and Noto Serif CJK TC for consistent Traditional Chinese
and English output. The installed environment can be used directly:

```sh
/workspace/.openslide-venv/bin/python jjp-presentation/build.py path/to/brief.json path/to/new-output
```

On another machine, select its equivalent prepared Python executable.
OpenSlide and its native library are needed only for compatible whole-slide
assets. OpenSlide is an image reader. LibreOffice renders the editable PPTX
to PDF. HTML shares the deck's layout geometry and embeds its images, with
fonts resolved locally in the viewer's browser.

The output directory must be new. The renderer creates `presentation.html`,
`presentation.pdf`, `presentation.pptx`, and `preview/`. A failed export
does not publish a partial deck. The build checks and renders every PDF page.
Complete the accompanying visual review checklist separately.

## Receive a brief from ChatGPT

Place the UTF-8 JSON and image files in one project directory. Use
[example.json](example.json) as a complete field reference. Replace its sample
asset paths with the supplied files. Ask ChatGPT to return the approved slide
order, the selected layout per page, the final page copy in the requested
language, and a file mapping with captions and alt text. Consolidate copy to
fit the selected layout instead of shrinking a crowded page.

The top level requires `title` and a nonempty `slides` array. Set
`language` to `zh-Hant` or `en`. Both scripts may appear in the same deck.
Every slide requires `layout` and `title`. Use standard JSON strings for text.
A newline sets a manual line break. The builder also wraps text using Traditional
Chinese font metrics for Han text and preserves Latin words.

| Layout | Additional fields |
| --- | --- |
| `cover` | Optional `body`, such as project name and presentation date |
| `section` | Optional `body`, such as the scope of the next chapter |
| `photography` | `image` and optional `body` |
| `essay` | `blocks` with one or two objects containing `heading` and `body` |
| `drawing` | `image` and optional `body` |
| `evolution` | `stages` with two or three objects containing `heading`, `image` and optional `body` |
| `comparison` | Two `options` headings and one to four `rows` of `[criterion, option A, option B]` |
| `closing` | Optional `body` for the conclusion or next decision |

Each image accepts `path` relative to the brief, `alt`, and optional `fit`.
Photography and drawing accept a visible `caption`. Add source or credit there
when needed. For evolution, place the source or note in the stage's `body`.
Only photography accepts `fit: "cover"`. Every drawing uses `contain`, keeps
its aspect ratio to the limits of pixel rounding and embeds the full sheet. For
a PDF drawing, supply a full-page, high-resolution PNG for each sheet while
retaining the source PDF separately. Do not trim the exported sheet margins.

Standard images use Pillow. For an OpenSlide-compatible TIFF or other supported
whole-slide file, set `reader: "openslide"` to use a full-slide thumbnail.
Use the standard reader for original architectural sheets to retain their
full pixel resolution. Neither reader writes to the source asset.

## Check the result

Open the HTML and walk through all pages. Inspect every PNG in `preview/` at
full scale, checking comparison alignment, font fallback, spacing and image
bounds. Compare each drawing with its original, including annotations and
sheet edges. PDF previews also check the exported PPTX as rendered by
LibreOffice. Retest in Microsoft PowerPoint when exact Office rendering is a
delivery requirement.
