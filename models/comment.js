const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    postComments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'News',
        },
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
})

const Comment = mongoose.model('Comment', CommentSchema)

CommentSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

CommentSchema.set('toJSON', {
    virtuals: true,
})

exports.Comment = Comment