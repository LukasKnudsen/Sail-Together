type AddPostPopUpProps = {
  open: boolean;
  onClose: () => void;
};

export default function AddPostModal({ open, onClose }: AddPostPopUpProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Create a post</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-3">
          <input
            className="w-full rounded-lg border border-gray-200 p-2"
            placeholder="Title"
          />
          <textarea
            className="w-full rounded-lg border border-gray-200 p-2"
            placeholder="What’s on your mind?"
            rows={5}
          />
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2"
            >
              Cancel
            </button>
            <button className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700">
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
