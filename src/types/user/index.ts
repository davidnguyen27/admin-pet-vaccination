export interface User {
  userId: string;
  email: string;
  password: string;
  fullName?: string | null;
  roleCode: string;
}
