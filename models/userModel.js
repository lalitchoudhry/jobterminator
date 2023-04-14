const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    mobile: {type: Number, required: true},
    password: {type: String, required: true},
    token: {type: String}
});

module.exports = mongoose.model('user', userSchema);