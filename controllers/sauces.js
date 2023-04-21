
const mongoose = require("mongoose")
const productSchema = new mongoose.Schema({
  userId: String,
  name: String,
  manufacturer: String,
  description: String,
  mainPepper: String,
  ImageUrl: String,
  heat: Number,
  likes: Number,
  dislikes: Number,
  usersLiked: [String],
  usersDisliked: [String]
})
//create model
const Product = mongoose.model("product", productSchema)

const jwt = require("jsonwebtoken")


//!!!!! tried to move into a separate middleware folder but would not connect on index.js page so put it back here!!!
function authenticateUser(req, res, next) { //takes 3rd arguement NEXT as it is a middleware
  console.log("authenticate user")
  const header = req.header("Authorization")
  if (header == null) return res.status(403).send({message: "Invalid"}) 
  
  const token = header.split(" ")[1] //splits up the full token and remove BEARER
  if (token == null) return res.status(403).send({message: "Token null"}) 
   
  jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) =>{
      if (err) return res.status(403).send({message: "Invalid Token" + err}) 
      console.log("token is validated")
      next()
    })
}


//if there is an error BELOW
function getSauces ( req,res) {
  console.log("Token Validated, you are in HOT TAKES!")
  
  //authenticateUser(req, res)
  //console.log("Token OK", decoded)
  Product.find({}).then(products => res.send(products))
  //res.send({message: [{sauce: "sauce1"}, {sauce: "sauce1"}] })

}

function createSauce(req, res) {
  const { body, file } = req
  console.log({ file })
  const fileName = file.fileName
  console.log("filename:" + fileName) //creating image filename, see index.js for fileName creation
  const sauce = JSON.parse(body.sauce)
  const { name, manufacturer, description, mainPepper, heat, userId } = sauce
  console.log(sauce)
  const product = new Product({
    
  userId:userId,
  name:name,
  manufacturer:manufacturer,
  description:description,
  mainPepper:mainPepper,
  ImageUrl:"images/" +fileName,
  heat:heat,
  likes: 0,
  dislikes: 0,
  usersLiked: [],
  usersDisliked: [],
})
console.log(product)
product.save().then((res)=> console.log("product saved", res)).catch(console.error)
}


module.exports = {getSauces, createSauce, authenticateUser}