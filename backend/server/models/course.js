// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ course.js ]
// * PackageName  [ server/models ]
// * Synopsis     [ Schema of course ]
// * Author       [ Chin-Yi Cheng ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const CourseSchema = Schema({
    TITLE: { type: String, required: true },
    LINK: { type: String, required: true },
    INTRO: { type: Array },
    CONTENTS: { type: Array },
    SEMESTER: { type: String },
    GITHUB: { type: String }
}, {
    collection: 'course',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

const exportSchema = mongoose.model('course', CourseSchema)

export default exportSchema
