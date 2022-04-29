const express = require('express')
const { News } = require('../models/news')
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
    const news = await News.find()

    if (!news) {
        return res.status(500).json({
            success: false,
            message: 'news was not found',
        })
    }

    res.status(200).send(news)
})

router.get('/:newsId', async (req, res) => {
    const news = await News.findById(req.params.newsId)

    if (!news) {
        return res.status(500).json({
            success: false,
            message: 'news was not found',
        })
    }

    res.status(200).send(news)
})

router.post('/', uploadsOption.single('image'), async (req, res) => {
    let file = req.file
    imagePath
    const baseUrl = `${req.protocol}://${req.get('host')}/public/uploads/`

    if (file) imagePath = `${baseUrl}${file.filename}`
    else return res.status(500).send("You didn't choose any image")

    let news = new News({
        title: req.body.title,
        description: req.body.description,
        shortDescription: req.body.shortDescription,
        blogger: req.body.blogger,
        tags: req.body.tags,
        characters: req.body.characters,
        image: imagePath,
    })

    news = await news.save()

    if (!news) return res.status(500).send('News can not be added')

    res.status(201).send(news)
})

router.delete('/:newsId', (req, res) => {
    const news = News.findByIdAndDelete(req.params.newsId)
        .then((deletedNews) => {
            if (deletedNews) {
                return res.status(200).json({
                    success: true,
                    message: 'News was deleted',
                })
            } else {
                return res.status(200).json({
                    success: false,
                    message: 'News was not found',
                })
            }
        })
        .catch((error) => {
            return res.status(500).send(error)
        })
})

router.put('/:newsId', uploadsOption.single('image'), async (req, res) => {
    const news = await News.findById(req.params.newsId)
    if (!news) return res.status(400).send('News is invalid')

    let file = req.file
    imagePath = news.filename
    const baseUrl = `${req.protocol}://${req.get('host')}/public/uploads/`

    if (file) imagePath = `${baseUrl}${file.filename}`

    const updatedNews = await News.findByIdAndUpdate(
        req.params.newsId,
        {
            title: req.body.title,
            description: req.body.description,
            shortDescription: req.body.shortDescription,
            blogger: req.body.blogger,
            tags: req.body.tags,
            characters: req.body.characters,
            image: imagePath,
        },
        { new: true }
    )

    if (!updatedNews) {
        return res.status(404).json({
            success: true,
            message: 'News can not updated!',
        })
    }

    res.status(200).send(updatedNews)
})

module.exports = router