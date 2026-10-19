# GitHub Weekly — scope

**This file defines what the newsletter covers.** The weekly task reads it at the
start of every run, and it wins over anything in the prompt. It is the file
Andrew edits to steer the newsletter — scope is data, not prompt.

*Status: live from Thursday 22 Oct 2026. The routine starts at 04:20 UTC every Thursday, and the emailer (to Andrew only) sends it between 07:00 and 08:00 London. The first issue, 18 Oct 2026, was made by hand. Andrew's answers, 18.10.26: email to him only; Thursday (moved from Sunday 19.10.26, so the picks land before the weekend); 3 to 5 picks; be cautious about anything under a month old.*

## Subject

A Thursday-morning pick of **3 to 5 open-source projects worth trying**, chosen
from GitHub for one reader. It is not "what's trending": raw star counts on new
repositories are mostly hype. The measure of success is that he actually tries
one of them, and that nothing he tries does him harm.

His own words: *a weekly newsletter googling around GitHub and selecting a few
interesting, new open-source applications that I could try* — things he is
already interested in, code that might make his projects easier or more
exciting, copies of software that is usually expensive, applications getting a
lot of likes, and games. They might run on a Mac, a phone or an iPad.

## The reader

**Read his own note first. It is the truth:**

    andrew-second-brain/Me/Identity/Interests/Interests at a glance.md

(his vault is cloned next to this repo, with only `Me/Identity/Interests/` checked out; find it with `ls ..` or
`find / -name "Interests at a glance.md" 2>/dev/null`). It collects his **whole
range of interests, goals and practical constraints in one place**, and he edits
it whenever they move, so anything new or dated in it outranks the snapshot
below. Use the notes it links to for detail. Only if it cannot be found, use the
snapshot (copied 18.10.26) and say so in the final message. **Never reproduce
personal details from it in the issue**: use it to choose, not to quote.

**The range (snapshot).** Do not let this collapse into "music and AI".
- **Music**: composer and student of scores. Sheet-music scanning (OMR), MIDI,
  MusicXML and ABC, DAWs and synths, Web Audio, generative music and
  sonification, tools for studying form and harmony.
- **Software he builds** with Claude Code: agents and MCP (be sceptical, the hype
  is thickest here); Astro and Tailwind on Cloudflare Workers; GitHub Pages;
  Google Apps Script with clasp; Playwright and ffmpeg (a video pipeline that
  records HTML scenes); Godot and three.js; Python on a Mac with launchd.
- **Obsidian and his vaults**: Bases, Excalidraw, Git and sync tooling. One vault
  lives in iCloud (invisible to his Android phone), the other syncs through git.
- **Teaching children** music, phonics, maths and history with games and video.
- **Video and a YouTube presence**: AI voices, avatars, short-form clips, a hymn
  channel.
- **Optical networking and quantum** (his professional field), including error
  correction and photonics.
- **Puzzles and maths**: sudoku variants, logic games, tower-defence and board
  games, maths visualisation and animation.
- **Photography and a very large photo library**: culling, search, metadata,
  deduplication.
- **Electronics** (he wants to teach it), **origami and geometry**, **history and
  archaeology** (a 3D Roman Colchester, maps, LiDAR), **garden and cooking**.

**Kit.** A MacBook (where the Claude work happens), a Windows PC (music and video
work, short of RAM), an **iPad** (no Claude Code; ideas, sketching, recreation, so
browser apps and installable web apps matter), an Android phone, and an ARM NAS
with **no Docker** (so a "just run the Docker image" project is no use for it).

**Dislikes.** Hype. Anything that is mostly a prompt pack. Projects that need a
paid account to do the interesting part. Windows-only tools, unless they are
for the PC's music work.

## Hard rules: never break these

Breaking them is worse than a thin issue.

1. **Age.** Nothing created in the last **30 days** is a pick. (Andrew, 18.10.26:
   "be cautious about anything under a month old.") A project between 14 and 30
   days old may appear only under **On the radar**, and only if it is from an
   established organisation, has at least five contributors and an OSI licence,
   and is labelled "too new to try yet". Anything younger is left out entirely.
2. **A clear licence.** An OSI-approved licence stated in the repo. No licence,
   or `NOASSERTION`, means leave it out. If a repo mixes licences, say so.
3. **No harm, no grey areas.** Leave out: adult content; cracked, pirated or
   "free download" copies of paid software; ports, emulators or compatibility
   layers for commercial games; scrapers built to evade bot detection; crypto
   trading bots and wallets; credential or cookie tools; clones of a company's
   branded interface.
4. **Never recommend an install that pipes a script into a shell** (`curl … | sh`,
   `iwr … | iex`) or asks for `sudo` without saying so. If that is the only way to
   install it, it is not a pick.
5. **Say what it does with his data.** Accounts needed, telemetry, network use,
   hosted-versus-local. If the README is silent, say so.
