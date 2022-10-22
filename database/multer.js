const express = require("express");
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage=multer.diskStorage({
    destination:path.join(__dirname,"../public"),
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
})

router.use(multer({
    storage,
    dest:path.join(__dirname,"../public")
}).single('file'));

module.exports = storage