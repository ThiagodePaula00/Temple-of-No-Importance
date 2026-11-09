import "server-only";
import { authenticatedApiRequest } from "@/utils/authenticated-api-request";
import type {
  AdminPasswordChangeRequestModel,
  PasswordChangeRequestModel,
} from "@/models/password-request/password-request-models";

export function findMyPasswordChangeRequest() {
  return authenticatedApiRequest<PasswordChangeRequestModel | null>(
    "/password-change-requests/mine",
    { cache: "no-store" },
  );
}

export function findPendingPasswordChangeRequests() {
  return authenticatedApiRequest<AdminPasswordChangeRequestModel[]>(
    "/password-change-requests",
    { cache: "no-store" },
  );
}
