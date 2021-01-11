const router=require('express').Router();
const {connection}=require('../db_connection');

router.get("/", (_req, res) => {
    const sql='SELECT * FROM News';
    connection.query(sql, (err, result)=>{
        if (err){
            res.status(500).json({errorMessage: err.message});
        }
        else{
            res.status(200).json(result);
        }
    })    
  });

  router.get("/:id", (req, res) => {
    connection.query(
      "SELECT * from News WHERE id=?",
      [req.params.id],
      (err, results) => {
        if (err) {  
          console.log(err);
          res.status(500).send("Error receiving data");
        } else {
          res.status(200).json(results);
        }
      }
    );
  });


  router.post("/", (req, res) => {
    const { Title, Description, Date, Address } = req.body;
    connection.query(
      "INSERT INTO News(Title, Description, Date, Address) VALUES(?, ?, ?, ?)",
      [Title, Description, Date, Address],
      (err) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error saving a news");
        } else {
          res.status(200).send("Successfully saved");
        }
      }
    );
  });

  router.put("/:id", (req, res) => {
    
    const idNews = req.params.id;
    const newNews = req.body;
  
    connection.query(
      "UPDATE News SET ? WHERE id = ?",
      [newNews, idNews],
      (err) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error updating a news");
        } else {
          res.status(200).send("News updated successfully 🎉");
        }
      }
    );
  });

  router.delete("/:id", (req, res) => {
    const idNews = req.params.id;
    connection.query(
      "DELETE FROM News WHERE id = ?",
      [idNews],
      (err) => {
        if (err) {
          console.log(err);
          res.status(500).send("😱 Error deleting an News");
        } else {
          res.status(200).send("🎉 the news deleted!");
        }
      }
    );
  });




module.exports=router;