const GET = (req, res) => {
    res.json(req.select('users'))
}

const POST = (req, res) => {
    console.log(req.files)
    console.log(req.body)
}

module.exports = {
    GET,
    POST
}