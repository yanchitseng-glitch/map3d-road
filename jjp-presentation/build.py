"""Build a 16:9 JJP presentation from a UTF-8 JSON brief."""
import argparse
import base64
import html
import io
import json
import math
import re
import shutil
import subprocess
import tempfile
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageFont, ImageOps
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml.xmlchemy import OxmlElement
from pptx.util import Emu, Pt

THEME = json.loads(Path(__file__).with_name("theme.json").read_text())
WIDTH, HEIGHT = THEME["size"]
MARGIN = THEME["margin"]
RIGHT = WIDTH - MARGIN
PX = 9525
LABELS = {
    "cover": ("封面", "Cover"),
    "section": ("章節", "Section"),
    "photography": ("建築攝影", "Architecture"),
    "essay": ("設計論述", "Design statement"),
    "drawing": ("建築圖面", "Drawings"),
    "evolution": ("概念演變", "Design evolution"),
    "comparison": ("方案比較", "Options"),
    "closing": ("結語", "Closing"),
}


def command(*args):
    return subprocess.run(args, check=True, text=True, capture_output=True).stdout


def require_text(value, name):
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{name} must be a nonempty string")
    return value


@dataclass
class Frame:
    kind: str
    x: int
    y: int
    w: int
    h: int
    value: object
    size: int = 0
    family: str = ""
    alt: str = ""


