const mongoose = require('mongoose');

//roles
const roles = ['user', 'admin', 'superadmin'];

//plans
const plans = ['free', 'premium'];

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: roles,
        default: 'user'
    },
    plan: {
        type: String,
        enum: plans,
        default: 'free'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;