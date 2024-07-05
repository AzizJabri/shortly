const mongoose = require('mongoose');
const { ATLAS_URI } = require('../configs');

const connect = async () => {
    try {
        await mongoose.connect(ATLAS_URI);
        console.log('Connected to the database');
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    connect,
}