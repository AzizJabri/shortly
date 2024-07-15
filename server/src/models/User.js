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
    },
    isVerified: {
        type: Boolean,
        default: false
    }
});

//auto delete user after 24 hours if not verified
userSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400, partialFilterExpression: { isVerified: false } });

const User = mongoose.model('User', userSchema);


module.exports = User;