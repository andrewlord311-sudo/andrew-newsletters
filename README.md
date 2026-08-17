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

1. **Generation** — since 10.8.26, a **Claude cloud routine** per newsletter (Mon 04:00 UTC for
   PDPT Watch, Mon 04:30 UTC for What's On, Fri 04:00 UTC for Puzzle Weekly, Sat 04:00 UTC for
   Music Weekly — see `CLAUDE.md`) does live web research and overwrites that newsletter's
   `.html` file, keeping the existing design/CSS and only updating the content. Commits and
   pushes to `main`. Runs in the cloud specifically because the laptop is asleep at that hour —
   the local scheduled tasks this replaced (`pdpt-weekly-newsletter`, `whatson-weekly-newsletter`,
   `puzzle-weekly-newsletter`) never fired on time and are now disabled, kept only as a fallback.
2. **Publishing** — GitHub Pages serves this repo directly: https://andrewlord311-sudo.github.io/andrew-newsletters/
3. **Delivery** — a Google Apps Script per newsletter (`apps-script/send-*.gs`, owned by
   Andrew, runs on his own Google account) fetches the published page between 7am and 8am UK
   time and emails out whatever's live at that moment — PDPT Watch and Puzzle Weekly inline,
   What's On as a PDF attachment (Apps Script's built-in HTML→PDF conversion, which is why
   `whatson.html`'s CSS is plain and hardcoded rather than using variables/media queries — see
   the comment at the top of `send-whatson-newsletter.gs`). Source kept here for reference; the
   live copy of each script lives at script.google.com. **The recipient email is intentionally
   left as a placeholder in every `.gs` file in this repo** — this repo is public, fill it in
   only in the live script.google.com copy (see `PDPT-WATCH-FAQ.md` for why, and a past incident
   where this wasn't done). PDPT Watch and What's On go to Laura; Puzzle Weekly and Music Weekly
   go to Andrew himself.

   **Freshness guard (17.8.26):** every `send-*.gs` script checks the fetched page's own "Week
   of D Month YYYY" date before sending — if it's more than 6 days old, the script holds the
   email back and emails *Andrew* instead, rather than silently forwarding a stale issue.
   Added after What's On forwarded 10 August's issue on 17 August (Andrew: *"What's On was 10th
   August not 17th"*) — the generation and send steps are two independently-scheduled jobs with
   no coordination between them, and although both ran well within their intended windows that
   morning (PDPT pushed 04:18 UTC, What's On 04:42 UTC — both over an hour before the 7am send
   window), the send still picked up stale content. The exact race couldn't be confirmed without
   the live Apps Script execution log (no browser access to script.google.com from this
   session), so the fix closes the failure mode itself rather than the unconfirmed cause: no
   `.gs` script can silently forward a stale issue again, regardless of why the race happens.

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
