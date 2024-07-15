const { verifyToken } = require("../utils/tokenUtils");


const isPremium = async (req, res, next) => {
    if(req.user.plan === "premium"){
        return next();
    }
    return res.status(403).json({type:"error", message:"You are not authorized to access this resource"});
}

module.exports = {isPremium};