6. **Do not trust star counts.** Repos that gain tens of thousands of stars in a
   few months are common and cannot be told apart from bought stars. Weigh
   **forks, contributors, release history and recent commits** above stars, and
   flag a count that is out of line with them.
7. **Never download, clone or run anything.** Read descriptions and READMEs through
   the API only. "Works on iPad" means "the README says it runs in a browser",
   never "I tested it". Every pick carries a plain **Risk** line.
8. **Cover the range.** No more than two picks from the same area in one issue,
   and at least **three different areas** each week. If a week's best finds are all
   music or AI, go back and search the other areas before settling. Say so if a
   corner of his range has nothing worth recommending that week.
9. **Never repeat.** Do not feature anything listed in `scope/github-seen.md`.
   After publishing, append each pick (owner/name, date of the issue) and commit
   it with the issue.

## Sections

About **five picks in total**: quality over completeness, a short issue he acts
on beats a long one he skims. Use the same page design as the other newsletters
(email-safe CSS, hardcoded colours).

1. **Try this weekend**: three picks. For each: what it is in one line, **why it
   is for him** (named against an interest or a project), what it takes to try it
   and on which device, how long that will take, and the **Risk** line (age,
   licence, who maintains it, anything the install or the README makes you
   cautious about).
2. **For your projects**: one pick tied to something he is building. Say which
   project, and whether it is something to *use* or just to *learn from*.
3. **A game**: one, ideally playable in a browser or as an installable web app.
4. **On the radar** (optional, short): worth knowing but not this week: too new,
   too big, or no room.
5. **What I left out and why**: two or three lines naming the kinds of thing that
   were rejected and the rule that rejected them. This keeps the filter honest.

## How to find candidates

Use the **GitHub search API with `curl`**, no key needed:

    curl -s "https://api.github.com/search/repositories?q=topic:midi+created:2026-01-01..2026-09-17+pushed:%3E2026-09-25+stars:%3E40&sort=stars&order=desc&per_page=8"

- **One topic per query.** Queries that combined topics with `OR` and parentheses returned nothing when tried (18.10.26).
- Always restrict by `created:` (older than 30 days; usually within the last year)
  and `pushed:` (active in the last few weeks).
- Unauthenticated limits: about **10 searches a minute and 60 other API calls an
  hour**. Pause a few seconds between searches and keep to roughly 25 searches and
  15 detail calls a run.
- For each finalist read `repos/{owner}/{repo}` (created, pushed, stars, forks,
  licence, owner type), `…/contributors`, `…/commits?since=` (last 30 days),
  `…/releases` and `…/readme`. Flag a README that says `telemetry`, `account`,
  `sign in`, `subscription`, `sudo`, or pipes to a shell.
- GitHub has **no official trending feed**. Do not scrape its trending page. For
  "getting a lot of likes", use recent repos sorted by stars and the snapshot in
  `scope/github-seen.md`.

**Topics to rotate** (vary week to week; two issues running that lean on the same
searches is a failure of the brief). Music: `midi`, `musicxml`, `abc-notation`,
`music-theory`, `daw`, `synthesizer`, `web-audio`, `generative-music`, `lilypond`.
Work tools: `obsidian-plugin`, `mcp-server`, `claude-code`, `ffmpeg`, `playwright`,
`godot`. Games and puzzles: `browser-game`, `educational-game`, `sudoku`. The rest
of the range: `photo-management`, `kicad`, `esp32`, `manim`, `photonics`, `qgis`,
`blender`, `origami`, `gardening`, `youtube`, plus "open source alternative to…" in
descriptions. Many of these return few or no results; widen the star threshold
downwards rather than the date range.

## Rating — how it feeds back in

Every pick carries 👍 / 🙂 / 👎 links to the same Apps Script collector the puzzle
and music newsletters use (copy the base URL exactly as it appears in
`github.html`). Set `week=` to today's date (`YYYY-MM-DD`), `cat=` to the pick's
**area** (`gh-music`, `gh-vault`, `gh-photo`, `gh-video`, `gh-game`, or a new
`gh-<area>` for another corner of his range, such as `gh-electronics` or
`gh-maps`) and `item=` to a kebab-case `owner-repo`. **Each run fetches
`?mode=summary` first** and shifts emphasis: lean into the areas and kinds of pick
that score well, ease off what does not. Ratings by area are how the newsletter
learns which parts of his range he actually wants.

## Publishing

The routine starts at **04:20 UTC on Thursday**. The emailer sends whatever is live
between **07:00 and 08:00 Europe/London**, so **push by 06:30 London at the latest**;
cut scope rather than miss it. The page's date line must read `Week of D Month YYYY`
with today's date: the emailer holds the issue back as stale otherwise. Overwrite
`github.html`, append the picks to `scope/github-seen.md`, and push with
`git push origin HEAD:main` (a bare `git push` fails in the routine's sandbox), then
confirm with `git diff --quiet origin/main -- github.html && echo PUBLISHED_OK`.

## Reader requests

*Andrew adds things here and they are honoured from the next issue.*

-
