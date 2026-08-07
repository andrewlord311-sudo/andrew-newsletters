// Puzzle Weekly — weekly emailer.
// Fetches the latest published issue and emails it to Andrew (himself, not Laura — this one's
// his). The issue itself is regenerated separately (Claude Code, every Friday early morning)
// and published to GitHub Pages — this script's only job is to pick up whatever is live there
// and forward it, so it lands with the weekend still ahead.
//
// Setup (same pattern as send-pdpt-newsletter.gs):
//   1. script.google.com → New project → rename it (e.g. "Puzzle Weekly Newsletter")
//   2. Delete the placeholder code, paste this file's contents in
//   3. Save
//   4. Run once manually (▶ button) to authorise it — approve the Gmail-send permission
//      it asks for
//   5. Left sidebar → Triggers (clock icon) → Add Trigger:
//        Function: sendPuzzleNewsletter
//        Event source: Time-driven
//        Type: Week timer
//        Day: Friday
//        Time: 7am to 8am
//   6. Save

function sendPuzzleNewsletter() {
  var url = "https://andrewlord311-sudo.github.io/andrew-newsletters/puzzles.html";
  var html = UrlFetchApp.fetch(url).getContentText();

  // Recipient intentionally left out of this reference copy — this repo is public.
  // Set it directly in the live script.google.com project instead (Andrew's own address,
  // not Laura's — this is his newsletter).
  MailApp.sendEmail({
    to: "RECIPIENT_EMAIL_SET_IN_LIVE_SCRIPT_ONLY",
    subject: "🧩 Puzzle Weekly",
    htmlBody: html,
  });
}
