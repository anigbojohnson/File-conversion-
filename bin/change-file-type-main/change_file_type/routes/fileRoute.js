const express = require('express')
const app = express();
const router = express.Router()
const bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


const {
    CPIOConverter
} = require('../controller/CPIOConverterController')

router.post('/transform_file', CPIOConverter  )

module.exports = router
