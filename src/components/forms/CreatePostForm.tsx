import { useState } from "react";
import { cn } from "@/lib/utils";
import { Field, FieldLabel, FieldDescription } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { getCurrentUser } from "@/lib/parse/auth";
import { createPost } from "@/features/posts/api";

type CreatePostFormProps = React.ComponentProps<"form"> & {
  onCancel?: () => void;
  onCreated?: () => void;
};

export default function CreatePostForm({
  className,
  onCancel,
  onCreated,
  ...props
}: CreatePostFormProps) {
  const [mediaUrl, setMediaUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const hasMediaUrl = mediaUrl.trim().length > 0;
  const isFormValid = hasMediaUrl;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isFormValid || isSubmitting) return;

    const currentUser = getCurrentUser();
    if (!currentUser) {
      setError("You must be logged in to create a post");
      return;
    }

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      await createPost({
        mediaUrl: mediaUrl.trim(),
        mediaAlt: caption.trim() || "",
        // Missing loc for formula, therefore empty string
        locationId: "",
      });

      setSuccess("Post created successfully!");
      setMediaUrl("");
      setCaption("");

      if (onCreated) {
        onCreated();
      }
    } catch (err: any) {
      console.error("Error creating post:", err);
      const message = err instanceof Error ? err.message : "Failed to create post";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancelClick() {
    setMediaUrl("");
    setCaption("");
    setError("");
    setSuccess("");

    if (onCancel) {
      onCancel();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-8 py-4", className)}
      {...props}
    >
      <Field>
        <FieldLabel htmlFor="caption">Text for post</FieldLabel>
        <FieldDescription>
          Share whats on your mind
        </FieldDescription>
        <Input
          id="caption"
          type="text"
          placeholder="What's on your mind?"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="mediaUrl">Image URL</FieldLabel>
        <FieldDescription>
          Paste a link to the image you want to share.
        </FieldDescription>
        <Input
          id="mediaUrl"
          type="url"
          required
          placeholder="https://example.com/your-photo.jpg"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          className="min-h-20"
        />
      </Field>

      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="bg-destructive/10 text-destructive border-destructive/20 w-full rounded-xl border px-3 py-2 text-center text-sm font-medium"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="alert"
          aria-live="polite"
          className="w-full rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-center text-sm font-medium text-green-700"
        >
          {success}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          size="lg"
          variant="secondary"
          className="flex-1"
          onClick={handleCancelClick}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          size="lg"
          className="flex-1"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting && <Spinner />}
          Post
        </Button>
      </div>
    </form>
  );
}
