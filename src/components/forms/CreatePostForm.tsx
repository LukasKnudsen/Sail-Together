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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const hasMedia = imageFile !== null || mediaUrl.trim().length > 0;
  const isFormValid = hasMedia;

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
        mediaUrl: mediaUrl.trim() || undefined,
        mediaAlt: caption.trim() || "",
        locationId: "",
        imageFile,
      });
  
      setSuccess("Post created successfully!");
      setMediaUrl("");
      setCaption("");
      setImageFile(null);
  
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
    setImageFile(null);
    setError("");
    setSuccess("");
  
    if (onCancel) {
      onCancel();
    }
  }
  

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-8", className)}
      {...props}
    >
      <Field>
        <FieldLabel htmlFor="caption">Text for post</FieldLabel>
        <FieldDescription>Share whats on your mind</FieldDescription>

        <textarea
          id="caption"
          placeholder="What's on your mind?"
          value={caption}
          maxLength={1500}
          onChange={(e) => {
            const value = e.target.value.slice(0, 1500);
            setCaption(value);
          }}
          className={cn(
            "mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "min-h-[80px] max-h-60 overflow-y-auto resize-none"
          )}
        />

        <div className="mt-1 text-right text-xs text-muted-foreground">
          {caption.length}/1500
        </div>
      </Field>

      <Field>
      <FieldLabel htmlFor="image">Upload an image</FieldLabel>
      <FieldDescription>
        You can upload a photo from your device. If you prefer, you can just paste an image URL above.
      </FieldDescription>
      <Input
        id="image"
        type="file"
        accept="image/png, image/jpeg"
        className="border-2 border-dashed"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          setImageFile(file);
        }}
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