# Music Weekly — scope

**This file defines what the newsletter covers.** The weekly task reads it at the
start of every run, and it wins over anything in the prompt. It is the file
Andrew edits to steer the newsletter — scope is data, not prompt.

## Subject

A Saturday-morning briefing that pushes Andrew to **listen to more, and explore
further than he otherwise would**. He is a composer with three albums out and a
working knowledge of theory, so this is not an introduction to classical music.
It should tell him things he does not already know.

His own words: *"I don't listen to enough."* The measure of success is that he
actually plays something because of it.

## The taste, in his words

Copied from `Me/Identity/My musical tastes and interests.md` in the vault, which
the cloud routine cannot read. **If the two disagree, the vault note is the
truth and this copy needs updating.**

**Renaissance and earlier** — not keen in general, but he plays the lute and
likes lute music, especially **John Dowland**. Curious about re-using very old
music, especially by lesser-known composers.

**Baroque** — loves Bach but finds him hard when too cerebral (*The Art of Fugue*
is "incredible and extremely hard to listen to"); fond of the instrumental
output. Prefers **Handel's** lyricism and simplicity — better tunes. Not obsessed
with the era.

**Classical** — recently fallen in love with **Mozart** after never getting him
before; **Haydn** too. Two live questions: how the Baroque, Classical and
Romantic eras ran headlong into each other, and quite how Mozart was so far
ahead of everyone. He owns the complete **string quartets in score** and is
studying them.

**Romantic** — Beethoven is incredible; Schubert speaks to him more; but
**Schumann is his "Prince of Music"**. He likes **Clara**'s music too and is
**obsessed with that family**. Likes **Brahms**, whose seamlessness terrifies him
— "sometimes hard to work out where I am in it". Enjoys **Tchaikovsky, Dvořák,
the Russian school**. **Mendelssohn** is growing on him.

**20th century** — likes the continuing Romantic line: **Elgar, Walton, Mahler
(a MASSIVE favourite), Shostakovich, Vaughan Williams**, and any 20th-century
music that isn't atonal. Has the **Planets** score. **Loves Bartók.** Believes
there are many composers here he has not explored.

**21st century** — likes **Arvo Pärt** and **Judith Weir (loves her)**. Likes
that the century is flying off in all directions and wishes he had time to
explore it.

**Broader** — compositional technique, form, orchestration, and understanding a
composer within their historical context.

## Hard exclusions — never include these

This list is what stops the newsletter being generic. Breaking it is worse than
a thin issue.

- **Opera — period.** Not a single aria, overture-plus-synopsis, or "you might
  like this one". The sole exception he allows is one or two **Wagner opera
  overtures**, and even those are a rarity, not a section.
- **Wagner** otherwise. **Berlioz** — "don't like at all". **Liszt.**
- **The Second Viennese School** (Schoenberg, Berg, Webern) and **atonal music**
  generally.
- **Minimalism** (Glass, Reich, Adams and successors). Note Arvo Pärt is *not*
  minimalism for this purpose — he is explicitly liked.
- **Film music.**

If a recommendation is only reachable through one of these, drop it and say the
section was thin this week rather than smuggling it in.

## Sections

Five recommendations is the target. Quality over completeness — a shorter issue
he acts on beats a full one he skims.

1. **Listen this week** — 3 to 4 pieces, each with a real, working link
   (Spotify, YouTube, or BBC Sounds). For each: what it is, why *he* specifically
   might like it given the taste above, and roughly how long it takes. Prefer
   things adjacent to what he already loves but that he plausibly hasn't heard —
   a Schumann contemporary, a Mahler symphony he rarely reaches for, a Bartók
   quartet, a Dowland setting.
2. **A composer to explore** — one, with a short "why now" and a route in
   (which piece first, then what). Lean into his own stated gap: unexplored
   20th-century composers, and lesser-known older ones worth reviving.
3. **Something to study** — a score, a technique, a piece of form or
   orchestration analysis. This is where his composer's ear is served: what
   Brahms is actually doing that makes it seamless, how Mozart voices a quartet.
   IMSLP links are ideal since the scores are free.
4. **On the radio** — **special events on BBC Radio 3 in the coming week.**
   Andrew's own framing, 15.8.26: *"all I really want to know is what
   interesting concerts/events are coming up that I don't want to miss"* —
   not a listing of everything broadcasting, a filter down to what's actually
   worth clearing time for.

   **Do not scrape the BBC website — it blocks that, which is why this
   section kept failing.** Instead, fetch the schedule directly as JSON, one
   call per day, using Bash:

   ```
   curl -s "https://rms.api.bbc.co.uk/v2/experience/inline/schedules/bbc_radio_three/YYYY-MM-DD"
   ```

   No headers, no auth, no User-Agent needed — confirmed working plainly.
   Fetch today plus the next six days. Each response is
   `.data[0].data[]`, a list of broadcasts with `start`/`end` (UTC),
   `titles.primary`/`titles.secondary`, and `synopses.short`/`medium`/`long`
   — the `long` synopsis often lists the actual pieces and performers.

   **What counts as special** — there is no flag for this, judge it from the
   titles and synopses: a **"Classical Live"** relay (these are Proms or
   festival broadcasts — the secondary title says which, e.g. *"from the BBC
   Proms"* or *"from the Edinburgh Festival"*), an **"In Tune"** entry naming
   a specific artist playing live in the studio, or anything else whose
   synopsis makes clear it is a one-off performance rather than a themed
   selection or a continuity slot (**"Through the Night", "Breakfast",
   "Essential Classics"** and similar are routine — leave them out even if
   nothing else is happening that day).

   For each one picked: what it is, who's performing, and the UK broadcast
   time converted from the UTC in `start`. If nothing in the coming week
   clears that bar, say so plainly — a genuinely quiet week is a valid answer,
   better than padding with routine programming dressed up as an event.

   (BBC Sounds catch-up-expiry is not covered by this endpoint and has no
   reliable source found yet — dropped from scope rather than guessed at.)
5. **Live near Colchester** — concerts in Colchester, Essex and reachable parts
   of Suffolk and Cambridge. Include date, venue, price and a booking link.
   Say plainly if there is nothing worth the trip.

## Sources to explore — rotate, don't settle

BBC Radio 3 schedules and BBC Sounds; IMSLP; Gramophone and BBC Music Magazine
reviews; Presto Music new releases; the Colchester and Essex venue listings
(Firstsite, Colchester Arts Centre, the Mercury, local churches and music
societies); University of Essex and Colchester Institute concert listings;
Aldeburgh and Snape Maltings; Cambridge college and Saffron Hall listings;
Wigmore Hall for anything worth the train; Bachtrack for what is on;
composer anniversaries and centenaries.

Vary week to week. Two issues running that both lean on the same source is a
failure of the brief.

## Rating — how it feeds back in

Every item carries 👍 / 🙂 / 👎 links to the same Apps Script collector the
puzzle newsletter uses. Each run **fetches the summary first** and shifts
emphasis: lean into what scores well, ease off what does not. This loop is the
main mechanism for the newsletter getting better — the taste above is only the
starting point, and six weeks of ratings will describe him better than his own
description does.

## Reader requests

*Andrew adds things here and they are honoured from the next issue.*

-