class Deck:
    def __init__(self, spec, root):
        self.title = require_text(spec.get("title"), "title")
        self.language = spec.get("language", "zh-Hant")
        if self.language not in ("zh-Hant", "en"):
            raise ValueError("language must be zh-Hant or en")
        self.root = root
        self.fonts = {}
        self.pages = []
        slides = spec.get("slides")
        if not isinstance(slides, list) or not slides:
            raise ValueError("slides must be a nonempty array")
        for index, slide in enumerate(slides, start=1):
            try:
                self.pages.append(self.layout(slide, index))
            except (KeyError, TypeError, ValueError, OSError) as error:
                raise ValueError(f"Slide {index}: {error}") from error

    def font(self, family, size):
        key = family, size
        if key not in self.fonts:
            path, index, families = command(
                "fc-match", "-f", "%{file}\n%{index}\n%{family}", family
            ).splitlines()
            if family not in families.split(","):
                raise ValueError(f"Required font unavailable: {family}")
            self.fonts[key] = ImageFont.truetype(path, size, index=int(index))
        return self.fonts[key]

    def text(self, frames, value, x, y, w, h, size, role="body"):
        family = THEME["display" if role == "display" else "body"]
        font = self.font(family, size)
        lines = []
        # Keep Latin words intact and permit line breaks between CJK characters.
        for paragraph in require_text(value, "text").split("\n"):
            line = ""
            for token in re.findall(r"[\u2e80-\u9fff\uf900-\ufaff]|[^\s\u2e80-\u9fff\uf900-\ufaff]+|[ \t]+", paragraph):
                if font.getlength(line + token) > w * 0.94 and line.strip():
                    lines.append(line.rstrip())
                    line = ""
                if token.strip() or line:
                    line += token
                if font.getlength(line) > w * 0.94:
                    raise ValueError(f"Text token exceeds its column width: {token!r}")
            lines.append(line.rstrip())
        step = math.ceil(size * 1.32)
        if len(lines) * step > h:
            raise ValueError(f"Text exceeds its {w} × {h} frame: {value[:72]!r}")
        for i, line in enumerate(lines):
            if line:
                frames.append(Frame(role, x, y + i * step, w, step, line, size, family))

    def asset(self, frames, source, x, y, w, h, *, allow_crop=False):
        path = (self.root / require_text(source.get("path"), "asset.path")).resolve()
        if not path.is_relative_to(self.root) or not path.is_file():
            raise ValueError(f"Asset must be a file inside the brief directory: {path.name}")
        alt = require_text(source.get("alt"), "asset.alt")
        fit = source.get("fit", "contain")
        if fit not in ("contain", "cover") or (fit == "cover" and not allow_crop):
            raise ValueError("Only photography permits an explicit cover crop")
        if source.get("reader", "standard") == "openslide":
            import openslide

            with openslide.OpenSlide(str(path)) as slide:
                image = slide.get_thumbnail((2400, 2400))
        elif source.get("reader", "standard") == "standard":
            with Image.open(path) as original:
                if getattr(original, "n_frames", 1) != 1:
                    raise ValueError("Provide each drawing sheet as a separate image")
                image = ImageOps.exif_transpose(original).copy()
        else:
            raise ValueError("asset.reader must be standard or openslide")
        if fit == "cover":
            image = ImageOps.fit(image, (w * 2, h * 2), Image.Resampling.LANCZOS)
        else:
            ratio = min(w / image.width, h / image.height)
            iw, ih = max(1, round(image.width * ratio)), max(1, round(image.height * ratio))
            x, y, w, h = x + (w - iw) // 2, y + (h - ih) // 2, iw, ih
        buffer = io.BytesIO()
        image.convert("RGBA").save(buffer, format="PNG")
        frames.append(Frame("image", x, y, w, h, buffer.getvalue(), alt=alt))

    def layout(self, slide, index):
        kind = slide["layout"]
        label = LABELS[kind][self.language == "en"]
        title = require_text(slide.get("title"), "slide.title")
        frames = [
            Frame("rule", MARGIN, 78, RIGHT - MARGIN, 1, THEME["rule"]),
            Frame("rule", MARGIN, 657, RIGHT - MARGIN, 1, THEME["rule"]),
        ]
        self.text(frames, label, MARGIN, 41, 450, 24, 15, "accent")
        self.text(frames, f"{index:02d}", RIGHT - 45, 669, 45, 23, 15, "accent")

        def text(value, x, y, w, h, size, role="body"):
            self.text(frames, value, x, y, w, h, size, role)

        def optional(value, *args):
            if value:
                text(value, *args)

        if kind in ("cover", "section", "closing"):
            title_size = {"cover": 91, "section": 70, "closing": 63}[kind]
            text(title, MARGIN, 164, RIGHT - MARGIN, 255, title_size, "display")
            optional(slide.get("body"), MARGIN, 470, 920, 145, 28)
        elif kind in ("photography", "drawing"):
            asset = slide["image"]
            if kind == "photography":
                self.asset(frames, asset, MARGIN, 106, 807, 518, allow_crop=True)
                text(title, 912, 117, 296, 112, 37, "display")
                optional(slide.get("body"), 912, 243, 296, 218, 23)
                optional(asset.get("caption"), 912, 543, 296, 80, 17, "accent")
            else:
                text(title, MARGIN, 116, 308, 125, 43, "display")
                optional(slide.get("body"), MARGIN, 258, 306, 230, 22)
                optional(asset.get("caption"), MARGIN, 527, 310, 96, 17, "accent")
                self.asset(frames, asset, 414, 105, 794, 522)
        elif kind == "essay":
            text(title, MARGIN, 159, 566, 305, 56, "display")
            blocks = slide["blocks"]
            if not isinstance(blocks, list) or not 1 <= len(blocks) <= 2:
                raise ValueError("essay requires one or two blocks")
            for i, block in enumerate(blocks):
                top = 156 + i * 221
                frames.append(Frame("rule", 693, top, 515, 1, THEME["rule"]))
                text(block["heading"], 693, top + 19, 515, 69, 25, "accent")
                text(block["body"], 693, top + 94, 515, 123, 22)
        elif kind == "evolution":
            text(title, MARGIN, 105, 1136, 124, 43, "display")
            stages = slide["stages"]
            if not isinstance(stages, list) or not 2 <= len(stages) <= 3:
                raise ValueError("evolution requires two or three stages")
            gap = 32
            width = (RIGHT - MARGIN - gap * (len(stages) - 1)) // len(stages)
            for i, stage in enumerate(stages):
                x = MARGIN + i * (width + gap)
                self.asset(frames, stage["image"], x, 232, width, 248)
                frames.append(Frame("rule", x, 499, width, 1, THEME["rule"]))
                text(f"{i + 1:02d}  {stage['heading']}", x, 512, width, 63, 22, "display")
                optional(stage.get("body"), x, 580, width, 64, 16)
        else:
            text(title, MARGIN, 105, 1136, 112, 43, "display")
            options, rows = slide["options"], slide["rows"]
            if not isinstance(options, list) or len(options) != 2:
                raise ValueError("comparison requires two option headings")
            if not isinstance(rows, list) or not 1 <= len(rows) <= 4:
                raise ValueError("comparison requires one to four rows")
            for x, option in zip((342, 776), options):
                text(option, x, 221, 414, 74, 27, "display")
            for i, row in enumerate(rows):
                if not isinstance(row, list) or len(row) != 3:
                    raise ValueError("Each comparison row requires [criterion, option A, option B]")
                y = 300 + i * 79
                frames.append(Frame("rule", MARGIN, y, RIGHT - MARGIN, 1, THEME["rule"]))
                for x, width, value, role in zip(
                    (MARGIN, 342, 776), (230, 410, 420), row, ("accent", "body", "body")
                ):
                    text(value, x, y + 11, width, 64, 21, role)
            frames.append(Frame("rule", MARGIN, 300 + len(rows) * 79, RIGHT - MARGIN, 1, THEME["rule"]))
        return title, frames

    def pptx(self, destination):
        deck = Presentation()
        deck.core_properties.title = self.title
        deck.slide_width, deck.slide_height = Emu(WIDTH * PX), Emu(HEIGHT * PX)
        for title, frames in self.pages:
            slide = deck.slides.add_slide(deck.slide_layouts[6])
            slide.background.fill.solid()
            slide.background.fill.fore_color.rgb = rgb(THEME["paper"])
            for f in frames:
                bounds = [Emu(n * PX) for n in (f.x, f.y, f.w, f.h)]
                if f.kind == "image":
                    shape = slide.shapes.add_picture(io.BytesIO(f.value), *bounds)
                    shape._element.nvPicPr.cNvPr.set("descr", f.alt)
                elif f.kind == "rule":
                    rule = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, *bounds)
                    rule.fill.solid()
                    rule.fill.fore_color.rgb = rgb(f.value)
                    rule.line.fill.background()
                else:
                    shape = slide.shapes.add_textbox(*bounds)
                    tf = shape.text_frame
                    tf.margin_left = tf.margin_top = tf.margin_bottom = tf.margin_right = 0
                    tf.word_wrap = False
                    p = tf.paragraphs[0]
                    p.space_before = p.space_after = Pt(0)
                    run = p.add_run()
                    run.text = f.value
                    run.font.name = f.family
                    run.font.size = Pt(f.size * 0.75)
                    run.font.color.rgb = rgb(THEME["accent" if f.kind == "accent" else "ink"])
                    rpr = run._r.get_or_add_rPr()
                    rpr.set("lang", "zh-TW" if self.language == "zh-Hant" else "en-US")
                    ea = OxmlElement("a:ea")
                    ea.set("typeface", f.family)
                    rpr.append(ea)
            slide.notes_slide.notes_text_frame.text = title
        deck.save(destination)

    def html(self, destination):
        sections = []
        for title, frames in self.pages:
            elements = []
            for f in frames:
                style = f"left:{f.x / WIDTH:.6%};top:{f.y / HEIGHT:.6%};width:{f.w / WIDTH:.6%};height:{f.h / HEIGHT:.6%}"
                if f.kind == "image":
                    data = base64.b64encode(f.value).decode("ascii")
                    elements.append(f'<img alt="{html.escape(f.alt)}" style="{style}" src="data:image/png;base64,{data}">')
                elif f.kind == "rule":
                    elements.append(f'<div aria-hidden="true" style="{style};background:{f.value}"></div>')
                else:
                    color = THEME["accent" if f.kind == "accent" else "ink"]
                    elements.append(
                        f'<div style="{style};font-family:{f.family},sans-serif;font-size:{100 * f.size / WIDTH:.6f}cqw;color:{color}">'
                        f'{html.escape(f.value)}</div>'
                    )
            sections.append(f'<section aria-label="{html.escape(title)}">{"".join(elements)}</section>')
        destination.write_text(
            f'<!doctype html><html lang="{self.language}"><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width,initial-scale=1">'
            f'<title>{html.escape(self.title)}</title><style>'
            f'body{{margin:0;background:#d7d8d2}} section{{position:relative;container-type:inline-size;'
            f'background:{THEME["paper"]};aspect-ratio:{WIDTH}/{HEIGHT};width:min(100%,1280px);margin:16px auto}}'
            'section>*{position:absolute;box-sizing:border-box} section>div{white-space:pre;line-height:1.32}'
            'img{object-fit:contain} @media print{section{margin:0;width:100%;break-after:page}}</style>'
            f'<main>{"".join(sections)}</main></html>', encoding="utf-8"
        )


