const User = require("../mongo").User
const bcrypt = require('bcrypt');




async function createUser(req,res) {
  const {email, password} = req.body

  const hashedPassword = await hashPassword(password)
console.log ("passwords:", password)
console.log("hashedPassword:", hashedPassword)

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
  const email = req.body.email
  const password = req.body.password
  const user = await User.findOne({email: email})
  
  const isPasswordOk = await bcrypt.compare(password, user.password)
  if (!isPasswordOk) {
  res.status(403).send({ message: "Wrong Password"})
  }
  if (isPasswordOk) {
    res.status(200).send({ message: "User Connected"})
  }
  console.log('user:', user)
  console.log("isPasswordOk: ", isPasswordOk)
}

module.exports = {createUser, logUser}