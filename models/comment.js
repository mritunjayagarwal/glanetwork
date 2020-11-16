const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    news: { type: Schema.Types.ObjectId, ref: 'News'},
    owner: { type: Schema.Types.ObjectId, ref: 'User'},
    content: String,
    commentedon: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Comment', commentSchema);