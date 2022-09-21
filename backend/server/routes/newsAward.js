// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ newsAwards.js ]
// * PackageName  [ server/routes ]
// * Synopsis     [ Get news and award data from database ]
// * Author       [ Chin-Yi Cheng ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import NewsAward from '../models/newsAward'

exports.GetNewsAward = async (req, res) => {
    // Get NewsAdwards from mongodb and return to frontend
    NewsAward.find()
        .exec((err, data) => {
            if (err)
                res.status(403).send({ message: 'error', contents: [] })
            else
                res.status(200).send({ message: 'success', contents: data })
        })
}