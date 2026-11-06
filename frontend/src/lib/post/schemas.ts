import { z } from "zod";

export const AdminPostSchema = z.object({
  title: z.string().trim().min(2, "Title must contain at least 2 characters."),
  excerpt: z.string().trim().max(500, "Excerpt must be at most 500 characters."),
  content: z.string().min(1, "Post content is required."),
  coverImageUrl: z.union([z.literal(""), z.string().url("Enter a valid image URL.")]),
  published: z.boolean(),
});

export type AdminPostInput = z.infer<typeof AdminPostSchema>;

export type PostActionState = {
  fields: AdminPostInput;
  errors: string[];
};

export function readPostFormFields(formData: FormData): AdminPostInput {
  return {
    title: String(formData.get("title") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    content: String(formData.get("content") ?? ""),
    coverImageUrl: String(formData.get("coverImageUrl") ?? ""),
    published: formData.get("published") === "on",
  };
}