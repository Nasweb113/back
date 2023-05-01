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


module.exports={authenticateUser}