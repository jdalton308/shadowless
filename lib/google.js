import 'server-only';
import { JWT } from 'google-auth-library';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
];

let client;

const REQUIRED_VARS = ['GOOGLE_SERVICE_ACCOUNT_EMAIL', 'GOOGLE_SERVICE_ACCOUNT_KEY', 'BOOKS_SHEET_ID'];

export function missingGoogleVars() {
  return REQUIRED_VARS.filter((name) => !process.env[name]?.trim());
}

export function hasGoogleCredentials() {
  return missingGoogleVars().length === 0;
}

/**
 * Accepts the private key however it was pasted: with literal "\n" or real
 * line breaks, with or without the surrounding quotes from the JSON file.
 */
function privateKey() {
  return process.env.GOOGLE_SERVICE_ACCOUNT_KEY.trim()
    .replace(/^"|",?$/g, '')
    .replace(/\\n/g, '\n');
}

function getClient() {
  if (!client) {
    client = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL.trim(),
      key: privateKey(),
      scopes: SCOPES,
    });
  }
  return client;
}

async function authHeaders() {
  try {
    const { token } = await getClient().getAccessToken();
    return { Authorization: `Bearer ${token}` };
  } catch (err) {
    throw new Error(
      `Google sign-in failed for ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}: ${err.message}. ` +
        'Check that GOOGLE_SERVICE_ACCOUNT_KEY is the full private_key value from the JSON key file.',
    );
  }
}

/**
 * Reads a range from the Books sheet. Numbers come back unformatted
 * (1500, not "$1,500"); dates come back as displayed in the sheet.
 * Returns null when the tab does not exist.
 */
export async function readRange(range) {
  const id = process.env.BOOKS_SHEET_ID;
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${encodeURIComponent(range)}` +
    '?valueRenderOption=UNFORMATTED_VALUE&dateTimeRenderOption=FORMATTED_STRING';
  const res = await fetch(url, { headers: await authHeaders(), cache: 'no-store' });
  if (res.status === 400) return null;
  if (res.status === 403 || res.status === 404) {
    throw new Error(
      `Sheets API ${res.status} reading ${range}. Share the Books sheet with ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL} ` +
        '(Viewer), check BOOKS_SHEET_ID, and make sure the Google Sheets API is enabled for the project.',
    );
  }
  if (!res.ok) {
    throw new Error(`Sheets API ${res.status} reading ${range}: ${await res.text()}`);
  }
  const data = await res.json();
  return data.values ?? [];
}

/**
 * Lists the files directly inside a Drive folder (works for shared drives
 * too). Returns [{ id, name, md5Checksum }].
 */
export async function listDriveFolder(folderId) {
  const headers = await authHeaders();
  const files = [];
  let pageToken;
  do {
    const params = new URLSearchParams({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'nextPageToken, files(id, name, md5Checksum)',
      pageSize: '1000',
      supportsAllDrives: 'true',
      includeItemsFromAllDrives: 'true',
    });
    if (pageToken) params.set('pageToken', pageToken);
    const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, { headers, cache: 'no-store' });
    if (!res.ok) {
      throw new Error(
        `Drive API ${res.status} listing the photos folder. Share it with ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL} ` +
          '(Viewer), check DRIVE_PHOTOS_FOLDER_ID, and make sure the Google Drive API is enabled for the project.',
      );
    }
    const data = await res.json();
    files.push(...(data.files ?? []));
    pageToken = data.nextPageToken;
  } while (pageToken);
  return files;
}

/** Downloads a Drive file's bytes (works for shared drives too). */
export async function downloadDriveFile(fileId) {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&supportsAllDrives=true`;
  const res = await fetch(url, { headers: await authHeaders(), cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Drive API ${res.status} for file ${fileId}`);
  }
  return Buffer.from(await res.arrayBuffer());
}
