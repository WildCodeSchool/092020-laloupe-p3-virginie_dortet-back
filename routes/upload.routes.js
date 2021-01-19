const router=require('express').Router();
const multer = require("multer");
const { connection } = require('../db_connection');

router.get("/", (req, res) => {
    res.status(200).send("Hello upload");
})


// Upload images for Ateliers créatifs 
router.post("/ateliers", (req, res) => {
    // Configuration of the file where we will upload images and their names
    const storage = multer.diskStorage({
        destination: (_, file, cb) => {
            cb(null, "public/images");
        },
        filename: (_, file, cb) => {
            cb(null, `${file.originalname}`);
        }     
    });
    const upload = multer({storage}).single("file");
    upload(req, res, (err) => {
        if(err) {
            res.status(500).json(err);
        } else {
            connection.query('INSERT INTO Image SET ?', [{Image_Name: req.file.filename, Alt: req.file.filename, Atelier: true}], (errTwo) => {
                if(errTwo) {
                    res.status(500).json({errorMessage: errTwo.message});
                    console.log(errTwo);
                } else {
                    res.status(201).json({ filename: req.file.filename });
                }
            })
            
        }
    })
})

// Upload images for Books 
router.post("/livres", (req, res) => {
    // Configuration of the file where we will upload images and their names
    const storage = multer.diskStorage({
        destination: (_, file, cb) => {
            cb(null, "public/images");
        },
        filename: (_, file, cb) => {
            cb(null, `${file.originalname}`);
        }     
    });
    const upload = multer({storage}).single("file");
    upload(req, res, (err) => {
        if(err) {
            res.status(500).json(err);
        } else {
            connection.query('INSERT INTO Image SET ?', [{Image_Name: req.file.filename, Alt: req.file.filename}], (errTwo) => {
                if(errTwo) {
                    res.status(500).json({errorMessage: errTwo.message});
                    console.log(errTwo);
                } else {
                    res.status(201).json({ filename: req.file.filename });
                }
            }) 
        }
    })
})



router.post("/news", (req, res) => {
    // Configuration of the file where we will upload images and their names
    const storage = multer.diskStorage({
        destination: (_, file, cb) => {
            cb(null, "public/images");
        },
        filename: (_, file, cb) => {
            cb(null, `${file.originalname}`);
        }     
    });
    const upload = multer({storage}).single("file");
    upload(req, res, (err) => {
        if(err) {
            res.status(500).json(err);
        } else {
            connection.query('INSERT INTO Image SET ?', [{Image_Name: req.file.filename, Alt: req.file.filename}], (errTwo) => {
                if(errTwo) {
                    res.status(500).json({errorMessage: errTwo.message});
                    console.log(errTwo);
                } else {
                    res.status(201).json({ filename: req.file.filename });
                }
            })
            
        }
    })
})

router.post("/fundings", (req, res) => {
    // Configuration of the file where we will upload images and their names
    const storage = multer.diskStorage({
        destination: (_, file, cb) => {
            cb(null, "public/images");
        },
        filename: (_, file, cb) => {
            cb(null, `${file.originalname}`);
        }     
    });
    const upload = multer({storage}).single("file");
    upload(req, res, (err) => {
        if(err) {
            res.status(500).json(err);
        } else {
            connection.query('INSERT INTO Image SET ?', [{Image_Name: req.file.filename, Alt: req.file.filename}], (errTwo) => {
                if(errTwo) {
                    res.status(500).json({errorMessage: errTwo.message});
                    console.log(errTwo);
                } else {
                    res.status(201).json({ filename: req.file.filename });
                }
            }) 
        }
    })
})

module.exports = router;