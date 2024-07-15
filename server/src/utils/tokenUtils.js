const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../configs');

const generateAccessToken = (user) => {
    payload = {
        user: {
            id: user.id,
            email: user.email,
        },
        type: 'access',
    };
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '2h',
    });
    return token;
};

const generateRefreshToken = (user) => {
    payload = {
        user: {
            id: user.id,
            email: user.email,
        },
        type: 'refresh',
    };
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '7d',
    });
    return token;
}

const generateVerificationToken = (user) => {
    payload = {
        user: {
            id: user._id,
            email: user.email,
        },
        type: 'verify',
    };
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '1d',
    });
    return token;
}

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    generateVerificationToken
}