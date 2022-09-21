// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ maintainer.js ]
// * PackageName  [ server/models ]
// * Synopsis     [ Schema of maintainer ]
// * Author       [ Chin-Yi Cheng ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const MaintainerSchema = Schema({
    NAME: { type: String, required: true },
    LINK: { type: String, required: true },
}, {
    collection: 'maintainer',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

const exportSchema = mongoose.model('maintainer', MaintainerSchema)

export default exportSchema
