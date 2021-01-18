require("dotenv").config();

const router=require('express').Router();

const nodemailer = require("nodemailer");


// configuration de la boite mail qui va envoyer les mails
const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.emailAddressUsed,
      pass: process.env.emailPassword
    }
  })
  // Post un email pour formulaire email
  router.post("/", (req, res) => {
    let livreString = "";
    req.body.livreschoisis.map(els => {
      livreString = `${livreString  }- ${ els.Title  } x ${  els.number  }\n`;
      return els;
    })




    const emailOptions = {
      from: process.env.emailAddressUsed,
      to: process.env.emailAddressToSend,
      subject: "Pré-commande provenant du site",
      text: `De ${req.body.name} ${req.body.firstname},
      email : ${req.body.email} et N°Télephone : ${req.body.phone},
      Adresse : ${req.body.adresse},
      ${req.body.code_postal} ${req.body.ville},

      message : ${req.body.message},

      LIVRES CHOISIS :\n
      ${livreString}` 
    };
    
    
    transport.sendMail(emailOptions, (err, info) => {
      if(err) {
        res.status(500).send(err);
      } else {
        res.status(200).json({info});
      }
    })
  })


module.exports=router;



