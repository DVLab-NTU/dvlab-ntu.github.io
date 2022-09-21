// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ newsAward.js ]
// * PackageName  [ server/models ]
// * Synopsis     [ Schema of news and award ]
// * Author       [ Chin-Yi Cheng ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const NewsAdwardSchema = Schema({
    TITLE: { type: String, required: true },
    ATTENDANTS: [{ type: String }],
    YEAR: { type: Number },
    MONTH: { type: String },
    LINK: { type: String }
}, {
    collection: 'newsAwards',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

const exportSchema = mongoose.model('newsAwards', NewsAdwardSchema)

export default exportSchema
