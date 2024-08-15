// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ publication.js ]
// * PackageName  [ server/models ]
// * Synopsis     [ Schema of publication ]
// * Author       [ Chin-Yi Cheng ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const PublicationSchema = Schema({
    TITLE: { type: String, required: true },
    IMG: { type: String },
    AUTHOR: [{ type: String }],
    DATE: { type: Date },
    ABSTRACT: { type: String },
    KEYWORDS: [{ type: String }],
    LINK: { type: String }
}, {
    collection: 'publication',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

const PublicationModel = mongoose.model('publication', PublicationSchema)

export default PublicationModel
