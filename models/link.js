const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const linkSchema = new Schema({
    ctgry: { type: String, default: 'daily'},
    owner: { type: Schema.Types.ObjectId, ref: 'User'},
    section: String,
    title: { type: String, required: true},
    link: String,
    visits: { type: Number, default: 0},
    submitted: { type: Date, default: Date.now},
});

module.exports = mongoose.model('Link', linkSchema);