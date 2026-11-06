import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().trim().pipe(z.email("Enter a valid email address.")),
  password: z.string().min(8, "Password must contain at least 8 characters.").max(72),
});

export const CreateUserSchema = z
  .object({
    name: z.string().trim().min(2, "Name must contain at least 2 characters."),
    email: z.string().trim().pipe(z.email("Enter a valid email address.")),
    password: z
      .string()
      .min(8, "Password must contain at least 8 characters.")
      .max(72)
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character."),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  })
  .transform(({ name, email, password }) => ({ name, email, password }));

export type LoginFormState = {
  email: string;
  errors: string[];
};

export type CreateUserFormState = {
  name: string;
  email: string;
  errors: string[];
};

export const ProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must contain at least 2 characters."),
  email: z.string().trim().pipe(z.email("Enter a valid email address.")),
});

export const PasswordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z
      .string()
      .min(8, "Password must contain at least 8 characters.")
      .max(72)
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character."),
    newPasswordConfirmation: z.string(),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });