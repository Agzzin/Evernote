const mongoose =  require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique: true},
    password: {type: String, required: true},
    created_at: { type: Date, default: Date.now },
    uptaded_at: { type: Date, default: Date.now },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('User', userSchema);