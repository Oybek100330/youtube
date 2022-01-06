const usersList = document.querySelector('.navbar-list')
const avatarImg = document.querySelector('.avatar-img')
const videoList = document.querySelector('.iframes-list')
const searchbox = document.querySelector('.search-box')
const searchInput = document.querySelector('.search-input')
const microphone = document.querySelector('.speechbutton')

async function renderVideos (userId) {
    let videos = []
    if(typeof userId === 'number'){
        videos = await request('/videos' + (userId ? '?userId=' + userId : ''))
    }else {
        videos = await request('/videos' + (userId ? '?videoTitle=' + userId : ''))
    }
    const users = await request('/users')
	videoList.innerHTML = null
	for(let video of videos) {
		const [li,
            videofile, 
            div1, 
            userImage,
            div2,
            h2,
            h3,
            time, 
            a,
            span,
            img
        ] = createElements('li', 'video', 'div', 'img', 'div', 'h2', 'h3', 'time', 'a', 'span', 'img')
    
        const user = users.find(user => user.userId == video.userId)

        li.className = 'iframe'
        videofile.setAttribute('src', backendApi + video.videoUrl)
        videofile.setAttribute('controls', '')
        div1.className = 'iframe-footer'
		userImage.setAttribute('src', backendApi + user.avatarUrl)
        div2.className = 'iframe-footer-text'
        h2.className = 'channel-name'
        h2.textContent = user.username
        h3.className = 'iframe-title'
        h3.textContent = video.videoTitle
        time.className = 'uploaded-time'
        time.textContent = video.uploadedData
        a.className = 'download'
        a.setAttribute('href', backendApi + '/download' + video.videoUrl)
        span.textContent = video.videoSize
		img.setAttribute('src', './img/download.png')

        a.append(span, img)
        div2.append(h2, h3, time, a)
        div1.append(userImage, div2)
        li.append(videofile, div1)
        videoList.append(li)
	}

}

async function searchList (){
    let videos = await request('/videos')
    for(let video of videos){
        const option = document.createElement('option')
        option.setAttribute('value', video.videoTitle)
        datalist.append(option)
    }
}
searchList()

async function renderUsers () {
	const userId = window.localStorage.getItem('userId')
	const users = await request('/users')
	for(let user of users) {
		const [li, a, img, span] = createElements('li', 'a', 'img', 'span')
        li.className = 'channel'
		a.setAttribute('href', '#')
		img.setAttribute('src', backendApi + user.avatarUrl)
		img.setAttribute('width', '30px')
		img.setAttribute('height', '30px')
        span.textContent = user.username
        a.append(img, span)
        li.append(a)
		usersList.append(li)

		a.onclick = () => {
			renderVideos(user.userId)
		}
	}
    let token = window.localStorage.getItem('token')
    let userIdNumber = window.localStorage.getItem('userId')
    let finded = users.find(user => user.userId == userIdNumber)
    if(token) avatarImg.setAttribute('src', backendApi + finded.avatarUrl)
}

searchbox.onsubmit = async event => {
    event.preventDefault()
    const title = searchInput.value
    renderVideos(title)
}

const voice = new webkitSpeechRecognition()
voice.lang = 'en-EN'

microphone.onclick = () => {
    voice.start()
}

voice.onaudiostart = () => {
    console.log('start...');
}

voice.onaudioend = () => {
    console.log('end');
}

voice.onresult = event => {
    let result = event.results[0][0].transcript
    searchInput.value = result
    console.log(result);
    setTimeout( () => {
        renderVideos(result)
    }, 1000)
}

renderUsers()
renderVideos()