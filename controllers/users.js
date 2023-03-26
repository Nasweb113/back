const User = require("../mongo").User
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")



async function createUser(req,res) {
  const {email, password} = req.body

  const hashedPassword = await hashPassword(password)


  const user = new User({ email, password: hashedPassword})

user
.save()
.then(() => res.status(201).send({message: "User Saved!"}))
.catch((err) => res.status(409).send({message:"user not saved"+ err}))
}

function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds) 
    // Store hash in your password DB.
}

async function logUser(req, res) {
  try {
  const email = req.body.email
  const password = req.body.password
  const user = await User.findOne({email: email})
  
  
  const isPasswordOk = await bcrypt.compare(password, user.password)
  if (!isPasswordOk) {
  res.status(403).send({ message: "Wrong Password"})
  }
  const token = createToken(email)
  res.status(200).send({ userId: user?._id, token: token})
} catch(err) {
  res.status(500).send({ message: "internal error"})
}
}
function createToken(email) {
  jwtPassword = process.env.JWT_PASSWORD
  const token = jwt.sign({email: email}, "pelican", {expiresIn: "24h"}) //expires in, so if stolen it will expire
  return token
}
module.exports = {createUser, logUser}