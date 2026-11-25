# Legacy

**Every life leaves a Legacy.** An interactive archive of 32 people who changed the world — scientists, leaders, artists, innovators, entertainers and sports legends — told through a 3D globe, a walk-through museum, a sky of stars, a time machine and a quiz.

Built with React, Vite and three.js (via React Three Fiber). Everything the site shows is stored in this project, so visitors never depend on an outside service (apart from Google Fonts).

## Pages

| Page | What it does |
|---|---|
| **Home** | A 3D globe with a light at each legend's birthplace, plus three daily features: *Born on this day* (only on a legend's birthday), *Happened on this day* (events from history, each with its full story and photo) and *Quote of the day*. |
| **Legends** | A sliding 3D portrait gallery with search, field filters and favourites. Each legend has a story page with key moments, a sourced quote, a "Listen" button, and the history of their portrait photo. |
| **Museum** | A 3D gallery hall: the portraits hang in order of birth, so walking forward walks through time. Optional spoken audio guide. |
| **Sky** | Every legend is a star; each field is a constellation, joined in order of birth. |
| **Time Machine** | Pick any year to see which legends were alive, how old they were, and what happened that year. |
| **Timeline** | Six centuries of lifespans on one scrolling line. |
| **Quiz** | Three modes: clues, blurred photo, and "who was born first?". |

Pages have their own addresses (for example `#/quiz`, `#/time-machine/1905`, `#legend/marie-curie`), so any of them can be shared as a link.

## Running it

```bash
npm install
npm run dev      # local preview at http://localhost:5173
npm run build    # the finished site, in dist/
```

## Where things live

- `src/data/personalities.js` — every legend: life story, key moments, quiz clues, quotes (with sources) and portrait-photo histories. To add a legend, copy one entry and drop a photo named after them into `public/portraits/`.
- `public/history/` — "Happened on this day" for all 366 days (`MM-DD.json`), their photos (`images/`) and the Time Machine's index by year (`years/`).
- `scripts/fetch-history.py` — collects that history. Run it once a year for a fresh set; it can be stopped and re-run and picks up where it left off (Wikimedia limits download speed, so the photos take a while). Needs Python and Pillow (`pip install pillow`).
- `scripts/build-years.py` — rebuilds the Time Machine's year index (run automatically by the script above).
- `portraits-original/` — full-size originals of the portraits; the site uses the smaller copies in `public/portraits/`.

## Credits

- Historical events and their summaries are adapted from Wikipedia's "Selected anniversaries" and articles, under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Event photos come from Wikimedia Commons; each photo's author and licence are shown with it on the site.
- The Nelson Mandela portrait is by John Mathew Smith and the Steve Jobs portrait by Ben Stanfield, both under CC BY-SA 2.0; the site credits them in each portrait's "About this photo" panel.
- Quotes are included only where a source could be found; each is shown with where it comes from.

Please keep these credits if you change or publish the site.

## Before publishing

- In `index.html`, change the link-preview image (`og:image`) to its full web address once the site has one, e.g. `https://your-site.vercel.app/og-image.jpg`.
