const videoUpload = document.querySelector('.site-form')
const videoList = document.querySelector('.videos-list')

videoUpload.onsubmit = async event => {
	try {
		event.preventDefault()

        let formdata = new FormData()
        formdata.append('title', videoInput.value)
        formdata.append('video', uploadInput.files[0])
        const size = (uploadInput.files[0].size / 1024 / 1024).toFixed(2)
        if(size > 200) {
            alert('The size of this video more 200 MB')
            return
        }
	
		const response = await request('/videos', 'POST', formdata)
		// messageText.textContent = response.message
		// messageText.style.color = 'green'
		// window.localStorage.setItem('token', response.token)
		// window.localStorage.setItem('userId', response.userId)
		window.location = '/'
		
	} catch(error) {
		console.log(error.message)
	}
}

async function renderVideos () {
    const userId = window.localStorage.getItem('userId')
    const videos = await request('/videos' + '?userId=' + userId)
    const users = await request('/users')
	videoList.innerHTML = null
	for(let video of videos) {
		const [li,
            videofile, 
            p,
            img
        ] = createElements('li', 'video', 'p', 'img')
    
        // const user = users.find(user => user.userId == video.userId)

        li.className = 'video-item'
        videofile.setAttribute('src', backendApi + video.videoUrl)
        videofile.setAttribute('controls', '')
        p.className = 'content'
        p.setAttribute('data-id', '2')
        p.setAttribute('contenteditable', 'true')
        p.textContent = video.videoTitle
		img.className = 'delete-icon'
		img.setAttribute('src', './img/delete.png')
		img.setAttribute('width', '25px')
		img.setAttribute('alt', 'upload')
        img.setAttribute('data-id', '10')

        li.append(videofile, p, img)
        videoList.append(li)
        
        p.onkeyup = async event => {
            if(event.keyCode == 13){
                p.innerHTML = p.textContent
                let formdata = new FormData()
                formdata.append('videoId', video.videoId)
                formdata.append('videoTitle',  p.innerHTML)
                const response = await request('/videos', 'PUT', formdata)
            }
        }

        img.onclick = async () => {
            let formdata = new FormData()
            formdata.append('videoId', video.videoId)

            const response = await request('/videos', 'DELETE', formdata)
        }
	}
}

renderVideos()