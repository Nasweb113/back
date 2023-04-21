require('dotenv').config()
console.log(process.env)
//const bodyParser = require("body-parser")
const path = require("path")
console.log('hello world')
const express = require("express")
const app = express()
const cors = require("cors")
const port = 3000
const multer = require("multer")


const storage = multer.diskStorage({
  destination: "images/",  
  filename: function (req, file, cb) {    
    cb(null, makeFileName(req, file))
  }
})

function makeFileName(req, file) {
  const fileName = `${Date.now()}-${file.originalname}`.replace(/\s/g, "-")
  file.fileName = fileName
  return fileName
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

//routes
app.post("/api/auth/signup",createUser) 
app.post("/api/auth/login",logUser) 
app.get("/api/sauces", authenticateUser,  getSauces)
app.post("/api/sauces", authenticateUser, upload.single("image"), createSauce )
app.get("/", (req, res) => res.send("Hello World"))


//listen

app.use("/images", express.static(path.join(__dirname, "images")))
app.listen(port, () => console.log('listening on port: ' + port))





