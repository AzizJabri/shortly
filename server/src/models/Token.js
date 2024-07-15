const mongoose = require('mongoose');
const {client,getVerificationEmail} = require('../utils/mailer');

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 43200
    }
});

tokenSchema.pre('save', async function (next) {
    if(this.isNew){
        await client.beginSend(getVerificationEmail(this.email, this.token));
    }
    next();
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;