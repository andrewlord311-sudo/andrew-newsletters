# andrew-newsletters

Four weekly HTML newsletters, published to GitHub Pages and emailed by Google
Apps Script: **PDPT Watch** and **What's On** to Laura on Mondays, **Puzzle
Weekly** to Andrew on Fridays, **Music Weekly** to Andrew on Saturdays.

## Two rules that break things silently

**1. The CSS is email-safe on purpose.** Every colour is hardcoded. There are no
CSS custom properties (`var(--x)`), no `@media` queries, and no gradients. Gmail
and Outlook strip all three, which flattens the design and can stop links
rendering as links. Do **not** "improve" the CSS by reintroducing them — the
page looking fine in a browser proves nothing about how it arrives in an inbox.

**2. `scope/*.md` is data, not prompt.** `scope/pdpt.md`, `scope/whatson.md`,
`scope/puzzles.md` and `scope/music.md` define what each newsletter covers, including reader requests
Laura has made. They are what Andrew edits to steer the content. If a scope file
conflicts with a generation prompt, **the scope file wins.**

Also keep the `.feedback` block above each footer — that's how Laura asks for
scope changes.

## Who generates these

Since 10.8.26, **Claude cloud routines** (Mon 04:00 and 04:30 UTC, Fri 04:00 UTC,
Sat 04:00 UTC). They run in the cloud precisely because this laptop is asleep at
that hour — the previous local scheduled tasks never fired on time, and the
Apps Script emailer would send the *previous* week's issue. The local tasks
still exist but are disabled.

The emailers fire between 07:00 and 08:00 Europe/London and send **whatever is
live on GitHub Pages at that moment**. So generating a file without pushing it
is a total failure, not a partial one.

## Network egress — READ THIS BEFORE RESEARCHING

**Status: BLOCKED as of 1.9.26.** Inside the cloud-routine sandbox, `WebFetch`
returns `EGRESS_BLOCKED` for **every** domain — including neutral controls like
`example.com` and `wikipedia.org`. `WebSearch` works normally. Andrew has
already set claude.ai → Settings → Capabilities → Domain allowlist to "Allow
all domains"; that did **not** fix it, so it is not the lever.

This section is data, not prompt — same convention as `scope/*.md`. When the
block lifts, edit this section and every routine changes behaviour at once.
Do not edit the routines' prompts for this.

### What each run must do

**Probe exactly once, before any research:**

```
WebFetch https://example.com   (prompt: "what does this page say")
```

- **Succeeds** → egress is back. Research normally, opening pages to verify
  facts. Say **"EGRESS OK"** in your final summary so Andrew learns the block
  has lifted, and flag that this section is now out of date.
- **`EGRESS_BLOCKED`** → you are in **degraded mode**. Do not call `WebFetch`
  again this run — not on another domain, not "just to check one". Every retry
  burns a minute of a deadline-bound run and fails identically. Past runs have
  wasted half their time this way.

### Degraded mode rules (WebSearch only)

WebSearch returns real titles, URLs and snippets. That is enough for an honest,
thinner issue — and not enough for anything more.

1. **State only what a snippet actually supports** — a name, a date, an
   organisation, a URL. Never extrapolate a claim a snippet merely gestures at,
   and never reconstruct a detail you would normally confirm by opening a page.
2. **Link only to URLs that appeared verbatim in a search result.** Never
   assemble a plausible-looking URL by hand.
3. **Fewer well-sourced items beat a full issue.** A section you can't source
   from snippets gets an honest "nothing solid this week" note, not padding.
4. **Never invent** a fact, date, price, time, rule or statistic. Fabrication is
   the real risk this block creates, and it is far worse than a short issue.
5. **Tell Andrew, not the reader.** Finish with a PushNotification saying the
   issue was built in degraded mode and which sections suffered. Tooling notes
   do not belong in the newsletter itself.

### Knock-on effects, per newsletter

- **All four** — the 👍/🙂/👎 ratings-summary endpoint is fetched with WebFetch,
  so it is unreachable in degraded mode. Expected; proceed without rating data
  rather than retrying or treating it as a blocker.
- **Music Weekly** — the `rms.api.bbc.co.uk` Radio 3 schedule endpoint that
  `scope/music.md` tells you to `curl` goes through the same proxy, so the "On
  the radio" section cannot be compiled. Declare it thin. **Never** reconstruct
  broadcasts, times or performers from memory — a wrong time wastes his evening.
- **Puzzle Weekly** — you cannot open a puzzle page to read its rules. Include a
  puzzle only when both its play link and its actual rule wording appear in
  search results. Never infer a variant's rules from its name, and never invent
  a difficulty rating.

## Publishing

Pushing to `main` is all that's needed; Pages serves it. Always verify the push
actually landed rather than assuming:

```
git fetch origin && git diff --quiet origin/main -- pdpt.html && echo PUBLISHED_OK
```

## Music Weekly, specifically

`scope/music.md` carries a **copy of Andrew's taste note** from the vault
(`Me/Identity/My musical tastes and interests.md`), because a cloud routine
cannot read the vault. If the two disagree, the vault note is the truth.

That file contains a **hard exclusion list** — no opera at all, no Wagner
(bar one or two overtures), no Berlioz, no Liszt, no Second Viennese School or
atonal music, no minimalism, no film music. Those exclusions are what stop the
newsletter being generic. Breaking one is worse than shipping a thin issue.
