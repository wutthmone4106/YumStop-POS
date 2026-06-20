const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const multer = require("multer");

// Configure local file disk storage rules for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        // Extracts and appends original format extension (e.g., .jpg or .png)
        const ext = file.originalname.substring(file.originalname.lastIndexOf("."));
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage });

// Secure all endpoints below by routing them through session token gatekeeper
router.use(isVerifiedUser);

// Operations on the entire menu tree root collection
router.route('/')
  .get(menuController.getMenuItems) // GET ALL MENU ITEMS (with category names populated)
  .post(upload.single("image"), menuController.createMenuItem); 

// Operations addressing a distinct item payload directly via unique parameter IDs
router.route('/:id')
  .put(upload.single("image"), menuController.updateMenuItem)  // UPDATE A MENU ITEM (Admin-only) - expects full item payload in request body
  .delete(menuController.deleteMenuItem);  // DELETE A MENU ITEM (Admin-only) - safely check for dependencies before deletion

module.exports = router;
