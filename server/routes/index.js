// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ server/models ]
// * Synopsis     [ Define backend APIs ]
// * Author       [ Chin-Yi Cheng ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import memberRoute from './member'
import maintainerRoute from './maintainer'
import courseRoute from './course'
import publicationRoute from './publication'
import newsAwardRoute from './newsAward'

const wrap = fn => (...args) => fn(...args).catch(args[2])

function main(app) {
  app.get('/api/getMemBio', wrap(memberRoute.GetMemBio))
  app.get('/api/getMemBrief', wrap(memberRoute.GetMemBrief))
  app.get('/api/getMaintainer', wrap(maintainerRoute.GetMaintainer))
  app.get('/api/getCourse', wrap(courseRoute.GetCourse))
  app.get('/api/getPublication', wrap(publicationRoute.GetPublication))
  app.get('/api/getNewsAward', wrap(newsAwardRoute.GetNewsAward))
}

export default main
