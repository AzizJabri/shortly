const rateLimit = require("express-rate-limit");

const getMax = (req) => {
    switch(req.user.plan) {
        case 'free':
            return 5;
        case 'premium':
            return 1000;
        default:
            return 1;
    }
};


const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: (req,res) => getMax(req),
    message: "You have reached you daily limit of links creation. Please upgrade your plan to create more links.",
    skipFailedRequests: true,
});

const anonymousLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 1,
    message: "You have reached you daily limit of links creation.",
    skipFailedRequests: true,
});

module.exports = {
    limiter,
    anonymousLimiter
}