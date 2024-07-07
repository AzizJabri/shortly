const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
    link: mongoose.Schema.Types.ObjectId,
    timestamp: {
        type: Date,
        default: Date.now
    },
    userAgent: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    },
    referer: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        required: true
    },

});


const Click = mongoose.model('Click', clickSchema);

module.exports = Click;