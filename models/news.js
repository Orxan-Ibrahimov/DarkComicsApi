const mongoose = require('mongoose')

const NewsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    shortDescription: {
        type: String,
        required: true,
    },
    blogger: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: '',
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    characters: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Character',
        },
    ],
    tags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tag',
        },
    ],
})

const News = mongoose.model('News', NewsSchema)

NewsSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

NewsSchema.set('toJSON', {
    virtuals: true,
})

exports.News = News