def rgb(hex_color):
    return RGBColor.from_string(hex_color.lstrip("#"))


def build(brief, output):
    deck = Deck(json.loads(brief.read_text(encoding="utf-8")), brief.parent.resolve())
    output = output.resolve()
    if output.exists():
        raise ValueError(f"Choose a new output directory: {output}")
    output.parent.mkdir(parents=True, exist_ok=True)
    # Stage together so a failed render never leaves an apparently complete deck.
    with tempfile.TemporaryDirectory(prefix=".jjp-", dir=output.parent) as temporary:
        stage = Path(temporary) / "deck"
        stage.mkdir()
        pptx = stage / "presentation.pptx"
        pdf = stage / "presentation.pdf"
        deck.pptx(pptx)
        deck.html(stage / "presentation.html")
        converter = shutil.which("soffice") or shutil.which("libreoffice")
        if not converter:
            raise ValueError("LibreOffice (soffice) is required for PDF export")
        profile = (Path(temporary) / "profile").as_uri()
        command(converter, f"-env:UserInstallation={profile}", "--headless",
                "--convert-to", "pdf", "--outdir", str(stage), str(pptx))
        info = command("pdfinfo", str(pdf))
        count = re.search(r"^Pages:\s+(\d+)$", info, re.MULTILINE)
        if not count or int(count[1]) != len(deck.pages):
            raise ValueError("PDF page count differs from brief")
        preview = stage / "preview"
        preview.mkdir()
        command("pdftoppm", "-r", "96", "-png", str(pdf), str(preview / "slide"))
        renders = list(preview.glob("slide-*.png"))
        if len(renders) != len(deck.pages):
            raise ValueError("Missing slide renders")
        for render in renders:
            with Image.open(render) as image:
                if abs(image.width / image.height - WIDTH / HEIGHT) > 0.005:
                    raise ValueError(f"Unexpected slide ratio: {render.name}")
        (preview / "review.md").write_text(
            "# Layout review\n\nReview each PNG at full size and the HTML in a browser.\n\n"
            + "\n".join(f"- [ ] {i:02d} {title}" for i, (title, _) in enumerate(deck.pages, 1))
            + "\n", encoding="utf-8"
        )
        stage.rename(output)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("brief", type=Path)
    parser.add_argument("output", type=Path)
    options = parser.parse_args()
    try:
        build(options.brief, options.output)
    except subprocess.CalledProcessError as error:
        parser.exit(1, f"Export failed: {error.stderr or error.stdout}\n")
    except (ValueError, OSError, ImportError) as error:
        parser.exit(1, f"Build failed: {error}\n")
