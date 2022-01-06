const express = require('express')
const fileUpload = require('express-fileupload')
const path = require('path')
const cors = require('cors')
const PORT = process.env.PORT || 4000
const app = express()

app.use(cors(/*{origin: 'http://localhost:4001'}*/))
app.use(fileUpload())

app.use('/data/files/', express.static(path.join(__dirname, 'files')))

const modelMiddleware = require('./middlewares/model.js')
const authTokenMiddleware = require('./middlewares/authToken.js')

app.use(express.json())
app.use(modelMiddleware)


const userRouter = require('./routes/user.js')
const authRouter = require('./routes/auth.js')
const videoRouter = require('./routes/video.js')

app.get('/download/data/files/videos/:videoName', (req, res) => {
    res.download( path.join(__dirname, 'files', 'videos', req.params.videoName) )
})

app.use('/auth', authRouter)
app.use('/videos', videoRouter)
app.use('/users', userRouter)
app.use(authTokenMiddleware)

app.listen(PORT, () => console.log('server is running on http://localhost:' + PORT))