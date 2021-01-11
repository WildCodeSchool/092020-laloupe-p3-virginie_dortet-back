const router=require('express').Router();
const {connection}=require('../db_connection');


// Select all the emails of the clients 
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

// Select one email 
router.get("/:id", (req, res) => {
  connection.query(
    "SELECT * from Email WHERE id=?",
    [req.params.id],
    (err, results) => {
      if (err) {  
        console.log(err);
        res.status(500).json({errorMessage: "Aucun email n'a été trouvé."});
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// Create a new email
router.post("/", (req, res) => {
  const { Email } = req.body;
  if (!Email) {
    res.status(400).json({ errorMessage: "Tous les champs doivent être renseignés."});
  } else {
    connection.query("SELECT * FROM Email WHERE Email = ?",
    [Email],
    (errOne, resultOne) => {
        if(errOne || resultOne.length>0) {
          res.status(500).json({ errorMessage: "Cet email existe déjà."});
        }
        else {
          connection.query("INSERT INTO Email (Email) VALUES(?)",
              [Email],
              (errTwo, resultTwo) => {
                if (errTwo) {
                  console.log(errTwo);
                  res.status(500).send("Une erreur s'est produite lors de l'ajout de l'email.");
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
  
// Delete an email
router.delete("/:id", (req, res) => {
  const idEmail = req.params.id;
  connection.query(
    "DELETE FROM Email WHERE id = ?",
    [idEmail],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Une erreur s'est produite lors de la suppression de l'email.");
      } else {
        res.status(200).send("L'email a été supprimé.");
      }
    }
  );
});


module.exports=router;