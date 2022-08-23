// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ course.js ]
// * PackageName  [ server/routes ]
// * Synopsis     [ Get course data from database ]
// * Author       [ Chin-Yi Cheng ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import Course from '../models/Course'

exports.GetCourse = async (req, res) => {
    // Get MemberBios from mongodb and return to frontend
    Course.find()
        .exec((err, data) => {
            if (err)
                res.status(403).send({ message: 'error', contents: [] })
            else
                res.status(200).send({ message: 'success', contents: data })
        })
}