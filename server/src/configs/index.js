const dotenv = require("dotenv");
dotenv.config(
    {
        path: `./.env.${process.env.NODE_ENV.trim()}`
    }
)



module.exports = {
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET || "somethingsecret",
    ATLAS_URI : process.env.ATLAS_URI || "mongodb://localhost:27017/shortly",
    COMMUNICATION_SERVICE_CONNECTION_STRING: process.env.COMMUNICATION_SERVICE_CONNECTION_STRING || "",
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:4200",
};