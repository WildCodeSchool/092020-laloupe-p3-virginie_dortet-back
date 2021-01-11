const router=require('express').Router();
const { connection }=require('../db_connection');



// Retrieve all the images and possibility to filter images specific to Ateliers Créatifs
router.get("/", (req, res) => {
    const { filter, order } = req.query;
    // Filter images specific to Ateliers créatifs
    let sql = "SELECT * FROM Image";
    if (filter === "Atelier") {
        sql = `SELECT Id, Name, Alt, Atelier FROM Image WHERE Atelier=true`;
    // Ordering images by ASC or DESC order
    } else if (order) {
        sql += ` ORDER BY Name ${order}`;
    } 
    // Selecting all the images from the DB
    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send({errorMessage: err.message});
        } else if (results.length === 0) {
            res.status(404).json({errorMessage: "Aucune image n'a été trouvé."})
        } else {
        // Displaying the list of images
            res.status(200).json(results);
        }
    }
    )  
});

// GET one Image from the table with its id
router.get("/:id", (req, res) => {
    connection.query(`SELECT * FROM Image WHERE id = ?`, [req.params.id], (err, results) => {
        if (results.length === 0 || results === undefined) {
            res.status(404).json( { error: "L'image n'existe pas."});
        } else if (err) {
                res.status(500).send("Une erreur s'est produite lors de la récupération de l'image.");
            } else {
                const selectedImage = results[0];
                const { Description, ...Image } = selectedImage;
                res.status(200).json(Image);
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
    return connection.query('UPDATE Image SET ? WHERE id = ?', [updatedImage, idImage], (err) => {
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
    connection.query('DELETE FROM Image WHERE id = ?', [idImage], (err) => {
        if (err) {
            res.status(500).send("Une erreur s'est produite lors de la suppression de l'image.");
        } else {
            res.status(200).send(`L'image ${idImage} a été supprimée.`);
        }
    })
})

module.exports=router;