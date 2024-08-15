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

exports.GetPublications = async (req, res) => {
    // Get MemberBios from mongodb and return to frontend
    Publication.find().sort({ 'DATE': -1 })
        .exec((err, data) => {
            if (err)
                res.status(403).send({ message: 'error', contents: [] })
            else {
                // map each data's date from Date object to Month-Year string (e.g., Jan, 2021)
                const mappedData = data.map(pub => {
                    return {
                        ...pub._doc,
                        "DATE": pub.DATE.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            timeZone: 'Asia/Taipei'
                        })
                    }
                })
                res.status(200).send({ message: 'success', contents: mappedData })
            }
        })
}