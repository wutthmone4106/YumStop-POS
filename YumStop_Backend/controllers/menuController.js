const Menu = require('../models/menuModel');
const mongoose = require('mongoose');

exports.getMenuItems = async (req, res, next) => {
    // Using populate to fetch category name along with menu items
    try {
        const items = await Menu.find().populate('category', 'name');
        res.status(200).json({ status: 'success', data: items });
    } catch (err) { next(err); }
};

// Admin-only operations below - create, update, delete menu items
exports.createMenuItem = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                status: 'fail', 
                message: 'Please upload an image file from your device.' 
            });
        }

        const menuData = {
            name: req.body.name,
            price: Number(req.body.price), 
            category: req.body.category,  
            image: req.file.path 
        };

        const newItem = await Menu.create(menuData);
        res.status(201).json({ status: 'success', data: newItem });

    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err.message || 'Database validation failed'
        });
    }
};

exports.updateMenuItem = async (req, res, next) => {
    try {
        // Validate that the menu entry actually exists first
        const existingItem = await Menu.findById(req.params.id);
        if (!existingItem) {
            return res.status(404).json({ 
                status: 'fail', 
                message: 'Target menu asset record missing' 
            });
        }

        // Safely parse and fall back to existing data if fields are missing in req.body
        const updatedName = req.body.name || existingItem.name;
        const updatedPrice = req.body.price ? Number(req.body.price) : existingItem.price;
        
        // Prevent casting crash: Convert category string to a structural Mongoose ObjectId
        let updatedCategory = existingItem.category;
        if (req.body.category) {
            if (mongoose.Types.ObjectId.isValid(req.body.category)) {
                updatedCategory = new mongoose.Types.ObjectId(req.body.category);
            } else {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Invalid Category ID formatting structure.'
                });
            }
        }

        // Handle image updates cleanly
        let updatedImage = existingItem.image; // Keep the old image path by default
        if (req.file) {
            updatedImage = req.file.path; // Replace with new file path if uploaded
        }

        // Save the structured document updates
        const updated = await Menu.findByIdAndUpdate(
            req.params.id, 
            {
                name: updatedName,
                price: updatedPrice,
                category: updatedCategory,
                image: updatedImage
            }, 
            { 
                new: true, 
                runValidators: true 
            }
        ).populate('category', 'name'); // Re-populate immediately for the frontend cache

        res.status(200).json({ status: 'success', data: updated });

    } catch (err) { 
        res.status(400).json({
            status: 'error',
            message: err.message || 'Database alteration transaction failed'
        });
    }
};

exports.deleteMenuItem = async (req, res, next) => {
    try {

        await Menu.findByIdAndDelete(req.params.id);
        res.status(204).json({ status: 'success', data: null });

    } catch (err) { 
      next(err); 
    }
};
