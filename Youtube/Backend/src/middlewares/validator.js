const registerValidator = (req, res, next) => {
	try {
		const { username, password } = req.body
		const users = req.select('users')
		const result = users.find(user => user.username == username)
		
		if(!username) throw new Error("username is required!")
		if(result) throw new Error("this username is has been selected!")
		if(!password) throw new Error("password is required!")

		if(typeof(username) !== 'string' || username.length < 1 || username.length > 50) {
			throw new Error("Invalid username!")
		}

		if (
			password.length < 5 || 
			password.length > 15 ||
			!(/[A-Za-z]/).test(password) ||
			!(/[0-9]/).test(password)
		) {
			throw new Error("Invalid password!")
		}

		return next()
		
	} catch(error) {
		res.status(400).json({ message: error.message })
	}
}

const loginValidator = (req, res, next) => {
	try {
		const { username, password } = req.body

		if(!username) throw new Error("username is required!")
		if(!password) throw new Error("password is required!")

		return next()
	} catch(error) {
		res.status(400).json({ message: error.message })
	}
}


module.exports = {
	registerValidator,
	loginValidator
}