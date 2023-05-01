const {app, express} = require("./server.js")
const {saucesRouter} = require("./routers/sauces.router")
const {authRouter} = require("./routers/auth.router")
const port = 3000
const path = require("path")
const bodyParser = require("body-parser")
//connection to database
require("./mongo")

//middleware
app.use(bodyParser.json())
app.use("/api/sauces", saucesRouter)
app.use("/api/auth", authRouter)

//ROUTES
app.get("/", (req, res) => res.send("Hello World"))

//listen 
app.use("/images", express.static(path.join(__dirname, "images")))
app.listen(port, () => console.log('listening on port: ' + port))





