const User  = require("../config/models/userModel");

const JwtService = require("../services/jwt-service");

const jwtService = new JwtService();

const  authenticateTokenAdmin = async(req,res,next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split("")[1];

    if(token == null )
        return res.sendStatus(401);

    try{
     const decoded = await jwtService.verifyToken(token);
     const user = await User.findById(decoded.userId)
     if (!user) {
        return res.status(401).json({ error: "User not found" });
    }
    req.user = user;
    next();
    }
    catch (err) {
        console.log(err)
        return res.status(401).json({ error: "Please login again to proceed" });
    }
}

module.exports = {
    authenticateTokenAdmin,
    
}

