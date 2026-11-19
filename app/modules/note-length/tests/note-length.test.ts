import { describe, expect, it } from "vitest";
import { describeNoteLength } from "../index";
import { MAX_NOTE_LENGTH } from "~/lib/notes";

describe("describeNoteLength", () => {
  it("counts an empty draft as zero against the limit", () => {
    expect(describeNoteLength("")).toEqual({
      count: 0,
      max: MAX_NOTE_LENGTH,
      overLimit: false,
      nearLimit: false,
      label: "0 / 2,000",
    });
  });

  it("ignores leading and trailing whitespace, as the server does", () => {
    expect(describeNoteLength("  hello \n").count).toBe(5);
  });

  it("is not near the limit just below nine tenths of it", () => {
    const length = describeNoteLength("a".repeat(MAX_NOTE_LENGTH * 0.9 - 1));
    expect(length.nearLimit).toBe(false);
    expect(length.overLimit).toBe(false);
  });

  it("is near the limit from nine tenths of it", () => {
    const length = describeNoteLength("a".repeat(MAX_NOTE_LENGTH * 0.9));
    expect(length.nearLimit).toBe(true);
    expect(length.overLimit).toBe(false);
  });

  it("is still within the limit at exactly the limit", () => {
    const length = describeNoteLength("a".repeat(MAX_NOTE_LENGTH));
    expect(length.overLimit).toBe(false);
    expect(length.nearLimit).toBe(true);
    expect(length.label).toBe("2,000 / 2,000");
  });

  it("is over the limit one character past it, and no longer just near it", () => {
    const length = describeNoteLength("a".repeat(MAX_NOTE_LENGTH + 1));
    expect(length.overLimit).toBe(true);
    expect(length.nearLimit).toBe(false);
    expect(length.label).toBe("2,001 / 2,000");
  });
});
