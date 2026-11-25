"""
Collects "Happened on this day" events for all 366 days of the year and
saves everything inside the website, so visitors never contact an outside
service:

  public/history/MM-DD.json      the events for each day, each with its
                                 full story text and photo details
  public/history/images/...      the photos themselves

Run it from the project folder:

    python scripts/fetch-history.py

It works in three steps and can be stopped and re-run at any time; it
picks up where it left off (Wikimedia limits how fast you can download,
so the photos take a while):

  1. stories  – each day's events with the related article's summary
  2. credits  – who took each photo and its licence (many free photos
                must name their author)
  3. photos   – downloads each photo at a web-friendly size

Use --refresh to download every day's stories again from scratch, and
--only 11-25,11-26 to handle just those days (handy for testing), and
--no-photos to collect the stories and credits but skip the photos.

The text comes from Wikipedia's "Selected anniversaries" and article
summaries (CC BY-SA). Only photos from Wikimedia Commons are kept,
because those are freely licensed; photos Wikipedia uses under
"fair use" are skipped.
"""

import datetime
import hashlib
import html
import json
import pathlib
import re
import sys
import time
import urllib.parse
import urllib.request

FEED = "https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/selected/{:02d}/{:02d}"
COMMONS_API = "https://commons.wikimedia.org/w/api.php"
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "history"
IMAGES = OUT / "images"
HEADERS = {"User-Agent": "LegacyHistoryCollector/1.1", "Accept": "application/json"}
PHOTO_WIDTH = 480
WEBP_QUALITY = 72  # small files that still look sharp at this size

# notes such as "(pictured)", "(aircraft pictured)" or "(emblem depicted)"
# point at Wikipedia's own layout, so they are removed from the text
PICTURE_NOTE = re.compile(r"\s*\((?:[^()]*\s)?(?:pictured|depicted|shown|illustrated)\)", re.I)
COMMONS_THUMB = re.compile(r"/wikipedia/commons/thumb/[0-9a-f]/[0-9a-f]{2}/([^/]+)/")
COMMONS_FULL = re.compile(r"/wikipedia/commons/[0-9a-f]/[0-9a-f]{2}/([^/]+)$")


def clean(text):
    text = PICTURE_NOTE.sub("", text or "")
    return re.sub(r"\s+", " ", text).strip()


def strip_html(value):
    text = re.sub(r"<[^>]+>", " ", value or "")
    text = re.sub(r"\s+", " ", html.unescape(text)).strip()
    return re.sub(r"^(?:Creator|User)\s*:\s*", "", text)  # Wikimedia page labels


def get(url, binary=False):
    req = urllib.request.Request(url, headers=HEADERS)
    for attempt in range(8):
        try:
            with urllib.request.urlopen(req, timeout=40) as res:
                data = res.read()
                return data if binary else json.loads(data)
        except Exception as err:  # network hiccup or "too many requests": wait and retry
            if getattr(err, "code", None) == 404 or attempt == 7:
                raise
            wait = 20 * (attempt + 1)
            retry_after = getattr(err, "headers", None) and err.headers.get("Retry-After")
            if retry_after and retry_after.isdigit():
                wait = max(wait, int(retry_after))
            print(f"  waiting {wait}s, then retrying ({err})")
            time.sleep(wait)


ONLY = None  # set by --only 11-25,11-26 to handle just those days


