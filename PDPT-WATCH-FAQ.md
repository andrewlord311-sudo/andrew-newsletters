# PDPT Watch — How It Works (FAQ)

A plain-English summary of the whole pipeline: Claude Code researches and writes a weekly
newsletter, GitHub Pages hosts it, and a Google Apps Script emails it to Laura. Written
2026-07-22.

**Not committed to git.** This file discusses a privacy issue (see part vi) that shouldn't
live in the public repo alongside it. Keep it local, or move it somewhere private, if you want
to hang onto it.

---

## (i) How the whole thing works

Three independent stages, each owned by a different system, chained together by *time* rather
than by any of them calling the next directly:

1. **Generate** — Every Monday morning, a Claude Code *scheduled task* runs on your machine
   (or wherever Claude Code's scheduler executes it). It researches that week's
   psychodynamic-psychotherapy news for Colchester/Essex, rewrites `pdpt.html` with the new
   content (same design, new words), and pushes the change to GitHub.
2. **Publish** — GitHub Pages serves the `andrew-newsletters` repo directly as a static site.
   As soon as the push lands on `main`, the new `pdpt.html` is live at
   https://andrewlord311-sudo.github.io/andrew-newsletters/pdpt.html — no separate build step.
3. **Deliver** — About an hour later, a Google Apps Script (`sendPdptNewsletter`, running on
   *your* Google account, on its own weekly timer) fetches that live URL and emails the raw
   HTML to Laura.

None of the three stages talks to the others directly — each just does its job on a schedule
and trusts the previous stage finished. The one-hour gap between stage 1 and stage 3 exists
specifically to make that trust safe (see part iii).

## (ii) What files live where

| Location | What it is |
|---|---|
| `~/.claude/scheduled-tasks/pdpt-weekly-newsletter/SKILL.md` | The instructions Claude Code follows every Monday — what to research, how to write it, how to publish it. Editing this changes next week's behaviour. |
| `~/Documents/andrew-newsletters/` (git repo, GitHub: `andrewlord311-sudo/andrew-newsletters`, **public**) | The actual product. |
| &nbsp;&nbsp;`pdpt.html` | This week's newsletter. Overwritten every Monday. |
| &nbsp;&nbsp;`index.html` | A stable hub page linking to PDPT Watch (and any future newsletters). Never touched by the automation. |
| &nbsp;&nbsp;`README.md` | Human-facing summary of the system (shorter version of this file). |
| &nbsp;&nbsp;`apps-script/send-pdpt-newsletter.gs` | A **reference copy** of the emailer source, for readability/version history. Editing it does nothing live — see next row. |
| `script.google.com` (your Google account, not in the git repo) | The **live** Apps Script project — the actual code that runs and its time-driven trigger. This is the copy that matters; the `.gs` file in the repo is just a mirror you have to update by hand if you change one. |
| `~/Documents/.claude/settings.local.json` | Claude Code's permission allowlist for anything run from `~/Documents` (which is where the scheduled task executes). Governs whether the Monday run can act without stopping to ask you — see part vi. |
| `~/.claude/settings.json` | Global Claude Code settings (e.g. `acceptEdits` mode), not specific to this project. |

## (iii) What happens, when, and why

| Time (Mon, UK) | Event | Why then |
|---|---|---|
| ~06:04 (+ up to ~4 min random jitter) | Claude Code scheduled task fires: researches, rewrites `pdpt.html`, commits, pushes to `main`. | Cron schedule `0 6 * * 1`. Early morning so it's done well before Laura would see it. |
| Immediately after push | GitHub Pages serves the new `pdpt.html`. | Static hosting — publish is just "the file changed," no build/deploy lag to speak of. |
| 07:00–08:00 | Apps Script trigger fires, fetches `pdpt.html`, emails it to Laura. | The ~1 hour gap after generation is a safety margin — it guarantees the generation step has long finished (and GitHub Pages has caught up) before the email step grabs a copy, so Laura never gets last week's content re-sent under this week's date. |

If either the Monday-morning generation step **or** the push fails, the Apps Script will still
fire an hour later and simply re-fetch and re-send *last week's* `pdpt.html` — silently, with
no error. See part vi.

## (iv) What is stored, and where

- **In the public GitHub repo** (`andrewlord311-sudo/andrew-newsletters`): every past week's
  `pdpt.html` is preserved in git history (one commit per Monday), plus `index.html`,
  `README.md`, and the `.gs` reference copy. Nothing here is private by design — it's a public
  Pages site — **except** the emailer script currently contains Laura's real email address in
  plaintext (see part vi).
- **In your Google account** (script.google.com): the live Apps Script project and its
  time-driven trigger configuration. It does not archive anything — each run fetches fresh and
  discards it after sending.
- **Locally, outside the repo**: the scheduled-task prompt (`SKILL.md`) and the Claude Code
  permission allowlist (`settings.local.json`). Neither contains newsletter content — the
  allowlist just accumulates a list of commands/domains/tools Claude Code is allowed to run
  without asking.
- **No database, no analytics, no subscriber list** — it's a single hardcoded recipient inside
  the Apps Script.

## (v) Where AI is involved

Only in stage 1 (generation). Claude Code:
- Runs live web searches to find that week's genuinely new research/local news, rather than
  reusing a template.
- Exercises judgment on what counts as "the top story" (this week, for example, no fresh local
  headline turned up, so it profiled a long-standing local institution instead and said so
  explicitly, rather than inventing news).
- Writes the actual prose and picks which links/tables to update.
- Commits and pushes the result.

Stages 2 and 3 are plain deterministic code with **no AI involvement**: GitHub Pages is a
static file server, and the Apps Script is a five-line fetch-and-email function. Laura's inbox
never touches an AI system — she receives a normal email built from static HTML.

## (vi) What might go wrong in the future

- **The recipient's email address leaked into the public repo, and is still in git history.**
  `apps-script/send-pdpt-newsletter.gs` once had the real recipient address hardcoded and
  committed to a **public** GitHub repo. Commit `5cd0a4a` removed it from the current files,
  but **removing a line in a later commit does not remove it from history** — it remains
  readable in commits `63bb81c` and `9ef5cc1`, and was confirmed still publicly fetchable via
  `raw.githubusercontent.com` on 2026-07-27. Fully clearing it needs a history rewrite
  (`git filter-repo`) plus a force-push, and then asking GitHub Support to garbage-collect the
  unreachable objects — until that last step, the old commit SHAs stay fetchable even after a
  force-push. The address is deliberately **not written in this file** for the same reason.
  Alternative: make the repo private (note GitHub Pages on a private repo needs Pro/Team,
  otherwise Pages won't serve publicly at all, which would break stages 2/3).
- **Silent failures, at every stage.** None of the three stages notifies you if it fails:
  - If the Monday Claude Code run errors out or can't push, `pdpt.html` just doesn't update —
    and the Apps Script will cheerfully re-send last week's content an hour later as if
    nothing happened. Laura gets stale content with no signal to either of you that it's stale.
  - If GitHub Pages has an outage or lags, same result.
  - If Google revokes/expires the Apps Script's authorization (password change, security
    review, inactivity), the trigger silently stops firing — Laura just stops receiving emails,
    with nothing telling you why.
- **Research quality drift.** Some weeks (like this one) genuinely have no fresh local
  headline. The task is instructed to say so rather than invent news, but that's a judgment
  call executed by an LLM each time — worth spot-checking occasionally rather than assuming
  every "top story" is as solid as it looks.
- **Link rot.** Pages found via search this week could 404 in six months; there's no
  link-checking step, so old newsletters in the git history may accumulate dead links over
  time.
- **Permission allowlist gaps re-appearing.** The allowlist that lets the Monday run proceed
  unattended (`~/Documents/.claude/settings.local.json`) only covers domains/commands seen so
  far. A genuinely novel research domain, or a new kind of git operation, could still cause a
  run to stall waiting on an approval that never comes, since no one's watching on a Monday
  morning.
- **Duplicated source of truth for the Apps Script.** The `.gs` file in the repo is cosmetic —
  the real code lives on script.google.com. If you ever edit one without the other, they'll
  quietly diverge and the README's "source kept here for reference" claim becomes inaccurate.
