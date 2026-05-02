const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    deliveryFee: {
        type: Number,
        default: 50
    },
    minOrderForFreeDelivery: {
        type: Number,
        default: 1000
    }
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
