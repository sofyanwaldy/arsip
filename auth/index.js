const  express = require('express')
// const bodyParser = require('body-parser')
const path = require('path')

// Create express router
const router = express.Router()

// Transform req & res to have the same API as express
// So we can use res.status() & res.json()
const app = express()
const db = require(path.resolve(__dirname, '../server/config.js'))

// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})

// Add POST - /api/login
router.post('/login', (req, res) => {
  const username = req.body.username
  const password = req.body.password
  const qSelect = 'SELECT * from admin WHERE username=? AND password=?'
  // console.log(qSelect, [])
  db.all(qSelect,[username, password], (err, row) => {
    if (err) return res.json({ message: err })
    if (row.length > 0) {
      req.session.cookie.expires = false;
      req.session.authUser = { username: row[0].username }
      return res.json({
        success: 1,
        message: 'Login berhasil',
        username: row[0].username
      })
    }
    else return res.json({
      success: 0,
      message: 'username atau password salah'
    })
  })
  // console.log('session request', req.session)
})

// Add POST - /api/logout
router.post('/logout', (req, res) => {
  delete req.session.authUser
  res.json({ ok: true })
})

// Export the server middleware
export default {
  path: '/api',
  handler: router
}
