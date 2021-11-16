const jwt = require('jsonwebtoken');

module.exports = function( req, res, next ) {
    //read header token
    const token = req.header('x-auth-token');
    console.log(`ping token`);

    //check
    if(!token){
        return res.status(401).json({msg : 'error'});
    };

    //token validation
    try {
        const verified = jwt.verify(token, process.env.SECRET);
        req.user = verified.user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({msg : 'invalid token'});
    }

}