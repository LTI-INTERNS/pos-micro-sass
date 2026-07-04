export interface PersonalDetails {
  name: string;
  email: string;
  phone?: string;
  branchId?: string;
}

export interface PasswordUpdatePayload {
  currentPassword: string;
  newPassword: string;
}