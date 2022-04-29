const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },  
    isSubscriber: {
        type: Boolean,
        default: true,
    },
    image: {
        type: String,
        default: ''
    },   
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ]
})

const User = mongoose.model('User', UserSchema)

UserSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

UserSchema.set('toJSON', {
    virtuals: true,
})

exports.User = User
