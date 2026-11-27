/**
 * Shadowless site: "Publish site" menu for the Books sheet.
 *
 * Setup (once):
 * 1. In Books, open Extensions → Apps Script and paste this file.
 * 2. Project Settings → Script properties → add:
 *      SITE_URL     https://<your-site>.vercel.app   (no trailing slash)
 *      CRON_SECRET  the same value as CRON_SECRET in Vercel
 * 3. Reload Books. A "Shadowless site" menu appears.
 */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Shadowless site')
    .addItem('Publish site', 'publishSite')
    .addToUi();
}

function publishSite() {
  var props = PropertiesService.getScriptProperties();
  var siteUrl = props.getProperty('SITE_URL');
  var secret = props.getProperty('CRON_SECRET');
  var ui = SpreadsheetApp.getUi();

  if (!siteUrl || !secret) {
    ui.alert('Set SITE_URL and CRON_SECRET in Apps Script → Project Settings → Script properties.');
    return;
  }

  SpreadsheetApp.getActive().toast('Publishing… this can take up to a minute when there are new photos.', 'Shadowless site', 10);

  var res = UrlFetchApp.fetch(siteUrl + '/api/refresh', {
    method: 'post',
    headers: { Authorization: 'Bearer ' + secret },
    muteHttpExceptions: true,
  });

  var code = res.getResponseCode();
  if (code !== 200) {
    ui.alert('Publish failed (' + code + '): ' + res.getContentText().slice(0, 500));
    return;
  }

  var body = JSON.parse(res.getContentText());
  var p = body.photos || {};
  var lines = ['Site updated.'];
  if (p.skipped) lines.push('Photos skipped: ' + p.skipped + '.');
  if (p.listed !== undefined) lines.push(p.listed + ' cards listed, ' + p.uploaded + ' new or updated photos copied.');
  if (p.withoutPhoto && p.withoutPhoto.length) {
    lines.push('No front photo in Drive for Item IDs: ' + p.withoutPhoto.join(', ') + '.');
  }
  if (p.remaining) lines.push(p.remaining + ' photos still to upload. Run Publish again.');
  if (p.failed && p.failed.length) lines.push(p.failed.length + ' photos failed to copy.');
  ui.alert(lines.join('\n'));
}
