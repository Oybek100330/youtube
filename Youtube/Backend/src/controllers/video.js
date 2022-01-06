const path = require('path')
const fs = require('fs')
const jwt = require('jsonwebtoken')

const GET = (req, res) => {
	const { userId, videoTitle } = req.query
	const files = req.select('files')
	if(userId) {
		res.status(200).json(
			files.filter(file => file.userId == userId)
		)
	} else if (videoTitle){
        res.status(200).json(
		    files.filter(file => file.videoTitle.toLowerCase().includes(videoTitle.toLowerCase()))
        )
	} else {
		res.status(200).json(files)
	}
}

const PUT = (req, res) => {
	const { videoId, videoTitle } = req.body
    console.log(req.body)
	const files = req.select('files')
	const index = files.findIndex(file => file.videoId == videoId)
    files[index]["videoTitle"] = videoTitle
    req.insert('files', files)

    return res.status(201).json({ message: 'OK' })
    // res.redirect('/admin')
}

const DELETE = (req, res) => {
	const { videoId } = req.body
	const files = req.select('files')
	const index = files.findIndex(file => file.videoId == videoId)
    files.splice(index, 1)
    req.insert('files', files)

    return res.status(201).json({ message: 'OK' })
    // res.redirect('/admin')
}

function twoDigit(n){
    return ('0' + n).slice(-2)
}

const POST = (req, res) => {
	const { video } = req.files
	const { title } = req.body
    let date = new Date()
    
    const size = (video.size / 1024 / 1024).toFixed(2)
    if(size > 200) return
	const videoName = video.name.replace(/\s/g, '')
	video.mv( path.join(process.cwd(), 'src', 'files', 'videos', videoName) )
    
    const files = req.select('files')
    const { userId, agent } = jwt.verify(req.headers.token, 'SECRET_KEY')
    req.userId = userId
	const newVideo = {
        videoId: files.length ? files[files.length - 1].videoId + 1 : 1,
		videoUrl: '/data/files/videos/' + videoName,
		videoTitle: title,
		userId: req.userId,
        videoSize: size + ' MB',
        uploadedData: date.getFullYear() + '/' + twoDigit((date.getMonth() + 1)) + '/' + 
        twoDigit(date.getDay()) + ' | ' + twoDigit(date.getHours()) + ':' + twoDigit(date.getMinutes())
	}

	files.push(newVideo)
	req.insert('files', files)

	return res.status(201).json({ message: 'OK' })
}

module.exports = {
	POST,
    PUT,
    DELETE,
	GET
}