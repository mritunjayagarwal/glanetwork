const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User'},
    catgry: { type: String, default: 'visible'},
    content: String,
    postedon: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Comment', commentSchema);