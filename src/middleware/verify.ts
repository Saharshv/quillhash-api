const jwt = require('jsonwebtoken');

// AUTHENTICATES THE USER WITH A JWT
export const auth = (req: any, res: any, next: any) => {
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied');

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    }
    catch(err){
        res.status(400).send('Invalid Token');
    }
}