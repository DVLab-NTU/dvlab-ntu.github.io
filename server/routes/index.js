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

const wrap = fn => (...args) => fn(...args).catch(args[2])

function main(app) {
  app.get('/api/getMemBio', wrap(memberRoute.GetMemBio))
  app.get('/api/getMaintainer', wrap(maintainerRoute.GetMaintainer))
}

export default main
