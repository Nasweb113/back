const jwt = require("jsonwebtoken")


function getSauces(req,res) {
  const header = req.header("Authorization")
  const token = header.split(" ")[1] //splits up the full token and remove BEARER

  if (!token){
    res.status(403).send({message: "Invalid"})
  }
   
  const decoded =jwt.verify(token, process.env.JWT_PASSWORD)
console.log("token:",token)
console.log("decoded: ", decoded)
res.send(decoded)
}
module.exports = {getSauces}