import fs from 'node:fs';
import path from 'node:path';

export function resolveMemberAvatar(member: { id: string; avatar?: string }): string {
  const source = member.avatar?.trim() || `/member/images/${member.id}.jpg`;
  if (fs.existsSync(path.join(process.cwd(), 'public', source))) return source;
  if (member.avatar?.trim()) throw new Error(`Missing member avatar: ${source}`);
  return '/images/avatar-default.png';
}
