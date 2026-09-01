#!/usr/bin/env python3
"""Alert on Telegram when a newsletter stops being published.

Why this exists: on 31.8.26 every one of these newsletters was publishing
normally, and a check of the *local* clone (four commits behind `origin/main`)
plus the long-disabled `~/.claude/scheduled-tasks/` entries produced a
confident, entirely wrong "all the cloud routines have disappeared". The real
failure that week was the opposite shape and invisible from git: the routines
ran on time but WebFetch was blocked, so they published unverified
WebSearch-snippet content and reported success.

So this watchdog answers exactly one question, the one git can actually
answer: **did each newsletter's routine produce an issue when it should
have?** It fetches `origin/main` and compares each file's last commit date
against its weekly cadence. It says nothing about whether the content was
well-sourced -- see the "Network egress" section of CLAUDE.md for that, which
the routines themselves report on via PushNotification.

Deliberately NOT watched: holiday-monitor. Its research routine correctly
commits nothing when no deal matches, so commit age there means "no deals
this week" far more often than "the routine is broken" -- alerting on it
would train Andrew to ignore this bot. Its runs notify him directly instead.

Config: ~/.secrets/voice-journal.env (same bot as Voice Journal, holiday-monitor
and the `remind` nudge -- no new bot token needed).

    TELEGRAM_BOT_TOKEN="..."
    TELEGRAM_CHAT_ID="..."
"""

from __future__ import annotations

import json
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parent
ENV_FILE = Path.home() / ".secrets/voice-journal.env"
STATE_FILE = Path.home() / ".secrets/newsletter-watchdog.state"
TELEGRAM = "https://api.telegram.org"
TIMEOUT = 30

DAY = 86400
# Weekly newsletters: a gap over 8 days means a scheduled run was missed
# outright (7 days cadence + a day of slack for run-time and clock drift).
STALE_AFTER = 8 * DAY
# Once an outage is reported, stay quiet for a week rather than nagging daily.
RENOTIFY_AFTER = 7 * DAY

NEWSLETTERS = [
    ("PDPT Watch", "pdpt.html", "Monday"),
    ("What's On", "whatson.html", "Monday"),
    ("Puzzle Weekly", "puzzles.html", "Friday"),
    ("Music Weekly", "music.html", "Saturday"),
]


def load_env() -> dict[str, str]:
    values: dict[str, str] = {}
    if ENV_FILE.exists():
        for line in ENV_FILE.read_text().splitlines():
            line = line.strip().removeprefix("export ").strip()
            if line and not line.startswith("#") and "=" in line:
                k, _, v = line.partition("=")
                values[k.strip()] = v.strip().strip('"').strip("'")
    for required in ("TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID"):
        if not values.get(required):
            sys.exit(f"error: {required} missing from {ENV_FILE}")
    return values


def load_state() -> dict:
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text())
    return {}


def save_state(state: dict) -> None:
    STATE_FILE.write_text(json.dumps(state, indent=2))


def git(*args: str) -> subprocess.CompletedProcess:
    return subprocess.run(["git", *args], cwd=REPO, capture_output=True, text=True)


def last_published(filename: str) -> int | None:
    """Commit timestamp of `filename` on origin/main, or None if unknown."""
    result = git("log", "-1", "--format=%ct", "origin/main", "--", filename)
    if result.returncode != 0 or not result.stdout.strip():
        return None
    return int(result.stdout.strip())


def send_message(token: str, chat_id: str, text: str) -> bool:
    data = urllib.parse.urlencode({
        "chat_id": chat_id, "text": text, "parse_mode": "HTML",
        "disable_web_page_preview": "true",
    }).encode()
    try:
        with urllib.request.urlopen(
            f"{TELEGRAM}/bot{token}/sendMessage", data=data, timeout=TIMEOUT
        ) as resp:
            return json.loads(resp.read().decode()).get("ok", False)
    except urllib.error.URLError as err:
        print(f"  send failed: {err}")
        return False


def main() -> int:
    dry_run = "--dry-run" in sys.argv
    env = load_env()
    token, chat_id = env["TELEGRAM_BOT_TOKEN"], str(env["TELEGRAM_CHAT_ID"])
    state = load_state()
    now = int(time.time())

    # Always fetch: reading the local clone without this is precisely the
    # mistake that prompted the whole watchdog.
    fetched = git("fetch", "origin", "--quiet")
    if fetched.returncode != 0:
        print(f"  git fetch failed: {fetched.stderr.strip()}")
        print("  cannot trust local refs without a fetch -- skipping this run")
        return 0

    stale: list[str] = []
    suppressed = 0
    for name, filename, weekday in NEWSLETTERS:
        published = last_published(filename)
        if published is None:
            print(f"  {name}: no commit found for {filename} -- skipping")
            continue

        age = now - published
        days = age // DAY
        ago = f"{days} day{'s' if days != 1 else ''} ago"
        if age <= STALE_AFTER:
            print(f"  {name}: ok ({days}d)")
            state.pop(filename, None)
            continue

        last_alert = state.get(filename, {}).get("alerted_at", 0)
        if now - last_alert < RENOTIFY_AFTER:
            print(f"  {name}: STALE ({days}d) -- already alerted, staying quiet")
            suppressed += 1
            continue

        print(f"  {name}: STALE ({days}d) -- alerting")
        stale.append(f"• <b>{name}</b> ({weekday}) — last published {ago}")
        state[filename] = {"alerted_at": now, "published": published}

    if stale:
        body = "\n".join(stale)
        text = (
            "⚠️ <b>Newsletter watchdog</b>\n\n"
            f"{body}\n\n"
            "A weekly routine looks like it missed a run. Check the routines at "
            "claude.ai/code/routines, and read the actual run log "
            "(RemoteTrigger list_runs + get_run_log) rather than the local clone."
        )
        if dry_run:
            print("  --dry-run, would have sent:")
            print("  " + text.replace("\n", "\n  "))
            return 0
        if not send_message(token, chat_id, text):
            # Don't record the alert if it never went out, or the outage goes
            # silent for a week.
            for name, filename, _ in NEWSLETTERS:
                state.pop(filename, None)
            print("  alert failed to send; state not recorded")

    save_state(state)
    if not stale:
        # Never say "all current" while something is merely un-renotified --
        # a falsely reassuring summary is the failure this watchdog exists
        # to catch, so it must not commit that failure itself.
        if suppressed:
            print(f"  {suppressed} still stale, alert already sent within the week.")
        else:
            print("  all newsletters current.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
