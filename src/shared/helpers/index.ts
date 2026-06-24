export function mapRoleCode(role?: string) {
  if (!role) return 'unknown role';
  const roleCodeMap: Record<string, string> = {
    staff: 'STAFF',
    veterinarian: 'VET',
    owner: 'OWN',
    admin: 'ADMIN',
  };
  return roleCodeMap[role.toLowerCase()] || role;
}
