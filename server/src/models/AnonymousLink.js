const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    session: {
        type: String,
        required: true
    },
});

linkSchema.index({ short_url: 1 }, { unique: true });
//auto delete after 24 hours
linkSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const AnonymousLink = mongoose.model('AnonymousLink', linkSchema);

module.exports = AnonymousLink;