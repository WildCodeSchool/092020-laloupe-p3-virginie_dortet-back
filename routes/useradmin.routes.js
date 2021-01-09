const router=require('express').Router();
const {connection}=require('../db_connection');
const { createToken, authenticateWithJsonWebToken } = require("../services/jwt");

const bcrypt = require('bcrypt');
const saltRounds = 10;

// Select the list of all the admin users but the result is not visible from others
router.get("/", authenticateWithJsonWebToken, (req, res) => {
    const sql='SELECT * FROM User_Admin';
    connection.query(sql, (err, result)=>{
        if (err){
            res.status(500).json({errorMessage: err.message});
        }
        else{
            res.status(200).json(result);
        }
    })    
});

// Select the list of one admin but the result is not visible from others
router.get("/:id", authenticateWithJsonWebToken, (req, res) => {
    const {id} = req.params;
    const sql='SELECT * from User_Admin WHERE id=?';
    connection.query(
      sql,
      [id],
      (err, result) => {
        if (err) {  
          console.log(err);
          res.status(500).json({errorMessage: err.message});
        } else if (result.length === 0) {
            res.status(404).json({errorMessage: `L'administrateur avec l'id ${id} n'a pas été trouvé`})
        } else {
            res.status(200).json(result[0]);
        }
      }
    );
});

  // Adding a new admin user 
router.post("/", (req, res) => {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
      res.status(400).json({ errorMessage: "Merci de renseigner toutes les informations."});
    } else {
      connection.query("SELECT * FROM User_Admin WHERE Email = ?",
      [Email],
      (errOne, resultOne) => {
          if(errOne || resultOne.length>0) {
            res.status(500).json({ errorMessage: "Cet email existe déjà"});
          }
          else {
            const sql = "INSERT INTO User_Admin (Email, Password) VALUES (?, ?)"
            //encryption of the password before insertion
            bcrypt.hash(Password, saltRounds, function(err, hash) {
              connection.query(sql,
                  [Email, hash],
                  (errTwo, resultTwo) => {
                    if (errTwo) {
                      console.log(errTwo);
                      res.status(500).send({ errorMessage: errTwo.message });
                    } else {
                      connection.query('SELECT * FROM User_Admin WHERE id=?', [resultTwo.insertId], (errThree, resultThree)=> {
                        if (errThree) {
                          console.log(errThree);
                          res.status(500).send({ errorMessage: errThree.message });
                        }
                        else {
                          res.status(201).json(resultThree[0]);
                        }                    
                      })                    
                    }
                  })
           })
          }
      })
    }
});

// Allowing an admin user to login with its credentials
router.post("/login", (req, res) => {
    const { Email, Password } = req.body;
    // verifiying both email and password have been provided
    if (!Email|| !Password) {
        res.status(400).json({ errorMessage: "Vous devez fournir toutes les informations."})
    } else {
        // verifying the email
        const sql = "SELECT * FROM User_Admin WHERE Email=?";
        connection.query(sql, [Email], (err, result) => {
            if(err) {
                res.status(500).json({errorMessage: err.message});
            } else if (result.length === 0) {
                res.status(400).json({errorMessage: "L'email est invalide"})
            } else {
              //verify the password put by the user is the same as the one in the DB
              const verified = bcrypt.compareSync(Password, result[0].Password);
              if (verified) {
                //create a token for the admin user
                const token = createToken(result[0].id);
                res.status(200).json({token});
              } else {
                res.status(400).json({errorMessage: "Le mot de passe est invalide."})
              }
            }
        })
    }
})
  
// Modify the email and the password of an existing Admin User
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { Email, Password } = req.body;
    // Verifying that both email and password have been provided
    if (!Email && !Password) {
        res.status(400).json({errorMessage: "Vous devez fournir toutes les informations."})
    } else {
        // Modifying the Email and the Password of a specific admin user
        let sql = "UPDATE User_Admin SET Email=?, Password=? WHERE id=?";
        //Encryption of the password before insertion
        bcrypt.hash(Password, saltRounds, function(err, hash) {
          connection.query(sql, [Email, hash, id], (errOne, resultOne) => {
              if(errOne) {
                  res.status(500).json({ errorMessage: errOne.message });
                } else if (resultOne.affectedRows === 0) {
                      res.status(404).json({errorMessage: `L'administrateur avec l'${id} n'a pas été trouvé.`})
                } else {
                    // Displaying the admin user with its updated credentials
                    sql = "SELECT * FROM User_Admin WHERE id=?";
                    connection.query(sql, [id], (errTwo, resultTwo) => {
                      if (errTwo) {
                          res.status(500).send({ errorMessage: errTwo.message });
                        }
                        else {
                          res.status(200).json(resultTwo[0]);
                        }
                    });
                }
          })
        })
    }
})

// Deleting an admin user 
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    connection.query(
      "DELETE FROM User_Admin WHERE id = ?",
      [id],
      (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).json({ errorMessage: err.message });
        } else if (results.affectedRows === 0) {
            res.status(404).json({errorMessage: `L'administrateur avec l'${id} n'a pas été trouvé`});
        } else {
            res.status(200).send(`L'administrateur ${id} a bien été supprimé`);
        }
      }
    );
});

module.exports=router;