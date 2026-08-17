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

  // Guard added 17.8.26, after What's On's sibling script (same fetch-then-send
  // shape) forwarded a stale issue to Laura because its send fired before that
  // week's regeneration had landed. This fetch and the Monday regeneration are two
  // independent schedules with no coordination -- hasn't bitten PDPT yet, but the
  // race exists here too, so the same guard applies before it does.
  if (!isThisWeeksIssue(html)) {
    MailApp.sendEmail({
      to: Session.getActiveUser().getEmail(),
      subject: "PDPT Watch — held back, looked stale",
      body: "Fetched " + url + " for this week's send, but its \"Week of\" date " +
            "isn't from the last few days -- looks like last week's issue, not a " +
            "fresh one. Didn't forward it to Laura. Check whether the generator ran " +
            "yet, then re-run sendPdptNewsletter manually once it has.",
    });
    return;
  }

  // Recipient intentionally left out of this reference copy — this repo is public.
  // Set it directly in the live script.google.com project instead.
  MailApp.sendEmail({
    to: "RECIPIENT_EMAIL_SET_IN_LIVE_SCRIPT_ONLY",
    subject: "PDPT Watch — Colchester & Essex",
    htmlBody: html,
  });
}

// True if the page's own "Week of D Month YYYY" date is recent enough to be this
// week's issue, not a leftover from before the generator's most recent run. A missing
// or unparseable date counts as NOT fresh -- never guess a stale page is fine.
function isThisWeeksIssue(html) {
  var match = html.match(/Week of (\d{1,2} \w+ \d{4})/);
  if (!match) return false;
  var issueDate = new Date(match[1]);
  if (isNaN(issueDate.getTime())) return false;
  var ageDays = (new Date() - issueDate) / (1000 * 60 * 60 * 24);
  return ageDays >= 0 && ageDays < 6;
}
