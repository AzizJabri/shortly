const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    long_url: {
        type: String,
        required: true
    },
    short_url: {
        type: String,
        required: true,
        unique: true,
        minlength: 6,
        maxlength: 6
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    totalVisits: {
        type: Number,
        default: 0
    }
});

linkSchema.index({ short_url: 1 }, { unique: true });

const Link = mongoose.model('Link', linkSchema);

module.exports = Link;