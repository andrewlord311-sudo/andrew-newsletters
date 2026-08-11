// Puzzle Weekly — rating collector.
// A tiny Apps Script Web App with two jobs, both hit via plain GET (so a click on a link in
// the email is enough — no page to fill in, no login):
//
//   1. Log a rating. The email's 👍/🙂/👎 links call this with ?week=&cat=&item=&rating=
//      and it appends one row to a Google Sheet, then shows a small "thanks" page.
//   2. Serve a summary. Called with ?mode=summary, it reads that same Sheet back as JSON —
//      counts per category, plus the most recent raw rows — so the Friday generation task
//      can fetch it and weight next week's picks toward what's actually been rated well.
//
// Setup (same pattern as send-pdpt-newsletter.gs):
//   1. Create a new Google Sheet (any name, e.g. "Puzzle Weekly Ratings"). Copy its ID from
//      the URL: https://docs.google.com/spreadsheets/d/THIS_PART_IS_THE_ID/edit
//   2. script.google.com → New project → rename it (e.g. "Puzzle Rating Collector")
//   3. Delete the placeholder code, paste this file's contents in
//   4. Replace SHEET_ID below with the ID from step 1
//   5. Save, then Deploy → New deployment → type "Web app"
//        Execute as: Me
//        Who has access: Anyone
//      (needs to be "Anyone" so clicking a link in Gmail works without you being logged in
//      to the right Google account in that browser — the sheet itself stays private, only
//      this one narrow doGet endpoint is exposed)
//   6. Copy the deployment's Web App URL — it ends in /exec
//   7. In this repo's puzzles.html, find/replace every
//        https://script.google.com/macros/s/PUZZLE_RATING_SCRIPT_ID/exec
//      with that real URL (this reference copy deliberately keeps the placeholder — see
//      README.md / PDPT-WATCH-FAQ.md for why nothing identifying goes in the public repo)
//   8. Also paste the real Web App URL into the puzzle-weekly-newsletter scheduled task's
//      prompt (~/.claude/scheduled-tasks/puzzle-weekly-newsletter/SKILL.md), replacing the
//      same placeholder there, so the generator can fetch ?mode=summary
//   9. Run doGet once manually with a fake event object (or just visit the /exec URL with
//      ?mode=summary in a browser) to trigger the one-time permission approval

const SHEET_ID = "PUZZLE_RATINGS_SHEET_ID"; // replace with your real Sheet ID (step 4 above)
const SHEET_NAME = "Puzzle Weekly Ratings";

function doGet(e) {
  var p = (e && e.parameter) || {};

  if (p.mode === "summary") {
    return ContentService
      .createTextOutput(JSON.stringify(buildSummary()))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Logging path — ignore silently-malformed hits rather than erroring on a stray click.
  if (p.cat && p.item && p.rating) {
    logRating(p.week || "", p.cat, p.item, p.rating);
  }

  return HtmlService.createHtmlOutput(
    "<html><body style='font-family:sans-serif;text-align:center;padding:3rem;color:#221F2E;'>" +
    "<h2>Thanks — rating saved 👍</h2>" +
    "<p>You can close this tab.</p>" +
    "</body></html>"
  );
}

function logRating(week, cat, item, rating) {
  var sheet = getSheet_();
  sheet.appendRow([new Date(), week, cat, item, rating]);
}

function buildSummary() {
  var sheet = getSheet_();
  var rows = sheet.getDataRange().getValues();
  rows.shift(); // header row

  var byCategory = {};
  var recent = [];

  rows.forEach(function (row) {
    var ts = row[0], week = row[1], cat = row[2], item = row[3], rating = row[4];
    if (!cat || !rating) return;

    if (!byCategory[cat]) byCategory[cat] = { up: 0, mid: 0, down: 0 };
    if (byCategory[cat][rating] !== undefined) byCategory[cat][rating]++;

    recent.push({ week: week, cat: cat, item: item, rating: rating });
  });

  // Most recent 40 only — plenty for weighting one week's picks, keeps the payload small.
  recent = recent.slice(-40);

  return { byCategory: byCategory, recent: recent };
}

function getSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["Timestamp", "Week", "Category", "Item", "Rating"]);
  }
  return sheet;
}
