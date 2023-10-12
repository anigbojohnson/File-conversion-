const express = require('express')
const router = express.Router()


const { 
    loginUser,
    registerUser,
    getCode
} = require('../controller/userController')

const { 
    googleLogin,
    facebookLogin
} = require('../controller/oaut20Controller')

const {protect} = require('../middleware/authMiddleware')
router.get('/login', loginUser)
router.post('/google/oauth20',googleLogin)
router.post('/facebook/oauth20',facebookLogin)
router.post('/register',protect, registerUser)

router.post('/getCode', getCode)

module.exports = router


