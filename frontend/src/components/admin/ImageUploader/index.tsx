"use client";

import { useState } from "react";

type ImageUploaderProps = {
  defaultValue?: string;
  disabled?: boolean;
};

export function ImageUploader({
  defaultValue = "",
  disabled = false,
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState(defaultValue);

  return (
    <div className="grid gap-2">
      <label className="grid gap-2 text-sm font-semibold" htmlFor="coverImageUrl">
        Cover image URL
        <input
          className="w-full rounded-md border border-(--control-border) bg-(--control-background) px-3 py-2 font-normal text-inherit outline-none focus:border-blue-500 disabled:opacity-60"
          defaultValue={defaultValue}
          disabled={disabled}
          id="coverImageUrl"
          name="coverImageUrl"
          onChange={(event) => setPreviewUrl(event.target.value)}
          type="url"
        />
      </label>
      <p className="text-xs text-(--muted-text-color)">
        Enter a publicly accessible image URL. File uploads require a storage
        service, which is not configured in this project yet.
      </p>
      {previewUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt="Cover preview"
          className="max-h-64 w-fit rounded-lg border border-(--card-border) object-contain"
          src={previewUrl}
        />
      )}
    </div>
  );
}