// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ maintainer.js ]
// * PackageName  [ server/routes ]
// * Synopsis     [ Get maintainer data from database ]
// * Author       [ Chin-Yi Cheng ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import Maintainer from '../models/Maintainer'

exports.GetMaintainer = async (req, res) => {
    // Get MemberBios from mongodb and return to frontend
    Maintainer.find()
        .exec((err, data) => {
            if (err)
                res.status(403).send({ message: 'error', contents: [] })
            else
                res.status(200).send({ message: 'success', contents: data })
        })
}