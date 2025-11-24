import { Button } from "@/components/ui/button";

type CreatePostPromptProps = {
  onAddPost: () => void;
};

export function CreatePostPrompt({ onAddPost }: CreatePostPromptProps) {
  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="flex items-center justify-between rounded-3xl bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">

          <span className="text-base text-gray-500">Whats new?</span>
        </div>

        <Button
          onClick={onAddPost}
          className="rounded-xl px-5 py-2 text-sm font-semibold"
        >
          Add Post
        </Button>
      </div>
    </div>
  );
}
