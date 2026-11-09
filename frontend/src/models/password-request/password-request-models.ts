export type PasswordChangeRequestStatus =
  | "pending"
  | "approved"
  | "denied"
  | "completed";

export type PasswordChangeRequestModel = {
  id: string;
  message: string | null;
  status: PasswordChangeRequestStatus;
  createdAt: string;
  reviewedAt: string | null;
  completedAt: string | null;
};

export type AdminPasswordChangeRequestModel = PasswordChangeRequestModel & {
  user: { id: string; name: string; email: string };
};
