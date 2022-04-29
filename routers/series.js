const express = require('express')
const mongoose = require('mongoose')
const { Serie } = require('../models/serie')
const router = express.Router()
const multer = require('multer')

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
    const series = await Serie.find()

    if (!series) {
        return res.status(400).json({
            success: false,
            message: 'series were not found',
        })
    }

    res.status(200).send(series)
})

router.get('/:serieId', async (req, res) => {
    const serie = await Serie.findById(req.params.serieId)

    if (!serie) {
        return res.status(400).json({
            success: false,
            message: 'serie was not found',
        })
    }

    res.status(200).send(serie)
})

router.post('/', uploadsOption.array('images'), async (req, res) => {
    const files = req.files
    let imagePaths = []
    const baseUrl = `${req.protocol}://${req.get('host')}/public/uploads/`
    if (files) {
        files.map((file) => {
            imagePaths.push(`${baseUrl}${file.filename}`)
        })
    }

    let serie = new Serie({
        name: req.body.name,
        images: imagePaths,
        isActive: req.body.isActive,
        discount: req.body.discount,
        isTeam: req.body.isTeam,
        deletedDate: req.body.deletedDate,
        isDeleted: req.body.isDeleted,
    })

    serie = await serie.save()

    if(!serie) {
        return res.status(404).json({
            success: false,
            message: 'serie could not be added',
        })
    }

    res.status(201).send(serie)
})

router.delete('/:serieId', (req, res) => {
    const serie = Serie.findByIdAndDelete(req.params.serieId)
    .then((deletedSerie) => { 
        if(deletedSerie){
            return res.status(200).json({
                success:true,
                message: `${deletedSerie.name} was deleted`
            })
        }
        else{
            return res.status(200).json({
                success:true,
                message: `serie was not found`
            }) 
        }
    })
    .catch((error) => {
        return res.status(500).send(error)
    })
})

router.put('/:serieId', uploadsOption.array('images'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.serieId))
    return res.status(400).send('Serie is Invalid')

    const files = req.files
    let imagePaths = []
    const baseUrl = `${req.protocol}://${req.get('host')}/public/uploads/`
    if (files) {
        files.map((file) => {
            imagePaths.push(`${baseUrl}${file.filename}`)
        })
    }

    const serie = Serie.findByIdAndUpdate(
        req.params.serieId,
        {
            name: req.body.name,
            images: imagePaths,
            isActive: req.body.isActive,
            discount: req.body.discount,
            isTeam: req.body.isTeam,
            deletedDate: req.body.deletedDate,
            isDeleted: req.body.isDeleted,
        },
        {new: true}
    )

    if(!serie) {
        return res.status(500).json({
            success: false,
            message: "serie couldn't be added"
        })
    }

    res.status(200).send(serie)
})

module.exports = router