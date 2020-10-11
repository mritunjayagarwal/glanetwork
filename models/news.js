const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newsSchema = new Schema({
    title: { type: String, required: true, lowercase: true},
    content: String,
    submitted: { type: Date, default: Date.now},
    views: { type: Number, default: 0},
    likes: [
        {
            owner: { type: Schema.Types.ObjectId, ref: 'User'},
            likedon: { type: Date, default: Date.now},
        }
    ],
    comments: [
        {
            comment: { type: Schema.Types.ObjectId, ref: 'Comment'},
            commentedon: { type: Date, default: Date.now}
        }
    ]
});

module.exports = mongoose.model('News', newsSchema);