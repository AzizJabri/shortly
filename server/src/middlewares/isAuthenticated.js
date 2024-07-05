const User = require("../models/User");
const { verifyToken } = require("../utils/tokenUtils");


const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.authorization
        if (!token) {
            return res.status(401).json({
                type: "error",
                message: "Not authorized to access this resource"
            });
        }
        token = token.split(" ")[1];
        const {user, type} = verifyToken(token);
        if (type !== "access") {
            return res.status(401).json({
                type: "error",
                message: "Not authorized to access this resource"
            });
        }
        const userExists = await User.findOne({ _id: user.id });
        if (!userExists) {
            return res.status(404).json({
                type: "error",
                message: "Unvalid token"
            });
        }
        req.user = userExists;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            type: "error",
            message: "Not authorized to access this resource"
        });
    }
}

module.exports = {isAuthenticated};