"use client";

import { useState } from "react";

type ImageUploaderProps = {
  defaultValue?: string;
  disabled?: boolean;
  onValueChange?: (url: string) => void;
};

export function ImageUploader({
  defaultValue = "",
  disabled = false,
  onValueChange,
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState(defaultValue);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);

      const token = localStorage.getItem("accessToken") || "";

      const res = await fetch("http://localhost:3000/upload", {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const imageUrl = data.url || data.path;
        setPreviewUrl(imageUrl);
        onValueChange?.(imageUrl);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Image upload failed:", errorData);
      }
    } catch (error) {
      console.error("Connection error while uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid gap-2">
      <label className="grid gap-2 text-sm font-semibold" htmlFor="coverImageFile">
        Cover image
        <input
          className="w-full rounded-md border border-(--control-border) bg-(--control-background) px-3 py-2 font-normal text-inherit outline-none file:mr-4 file:rounded file:border-0 file:bg-(--card-background) file:px-3 file:py-1 file:text-sm file:font-semibold file:text-inherit hover:file:cursor-pointer disabled:opacity-60 focus:border-blue-500"
          disabled={disabled || isUploading}
          id="coverImageFile"
          name="coverImageFile"
          onChange={handleFileChange}
          type="file"
          accept="image/jpeg,image/png,image/webp"
        />
      </label>
      
      <p className="text-xs text-(--muted-text-color)">
        {isUploading ? "Uploading and processing image..." : "Select an image (JPG, PNG, WEBP up to 5MB)."}
      </p>

      {previewUrl && (
        <img
          alt="Cover preview"
          className="max-h-64 w-fit rounded-lg border border-(--card-border) object-contain"
          src={previewUrl}
        />
      )}
    </div>
  );
}