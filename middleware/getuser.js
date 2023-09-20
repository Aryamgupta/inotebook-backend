const jwt = require('jsonwebtoken');
const JWT_STR = 'aryamsign';


const getuser = (req, res,next) => {
    // get the token from the HEADER
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "No Token Found" });
    }
    try {
        const data = jwt.verify(token, JWT_STR);
        // console.log(data);
        // console.log(token);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Invalid Token / Access Denied" });
    }
}

module.exports = getuser;