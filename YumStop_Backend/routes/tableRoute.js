const express = require('express');
const router = express.Router();
const { getTables, createTable, updateTable, deleteTable, releaseTable } = require('../controllers/tableController');
const { isVerifiedUser } = require("../middlewares/tokenVerification");

router.use(isVerifiedUser);

router.route('/')
  .get(getTables) // GET ALL TABLES - returns an array of all table documents in the database, sorted by tableNumber for easier frontend display    
  .post(createTable); // GET ALL TABLES - returns an array of all table documents in the database, sorted by tableNumber for easier frontend display

// Distinct Document Identifier Endpoint Layout
router.route('/:id')
  .put(updateTable) // UPDATE A TABLE (Admin-only) - expects full table payload in request body
  .delete(deleteTable); // DELETE A TABLE (Safely check for dependencies before deletion)

router.put('/:id/release', releaseTable);


module.exports = router;
