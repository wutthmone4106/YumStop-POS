const express = require("express");
const { login, register, getUserData, getAllEmployees, updateEmployee, deleteEmployee, logout, getStaffPerformanceData } = require("../controllers/userController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const router = express.Router();

// Authentication Routes
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(isVerifiedUser, logout);
router.route("/").get(isVerifiedUser, getUserData);

// Employee Management RUD Routes (Protected)
router.route("/employees").get(isVerifiedUser, getAllEmployees);
router.route("/employees/:id")
    .put(isVerifiedUser, updateEmployee)
    .delete(isVerifiedUser, deleteEmployee);

router.get('/performance-tracking', isVerifiedUser, getStaffPerformanceData);

module.exports = router;