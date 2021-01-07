const router=require('express').Router();
const { connection }=require('../db_connection');
const { sanitizeBook }=require('../models/livres');

// GET all the books with its images
router.get("/", (req, res) => {
    const sql="SELECT B.id AS BookId, B.Title, B.Publication, B.Description, B.Price, I.id AS ImageId, I.Name, I.Alt FROM Book as B JOIN Image as I ON B.id=I.Book_id ORDER BY B.id ASC";
    connection.query(sql, (err, result) => {
        const books = sanitizeBook(result);
        if (err) {
            res.status(500).json({errorMessage: err.message});
        } else if (result.length === 0) {
            res.status(404).json({errorMessage: "Aucun livre n'a été trouvé."})
        } else {

            res.status(200).json(books);
        }
    }); 
  });

// GET one Book with its images
router.get("/:id", (req, res) => {
    const { id } = req.params;
    const sql = "SELECT B.id AS BookId, B.Title, B.Publication, B.Description, B.Price, I.id AS ImageId, I.Name, I.Alt FROM Book as B JOIN Image as I ON B.id=I.Book_id WHERE B.id=?";
    connection.query(sql, [id], (err, result) => {
        const books = sanitizeBook(result); 
        if (result.length === 0 || result === undefined) {
            res.status(404).json( { error: "Le livre n'existe pas."});
        } else if (err) {
                res.status(500).send("Une erreur s'est produite lors de la récupération du livre.");
            } else {   
                res.status(200).json(books);
                }
            });
});

// POST Insert a new Book
router.post('/', (req, res) => {
    return connection.query('INSERT INTO Book SET ?', req.body, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.message,
                sql: err.sql
            });
        }
        return connection.query('SELECT * FROM Book WHERE id = ?', results.insertId, (err2, records) => {
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

// PUT Modify an existing Book
router.put("/:id", (req, res) => {
    const idBook = req.params.id;
    const updatedBook = req.body;
    return connection.query('UPDATE Book SET ? WHERE id = ?', [updatedBook, idBook], (err) => {
        if (err) {
            return res.status(500).json({
                error: err.message,
                sql: err.sql,
            });
        }
        return connection.query('SELECT * FROM Book WHERE id = ?', idBook, (err2, records) => {
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

// DELETE Delete a Book
router.delete("/:id", (req, res) => {
    const idBook = req.params.id;
    connection.query('DELETE FROM Book WHERE id = ?', [idBook], (err) => {
        if (err) {
            res.status(500).send("Error deleting a Book");
        } else {
            res.status(200).send(`Book ${idBook} deleted`);
        }
    })
})

module.exports=router;