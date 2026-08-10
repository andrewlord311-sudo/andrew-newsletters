# andrew-newsletters

Three weekly HTML newsletters, published to GitHub Pages and emailed by Google
Apps Script: **PDPT Watch** and **What's On** to Laura on Mondays, **Puzzle
Weekly** to Andrew on Fridays.

## Two rules that break things silently

**1. The CSS is email-safe on purpose.** Every colour is hardcoded. There are no
CSS custom properties (`var(--x)`), no `@media` queries, and no gradients. Gmail
and Outlook strip all three, which flattens the design and can stop links
rendering as links. Do **not** "improve" the CSS by reintroducing them — the
page looking fine in a browser proves nothing about how it arrives in an inbox.

**2. `scope/*.md` is data, not prompt.** `scope/pdpt.md`, `scope/whatson.md` and
`scope/puzzles.md` define what each newsletter covers, including reader requests
Laura has made. They are what Andrew edits to steer the content. If a scope file
conflicts with a generation prompt, **the scope file wins.**

Also keep the `.feedback` block above each footer — that's how Laura asks for
scope changes.

## Who generates these

Since 10.8.26, three **Claude cloud routines** (Mon 04:00 and 04:30 UTC, Fri
04:00 UTC). They run in the cloud precisely because this laptop is asleep at
that hour — the previous local scheduled tasks never fired on time, and the
Apps Script emailer would send the *previous* week's issue. The local tasks
still exist but are disabled.

The emailers fire between 07:00 and 08:00 Europe/London and send **whatever is
live on GitHub Pages at that moment**. So generating a file without pushing it
is a total failure, not a partial one.

## Publishing

Pushing to `main` is all that's needed; Pages serves it. Always verify the push
actually landed rather than assuming:

```
git fetch origin && git diff --quiet origin/main -- pdpt.html && echo PUBLISHED_OK
```
