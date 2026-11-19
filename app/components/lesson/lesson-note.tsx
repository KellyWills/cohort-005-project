import { useState, useId } from "react";
import { useFetcher } from "react-router";
import type { LessonLoaderData } from "./loader-data";
import { describeNoteLength, type NoteLength } from "~/modules/note-length";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { NotebookPen } from "lucide-react";
import { cn, formatRelativeTime } from "~/lib/utils";

export function LessonNote({ note }: { note: LessonLoaderData["note"] }) {
  const fetcher = useFetcher<{ ok: boolean; error?: string }>();
  const isSaving = fetcher.state !== "idle";
  const error = fetcher.data?.error;
  const [body, setBody] = useState(note?.body ?? "");
  const length = describeNoteLength(body);
  const counterId = useId();

  return (
    <Card className="mb-8">
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <NotebookPen className="size-4 text-muted-foreground" />
          <h2 className="font-semibold">Your notes</h2>
        </div>

        <fetcher.Form method="post" className="space-y-3">
          <input type="hidden" name="intent" value="save-note" />
          <Textarea
            name="body"
            rows={6}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Only you can read this."
            className="resize-y"
            aria-describedby={counterId}
            aria-invalid={length.overLimit || undefined}
          />
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              size="sm"
              disabled={isSaving || length.overLimit}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <NoteStatus error={error} note={note} />
            <NoteCharacterCount id={counterId} length={length} />
          </div>
        </fetcher.Form>
      </CardContent>
    </Card>
  );
}

function NoteStatus({
  error,
  note,
}: {
  error: string | undefined;
  note: LessonLoaderData["note"];
}) {
  if (error) return <span className="text-sm text-red-600">{error}</span>;
  if (!note) return null;
  return (
    <span suppressHydrationWarning className="text-xs text-muted-foreground">
      Last edited {formatRelativeTime(note.updatedAt)}
    </span>
  );
}

function NoteCharacterCount({
  id,
  length,
}: {
  id: string;
  length: NoteLength;
}) {
  return (
    <span
      id={id}
      aria-live="polite"
      className={cn(
        "ml-auto text-xs tabular-nums",
        length.overLimit
          ? "font-medium text-red-600"
          : length.nearLimit
            ? "text-amber-600"
            : "text-muted-foreground"
      )}
    >
      {length.label} characters
      {length.overLimit && " (over the limit)"}
    </span>
  );
}
