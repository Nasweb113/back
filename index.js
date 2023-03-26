require('dotenv').config()
console.log(process.env)
//const bodyParser = require("body-parser")
//const path = require("path")
console.log('hello world')
const express = require("express")
const app = express()
//express.js cors middleware and usage instructions
const cors = require("cors")
const port = 3000
const multer = require("multer")


const storage = multer.diskStorage({
  destination: "image/",  
  filename: function (req, file, cb) {    
    cb(null, makeFileName(file))
  }
})

function makeFileName(file) {
  return `${Date.now()}-${file.originalname}`
}

const upload = multer({storage: storage})
//connection to database
require("./mongo")
//controllers
const {createUser, logUser} = require("./controllers/users")
const {getSauces, createSauce, authenticateUser} = require("./controllers/sauces")


//middleware
app.use(cors())
app.use(express.json())
//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({ extended: true}))


//const multer = require("multer")
//const storage = multer.diskStorage({destination: "images/", filename: makeFilename})
//const upload = multer({ storage: storage})

//routes
app.post("/api/auth/signup",createUser) 
app.post("/api/auth/login",logUser) 
app.get("/api/sauces", authenticateUser,  getSauces)
app.post("/api/sauces", authenticateUser,upload.single("image"), createSauce )
app.get("/", (req, res) => res.send("Hello World"))


//listen
app.listen(port, () => console.log('listening on port: ' + port))

