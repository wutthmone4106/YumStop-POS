const Category = require('../models/categoryModel');
const Menu = require('../models/menuModel');

// GET ALL CATEGORIES
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 }); // Sorted alphabetically
    res.status(200).json({
      status: 'success',
      results: categories.length,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

//  CREATE A CATEGORY
exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ status: 'fail', message: 'Category name is required' });
    }

    // Check for existing duplicate category names
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingCategory) {
      return res.status(400).json({ status: 'fail', message: 'Category already exists' });
    }

    // Generate clean slug mapping
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newCategory = await Category.create({ name, slug });

    res.status(201).json({
      status: 'success',
      data: newCategory,
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE A CATEGORY
exports.updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    if (!name) {
      return res.status(400).json({ status: 'fail', message: 'Category name cannot be empty' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, slug },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ status: 'fail', message: 'No category found with that ID' });
    }

    res.status(200).json({
      status: 'success',
      data: updatedCategory,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE A CATEGORY (Safely check dependencies)
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Safety Gate: Prevent deletion if any active menu items depend on this category
    const hasMenuItems = await Menu.exists({ category: id });
    if (hasMenuItems) {
      return res.status(400).json({
        status: 'fail',
        message: 'Cannot delete category. There are still dishes assigned to it. Reassign or remove those dishes first.',
      });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ status: 'fail', message: 'No category found with that ID' });
    }

    // Status 204 means No Content (Standard successful delete)
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
