# Andrew's Newsletters

Weekly research digests, published automatically and emailed out.

- **PDPT Watch** — psychodynamic psychotherapy / counselling, Colchester & Essex. Emailed as
  inline HTML.
- **What's On** — local activities for the coming week (open days, kids' events, food & drink,
  museums), Colchester & Essex. Emailed as a PDF attachment.

## How it works

1. **Generation** — a Claude Code scheduled task per newsletter (`pdpt-weekly-newsletter` Mon
   ~6:04am, `whatson-weekly-newsletter` Mon ~6:20am, both UK time) does live web research and
   overwrites that newsletter's `.html` file, keeping the existing design/CSS and only
   updating the content. Commits and pushes to `main`.
2. **Publishing** — GitHub Pages serves this repo directly: https://andrewlord311-sudo.github.io/andrew-newsletters/
3. **Delivery** — a Google Apps Script per newsletter (`apps-script/send-*.gs`, owned by
   Andrew, runs on his own Google account) fetches the published page about an hour after the
   generation step and emails it to Laura — PDPT Watch inline, What's On as a PDF attachment
   (Apps Script's built-in HTML→PDF conversion, which is why `whatson.html`'s CSS is plain and
   hardcoded rather than using variables/media queries — see the comment at the top of
   `send-whatson-newsletter.gs`). Source kept here for reference; the live copy of each script
   lives at script.google.com. **The recipient email is intentionally left as a placeholder in
   both `.gs` files in this repo** — this repo is public, fill it in only in the live
   script.google.com copy (see `PDPT-WATCH-FAQ.md` for why, and a past incident where this
   wasn't done).

`index.html` is a stable hub page linking to each newsletter — add a new `<li>` there when a
new topic (e.g. a music newsletter) gets built the same way.

## Adding a new newsletter topic

1. Create `<topic>.html` following `pdpt.html`'s structure (own masthead/colour if it should
   feel distinct, or reuse the same design system)
2. Add a scheduled task for it (same shape as `pdpt-weekly-newsletter`)
3. Add it to `index.html`
4. If it also needs email delivery, copy the Apps Script pattern with a new function/trigger
