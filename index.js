require('dotenv').config()
console.log(process.env)

//use nodemon index.js to view the changes directly
console.log('hello world')
const express = require("express")
const app = express()
//express.js cors middleware and usage instructions
const cors = require("cors")
const port = 3000


//connection to database
require("./mongo")
//controllers
const {createUser, logUser} = require("./controllers/users")
const {getSauces} = require("./controllers/sauces")
//middleware
app.use(cors())
// Parse JSON bodies for this app. Make sure you put
// `app.use(express.json())` **before** your route handlers!
app.use(express.json());


//routes
app.post("/api/auth/signup",createUser) 
app.post("/api/auth/login",logUser) 
app.get("/api/sauces", getSauces)
app.get("/", (req, res) => res.send("Hello World"))
//listen
app.listen(port, () => console.log('listening on port: ' + port))

