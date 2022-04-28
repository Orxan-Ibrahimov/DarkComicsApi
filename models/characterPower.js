const { type } = require('express/lib/response');
const mongoose = require('mongoose')

const CharacterPowerSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    powerId: {
        type: String,
        required: true,
    },
    characterId: {
        type: String,
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

const CharacterPower = mongoose.model('CharacterPower', CharacterPowerSchema);

CharacterPowerSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

CharacterPowerSchema.set('toJSON', {
    virtuals: true,
})

exports.CharacterPower = CharacterPower;
