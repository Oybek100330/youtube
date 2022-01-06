const router = require('express').Router()
const videoController = require('../controllers/video.js')
router.route('/')
    .get(videoController.GET)
    .post(videoController.POST)
    .put(videoController.PUT)
    .delete(videoController.DELETE)

module.exports = router