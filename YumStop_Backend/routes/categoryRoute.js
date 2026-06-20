const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { isVerifiedUser } = require("../middlewares/tokenVerification");

// All POS terminals need to read categories, admins change them
router.use(isVerifiedUser);

router.route('/')
  .get(categoryController.getCategories) // GET ALL CATEGORIES
  .post(categoryController.createCategory); // CREATE A CATEGORY

router.route('/:id')
  .put(categoryController.updateCategory) // UPDATE A CATEGORY
  .delete(categoryController.deleteCategory); // DELETE A CATEGORY (Safely check dependencies)

module.exports = router;
