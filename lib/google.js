import 'server-only';
import { JWT } from 'google-auth-library';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
];

let client;

export function hasGoogleCredentials() {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY &&
      process.env.BOOKS_SHEET_ID,
  );
}

function getClient() {
  if (!client) {
    client = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      // Vercel stores multi-line keys with literal "\n"; restore real newlines.
      key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY.replace(/\\n/g, '\n'),
      scopes: SCOPES,
    });
  }
  return client;
}

async function authHeaders() {
  const { token } = await getClient().getAccessToken();
  return { Authorization: `Bearer ${token}` };
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
  if (!res.ok) {
    throw new Error(`Sheets API ${res.status} reading ${range}: ${await res.text()}`);
  }
  const data = await res.json();
  return data.values ?? [];
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