def days():
    day = datetime.date(2024, 1, 1)  # a leap year, so 29 February is included
    while day.year == 2024:
        name = f"{day.month:02d}-{day.day:02d}"
        if ONLY is None or name in ONLY:
            yield day, OUT / f"{name}.json"
        day += datetime.timedelta(days=1)


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def save(path, events):
    path.write_text(json.dumps(events, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


def commons_file(page):
    """The Commons file name of a page's photo, or None if it isn't on Commons."""
    for key in ("originalimage", "thumbnail"):
        src = urllib.parse.urlparse((page.get(key) or {}).get("source", "")).path
        match = COMMONS_THUMB.search(src) or COMMONS_FULL.search(src)
        if match:
            return urllib.parse.unquote(match.group(1))
    return None


# ── step 1: stories ─────────────────────────────────────────
def step_stories(refresh):
    for day, target in days():
        if target.exists() and not refresh:
            events = load(target)
            if events and "title" in events[0]:
                continue  # already has the full stories
        raw = get(FEED.format(day.month, day.day))
        events = []
        for e in raw.get("selected", []):
            if not isinstance(e.get("year"), int) or not e.get("text"):
                continue
            pages = e.get("pages") or []
            # up to three related articles, each with its summary
            details = []
            for p in pages:
                summary = clean(p.get("extract"))
                if summary and len(details) < 3:
                    details.append({"title": clean(p.get("normalizedtitle") or p.get("title")), "summary": summary})
            photo_page = next((p for p in pages if commons_file(p)), None)
            event = {
                "year": e["year"],
                "text": clean(e["text"]),
                "title": details[0]["title"] if details else "",
                "details": details,
            }
            if photo_page:
                event["image"] = {"file": commons_file(photo_page), "about": clean(photo_page.get("normalizedtitle") or "")}
            events.append(event)
        events.sort(key=lambda ev: ev["year"])
        save(target, events)
        print(f"stories {target.name}: {len(events)} events")
        time.sleep(2)  # be gentle with the free service


# ── step 2: credits ─────────────────────────────────────────
def step_credits():
    wanted = set()
    for _, target in days():
        for ev in load(target):
            img = ev.get("image")
            if img and "license" not in img:
                wanted.add(img["file"])
    wanted = sorted(wanted)
    print(f"credits: looking up {len(wanted)} photos")
    found = {}
    for i in range(0, len(wanted), 50):
        batch = wanted[i : i + 50]
        query = urllib.parse.urlencode({
            "action": "query",
            "format": "json",
            "prop": "imageinfo",
            "iiprop": "extmetadata|url|mime",
            "iiurlwidth": PHOTO_WIDTH,
            "titles": "|".join("File:" + name for name in batch),
        })
        data = get(f"{COMMONS_API}?{query}")
        normalized = {n["to"]: n["from"] for n in data.get("query", {}).get("normalized", [])}
        for page in data.get("query", {}).get("pages", {}).values():
            info = (page.get("imageinfo") or [{}])[0]
            meta = info.get("extmetadata") or {}
            title = normalized.get(page.get("title"), page.get("title", ""))
            name = title.removeprefix("File:")
            found[name] = {
                "author": strip_html(meta.get("Artist", {}).get("value"))[:160],
                "license": strip_html(meta.get("LicenseShortName", {}).get("value")) or "",
                "thumb": info.get("thumburl"),
                "mime": info.get("mime", ""),
            }
        print(f"  credits {min(i + 50, len(wanted))}/{len(wanted)}")
        time.sleep(1)
    for _, target in days():
        events = load(target)
        changed = False
        for ev in events:
            img = ev.get("image")
            if not img or "license" in img:
                continue
            info = found.get(img["file"]) or found.get(img["file"].replace("_", " "))
            if not info or not info["thumb"] or not info["mime"].startswith("image/"):
                del ev["image"]  # nothing usable: show the story without a photo
            else:
                img.update(author=info["author"], license=info["license"], thumb=info["thumb"])
            changed = True
        if changed:
            save(target, events)


# ── step 3: photos ──────────────────────────────────────────
def shrink(data):
    """Re-save a downloaded photo as a small WebP (needs Pillow)."""
    import io
    from PIL import Image

    with Image.open(io.BytesIO(data)) as im:
        im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
        if im.width > PHOTO_WIDTH:
            im = im.resize((PHOTO_WIDTH, round(im.height * PHOTO_WIDTH / im.width)), Image.LANCZOS)
        out = io.BytesIO()
        im.save(out, "WEBP", quality=WEBP_QUALITY, method=6)
        return out.getvalue()


def step_photos():
    try:
        import PIL  # noqa: F401
    except ImportError:
        sys.exit("Photos need Pillow to keep them small: python -m pip install --user pillow")
    IMAGES.mkdir(parents=True, exist_ok=True)
    convert_old_photos()
    thumbs = {}
    for _, target in days():
        for ev in load(target):
            img = ev.get("image")
            if img and img.get("thumb") and "src" not in img:
                thumbs[img["file"]] = img["thumb"]
    todo = sorted(thumbs)
    print(f"photos: {len(todo)} to download")
    saved = {}
    for n, name in enumerate(todo, 1):
        thumb = thumbs[name]
        local = f"{hashlib.sha1(name.encode()).hexdigest()[:16]}.webp"
        path = IMAGES / local
        if not path.exists():
            try:
                path.write_bytes(shrink(get(thumb, binary=True)))
            except Exception as err:
                print(f"  skipped {name}: {err}")
                continue
            time.sleep(3)  # Wikimedia's image server limits how fast you can ask
        saved[name] = f"/history/images/{local}"
        if n % 50 == 0 or n == len(todo):
            print(f"  photos {n}/{len(todo)}")
            write_photo_paths(saved)
    write_photo_paths(saved)


def convert_old_photos():
    """Photos saved before shrinking existed (.jpg/.png) become small WebP files."""
    for _, target in days():
        events = load(target)
        changed = False
        for ev in events:
            img = ev.get("image") or {}
            src = img.get("src", "")
            if not src or src.endswith(".webp"):
                continue
            old = OUT / pathlib.Path(src).relative_to("/history")
            new = old.with_suffix(".webp")
            if old.exists() and not new.exists():
                new.write_bytes(shrink(old.read_bytes()))
            if new.exists():
                img["src"] = src.rsplit(".", 1)[0] + ".webp"
                changed = True
        if changed:
            save(target, events)
    for leftover in IMAGES.glob("*"):
        if leftover.suffix != ".webp" and leftover.with_suffix(".webp").exists():
            leftover.unlink()


def write_photo_paths(saved):
    for _, target in days():
        events = load(target)
        changed = False
        for ev in events:
            img = ev.get("image")
            if img and "src" not in img and img.get("file") in saved:
                img["src"] = saved[img["file"]]
                img.pop("thumb", None)  # the site uses its own copy from now on
                changed = True
        if changed:
            save(target, events)


def main():
    global ONLY
    if "--only" in sys.argv:
        ONLY = set(sys.argv[sys.argv.index("--only") + 1].split(","))
    OUT.mkdir(parents=True, exist_ok=True)
    step_stories(refresh="--refresh" in sys.argv)
    step_credits()
    if "--no-photos" not in sys.argv:
        step_photos()
    # refresh the Time Machine's index of events by year
    import runpy
    runpy.run_path(str(pathlib.Path(__file__).with_name("build-years.py")), run_name="__main__")
    print("Done.")


if __name__ == "__main__":
    main()
