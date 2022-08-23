// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ publication.js ]
// * PackageName  [ server/routes ]
// * Synopsis     [ Get publication data from database ]
// * Author       [ Chin-Yi Cheng ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import Publication from '../models/publication'

exports.GetPublication = async (req, res) => {
    // Get MemberBios from mongodb and return to frontend
    Publication.find()
        .exec((err, data) => {
            if (err)
                res.status(403).send({ message: 'error', contents: [] })
            else
                res.status(200).send({ message: 'success', contents: data })
        })
}