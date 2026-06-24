export interface User {
  id: string;
  role: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  avatarUrl: string;
  dob: string;
  isActive: boolean;
  isDeleted: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
