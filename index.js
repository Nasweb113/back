const {app, express} = require("./server.js")
const port = 3000
const path = require("path")


//connection to database
require("./mongo")
//controllers
const {createUser, logUser} = require("./controllers/users")
const {getSauces, createSauce, authenticateUser} = require("./controllers/sauces")
//middleware
const {upload} = require("./middleware/multer.js")

//routes
app.post("/api/auth/signup",createUser) 
app.post("/api/auth/login",logUser) 
app.get("/api/sauces", authenticateUser,  getSauces)
app.post("/api/sauces", authenticateUser, upload.single("image"), createSauce )
app.get("/", (req, res) => res.send("Hello World"))


//listen

app.use("/images", express.static(path.join(__dirname, "images")))
app.listen(port, () => console.log('listening on port: ' + port))





