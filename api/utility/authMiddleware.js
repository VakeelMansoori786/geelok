const jwt = require('jsonwebtoken');
const config = require('../config');

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Extract the JWT token from the header

        jwt.verify(token, config.JWT_SERECT_KEY, (err, decoded) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = decoded; // Add the user data to the request object
            next();
        });
    } else {
        res.sendStatus(401);
    }
}

module.exports =  authMiddleware;
