export interface User {
  id: string;
  email: string;
  password: string;
  fullName?: string | null;
  roleCode: string;
  isActive: boolean;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  dob?: string | null;
  lastLogin?: string | null;
  createdAt: string;
  updatedAt: string;
  owner?: Owner | null;
  staff?: Staff | null;
  vet?: Vet | null;
}

export interface Owner {
  id: string;
  user: User;
  address: string | null;
  locationLat: number | null;
  locationLng: number | null;
  totalPoints: number | 0;
}

export interface Staff {
  id: string;
  user: User;
  code: string;
  jobTitle: string;
  department: string;
  employmentType: string;
  employmentStatus: string;
  joinDate: string;
  endDate: string | null;
  address: string;
  citizenId: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Vet {
  id: string;
  user: User;
  bio: string;
  licenseNo: string;
  licenseIssueBy: string;
  licenseValidFrom: string;
  licenseValidTo: string;
  joinDate: string;
  endDate: string | null;
  address: string;
  citizenId: string;
  employmentStatus: string;
  createdAt: string;
  updatedAt: string;
}
