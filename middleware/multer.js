const multer = require("multer")

const storage = multer.diskStorage({
  destination: "images/",  
  filename: function (req, file, cb) {    
    cb(null, makeFileName(req, file))
  }
})

function makeFileName(req, file) {
  console.log("req, file:", file)
  const fileName = `${Date.now()}-${file.originalname}`.replace(/\s/g, "-")//replacing the spaces in file name
  file.fileName = fileName
  return fileName
}

const upload = multer({storage: storage})

module.exports = {upload}