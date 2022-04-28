const mongoose = require('mongoose')

const TagSchema = mongoose.Schema({
    id:{
        type:String,
    },
    title:{
        type:String,
        required:true
    },  
    createdDate:{
        type:Date,
        default:Date.now
    },
    news: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'News',
        },
    ]
}) 

const Tag = mongoose.model("Tag", TagSchema)

TagSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

TagSchema.set('toJSON', {
    virtuals: true,
})

exports.Tag = Tag