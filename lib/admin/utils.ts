import { $Enums } from '@prisma/client';

export function getRoleLabel(role: $Enums.Role): string {
  return role
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
