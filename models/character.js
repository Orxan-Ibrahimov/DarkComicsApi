const mongoose = require('mongoose')

const characterSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    heroName: {
        type: String,
        required: true,
    },
    firstAppearance: {
        type: String,
        required: true,
    },
    firstImageUrl: {
        type: String,
        default: '',
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
    },
    secondImageUrl: {
        type: String,
        default: '',
    },
    logoImageUrl: {
        type: String,
        default: '',
    },
    profileImageUrl: {
        type: String,
        default: '',
    },
    layoutImageUrl: {
        type: String,
        default: '',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    creator: {
        type: String,
        required: true,
    },
    height: {
        type: String,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    eyeColor: {
        type: String,
        required: true,
    },
    hairStyle: {
        type: String,
        required: true,
    },
    education: {
        type: String,
        required: true,
    },
    fighting: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
    },
    durability: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
    },
    energy: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
    },
    strength: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
    },
    speed: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
    },
    intelligence: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
    },
    description: {
        type: String,
        required: true,
    },
    shortDescription: {
        type: String,
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    deactivatedDate: {
        type: Date
    },
    characterPowers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Power',
        },
    ]
    // Products, ToyCharacters, ProductCharacters, CharacterNews,
});

const Character = mongoose.model('Character', characterSchema);

characterSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

characterSchema.set('toJSON', {
    virtuals: true,
})

exports.Character = Character;