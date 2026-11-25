"""
Builds the Time Machine's index of events by year from the saved days.

  public/history/years/1905.json   every stored event that happened in 1905:
                                   [{"d": "06-30", "i": 4, "t": "..."}, ...]
                                   d = the day file, i = the event's place in it
  public/history/years/index.json  {"1905": 12, ...} how many events each year has

The full story and photo stay in the day file; the page loads it only
when someone opens an event. Run this after scripts/fetch-history.py
(that script also runs it at the end):

    python scripts/build-years.py
"""

import json
import pathlib
import shutil
import time

ROOT = pathlib.Path(__file__).resolve().parent.parent
DAYS = ROOT / "public" / "history"
YEARS = DAYS / "years"


def read(path):
    # the photo download may be rewriting a day file at this moment
    for _ in range(5):
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            time.sleep(0.5)
    raise RuntimeError(f"could not read {path.name}")


def main():
    by_year = {}
    for path in sorted(DAYS.glob("[0-1][0-9]-[0-3][0-9].json")):
        for i, event in enumerate(read(path)):
            by_year.setdefault(event["year"], []).append({"d": path.stem, "i": i, "t": event["text"]})

    if YEARS.exists():
        shutil.rmtree(YEARS)
    YEARS.mkdir(parents=True)
    for year, events in by_year.items():
        events.sort(key=lambda e: e["d"])  # January to December
        (YEARS / f"{year}.json").write_text(json.dumps(events, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    index = {str(y): len(e) for y, e in sorted(by_year.items())}
    (YEARS / "index.json").write_text(json.dumps(index, separators=(",", ":")), encoding="utf-8")
    print(f"{len(by_year)} years indexed, {sum(index.values())} events")


if __name__ == "__main__":
    main()
