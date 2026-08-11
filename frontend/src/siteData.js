import awards from './data/awards.json'
import courses from './data/courses.json'
import maintainers from './data/maintainers.json'
import members from './data/members.json'
import publications from './data/publications.json'

export const getAwardData = () => awards
export const getCourseData = () => courses
export const getMaintainerData = () => maintainers
export const getMemberData = () => members
export const getMemberById = (id) => members.find((member) => member.ID === id)
export const getPublicationData = () => publications
