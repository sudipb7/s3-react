import React from "react";

export const Uploader = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [preview, setPreview] = React.useState(null);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const file = e.target.file.files[0];
      const key = e.target.key.value;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("key", key);
      const response = await fetch(
        `${import.meta.env.VITE_REACT_API_URL}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("An error occurred. Please try again later.");
      }

      const data = await response.json();
      const url = data.url;
      setPreview(url);
    } catch (error) {
      console.log(error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="space-y-6 mx-auto">
      <form
        onSubmit={handleSubmit}
        className="grid gap-3 mx-auto max-w-sm"
      >
        <input
          type="file"
          placeholder="Select a file"
          name="file"
          id="file"
          multiple={false}
          required
          disabled={isLoading}
        />
        <input
          type="text"
          name="key"
          id="key"
          placeholder="Enter key"
          disabled={isLoading}
          required
          className="px-3 py-2 rounded-md border border-neutral-700 outline-none"
        />
        <button
          disabled={isLoading}
          type="submit"
          className="px-5 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-50 text-sm disabled:opacity-50"
        >
          Upload
        </button>
      </form>
      {!isLoading && preview && (
        <div className="space-y-3 mx-auto max-w-sm">
          <h2 className="text-lg font-semibold">Presigned URL</h2>
          <div className="w-full relative">
            <input
              type="text"
              readOnly
              value={preview}
              className="px-3 py-2 rounded-md border border-neutral-700 outline-none w-full"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(preview);
                alert("Copied");
              }}
              className="absolute right-0 inset-y-0 py-0.5 px-3 rounded-md bg-white border border-neutral-700 text-sm"
            >
              📋
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
