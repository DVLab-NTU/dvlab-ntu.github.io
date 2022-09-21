// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ member.js ]
// * PackageName  [ server/models ]
// * Synopsis     [ Schema of member ]
// * Author       [ Chin-Yi Cheng ]
// * Copyright    [ 2022 8 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const MemberBioSchema = Schema({
    ID: { type: String, required: true, unique: true },
    NAME: { type: String, required: true },
    ENGLISH_NAME: { type: String },
    CHINESE_NAME: { type: String },
    TEAM: { type: String },
    GRADUATED: { type: Boolean },
    IMG: { type: String },
    EMAIL: { type: String },
    GITHUB: { type: String },
    FACEBOOK: { type: String },
    LINKEDIN: { type: String },
    RESEARCH_GATE: { type: String },
    PERSONAL_WEBSITE: { type: String },
    SHORT_BIO: [{ type: String }],
    INTEREST_FIELDS : [{ type: String }],
    EDUCATION : { type: Schema.Types.Mixed },
    PUBLICATION : { type: Schema.Types.Mixed }
}, {
    collection: 'memberTest',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

const exportSchema = mongoose.model('memberTest', MemberBioSchema)

export default exportSchema
