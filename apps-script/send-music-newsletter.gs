// Music Weekly — weekly emailer.
// Fetches the latest published issue and emails it to Andrew (himself, not Laura — this one's
// his). The issue itself is regenerated separately (a Claude cloud routine, every Saturday
// early morning) and published to GitHub Pages — this script's only job is to pick up whatever
// is live there and forward it, so it lands with the weekend still ahead and there is time to
// actually listen to something.
//
// Setup (same pattern as send-puzzle-newsletter.gs):
//   1. script.google.com → New project → rename it (e.g. "Music Weekly Newsletter")
//   2. Delete the placeholder code, paste this file's contents in
//   3. Change RECIPIENT below to your own address
//   4. Save
//   5. Run once manually (▶ button) to authorise it — approve the Gmail-send permission
//      it asks for
//   6. Left sidebar → Triggers (clock icon) → Add Trigger:
//        Function: sendMusicNewsletter
//        Event source: Time-driven
//        Type: Week timer
//        Day: Saturday
//        Time: 7am to 8am
//   7. Save
//
// The generator runs at 04:00 UTC, well before this fires, so the page is always the
// current week's by the time it is fetched.

function sendMusicNewsletter() {
  var url = "https://andrewlord311-sudo.github.io/andrew-newsletters/music.html";

  // Recipient intentionally left out of this reference copy — this repo is public.
  // Set it directly in the live script.google.com project instead (Andrew's own address,
  // not Laura's — this is his newsletter).
  var RECIPIENT = "RECIPIENT_EMAIL_SET_IN_LIVE_SCRIPT_ONLY";

  var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  if (response.getResponseCode() !== 200) {
    // Better to know the page is missing than to silently send nothing. GitHub Pages
    // occasionally 404s mid-deploy, and a silent failure here looks identical to
    // "the newsletter just didn't come this week".
    MailApp.sendEmail({
      to: RECIPIENT,
      subject: "Music Weekly — could not fetch this week's issue",
      body: "Fetching " + url + " returned HTTP " + response.getResponseCode() +
            ". The page may still be deploying, or the generator may have failed. " +
            "Try opening it in a browser.",
    });
    return;
  }

  MailApp.sendEmail({
    to: RECIPIENT,
    subject: "🎼 Music Weekly",
    htmlBody: response.getContentText(),
  });
}
