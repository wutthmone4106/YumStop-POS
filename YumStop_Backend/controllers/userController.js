const createHttpError = require("http-errors");
const User = require("../models/userModel");
const Menu = require("../models/menuModel")
const Order = require('../models/orderModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const register = async (req, res, next) => {
    try {
        const { name, phone, email, password, role } = req.body;

        // If one field is missing
        if(!name || !phone || !email || !password || !role) {
            const error = createHttpError(400, "All fields are required!");
            return next(error);
        }

        // User already exists
        const isUserPresent = await User.findOne({email});
        if(isUserPresent) {
            const error = createHttpError(400, "User already exists!");
            return next(error);
        }

        // New User Creation
        const user = { name, phone, email, password, role };
        const newUser = User(user);
        await newUser.save();

        res.status(201).json({success: true, message: "New user created!", data: newUser});

    } catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    try {

        const {email, password} = req.body;

        // If one field is missing
        if(!email || !password) {
            const error = createHttpError(400, "All fields are required!");
            return next(error);
        }

        // User not found
        const isUserPresent = await User.findOne({email});
        if(!isUserPresent) {
            const error = createHttpError(404, "User not found!");
            return next(error);
        }

        // Password is incorrect
        const isMatch = await bcrypt.compare(password, isUserPresent.password);
        if(!isMatch) {
            const error = createHttpError(401, "Invalid credentials!");
            return next(error);
        }

        // Generate JWT Token
        const accessToken = jwt.sign({_id: isUserPresent._id}, config.accessTokenSecret, {
            expiresIn: "1d"
        });

        // Send token in cookie
        res.cookie("accessToken", accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30, //1 day
            httpOnly: true,
            sameSite: "none",
            secure: true
        });

        res.status(200).json({success: true, message: "Login successful!", data: isUserPresent});

    } catch (error) {
        next(error);
    }
}

const getUserData = async (req, res, next) => {
    try {

        // req.user is set in the auth middleware after verifying the JWT token
        const user = await User.findById(req.user._id);
        res.status(200).json({success: true, data: user});

    }catch (error) {
        next(error);
    }
};

// READ: Get all registered users (employees)
const getAllEmployees = async (req, res, next) => {
    try {
        // Exclude password strings from the returned payload for security
        const employees = await User.find({}).select("-password");
        res.status(200).json({ success: true, data: employees });
    } catch (error) {
        next(error);
    }
};

// UPDATE: Modify user attributes (e.g., changing roles, phone, or name)
const updateEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, phone, email, role } = req.body;

        const updatedEmployee = await User.findByIdAndUpdate(
            id,
            { name, phone, email, role },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedEmployee) {
            const error = createHttpError(404, "Employee records not found!");
            return next(error);
        }

        res.status(200).json({ success: true, message: "Employee profile updated successfully!", data: updatedEmployee });
    } catch (error) {
        next(error);
    }
};

// DELETE: Remove user account from database system
const deleteEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            const error = createHttpError(404, "Employee entry not found!");
            return next(error);
        }

        res.status(200).json({ success: true, message: "Employee successfully deleted from database layout!" });
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {

        // Clearing the cookie on logout
        res.clearCookie("accessToken");
        res.status(200).json({success: true, message: "Logout successful!"});

    } catch (error) {
        next(error);
    }
}

