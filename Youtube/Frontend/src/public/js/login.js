const formLogin = document.querySelector('.site-form')
const messageText = document.querySelector('.zmdi zmdi-account')

formLogin.onsubmit = async event => {
	try {
		event.preventDefault()

		let user = {
			username: usernameInput.value,
			password: passwordInput.value,
		}
	
		const response = await request('/auth/login', 'POST', user)
        console.log(response)
		// messageText.textContent = response.message
		// messageText.style.color = 'green'
		window.localStorage.setItem('token', response.token)
		window.localStorage.setItem('userId', response.userId)
		window.location = '/'
		
	} catch(error) {
		messageText.textContent = error.message
        messageText.style.color = 'red'
	}
}