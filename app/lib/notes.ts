export const MAX_NOTE_LENGTH = 2000;

/**
 * A browser submits each textarea line break as CRLF but counts it as one
 * character while you type, so fold CRLF back to LF before measuring a Note.
 */
export function normalizeNoteBody(body: string): string {
  return body.replace(/\r\n/g, "\n");
}
