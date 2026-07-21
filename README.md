# Andrew's Newsletters

Weekly research digests, published automatically and emailed out. First one: **PDPT Watch**
(psychodynamic psychotherapy / counselling, Colchester & Essex).

## How it works

1. **Generation** — a Claude Code scheduled task (`pdpt-weekly-newsletter`, every Monday
   ~6am UK time) does live web research and overwrites `pdpt.html`, keeping the existing
   design/CSS and only updating the content. Commits and pushes to `main`.
2. **Publishing** — GitHub Pages serves this repo directly: https://andrewlord311-sudo.github.io/andrew-newsletters/
3. **Delivery** — a Google Apps Script (`apps-script/send-pdpt-newsletter.gs`, owned by
   Andrew, runs on his own Google account) fetches `pdpt.html` about an hour after the
   generation step and emails it to Laura. Source kept here for reference; the live copy
   lives at script.google.com.

`index.html` is a stable hub page linking to each newsletter — add a new `<li>` there when a
second topic (e.g. a music newsletter, or the local Colchester/Essex "what's on" idea) gets
built the same way.

## Adding a new newsletter topic

1. Create `<topic>.html` following `pdpt.html`'s structure (own masthead/colour if it should
   feel distinct, or reuse the same design system)
2. Add a scheduled task for it (same shape as `pdpt-weekly-newsletter`)
3. Add it to `index.html`
4. If it also needs email delivery, copy the Apps Script pattern with a new function/trigger
