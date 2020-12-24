const router=require('express').Router();
const { connection }=require('../db_connection');


//GET all of the Images from your table
router.get("/", (req, res) => {
    let sql = 'SELECT * FROM Image'
    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error retrieving the list of users");
        } else {
            res.status(200).json(results);
        }
    }
    )  
});

// GET one Image from the table with its id
router.get("/:id", (req, res) => {
    connection.query(`SELECT * FROM Image WHERE id = ?`, [req.params.id], (err, results) => {
        if (results.length === 0 || results === undefined) {
            res.status(404).json( { error: "User not found"});
        } else {
            if (err) {
                res.status(500).send("Error retrieving a user");
            } 
            const selectedImage = results[0];
        const { Description, ...Image } = selectedImage;
        return res.status(200).json(Image);
        }
    });
});

// POST Insert a new image
router.post('/', (req, res) => {
    return connection.query('INSERT INTO Image SET ?', req.body, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.message,
                sql: err.sql
            });
        }
        return connection.query('SELECT * FROM Image WHERE id = ?', results.insertId, (err2, records) => {
            if (err2) {
                return res.status(500).json({
                    error: err2.message,
                    sql: err2.sql,
                });
            }
            return res.status(201).json(records[0]);
        })
    })
})

// PUT Modify an existing image
router.put("/:id", (req, res) => {
    const idImage = req.params.id;
    const updatedImage = req.body;
    return connection.query('UPDATE Image SET ? WHERE id = ?', [updatedImage, idImage], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.message,
                sql: err.sql,
            });
        }
        return connection.query('SELECT * FROM Image WHERE id = ?', idImage, (err2, records) => {
            if (err2) {
                return res.status(500).json({
                    error: err2.message,
                    sql: err2.sql,
                });
            }
            return res.status(201).json(records[0]);
        })
    })
})

// DELETE Delete an image
router.delete("/:id", (req, res) => {
    const idImage = req.params.id;
    connection.query('DELETE FROM Image WHERE id = ?', [idImage], (err, results) => {
        if (err) {
            res.status(500).send("Error deleting an image");
        } else {
            res.status(200).send(`Image ${idImage} deleted`);
        }
    })
})

module.exports=router;