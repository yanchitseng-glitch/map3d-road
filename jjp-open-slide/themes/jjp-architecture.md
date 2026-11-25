---
name: JJP Architectural Editorial
description: Warm-paper architectural publication style for JJP annuals, competitions and design lectures.
mode: light
---

# JJP Architectural Editorial

## Palette

| Role | Value | Use |
| --- | --- | --- |
| bg | `#F4F2EB` | Warm paper |
| text | `#242824` | Editorial ink |
| accent | `#566449` | Olive-green reference |
| muted | `#8E9786` | Secondary captions |
| rule | `#C4C8B9` | Fine hairlines |
| panel | `#E6E8DE` | Reserved image slots |

## Typography

- Display: `"Noto Serif CJK TC", "Noto Serif TC", "Songti TC", serif` — elegant editorial headlines, semibold.
- Body: `"Noto Sans CJK TC", "Noto Sans TC", "PingFang TC", sans-serif` — Chinese and bilingual annotations.
- Hero title: 148 px; essay headline 86–100 px; body 28–36 px; eyebrow 22–27 px.
- Never strand a final Chinese character or an extremely short final line. Author explicit semantic lines with enough width for the font.

## Layout

- Native OpenSlide canvas: 1920 × 1080, fixed-size React pages.
- Content margin 120 px, top hairline at y=114, footer at y=1025.
- Alternate restrained essays, visual diagrams and building image-led case pages.
- Drawing sheets must remain whole, with legends and scales intact.
- Empty building images must be replaced only by approved JJP originals; use OpenSlide `ImagePlaceholder` controls until supplied.

## Fixed components

Use the `Frame`, `Footer`, `Head` and `Mark` components from `slides/architecture-of-care-2026/index.tsx` as paste-ready references when authoring another JJP deck. The project uses `useSlidePageNumber()` rather than hard-coded page numbers.

## Motion

Static. Avoid animation while architectural drawing or detailed comparison is being explained.

## Aesthetic

Calm architectural editorial rather than corporate template: serif Chinese titles, fine olive rules, deliberate line breaks, warm paper. No decorative stock images, fake building renders, excessive graphic embellishment or tiny copy.

## Example usage

```tsx
const Sample: Page = () => (
  <Frame eyebrow="DESIGN CONCEPT">
    <div style={{ position: 'absolute', left: 120, top: 290 }}>
      <Head lines={['關係的建築']} size={148} />
    </div>
  </Frame>
);
```
