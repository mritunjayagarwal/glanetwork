const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const linkSchema = new Schema({
    title: { type: String, required: true, lowercase: true},
    link: String,
    visits: { type: Number, default: 0},
    submitted: { type: Date, default: Date.now},
});

module.exports = mongoose.model('Link', linkSchema);