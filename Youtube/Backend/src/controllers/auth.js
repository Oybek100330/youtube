const sha256 = require('sha256')
const path = require('path')
const jwt = require('jsonwebtoken')

const LOGIN = (req, res) => {
    const { username, password } = req.body
    // const { avatar } = req.files



	const users = req.select('users')

	let user = users.find( user => user.username === username && user.password === sha256(password) )

	if(!user) {
		res.status(400).json({ message: "Wrong username or password!" })
	}

	res.status(200).json({
        userId: user.userId,
		message: "The user successfully logged in!",
		token: jwt.sign({ userId: user.userId, agent: req['headers']['user-agent'] }, 'SECRET_KEY')
	})
}

const REGISTER = (req, res) => {
    console.log(req.files)
    console.log(req.body)
    try {
        const { avatar } = req.files
		const { username, password } = req.body

        const avatarName = avatar.name.replace(/\s/g, '')
        avatar.mv( path.join(process.cwd(), 'src', 'files', 'avatar', avatarName))

        const users = req.select('users')

        const newUser = {
            userId: users.length ? users[users.length - 1].userId + 1 : 1,
            username: username,
            password: sha256(password),
            avatarUrl: '/data/files/avatar/' + avatarName
        }
		
		users.push(newUser)
		req.insert('users', users)

		res.status(201).json({
            userId: newUser.userId,
			message: "The user successfully registered!",
			token: jwt.sign({ userId: newUser.userId, agent: req['headers']['user-agent'] }, 'SECRET_KEY')
		})

	} catch(error) {
		res.status(401).json({ message: error.message })
	}
}

module.exports = {
    REGISTER,
    LOGIN
}