const getStaffPerformanceData = async (req, res, next) => {
    try {
        const loggedInUser = req.user; // Set by auth middleware
        const targetGoal = 600000;     // Daily milestone target
        const now = new Date();

        // Setup time restrictions for the current business date
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0); 

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999); 

        const completedStatusRule = { $regex: /^completed$/i };

        // IF THE LOGGED IN USER IS AN ADMIN
        if (loggedInUser.role.toLowerCase() === 'admin') {
            // Fetch all users from the database who are NOT admins
            const allEmployees = await User.find({ role: { $ne: 'Admin' } }).select("-password");
            
            // Fetch all orders that are fully completed
            const completedOrders = await Order.find({ orderStatus: completedStatusRule });

            // Loop through each employee and calculate their sales metrics
            const performanceGrid = allEmployees.map((employee) => {
                // Filter out only the orders created by this specific employee
                const employeeOrders = completedOrders.filter(
                    (order) => order.createdBy && order.createdBy.toString() === employee._id.toString()
                );

                // Track both values cleanly
                let totalSalesSum = 0;
                let todaySalesSum = 0;

                employeeOrders.forEach((order) => {
                    const orderValue = (order.grandTotal || order.bills?.totalWithTax || 0);
                    
                    // Accumulate Lifetime Total Revenue
                    totalSalesSum += orderValue;

                    // Accumulate Today's Sales Only
                    const orderDate = new Date(order.createdAt);
                    if (orderDate >= startOfToday && orderDate <= endOfToday) {
                        todaySalesSum += orderValue;
                    }
                });

                // Map the history array into simple keys for frontend modals
                const orderHistory = employeeOrders.map((order, index) => {
                    return {
                        _id: order._id,
                        sequenceNumber: order.sequenceNumber || order.orderNo || `TKT-${1000 + index}`,
                        orderType: order.orderType || 'Dine-In',
                        createdAt: order.createdAt,
                        totalAmount: order.grandTotal || order.bills?.totalWithTax || 0
                    };
                });

                // Return both metrics per employee row back to frontend application
                return {
                    _id: employee._id,
                    name: employee.name,
                    role: employee.role,
                    sales: totalSalesSum,       // Lifetime performance tracking
                    todaySales: todaySalesSum,  // Real-time daily tracking
                    orders: employeeOrders.length,
                    orderHistory: orderHistory 
                };
            });

            // Return the admin dataset response
            return res.status(200).json({
                success: true,
                isAdmin: true,
                data: performanceGrid
            });
        }

        // IF LOGGED IN USER IS A CASHIER 
        else {
            const userId = loggedInUser._id;

            const dashboardData = await generateDashboardData(
                userId,
                startOfToday,
                endOfToday
            );

            const myTodayOrders = await Order.find({
                createdBy: userId,
                orderStatus: { $regex: /^completed$/i },
                createdAt: { $gte: startOfToday, $lte: endOfToday }
            });

            const myTotalOrders = await Order.find({
                createdBy: userId,
                orderStatus: { $regex: /^completed$/i }
            });

            let todaySalesSum = 0;
            myTodayOrders.forEach((order) => {
                todaySalesSum += order.bills?.totalWithTax || 0;
            });

            const todayAverage = myTodayOrders.length > 0 
                ? Math.round(todaySalesSum / myTodayOrders.length) 
                : 0;
                
            const progressPercentage = Math.min(Math.round((todaySalesSum / targetGoal) * 100), 100);

            const weeklyChartData = [
                { name: '3 Wks Ago', sales: 0, minDays: 22, maxDays: 28 },
                { name: '2 Wks Ago', sales: 0, minDays: 15, maxDays: 21 },
                { name: '1 Wk Ago',  sales: 0, minDays: 8,  maxDays: 14 },
                { name: 'This Week', sales: 0, minDays: 0,  maxDays: 7 }
            ];

            const monthlyChartData = [];
            for (let i = 11; i >= 0; i--) {
                const targetMonthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const shortMonthName = targetMonthDate.toLocaleString('en-US', { month: 'short' });
                monthlyChartData.push({
                    name: shortMonthName,
                    sales: 0,
                    monthIdx: targetMonthDate.getMonth(),
                    year: targetMonthDate.getFullYear()
                });
            }

            myTotalOrders.forEach((order) => {
                const orderDate = new Date(order.createdAt || order.orderDate);
                const value = order.bills?.totalWithTax || 0;
                const differenceInDays = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));

                const matchedWeek = weeklyChartData.find(wk => differenceInDays >= wk.minDays && differenceInDays <= wk.maxDays);
                if (matchedWeek) matchedWeek.sales += value;

                const matchedMonth = monthlyChartData.find(mo => mo.monthIdx === orderDate.getMonth() && mo.year === orderDate.getFullYear());
                if (matchedMonth) matchedMonth.sales += value;
            });

            return res.status(200).json({
                success: true,
                isAdmin: false,
                data: {
                    sales: dashboardData.sales.toLocaleString(),
                    ordersCount: myTodayOrders.length,
                    avgOrderValue: todayAverage.toLocaleString(),
                    targetProgress: progressPercentage,
                    weeklyChartData: weeklyChartData.map(({ name, sales }) => ({
                        name,
                        sales
                    })),
                    monthlyChartData: monthlyChartData.map(({ name, sales }) => ({
                        name,
                        sales
                    })),
                    todayOrdersList: myTodayOrders,
                    activeOrdersCount: dashboardData.activeOrdersCount,
                    recentOrders: dashboardData.recentOrders,
                    popularDishesList: dashboardData.popularDishesList
                }
            });
        }

            } catch (error) {
                next(error);
            }
};

