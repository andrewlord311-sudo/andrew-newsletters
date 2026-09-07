#!/usr/bin/env python3
"""Test watchdog.fast_forward() against a synthetic origin + clone.

Built from scratch rather than cloning the real repo, so nothing here can
touch andrew-newsletters. Covers the four states that matter:

  A  clean, behind      -> fast-forwards
  B  clean, current     -> says so, does not claim it moved
  C  dirty, behind      -> refuses, preserves the local edit
  D  local commit ahead -> leaves it alone
"""
import importlib.util
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

WATCHDOG = Path.home() / "Projects/andrew-newsletters/watchdog.py"
TMP = Path(tempfile.mkdtemp())
ORIGIN, CLONE = TMP / "origin", TMP / "clone"

G = ["-c", "user.email=t@t", "-c", "user.name=t"]


def run(*args, cwd):
    return subprocess.run(["git", *G, *args], cwd=cwd,
                          capture_output=True, text=True)


def commit(cwd, name, text):
    (cwd / name).write_text(text)
    run("add", name, cwd=cwd)
    run("commit", "-q", "-m", f"add {text}", cwd=cwd)


# --- build an origin with three commits, then clone it -------------------
ORIGIN.mkdir()
run("init", "-q", "-b", "main", cwd=ORIGIN)
for i in (1, 2, 3):
    commit(ORIGIN, "page.html", f"issue {i}")
subprocess.run(["git", "clone", "-q", str(ORIGIN), str(CLONE)], check=True)

spec = importlib.util.spec_from_file_location("wd", WATCHDOG)
wd = importlib.util.module_from_spec(spec)
spec.loader.exec_module(wd)
wd.REPO = str(CLONE)                       # point the module at our clone

passed, failed = 0, []


def check(name, cond, detail=""):
    global passed
    if cond:
        passed += 1
        print(f"  ok  {name}")
    else:
        failed.append(name)
        print(f"  FAIL  {name}  {detail}")


def head():
    return run("rev-parse", "HEAD", cwd=CLONE).stdout.strip()[:7]


def rewind(n):
    """Move the clone back n commits WITHOUT touching the working tree of
    the real repo -- this is a synthetic clone in a temp dir."""
    run("reset", "--hard", "-q", f"HEAD~{n}", cwd=CLONE)


print("\nA — clean and behind: must fast-forward")
rewind(2)
before = head()
wd.fast_forward()
check("moved up to origin/main", head() != before, f"{before} -> {head()}")
check("landed on origin's tip",
      head() == run("rev-parse", "origin/main", cwd=CLONE).stdout.strip()[:7])

print("\nB — already current: must not claim it moved")
before = head()
import io
from contextlib import redirect_stdout
out = io.StringIO()
with redirect_stdout(out):
    wd.fast_forward()
check("head unchanged", head() == before)
check("says 'already current', not 'fast-forwarded'",
      "already current" in out.getvalue(), out.getvalue().strip())

print("\nC — dirty and behind: must refuse and preserve the edit")
rewind(2)
(CLONE / "page.html").write_text("MY LOCAL EDIT")
before = head()
out = io.StringIO()
with redirect_stdout(out):
    wd.fast_forward()
check("head unchanged", head() == before, f"{before} -> {head()}")
check("local edit preserved",
      (CLONE / "page.html").read_text() == "MY LOCAL EDIT")
check("says it could not fast-forward",
      "could not fast-forward" in out.getvalue(), out.getvalue().strip())

print("\nD — a local commit ahead: must leave it alone")
run("checkout", "-q", "--", "page.html", cwd=CLONE)
rewind(0)
commit(CLONE, "local.txt", "local only")
before = head()
out = io.StringIO()
with redirect_stdout(out):
    wd.fast_forward()
check("head unchanged", head() == before, f"{before} -> {head()}")
check("says it is leaving it alone",
      "local commit" in out.getvalue(), out.getvalue().strip())
check("the local commit survives",
      (CLONE / "local.txt").exists())

shutil.rmtree(TMP, ignore_errors=True)
print(f"\n{passed} checks passed" + (f", {len(failed)} FAILED" if failed else ""))
sys.exit(1 if failed else 0)
