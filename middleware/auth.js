const jwt = require('jsonwebtoken');
const config = require('config');


module.exports = function auth(req, res, next) {

    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    // verify valid token 
    try {
        const decocdedPayload = jwt.verify(token, config.get('jwtPrivateKey'));
        // add the user properties decoded from jwt to the request.
        // added: user._id, user.name
        req.user = decocdedPayload;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
}