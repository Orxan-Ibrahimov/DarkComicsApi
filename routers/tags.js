const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { Tag } = require('../models/tag')
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
    const tags = await Tag.find()

    if (!tags) {
        return res.status(400).json({
            success: false,
            message: 'tags were not found',
        })
    }

    res.status(200).send(tags)
})

router.get('/:tagId', async (req, res) => {
    const tag = await Tag.findById(req.params.tagId)

    if (!tag) {
        return res.status(400).json({
            success: false,
            message: 'tag was not found',
        })
    }

    res.status(200).send(tag)
})

router.post('/', uploadsOption.none(), async (req, res) => {
    let tag = new Tag({
        title: req.body.title,
        news: req.body.news,
    })

    tag = await tag.save()

    if (!tag) {
        return res.status(404).json({
            success: false,
            message: 'tag could not be added',
        })
    }

    res.status(200).send(tag)
})

router.delete('/:tagId', (req, res) => {
    const tag = Tag.findByIdAndDelete(req.params.tagId)
        .then((deletedTag) => {
            if (deletedTag) {
                return res.status(200).json({
                    success: true,
                    message: `${deletedTag.title} was deleted`,
                })
            } else {
                return res.status(400).json({
                    success: false,
                    message: `tag was not found`,
                })
            }
        })
        .catch((err) => {
            return res.status(500).send(err)
        })
})

router.put('/:tagId', uploadsOption.none(), async (req, res) => {
    const tag = await Tag.findByIdAndUpdate(
        req.params.tagId,
        {
            title: req.body.title,
            news: req.body.news,
        },
        {new: true}
    )

    if(!tag) {
        return res.status(404).json({
            success: false,
            message: 'tag was not found',
        })
    }

    res.status(200).send(tag)
})

module.exports = router