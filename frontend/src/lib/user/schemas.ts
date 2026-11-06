import { z } from "zod";

export const PublicUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  isAdmin: z.boolean(),
});

export type PublicUserDto = z.infer<typeof PublicUserSchema>;