const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { Comment } = require('../models/comment')
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
    const comments = await Comment.find()

    if (!comments) {
        return res.status(400).json({
            success: false,
            message: 'Comments were not found',
        })
    }

    res.status(200).send(comments)
})

router.get('/:commentId', async (req, res) => {
    const comment = await Comment.findById(req.params.commentId)

    if (!comment) {
        return res.status(400).json({
            success: false,
            message: 'Comment was not found',
        })
    }

    res.status(200).send(comment)
})

router.post('/', uploadsOption.none(), async (req, res) => {
    let comment = new comment({
        message: req.body.message,
        user: req.body.user,
        postComments: req.body.postComments,
    })

    comment = await comment.save()

    if (!comment) {
        return res.status(404).json({
            success: false,
            message: 'comment could not be added',
        })
    }

    res.status(200).send(comment)
})

router.delete('/:commentId', (req, res) => {
    const comment = comment
        .findByIdAndDelete(req.params.commentId)
        .then((deletedcomment) => {
            if (deletedcomment) {
                return res.status(200).json({
                    success: true,
                    message: `comment was deleted`,
                })
            } else {
                return res.status(400).json({
                    success: false,
                    message: `comment was not found`,
                })
            }
        })
        .catch((err) => {
            return res.status(500).send(err)
        })
})

router.put('/:commentId', uploadsOption.none(), async (req, res) => {
    const comment = await Comment.findByIdAndUpdate(
        req.params.commentId,
        {
            message: req.body.message,
            user: req.body.user,
            postComments: req.body.postComments,
            isActive: req.body.isActive,
        },
        { new: true }
    )

    if (!comment) {
        return res.status(404).json({
            success: false,
            message: 'comment was not found',
        })
    }

    res.status(200).send(comment)
})

module.exports = router
