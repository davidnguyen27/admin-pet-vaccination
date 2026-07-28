export interface User {
  id: string;
  role: string;
  email: string;
  full_name: string;
  phone_number: string;
  avatar_url: string;
  dob: string;
  is_active: boolean;
  is_deleted: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
