import { MAX_NOTE_LENGTH } from "~/lib/notes";

export type NoteLength = {
  overLimit: boolean;
  nearLimit: boolean;
  label: string;
};

// Warn in the last tenth, early enough to trim before the limit bites.
const NEAR_LIMIT_SHARE = 0.9;

export function measureNoteLength(body: string): NoteLength {
  // The server trims before it checks the limit, so count what it will save.
  const count = body.trim().length;
  const overLimit = count > MAX_NOTE_LENGTH;
  return {
    overLimit,
    nearLimit: !overLimit && count >= MAX_NOTE_LENGTH * NEAR_LIMIT_SHARE,
    label: `${count.toLocaleString("en")} / ${MAX_NOTE_LENGTH.toLocaleString("en")}`,
  };
}
