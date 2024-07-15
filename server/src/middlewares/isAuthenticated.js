const User = require("../models/User");
const { verifyToken } = require("../utils/tokenUtils");


const NOT_AUTHORIZED_ERROR = {
    type: "error",
    message: "Not authorized to access this resource"
};

const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json(NOT_AUTHORIZED_ERROR);
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json(NOT_AUTHORIZED_ERROR);
        }

        let user, type;
        try {
            ({ user, type } = verifyToken(token));
        } catch (error) {
            return res.status(401).json(NOT_AUTHORIZED_ERROR);
        }

        if (type !== "access") {
            return res.status(401).json(NOT_AUTHORIZED_ERROR);
        }

        const userExists = await User.findById(user.id);
        if (!userExists) {
            return res.status(404).json({
                type: "error",
                message: "Invalid token"
            });
        }

        req.user = userExists;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            type: "error",
            message: "Internal server error"
        });
    }
};


module.exports = {isAuthenticated};