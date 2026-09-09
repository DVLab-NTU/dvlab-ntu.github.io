export function validateEntry({ entry }) {
  for (const field of ['bio', 'intro', 'researchInterests']) {
    const value = entry.get('data').get(field);
    if (value && (value.get('zh')?.trim() || value.get('en')?.trim()) &&
        !(value.get('zh')?.trim() && value.get('en')?.trim())) {
      throw new Error(`${field}: provide both Chinese and English, or leave both empty.`);
    }
  }
  if (entry.get('collection') !== 'members') return entry;
  const id = entry.get('data').get('id');
  if (entry.get('newRecord')) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
      throw new Error('New member IDs must use lowercase letters, numbers and hyphens.');
    }
  } else if (id !== entry.get('slug')) {
    throw new Error('Keep the existing member ID so its filename and public URL remain unchanged.');
  }
  return entry;
}

if (typeof window !== 'undefined' && window.CMS) {
  window.CMS.registerEventListener({ name: 'preSave', handler: validateEntry });
  window.CMS.init();
}
