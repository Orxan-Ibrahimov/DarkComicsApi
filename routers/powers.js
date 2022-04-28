const express = require('express')
const multer = require('multer')
const { Power } = require('../models/power')
const router = express.Router()

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
    const powers = await Power.find()

    if (!powers) {
        return res.status(500).json({
            success: false,
            message: 'Power can not found',
        })
    }

    res.status(200).send(powers)
})

router.get('/:powerId', async (req, res) => {
    const power = await Power.findById(req.params.powerId)

    if (!power) {
        return res.status(500).json({
            success: false,
            message: 'Power can not found',
        })
    }

    res.status(200).send(power)
})

router.post('/', uploadsOption.none(), async (req, res) => {
    let power = new Power({
        name: req.body.name,
        isActive: req.body.isActive,
    })

    power = await power.save()

    if (!power) return res.status(404).send('Power can not be added')

    res.status(201).send(power)
})

router.delete('/:powerId', (req, res) => {
    const power = Power.findByIdAndDelete()
        .then((deletedPower) => {
            if (deletedPower) {
                return res.status(400).json({
                    success: true,
                    message: 'power was deleted',
                })
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'power was not found',
                })
            }
        })
        .catch((err) => {
            return res.status(400).send(err)
        })
})

router.put('/:powerId', uploadsOption.none(), async (req, res) => {
    const power = await Power.findByIdAndUpdate(
        req.params.powerId,
        {
            name: req.body.name,
            isActive: req.body.isActive,
        },
        {new: true}
    )

    if(!power) return res.status(500).send("power was not found");

    res.status(200).send(power)
});

module.exports = router