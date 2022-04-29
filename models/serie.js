const mongoose = require('mongoose')

const SerieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    images: [
        {
            type: String,
            default: '',
        },
    ],
    deletedDate: {
        type: Date,
        default: null,
    },
    discount: {
        type: Number,
        default:0
    },
    isDeleted:{
        type: Boolean,
        default: false,
    },
    isTeam:{
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
})

// ComicDetails

const Serie = mongoose.model('Serie', SerieSchema)

SerieSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

SerieSchema.set('toJSON', {
    virtuals: true,
})

exports.Serie = Serie