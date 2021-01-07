const router=require('express').Router();
const {connection}=require('../db_connection');
const { createToken, authenticateWithJsonWebToken } = require("../services/jwt");


// Select the list of all the admin users
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

router.get("/:id", (req, res) => {
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
            res.status(404).json({errorMessage: `Admin user with id ${id} not found`})
        } else {
            const user = result[0];
            user.Password = "hidden";
            res.status(200).json(result[0]);
        }
      }
    );
});

  // Add a new admin user 
router.post("/", (req, res) => {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
      res.status(400).json({ errorMessage: "You must provide all the information"});
    } else {
      connection.query("SELECT * FROM User_Admin WHERE Email = ?",
      [Email],
      (errOne, resultOne) => {
          if(errOne || resultOne.length>0) {
            res.status(500).json({ errorMessage: "This Email already exists"});
          }
          else {
            const sql = "INSERT INTO User_Admin SET ?"
            connection.query(sql,
                [{ Email, Password }],
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
          }
      })
    }
});

// POST Login
router.post("/login", (req, res) => {
    const { Email, Password } = req.body;
    if (!Email|| !Password) {
        res.status(400).json({ errorMessage: "Vous devez fournir toutes les informations"})
    } else {
        const sql = "SELECT * FROM User_Admin WHERE Email=? AND Password=?";
        connection.query(sql, [Email, Password], (err, result) => {
            if(err) {
                res.status(500).json({errorMessage: err.message});
            } else if (result.length === 0) {
                res.status(400).json({errorMessage: "L'email ou le mot de passe est invalide"})
            } else {
                const token = createToken(result[0].id);
                res.status(200).json({token});
            }
        })
    }
})
  
// PUT Modify an existing Admin User
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { Email, Password } = req.body;
    if (!Email && !Password) {
        res.status(400).json({errorMessage: "You must provide all the information"})
    } else {
        let sql = "UPDATE User_Admin SET ? WHERE id=?";
        connection.query(sql, [req.body, id], (errOne, resultOne) => {
            if(errOne) {
                res.status(500).json({ errorMessage: errOne.message });
              } else if (resultOne.affectedRows === 0) {
                    res.status(404).json({errorMessage: `Admin user with id ${id} not found`})
              } else {
                  sql = "SELECT * FROM User_Admin WHERE id=?";
                  connection.query(sql, [id], (errTwo, resultTwo) => {
                    if (errTwo) {
                        res.status(500).send({ errorMessage: errTwo.message });
                      }
                      else {
                        const user = resultTwo[0];
                        user.Password = "hidden";
                        res.status(200).json(user);
                      }
                  });
              }
        })
    }
})

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
            res.status(404).json({errorMessage: `Admin user with id ${id} not found`});
        } else {
            res.sendStatus(204);
        }
      }
    );
});


module.exports=router;