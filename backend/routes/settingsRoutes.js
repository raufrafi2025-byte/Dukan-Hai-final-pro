const express = require('express');
const router = express.Router();
const Settings = require('../models/settingsModel');

// Get Settings - /api/settings
router.get('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({ deliveryFee: 50, minOrderForFreeDelivery: 1000 });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Settings - /api/settings
router.put('/', async (req, res) => {
    try {
        const { deliveryFee, minOrderForFreeDelivery } = req.body;
        let settings = await Settings.findOne();
        if (settings) {
            settings.deliveryFee = deliveryFee;
            settings.minOrderForFreeDelivery = minOrderForFreeDelivery;
            await settings.save();
        } else {
            settings = await Settings.create({ deliveryFee, minOrderForFreeDelivery });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
