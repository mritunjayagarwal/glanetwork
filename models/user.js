const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

const userSchema = new Schema({
    username: { type: String, lowercase: true, required: true},
    email: String,
    password: { type: String, required: true},
    level: { type: Number, default: 0},
    liked: [
        {
            post: { type: Schema.Types.ObjectId, ref: 'News'},
            likeon: { type: Date, default: Date.now},
        }
    ],
    newses: [
        {
            news: { type: Schema.Types.ObjectId, ref: 'News'},
            uon: { type: Date, default: Date.now}
        }
    ],
    comments: [
        {
            comment: { type: Schema.Types.ObjectId, ref: 'Comment'},
            con: { type: Date, default: Date.now}
        }
    ],
    docs: [
        {
            doc: { type: Schema.Types.ObjectId, ref: 'Link'},
            don: { type: Date, default: Date.now}
        }
    ],
    viewsgiven: { type: Number, default: 0},
    created: { type: Date, default: Date.now}
});

// userSchema.path('level').get(function(value) {
//     return Math.ceil((this.comments.length)*10 + (this.newses.length)*20 + (this.liked.length)*5);
// });

userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

userSchema.methods.compare = function(password){
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);