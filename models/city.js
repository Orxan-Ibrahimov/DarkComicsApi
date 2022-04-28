const mongoose = require('mongoose')

const CitySchema = new mongoose.Schema({
    id: {
        type: String,
    },
    name: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
})

const City = mongoose.model('City', CitySchema)

CitySchema.virtual('id').get(function () {
    return this._id.toHexString()
})

CitySchema.set('toJSON', {
    virtuals: true,
})

exports.City = City
