// What's On — weekly emailer.
// Fetches the latest published digest and emails it inline to Laura. The digest itself
// is regenerated separately (Claude Code, every Monday ~6:20am) and published to GitHub
// Pages — this script's only job is to pick up whatever is live there and forward it
// about an hour later.
//
// Sent as inline HTML (not a PDF attachment) so the links inside are tappable, it reads
// straight from the inbox without opening an attachment, and replies come back to the
// sender as feedback. whatson.html must keep its plain hardcoded CSS — Gmail strips CSS
// custom properties (var(--x)) and @media queries, so variables/dark-mode blocks would
// silently flatten the design and stop links rendering as links.
//
// Setup (same pattern as the PDPT Watch emailer):
//   1. script.google.com → New project → rename it (e.g. "What's On Newsletter")
//   2. Delete the placeholder code, paste this file's contents in
//   3. Fill in the recipient email below (left blank here on purpose — this repo
//      is public, see PDPT-WATCH-FAQ.md for why that matters)
//   4. Save
//   5. Run once manually (▶ button) to authorise it — approve the Gmail-send
//      permission it asks for. This will send a real email immediately.
//   6. Left sidebar → Triggers (clock icon) → Add Trigger:
//        Function: sendWeeklyWhatsOn
//        Event source: Time-driven
//        Type: Week timer
//        Day: Monday
//        Time: 7am to 8am
//   7. Save

function sendWeeklyWhatsOn() {
  var url = "https://andrewlord311-sudo.github.io/andrew-newsletters/whatson.html";
  var html = UrlFetchApp.fetch(url).getContentText();

  MailApp.sendEmail({
    to: "FILL_IN_RECIPIENT_EMAIL_IN_LIVE_SCRIPT_ONLY",
    subject: "What's On — Colchester & Essex, this week",
    htmlBody: html,
  });
}
