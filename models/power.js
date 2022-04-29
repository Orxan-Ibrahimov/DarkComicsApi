const { type } = require('express/lib/response')
const mongoose = require('mongoose')

const PowerSchema = new mongoose.Schema({
    name: {
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
})

const Power = mongoose.model('Power', PowerSchema)

PowerSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

PowerSchema.set('toJSON', {
    virtuals: true,
})

exports.Power = Power
