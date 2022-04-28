const express = require('express')
const { Character } = require('../models/character')
const router = express.Router()
const multer = require('multer')
const mongoose = require('mongoose')
const { City } = require('../models/city')

const FileTypes = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FileTypes[file.mimetype]
        let typeError = new Error('invalid image Type')
        if (isValid) typeError = null
        cb(typeError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const filename = file.originalname.split(' ').join('-')
        const extension = FileTypes[file.mimetype]
        cb(null, `${filename}${Date.now()}.${extension}`)
    },
})

const uploadsOption = multer({ storage: storage })

router.get('/', async (req, res) => {
    const characterList = await Character.find()

    if (!characterList) {
        res.status(500).json({ success: false })
    }

    res.send(characterList)
})

router.get('/:characterId', async (req, res) => {
    const character = await Character.findById(req.params.characterId)
    if (!character) res.status(400).json({ success: false })

    res.status(200).send(character)
})

const cpUpload = uploadsOption.fields([
    { name: 'profileImageUrl', maxCount: 1 },
    { name: 'logoImageUrl', maxCount: 1 },
    { name: 'layoutImageUrl', maxCount: 1 },
    { name: 'firstImageUrl', maxCount: 1 },
    { name: 'secondImageUrl', maxCount: 1 },
])

router.post('/', cpUpload, async (req, res) => {
    // const city = await City.findById(req.body.city)

    // if (!city) return res.status(400).send('City is invalid')

    const profile = req.files['profileImageUrl'][0]
    const logo = req.files['logoImageUrl'][0]
    const layout = req.files['layoutImageUrl'][0]
    const first = req.files['firstImageUrl'][0]
    const second = req.files['secondImageUrl'][0]

    if (!profile)
        return res.status(400).send('profile image is not in the request!')
    if (!logo) return res.status(400).send('logo image is not in the request!')
    if (!layout)
        return res.status(400).send('layout image is not in the request!')
    if (!first)
        return res.status(400).send('first image is not in the request!')
    if (!second)
        return res.status(400).send('second image is not in the request!')

    const profileImage = profile.filename
    const logoImage = logo.filename
    const layoutImage = layout.filename
    const firstImage = first.filename
    const secondImage = second.filename

    console.log(req)
    console.log(profileImage)

    const baseUrl = `${req.protocol}://${req.get('host')}/public/uploads/`

    let character = new Character({
        name: req.body.name,
        heroName: req.body.heroName,
        firstAppearance: req.body.firstAppearance,
        logoImageUrl: `${baseUrl}${logoImage}`,
        profileImageUrl: `${baseUrl}${profileImage}`,
        layoutImageUrl: `${baseUrl}${layoutImage}`,
        isActive: req.body.isActive,
        firstImageUrl: `${baseUrl}${firstImage}`,
        secondImageUrl: `${baseUrl}${secondImage}`,
        nickname: req.body.nickname,
        creator: req.body.creator,
        height: req.body.height,
        weight: req.body.weight,
        eyeColor: req.body.eyeColor,
        news: req.body.news,
        powers: req.body.powers,
        hairStyle: req.body.hairStyle,
        education: req.body.education,
        fighting: req.body.fighting,
        durability: req.body.durability,
        energy: req.body.energy,
        strength: req.body.strength,
        speed: req.body.speed,
        intelligence: req.body.intelligence,
        description: req.body.description,
        shortDescription: req.body.shortDescription,
        city: req.body.city,
        deactivatedDate: req.body.deactivatedDate,
    })

    character = await character.save()

    if (!character) return res.status(400).send("Character can't be created!")

    res.status(201).send(character)
})

router.delete('/:characterId', (req, res) => {
    const character = Character.findByIdAndDelete(req.params.characterId)
        .then((deletedCharacter) => {
            if (deletedCharacter) {
                return res.status(200).json({
                    success: false,
                    message: 'Character was deleted!',
                })
            } else {
                return res.status(404).json({
                    success: true,
                    message: 'Character  was not found!',
                })
            }
        })
        .catch((err) => {
            return res.status(400).json(err)
        })
})

router.put('/:characterId', cpUpload, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.characterId))
        return res.status(400).send('Character is Invalid')

    const character = await Character.findById(req.params.characterId)
    if (!character) return res.status(400).send('Character is invalid')

    const city = await City.findById(req.body.city)
    if (!city) return res.status(400).send('City is invalid')

    const profile = req.files['profileImageUrl'][0]
    const logo = req.files['logoImageUrl'][0]
    const layout = req.files['layoutImageUrl'][0]
    const first = req.files['firstImageUrl'][0]
    const second = req.files['secondImageUrl'][0]

    let profileImage = character.profileImageUrl
    let logoImage = character.logoImageUrl
    let layoutImage = character.layoutImageUrl
    let firstImage = character.firstImageUrl
    let secondImage = character.secondImageUrl

    const baseUrl = `${req.protocol}://${req.get('host')}/public/uploads/`

    if (profile) profileImage = `${baseUrl}${profile.filename}`

    if (logo) logoImage = `${baseUrl}${logo.filename}`

    if (layout) layoutImage = `${baseUrl}${layout.filename}`

    if (first) firstImage = `${baseUrl}${first.filename}`

    if (second) secondImage = `${baseUrl}${second.filename}`

    const updateCharacter = await Character.findByIdAndUpdate(
        req.params.characterId,
        {
            name: req.body.name,
            heroName: req.body.heroName,
            firstAppearance: req.body.firstAppearance,
            logoImageUrl: logoImage,
            profileImageUrl: profileImage,
            firstImageUrl: firstImage,
            secondImageUrl: secondImage,
            layoutImageUrl: layoutImage,
            isActive: req.body.isActive,
            news: req.body.news,
            powers: req.body.powers,
            nickname: req.body.nickname,
            creator: req.body.creator,
            height: req.body.height,
            weight: req.body.weight,
            eyeColor: req.body.eyeColor,
            hairStyle: req.body.hairStyle,
            city: req.body.city,
            education: req.body.education,
            fighting: req.body.fighting,
            durability: req.body.durability,
            energy: req.body.energy,
            strength: req.body.strength,
            speed: req.body.speed,
            intelligence: req.body.intelligence,
            description: req.body.description,
            createdDate: req.body.createdDate,
            city: req.body.city,
            deactivatedDate: req.body.deactivatedDate,
        },
        { new: true }
    )

    if (!updateCharacter)
        return res.status(404).send('Product can not be update')

    res.status(200).send(updateCharacter)
})

module.exports = router
