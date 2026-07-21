// PDPT Watch — weekly emailer.
// Fetches the latest published digest and emails it to Laura. The digest itself is
// regenerated separately (Claude Code, every Monday ~6am) and published to GitHub Pages —
// this script's only job is to pick up whatever is live there and forward it, about an
// hour later, so the content is always fresh by the time it's fetched.
//
// Setup (same pattern as the Gmail daily summariser):
//   1. script.google.com → New project → rename it (e.g. "PDPT Newsletter")
//   2. Delete the placeholder code, paste this file's contents in
//   3. Save
//   4. Run once manually (▶ button) to authorise it — approve the Gmail-send permission
//      it asks for
//   5. Left sidebar → Triggers (clock icon) → Add Trigger:
//        Function: sendPdptNewsletter
//        Event source: Time-driven
//        Type: Week timer
//        Day: Monday
//        Time: 7am to 8am
//   6. Save

function sendPdptNewsletter() {
  var url = "https://andrewlord311-sudo.github.io/andrew-newsletters/pdpt.html";
  var html = UrlFetchApp.fetch(url).getContentText();

  MailApp.sendEmail({
    to: "laura.lord1306@gmail.com",
    subject: "PDPT Watch — Colchester & Essex",
    htmlBody: html,
  });
}
