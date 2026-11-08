"use client";

import { useRef, useState } from "react";

type MarkdownImageUploaderProps = {
  disabled?: boolean;
  onImageUploaded: (url: string, altText: string) => void;
};

export function MarkdownImageUploader({
  disabled = false,
  onImageUploaded,
}: MarkdownImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setError("");
    setIsUploading(true);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || typeof data.url !== "string") {
        setError(
          typeof data.message === "string"
            ? data.message
            : "Unable to upload this image.",
        );
        return;
      }

      onImageUploaded(data.url, file.name.replace(/\.[^.]+$/, ""));
    } catch {
      setError("Unable to connect to the image upload service.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="grid justify-items-start gap-2">
      <input
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        disabled={disabled || isUploading}
        onChange={handleFileChange}
        ref={inputRef}
        type="file"
      />
      <button
        className="w-fit rounded-md border border-(--control-border) px-3 py-1.5 text-sm transition-colors hover:bg-(--menu-background) disabled:opacity-60"
        disabled={disabled || isUploading}
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        {isUploading ? "Uploading image…" : "Insert image in content"}
      </button>
      <p className="text-xs text-(--muted-text-color)">
        JPG, PNG, or WEBP up to 5 MB. The Markdown image is inserted at the cursor.
      </p>
      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
