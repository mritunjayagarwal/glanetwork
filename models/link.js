const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const linkSchema = new Schema({
    ctgry: { type: String, default: 'daily'},
    owner: String,
    oname: String,
    section: String,
    subject: String,
    title: { type: String, required: true},
    desc: String,
    link: String,
    visits: { type: Number, default: 0},
    submitted: { type: Date, default: Date.now},
});

module.exports = mongoose.model('Link', linkSchema);