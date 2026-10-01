export const roles = {
  pi: { zh: '負責人 (PI)', en: 'PI' },
  phd: { zh: '博士生', en: 'PhD' },
  master: { zh: '碩士生', en: 'Master' },
  ra: { zh: '研究助理', en: 'RA' },
  undergraduate: { zh: '專題生', en: 'Undergraduate' },
};
export const statuses = {
  current: { zh: '在讀', en: 'Current' },
  active: { zh: '在職', en: 'Active' },
  alumni: { zh: '已畢業', en: 'Alumni' },
  former: { zh: '已離開', en: 'Former' },
};
export const areas = {
  '3dic': { zh: '3DIC', en: '3DIC' },
  'ai-formal': { zh: 'AI for Formal / Formal Verification', en: 'AI for Formal / Formal Verification' },
  quantum: { zh: 'Quantum', en: 'Quantum' },
  formal: { zh: 'Formal Verification', en: 'Formal Verification' },
  eda: { zh: 'EDA', en: 'EDA' },
  verification: { zh: 'Design Verification', en: 'Design Verification' },
  architecture: { zh: 'Computer Architecture', en: 'Computer Architecture' },
};

/** Members page: three research pillars (maps fine-grained `area` codes). */
export const memberDisplayGroups = [
  {
    key: 'ai-formal',
    areas: ['formal', 'ai-formal', 'verification'],
    label: { zh: 'AI Formal', en: 'AI Formal' },
  },
  {
    key: 'eda-3dic',
    areas: ['eda', '3dic', 'architecture'],
    label: { zh: 'EDA 3DIC', en: 'EDA 3DIC' },
  },
  {
    key: 'quantum',
    areas: ['quantum'],
    label: { zh: 'Quantum', en: 'Quantum' },
  },
];
