require("dotenv").config();
const jwt = require("jsonwebtoken");

const {JWT_SECRET} = process.env;

function createToken(id) {
    const token = jwt.sign(
        { id },
        JWT_SECRET,
        {
            expiresIn: '864000',
        }
    );
    return token;
}

function authenticateWithJsonWebToken(req, res, next) {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, JWT_SECRET,  (err) => {
            if (err) {
                res.status(401).json({errorMessage: "Vous n'êtes pas autorisés à accéder à ces données"})
            } else {
                next();
            }
        });
    } else {
        res.status(401).json({errorMessage: "Vous n'êtes pas autorisés à accéder à ces données"})
    }
}

module.exports = {
    createToken,
    authenticateWithJsonWebToken
};