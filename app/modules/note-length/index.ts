import { measureNoteLength, type NoteLength } from "./lib/note-length";

export type { NoteLength };

/**
 * How long a Note draft is against the limit the server enforces, for the
 * character counter under the notes box.
 */
export function describeNoteLength(body: string): NoteLength {
  return measureNoteLength(body);
}