const generateDashboardData = async (userId, startOfToday, endOfToday) => {

    // Today's completed sales
    const completedOrdersToday = await Order.find({
        createdBy: userId,
        orderStatus: { $regex: /^completed$/i },
        createdAt: {
            $gte: startOfToday,
            $lte: endOfToday
        }
    });

    // Active orders (Orders still being prepared)
    const activeOrders = await Order.find({
        createdBy: userId,
        orderStatus: {
            $not: /^completed$/i
        }
    });

    // Recent orders restricted to today only (Daily Refresh)
    const recentOrders = await Order.find({
        createdBy: userId,
        createdAt: {
            $gte: startOfToday,
            $lte: endOfToday
        }
    })
    .sort({ createdAt: -1 })
    .limit(10);

    // Total Sales Calculator
    let sales = 0;
    for (let i = 0; i < completedOrdersToday.length; i++) {
        sales = sales + (completedOrdersToday[i].bills?.totalWithTax || 0);
    }

    // Popular dishes restricted to today's transactions only
    const allOrdersToday = await Order.find({
        createdBy: userId,
        createdAt: {
            $gte: startOfToday,
            $lte: endOfToday
        }
    });

    const dishesMap = {};

    // Process transaction histories
    for (let i = 0; i < allOrdersToday.length; i++) {
        const currentOrder = allOrdersToday[i];
        if (currentOrder.items) {
            for (let j = 0; j < currentOrder.items.length; j++) {
                const item = currentOrder.items[j];
                // If this is a new dish found today, initialize it inside tracker map
                if (!dishesMap[item.name]) {
                    
                    // --- MENU IMAGE --- 
                    const realMenuProduct = await Menu.findOne({ name: item.name });
                    
                    let cleanAdminImage = "";
                    if (realMenuProduct && realMenuProduct.image) {
                        cleanAdminImage = realMenuProduct.image;
                    }
                    // ------------------------------

                    dishesMap[item.name] = {
                        name: item.name,
                        image: cleanAdminImage, // Pure path from original schema definitions
                        quantity: 0
                    };
                }

                // Add up the totals sold
                dishesMap[item.name].quantity = dishesMap[item.name].quantity + item.quantity;
            }
        }
    }

    // Sort the items to find the top selling dishes
    const popularDishesList = Object.values(dishesMap)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10)
        .map((dish, index) => ({
            id: index + 1,
            name: dish.name,
            image: dish.image,
            numberOfOrders: dish.quantity
        }));

    return {
        sales,
        activeOrdersCount: activeOrders.length,
        recentOrders,
        popularDishesList
    };
};


module.exports = { register, login, getUserData, logout, getAllEmployees, updateEmployee, deleteEmployee, getStaffPerformanceData, generateDashboardData };