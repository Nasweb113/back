
const mongoose = require("mongoose")
const {unlink} = require("fs/promises")//fs = File System

const productSchema = new mongoose.Schema({
  userId: String,
  name: String,
  manufacturer: String,
  description: String,
  mainPepper: String,
  imageUrl: String,
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



function getSauces ( req,res) {
  //Product.deleteMany({}).then(console.log).catch(console.error)
  Product.find({})
  .then((products) => res.send(products))
  .catch(error => res.status(500).send(error))
}

function getSauceById(req, res) {
const {id} = req.params
Product.findById(id)
.then (product => res.send(product)) 
.catch(console.error)
}



function deleteSauce(req,res){
  const {id} = req.params
  Product.findByIdAndDelete(id)
  .then ((product) => sendClientResponse(product, res))
  .then((item)=> deleteImage(item))
  .then((res)=> console.log("FILE DELETED", res))
  .catch((err) => res.status(500).send({message:err}))
}

function deleteImage(product) {
  if (product == null) return
  console.log("DELETE IMAGE", product)
  const imageToDelete = product.imageUrl.split("/").at(-1)
  return unlink( "images/" + imageToDelete)

  }
 
function modifySauce(req, res) {
  const {
    params: {id}
  } = req // nested destructuring, a way of writing th variable quickly

 
  const hasNewImage = req.file != null
  const payload = makePayload(hasNewImage, req)
  


  // UPDATE THE DATABASE
  Product.findByIdAndUpdate(id, payload)
  .then((dbResponse)=> sendClientResponse(dbResponse, res))
  .then((product)=> deleteImage(product))
  .then((res)=> console.log("FILE DELETED", res))
  .catch((err) => console.error("PROBLEM UPDATING:", err)) //in the case it was manually deleted in the database 
}

function makePayload(hasNewImage, req) {
  console.log("hasNewImage:", hasNewImage)
  if (!hasNewImage)return req.body
  const payload = JSON.parse(req.body.sauce)
  payload.imageUrl = makeImageUrl(req, req.file.fileName)
  console.log("New Image")
  console.log("here is the payload:", payload)
return payload
}
function sendClientResponse (product, res){
  
    if (product == null) {
      console.log("NOTHING TO UPDATE")
      return res.status(404).send({message: "Nothing to update in database"})
    } 
        console.log(" OK UPDATING:", product)
        return Promise.resolve (res.status(200).send({message: "Updated Successfully"}))
        .then(() => product)   
}

function makeImageUrl (req, fileName) {
  return req.protocol + "://" + req.get("host") + "/images/" +fileName
}


function createSauce(req, res) {
  const { body, file } = req
  const {fileName} = file
  const sauce = JSON.parse(body.sauce)
  const { name, manufacturer, description, mainPepper, heat, userId } = sauce


  
  const product = new Product({
    
  userId:userId,
  name:name,
  manufacturer:manufacturer,
  description:description,
  mainPepper:mainPepper,
  imageUrl:makeImageUrl(req, fileName),
  heat:heat,
  likes: 0,
  dislikes: 0,
  usersLiked: [],
  usersDisliked: [],
})
console.log(product)
product.save()
.then((message)=> {
  res.status(201).send({message:message})
 return  console.log("product saved", message)
})
   .catch(console.error)
}


module.exports = {getSauces, createSauce, getSauceById, deleteSauce, modifySauce}