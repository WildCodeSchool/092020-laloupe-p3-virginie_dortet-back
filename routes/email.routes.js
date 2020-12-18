const router=require('express').Router();
const {connection}=require('../db_connection');

router.get("/", (req, res) => {
    const sql='SELECT * FROM Email';
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
      "SELECT * from Email WHERE id=?",
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
    const { Email } = req.body;
    if (!Email) {
      res.status(400).json({ errorMessage: "All elements required"});
    } else {
      connection.query("SELECT * FROM Email WHERE Email = ?",
      [Email],
      (errOne, resultOne) => {
          if(errOne || resultOne.length>0) {
            res.status(500).json({ errorMessage: "this Email already exists"});
          }
          else {
            connection.query("INSERT INTO Email (Email) VALUES(?)",
                [Email],
                (errTwo, resultTwo) => {
                  if (errTwo) {
                    console.log(errTwo);
                    res.status(500).send("Error saving an email");
                  } else {
                    connection.query('SELECT * FROM Email WHERE id=?', [resultTwo.insertId], (errThree, resultThree)=> {
                      if (errThree) {
                        console.log(errThree);
                        res.status(500).send(errThree.message);
                      }
                      else {
                        res.status(201).json(resultThree[0]);
                      }                    
                    })                    
                  }
                })
          }
      })
    }
  });
  

  router.delete("/:id", (req, res) => {
    const idEmail = req.params.id;
    connection.query(
      "DELETE FROM Email WHERE id = ?",
      [idEmail],
      (err) => {
        if (err) {
          console.log(err);
          res.status(500).send("😱 Error deleting an email");
        } else {
          res.status(200).send("🎉 the email deleted!");
        }
      }
    );
  });


module.exports=router;