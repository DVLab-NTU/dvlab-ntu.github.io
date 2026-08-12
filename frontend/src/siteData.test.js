import {
  getAwardData,
  getCourseData,
  getMaintainerData,
  getMemberData,
  getPublicationData,
  getMemberById,
} from './siteData'

test('provides bundled public site data without an API', () => {
  expect(getCourseData()).not.toHaveLength(0)
  expect(getMaintainerData()).not.toHaveLength(0)
  expect(getMemberData()).not.toHaveLength(0)
  expect(getAwardData()).not.toHaveLength(0)
  expect(getPublicationData()).not.toHaveLength(0)
})

test('every award separates student collaborators from advisor metadata', () => {
  for (const award of getAwardData()) {
    expect(award.STUDENTS.length).toBeGreaterThan(0)
    expect(Array.isArray(award.ADVISORS)).toBe(true)
    expect(typeof award.SOURCE).toBe('string')
    expect(award.SOURCE).not.toBe('')
  }
})

test('contains the verified ICCAD CAD Contest awards', () => {
  const titles = getAwardData().map((a) => a.TITLE)
  expect(titles).toEqual(expect.arrayContaining([
    '2025 ICCAD CAD Contest Problem A First Place',
    '2025 ICCAD CAD Contest Problem A Third Place',
    '2025 ICCAD CAD Contest Problem A Honorable Mention',
    '2024 ICCAD CAD Contest Problem A First Place',
  ]))
})

test('every member has an explicit status and cohort field', () => {
  for (const member of getMemberData()) {
    expect(['Student', 'Graduated']).toContain(member.STATUS)
    expect(typeof member.COHORT).toBe('string')
    expect(member.ID).not.toBe('')
  }
})

test('member lookup works by id', () => {
  const first = getMemberData()[0]
  expect(getMemberById(first.ID)).toEqual(first)
  expect(getMemberById('no-such-member')).toBeUndefined()
})

test('every course links to the official NTU course catalogue', () => {
  for (const course of getCourseData()) {
    expect(course.LINK).toMatch(/^https:\/\/nol\.ntu\.edu\.tw\//)
    expect(course.TITLE).not.toBe('')
    expect(course.INTRO.length).toBeGreaterThan(0)
  }
})

test('every publication has an authors list and canonical link', () => {
  for (const pub of getPublicationData()) {
    expect(pub.AUTHOR.length).toBeGreaterThan(0)
    expect(pub.LINK).toMatch(/^https:\/\/(doi\.org|ieeexplore|dl\.acm)/)
  }
})

test('maintainers are verified current DVLab MIS members', () => {
  const links = getMaintainerData().map((m) => m.LINK)
  expect(links).toEqual(expect.arrayContaining([
    'https://github.com/Ferayer',
    'https://github.com/PioHuang',
    'https://github.com/swear01',
  ]))
})
