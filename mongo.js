//Database
const mongoose = require('mongoose');
//var uniqueValidator = require('mongoose-unique-validator');//checks for duplicate database entries



const password = process.env.DB_PASSWORD
const username = process.env.DB_USERNAME
const uri = `mongodb+srv://${username}:${password}@cluster0.zrfx6r2.mongodb.net/?retryWrites=true&w=majority`



mongoose
.connect(uri)
.then(() => console.log("Connected to Mongo"))
.catch(err => console.error("error connecting to Mongo: ", err))

const userSchema = new mongoose.Schema({
 email:{type: String, required: true, unique: true},
 password:{type:String, required: true}
})
//userSchema.plugin(uniqueValidator);
const User = mongoose.model("User", userSchema)

module.exports = {mongoose, User}