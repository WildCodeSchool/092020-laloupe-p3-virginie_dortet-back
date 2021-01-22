const router=require('express').Router();
const { connection }=require('../db_connection');
const { sanitizeBook }=require('../models/livres');


// GET all the books with its images
router.get("/", (req, res) => {
    // Selecting all the fields from Book and Image tables for all the Books
    const sql="SELECT B.id AS BookId, B.Title, B.Publication, B.Description, B.Price, B.Link, I.id AS ImageId, I.Image_Name, I.Alt FROM Book as B JOIN Image as I ON B.id=I.Book_id ORDER BY B.id ASC";
    connection.query(sql, (err, result) => {
        // Modifying the result send by mysql to get a list of books and for each book all of its images
        const books = sanitizeBook(result);
        if (err) {
            res.status(500).json({errorMessage: err.message});
        } else if (result.length === 0) {
            res.status(404).json({errorMessage: "Aucun livre n'a été trouvé."})
        } else {
            // Displaying the list of books 
            res.status(200).json(books);
        }
    }); 
  });

// GET one Book with its images
router.get("/:id", (req, res) => {
    const { id } = req.params;
    // Selecting all the fields from Book and Image tables for one Book
    const sql = "SELECT B.id AS BookId, B.Title, B.Publication, B.Description, B.Price, B.Link, I.id AS ImageId, I.Image_Name, I.Alt FROM Book as B JOIN Image as I ON B.id=I.Book_id WHERE B.id=?";
    connection.query(sql, [id], (err, result) => {
        // Modifying the result send by mysql to get a list of objecf each containing a book, and for each book all of its images
        const books = sanitizeBook(result); 
        if (result.length === 0 || result === undefined) {
            res.status(404).json( { error: "Le livre n'existe pas."});
        } else if (err) {
                res.status(500).send("Une erreur s'est produite lors de la récupération du livre.");
            } else {   
                // Displaying the book
                res.status(200).json(books);
                }
            });
});

// POST Insert a Book with its images
router.post("/", (req, res) => {
    const { Title, Publication, Description, Price, Link, Images } = req.body;
    const sql = "INSERT INTO Book (Title, Description, Price, Link, Publication) VALUES (?, ?, ?, ?, ?)";
    connection.query(sql, [Title, Description, Price, Link, Publication], (err, result) => {
        if (err) {
            res.status(500).json({ errorMessage: err.message });
        } else {
            const id = result.insertId;
            const sql2 = `INSERT INTO Image (Alt, Image_Name, Book_id) VALUES (?, ?, ?)`;
            console.log(Images);
            Images.forEach(image => {
                connection.query(sql2, [image.alt, image.img, id], () => {
                });

            })
            const sql3 = "SELECT B.id AS BookId, B.Title, I.id AS ImageId, I.Image_Name, I.Alt FROM Book as B JOIN Image as I ON B.id=I.Book_id WHERE B.id=LAST_INSERT_ID()";
            connection.query(sql3, (errTwo, record) => {
                if (errTwo) {
                    res.status(500).json({error: errTwo.message})
                } else {
                    res.status(201).json(record);
                }
            })
        }
    });
});

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
            res.status(500).send("Une erreur s'est produite lors de la suppression du livre.");
        } else {
            res.status(200).send(`Le livre ${idBook} a été supprimé.`);
        }
    })
})

module.exports=router;