# Andrew's Newsletters

Weekly research digests, published automatically and emailed out.

- **PDPT Watch** — psychodynamic psychotherapy / counselling, Colchester & Essex. Emailed as
  inline HTML.
- **What's On** — local activities for the coming week (open days, kids' events, food & drink,
  museums), Colchester & Essex. Emailed as a PDF attachment.
- **Puzzle Weekly** — sudoku variants (Cracking the Cryptic style), LinkedIn's daily logic
  games, Thinky Games dailies, and a maths puzzle. Andrew's own, emailed to him (not Laura).
  Has a one-click 👍/🙂/👎 rating system feeding back into future picks — see "Rating system"
  below.

## How it works

1. **Generation** — a Claude Code scheduled task per newsletter (`pdpt-weekly-newsletter` Mon
   ~6:04am, `whatson-weekly-newsletter` Mon ~6:20am, `puzzle-weekly-newsletter` Fri ~6:12am,
   all UK time) does live web research and overwrites that newsletter's `.html` file, keeping
   the existing design/CSS and only updating the content. Commits and pushes to `main`.
2. **Publishing** — GitHub Pages serves this repo directly: https://andrewlord311-sudo.github.io/andrew-newsletters/
3. **Delivery** — a Google Apps Script per newsletter (`apps-script/send-*.gs`, owned by
   Andrew, runs on his own Google account) fetches the published page about an hour after the
   generation step and emails it out — PDPT Watch and Puzzle Weekly inline, What's On as a PDF
   attachment (Apps Script's built-in HTML→PDF conversion, which is why `whatson.html`'s CSS is
   plain and hardcoded rather than using variables/media queries — see the comment at the top
   of `send-whatson-newsletter.gs`). Source kept here for reference; the live copy of each
   script lives at script.google.com. **The recipient email is intentionally left as a
   placeholder in every `.gs` file in this repo** — this repo is public, fill it in only in the
   live script.google.com copy (see `PDPT-WATCH-FAQ.md` for why, and a past incident where this
   wasn't done). PDPT Watch and What's On go to Laura; Puzzle Weekly goes to Andrew himself.

## Rating system (Puzzle Weekly only)

Each puzzle/section in Puzzle Weekly has 👍/🙂/👎 links that hit a small Apps Script Web App
(`apps-script/collect-puzzle-rating.gs`) via plain GET — one click, no page to fill in, no
login. It logs to a Google Sheet and also serves a `?mode=summary` JSON endpoint that the
Friday generation task fetches to weight next week's picks toward what's rated well. Setup
steps (creating the Sheet, deploying the Web App, wiring the real URL into both `puzzles.html`
and the scheduled task) are in that file's header comment — this is a second, separate Apps
Script project from the emailer, both living in Andrew's own Google account.

`index.html` is a stable hub page linking to each newsletter — add a new `<li>` there when a
new topic (e.g. a music newsletter) gets built the same way.

## Adding a new newsletter topic

1. Create `<topic>.html` following `pdpt.html`'s structure (own masthead/colour if it should
   feel distinct, or reuse the same design system)
2. Add a scheduled task for it (same shape as `pdpt-weekly-newsletter`)
3. Add it to `index.html`
4. If it also needs email delivery, copy the Apps Script pattern with a new function/trigger
