const formUser = document.querySelector('.site-form')

formUser.onsubmit = async event => {
	try {
		event.preventDefault()

        let formdata = new FormData()
        formdata.append('username', usernameInput.value)
        formdata.append('password', passwordInput.value)
        formdata.append('avatar', uploadInput.files[0])

		// let newUser = {
		// 	username: usernameInput.value,
		// 	password: passwordInput.value,
		// 	avatar: uploadInput.value
		// }
	
		const response = await request('/auth/register', 'POST', formdata)
		// messageText.textContent = response.message
		// messageText.style.color = 'green'
		window.localStorage.setItem('token', response.token)
		window.localStorage.setItem('userId', response.userId)
		window.location = '/'
		
	} catch(error) {
		console.log(error.message)
	}
}