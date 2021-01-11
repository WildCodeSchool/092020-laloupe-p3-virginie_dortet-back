const router=require('express').Router();
const multer = require("multer");
const { connection } = require('../db_connection');

router.get("/", (req, res) => {
    res.status(200).send("Hello upload");
})

router.post("/", (req, res) => {
    // Configuration of the file where we will upload images and their names
    const storage = multer.diskStorage({
        destination: (__, file, cb) => {
            cb(null, "public/images");
        },
        filename: (__, file, cb) => {
            cb(null, `${Date.now()} - ${file.originalname}`);
        }     
    });
    const upload = multer({storage}).single("file");
    upload(req, res, (err) => {
        if(err) {
            res.status(500).json(err);
        } else {
            connection.query('INSERT INTO Image SET ?', [{name: req.file.filename, alt:"dsss"}], (errTwo) => {
                if(errTwo) {
                    res.status(500).json(errTwo);
                } else {
                    res.status(201).json({ filename: req.file.filename });
                }
            })
            
        }
    })
})

module.exports = router;