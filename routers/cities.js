const express = require('express')
const { City } = require('../models/city')
const router = express.Router()
const multer = require('multer')
const mongoose = require('mongoose')


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
    const cities = await City.find()

    if (!cities) res.status(500).json({ success: false })

    res.status(200).send(cities)
})


router.get('/:cityId', async (req, res) => {
    const city = await City.findById(req.params.cityId)

    if (!city) {
        return res.status(500).json({
            success: false,
            message: 'City can not found',
        })
    }

    res.status(200).send(city)
})

router.post('/', uploadsOption.none(), async (req, res) => {
    let city = new City({
        name: req.body.name,
        isActive: req.body.isActive
    })

    city = await city.save()

    if (!city) return res.status(404).send('City can not be created!')

    res.status(201).send(city)
})

router.delete('/:cityId', (req, res) => {
    const city = City.findByIdAndDelete(req.params.cityId)
    .then((deletedCity) => {
        if(deletedCity){
            return  res.status(200).json({
                success: true,
                message: 'City was deleted!',
            })
        }
        else{
            return  res.status(500).json({
                success: false,
                message: 'City was not found!',
            })
        }
    })
    .catch((err) => {
       return res.status(500).send(err)
    })
})

router.put('/:cityId', uploadsOption.none(), async (req, res) => {
    const city = await City.findByIdAndUpdate(
        req.params.cityId,
        {
            name: req.body.name,
            isActive: req.body.isActive
        },
        {new: true}
    )

    if(!city){
        return  res.status(404).json({
            success: true,
            message: 'City can not updated!',
        })
    }

    res.status(200).send(city)
})


module.exports = router
