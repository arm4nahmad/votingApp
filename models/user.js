const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String },
    mobile: { type: String },
    address: { type: String, required: true },
    aadharCardNumber: { type: String, required: true, unique: true }, // changed to String
    password: { type: String, required: true },
    role: { type: String, enum: ['voter', 'admin'], default: 'voter' },
    isVoted: { type: Boolean, default: false }
});

// 🔐 Pre-save hook to hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// 🔑 Instance method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
