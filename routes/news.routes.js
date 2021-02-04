const router = require("express").Router();
const { connection } = require("../db_connection");
const { authenticateWithJsonWebToken } = require("../services/jwt");

router.get("/", (_, res) => {
  const sql =
    "SELECT N.id,N.Title,N.Description,N.Date,N.Address,I.Image_Name,I.Alt FROM News AS N JOIN Image AS I ON N.id=I.News_id ORDER BY Date DESC";
  connection.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ errorMessage: err.message });
    } else {
      res.status(200).json(result);
    }
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = `SELECT N.id,N.Title,N.Date,N.Description,N.Address,I.Image_Name,I.Alt FROM News AS N JOIN Image AS I ON N.id=I.News_id WHERE N.id=${id}`;
  connection.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ errorMessage: err.message });
    } else {
      res.status(200).json(result[0]);
    }
  });
});

router.post("/", authenticateWithJsonWebToken, (req, res) => {
  const { Title, Description, Address, Image_Name, Alt } = req.body;
  const myNewsDate = req.body.Date;
  const sqlOne =
    "INSERT INTO News(Title, Description, Date, Address) VALUES(?, ?, ?, ?)";
  connection.query(
    sqlOne,
    [Title, Description, myNewsDate, Address],
    (errOne, resultOne) => {
      if (errOne) {
        res.status(500).json({ error1: errOne.message });
      } else {
        const id = resultOne.insertId;
        const sqlTwo =
          "INSERT INTO Image(Image_Name,Alt,News_id) VALUES(?,?,?)";
        connection.query(sqlTwo, [Image_Name, Alt, id], (errTwo, resultTwo) => {
          if (errTwo) {
            res.status(500).json({ error2: errTwo.message });
          } else {
            res.status(200).json(resultTwo);
          }
        });
      }
    }
  );
});

router.put("/:id", authenticateWithJsonWebToken, (req, res) => {
  const { id } = req.params;
  const { Title, Description, Date, Address, Image_Name, Alt } = req.body;
  const sql1 = "UPDATE News SET ? WHERE id = ?";
  connection.query(
    sql1,
    [{ Title, Description, Date, Address }, id],
    (errOne) => {
      if (errOne) {
        res.status(500).send("Error updating a news");
      } else {
        const sql2 = "UPDATE Image SET ? WHERE News_id=?";
        connection.query(sql2, [{ Image_Name, Alt }, id], (errTwo) => {
          if (errTwo) {
            res.status(500).json({ error: errTwo.message });
          } else {
            const sql = `SELECT N.id,N.Title,N.Description,N.Date,N.Address,I.Image_Name,I.Alt FROM News AS N JOIN Image AS I ON N.id=I.News_id WHERE N.id=${id}`;
            connection.query(sql, (errThree, resultThree) => {
              if (errThree) {
                res.status(500).json({ error3: errThree.message });
              } else {
                res.status(200).json(resultThree[0]);
              }
            });
          }
        });
      }
    }
  );
});

router.delete("/:id", authenticateWithJsonWebToken, (req, res) => {
  const { id } = req.params;
  if (Number.isNaN(parseInt(id, 10))) {
    res.status(400).json({ errorMessage: " You must provided an valid ID !" });
  } else {
    const sql = "DELETE FROM News WHERE id = ?";
    connection.query(sql, [id], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json("😱 Error deleting an News");
      } else if (result.affectedRows === 0) {
        res.status(400).json({ errorMessage: `News with id ${id}not found.` });
      } else {
        res.status(200).send("🎉 the news deleted!");
      }
    });
  }
});

module.exports = router;
