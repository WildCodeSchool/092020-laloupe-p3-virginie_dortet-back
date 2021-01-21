const router=require('express').Router();
const {connection}=require('../db_connection');
const { authenticateWithJsonWebToken } = require("../services/jwt");


router.get("/", (req, res) => {
    const sql='SELECT F.id, F.Name, F.Description, F.Link, I.Image_Name, I.Alt FROM Funding AS F JOIN Image AS I ON F.id = I.Funding_id;';
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
    const { id } = req.params;
      const sql = `SELECT F.id, F.Name, F.Description, F.Link, I.Image_Name, I.Alt FROM Funding AS F JOIN Image AS I ON F.id = I.Funding_id WHERE F.id=${id}`;
      connection.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ errorMessage: err.message });
        } else {
            res.status(200).json(result[0]);
        }
    });
});

  router.post("/", authenticateWithJsonWebToken, (req, res) => {
    const { Name, Description, Link, Image_Name, Alt } = req.body;    
    const sql1 = "INSERT INTO Funding (Name, Description, Link) VALUES (?, ?, ?)";
    connection.query(sql1, [Name, Description, Link] , (errOne, resultOne) => {
        if (errOne) {
            res.status(500).json({ error1: errOne.message });
        } else {
            const id = resultOne.insertId;
            const sql2 = "INSERT INTO Image (Image_Name, Alt, Funding_id) VALUES (?, ?, ?)";
            connection.query(sql2, [Image_Name, Alt, id], (errTwo, resultTwo) => {
                if (errTwo) {
                    res.status(500).json({ error2: errTwo.message });
                } else {
                    res.status(200).json(resultTwo);
                }
            })
        }
    })
});


        router.put("/:id", authenticateWithJsonWebToken, (req, res) => {
            const { id } = req.params;
            const { Name, Description, Link, Image_Name, Alt } = req.body;
            console.log(req.body);

            const sql1 = "UPDATE Funding SET ? WHERE id=?";
            connection.query(sql1, [{Name, Description, Link}, id] , (errOne) => {
                if (errOne) {
                    res.status(500).json({ error1: errOne.message });
                } else {
                    
                    const sql2 = "UPDATE Image SET ? WHERE Funding_id=?";
                    connection.query(sql2, [{Image_Name, Alt}, id], (errTwo) => {
                        if (errTwo) {
                            res.status(500).json({ error2: errTwo.message });
                        } else {
                            const sql=`SELECT F.id, F.Name, F.Description, F.Link, I.Image_Name, I.Alt FROM Funding AS F JOIN Image AS I ON F.id = I.Funding_id WHERE F.id=${id}`;
                            connection.query(sql, (errThree, resultThree) => {
                                if (errThree) {
                                    res.status(500).json({ error3: errThree.message });
                                
                                } else {
                                    res.status(200).json(resultThree[0]);
                                }
                            })
                        }
                    })
                };
            })
        })


  router.delete("/:id", authenticateWithJsonWebToken, (req, res) => {
    const { id } = req.params;
    if (Number.isNaN(parseInt(id, 10))) {
        res.status(400).json({ errorMessage: " You must provided an valid ID !" });
    } else {
        const sql = "DELETE FROM Funding WHERE id = ?";
        connection.query(sql, [id], (err, result) => {
            if (err) {
                res.status(500).json({ errorMessage: err.message });
            } else if (result.affectedRows === 0) {
                res.status(400).json({ errorMessage: `Funding with id ${id} not found.` });
            } else {
                res.status(200).send("🎉 the Funding is deleted!");
            }
        });
    }
    });


module.exports=router;