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

export function getSpeciesColor(speciesId: string) {
  const lower = (speciesId || '').toLowerCase();
  if (lower === 'dog') return 'processing';
  if (lower === 'cat') return 'warning';
  if (lower === 'bird') return 'success';
  return 'default';
}
