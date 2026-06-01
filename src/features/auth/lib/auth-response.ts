export type AuthResponse = {
  accessToken: string;
};

export type AuthApprovalStatus = "pending" | "approved" | "rejected" | string;

export type RegisteredUserPreview = {
  id: number;
  email: string;
  role: string;
  approvalStatus: AuthApprovalStatus;
  rejectionReason?: string | null;
};

export type RegisterAuthResponse = {
  message: string;
  user: RegisteredUserPreview;
};

export type LoginBlockedResponse = {
  message: string;
  approvalStatus: AuthApprovalStatus;
  rejectionReason?: string | null;
};
