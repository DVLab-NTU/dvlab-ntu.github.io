// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ member.js ]
// * PackageName  [ server/routes ]
// * Synopsis     [ Get member data from database ]
// * Author       [ Chin-Yi Cheng ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import MemberBio from '../models/member'

exports.GetMemBio = async (req, res) => {
    // Get MemberBios from mongodb and return to frontend
    MemberBio.findOne({ID: req.query.ID})
        .exec((err, data) => {
            if (err)
                res.status(403).send({ message: 'error', contents: [] })
            else
                res.status(200).send({ message: 'success', contents: data })
        })
}

exports.GetMemBrief = async (req, res) => {
    // Get MemberBios from mongodb and return to frontend
    MemberBio.find({},'ID NAME TEAM IMG').sort('NAME')
        .exec((err, data) => {
            if (err)
                res.status(403).send({ message: 'error', contents: [] })
            else
                res.status(200).send({ message: 'success', contents: data })
        })
}