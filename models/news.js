const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newsSchema = new Schema({
    title: { type: String, required: true, lowercase: true},
    content: String,
    submitted: { type: Date, default: Date.now},
    likes: [
        {
            owner: { type: Schema.Types.ObjectId, ref: 'User'},
            likedon: { type: Date, default: Date.now},
        }
    ],
    comments: { type: Number, default: 0}
});

module.exports = mongoose.model('News', newsSchema);