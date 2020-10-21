const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const linkSchema = new Schema({
    title: { type: String, required: true, lowercase: true},
    link: String,
    submitted: { type: Date, default: Date.now},
});

module.exports = mongoose.model('Link', linkSchema);