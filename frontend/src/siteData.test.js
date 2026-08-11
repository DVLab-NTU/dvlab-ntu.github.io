import {
  getAwardData,
  getCourseData,
  getMaintainerData,
  getMemberData,
  getPublicationData,
} from './siteData'

test('provides bundled public site data without an API', () => {
  expect(getCourseData()).not.toHaveLength(0)
  expect(getMaintainerData()).not.toHaveLength(0)
  expect(getMemberData()).not.toHaveLength(0)
  expect(getAwardData()).not.toHaveLength(0)
  expect(getPublicationData()).not.toHaveLength(0)
})
