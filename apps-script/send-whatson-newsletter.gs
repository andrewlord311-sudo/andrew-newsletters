// What's On — weekly emailer.
// Fetches the latest published digest, converts it to a PDF, and emails it as an
// attachment to Laura. The digest itself is regenerated separately (Claude Code,
// every Monday ~6:20am) and published to GitHub Pages — this script's only job is
// to pick up whatever is live there, convert it, and forward it about an hour later.
//
// PDF conversion note: Utilities.newBlob(...).getAs(MimeType.PDF) uses Google's
// built-in HTML renderer, which is fairly basic — it doesn't support CSS custom
// properties (var(--x)) or @media queries. whatson.html is deliberately written
// with plain hardcoded CSS for this reason. If the page's styling is ever changed
// to use variables/media queries, the PDF will likely come out unstyled.
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

  var htmlBlob = Utilities.newBlob(html, MimeType.HTML, "whatson.html");
  var pdfBlob = htmlBlob.getAs(MimeType.PDF).setName("What's On - Colchester and Essex.pdf");

  MailApp.sendEmail({
    to: "FILL_IN_RECIPIENT_EMAIL_IN_LIVE_SCRIPT_ONLY",
    subject: "What's On — Colchester & Essex, this week",
    body: "This week's local activities are attached as a PDF — open days, kids' events, food & drink, and museums/exhibitions.",
    attachments: [pdfBlob],
  });
}
