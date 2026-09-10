import { roles, areas } from '../data/member-labels.mjs';
export const isFormer = member => member.status === 'alumni' || member.status === 'former';
export function groupMembers(members) {
  const rank = (values, key) => Object.keys(values).indexOf(key);
  const group = member => isFormer(member) ? 2 : member.role === 'pi' ? 0 : 1;
  const sorted = [...members].sort((a, b) => {
    const difference = group(a) - group(b);
    if (difference) return difference;
    if (group(a) === 1) {
      const area = rank(areas, a.area) - rank(areas, b.area);
      const role = rank(roles, a.role) - rank(roles, b.role);
      if (area || role) return area || role;
    } else {
      const cohort = (b.cohort ?? 0) - (a.cohort ?? 0);
      if (cohort) return cohort;
    }
    return a.id.localeCompare(b.id, 'en');
  });
  const groups = [];
  for (const member of sorted) {
    const key = isFormer(member) ? member.cohort ?? 'unknown' : 'current';
    const last = groups.at(-1);
    if (last?.key === key) last.members.push(member);
    else groups.push({ key, members: [member] });
  }
  return groups;
}

export function admissionCohortLabel(cohort, lang) {
  if (cohort == null) return lang === 'zh' ? '入學屆別未提供' : 'Admission cohort not provided';
  return lang === 'zh' ? `${100 + cohort} 學年度入學（${2011 + cohort}）` : `${2011 + cohort} admission cohort (ROC ${100 + cohort})`;
}
