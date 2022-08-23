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

const wrap = fn => (...args) => fn(...args).catch(args[2])

function main(app) {
  app.get('/api/getMemBio', wrap(memberRoute.GetMemBio))
  app.get('/api/getMaintainer', wrap(maintainerRoute.GetMaintainer))
  app.get('/api/getCourse', wrap(courseRoute.GetCourse))
}

export default main
