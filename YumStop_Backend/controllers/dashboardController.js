const Order = require('../models/orderModel.js');
const Table = require('../models/tableModel.js');
const User = require('../models/userModel.js');
const Menu = require('../models/menuModel.js');
const Category = require('../models/categoryModel.js');

const getDashboardStats = async (req, res) => {
    try {
        // Handle Myanmar time conversion (UTC +6:30)
        const now = new Date();
        const mmOffset = 6.5 * 60 * 60 * 1000; // Offset in milliseconds
        
        // Convert current time to Myanmar local date string (YYYY-MM-DD)
        const mmLocalDateString = new Date(now.getTime() + mmOffset).toISOString().split('T')[0];

        // Create a UTC midnight anchor shifted back by the local offset hours
        const startOfToday = new Date(mmLocalDateString + 'T00:00:00.000Z');
        startOfToday.setTime(startOfToday.getTime() - mmOffset);

        // TODAY SALES - Queries documents starting from local midnight
        const todayOrders = await Order.find({
            createdAt: { $gte: startOfToday }
        });

        const todaySales = todayOrders.reduce(
            (acc, item) => acc + (item.grandTotal || (item.bills && item.bills.totalWithTax) || item.totalAmount || 0),
            0
        );

        // TOTAL REVENUE
        const allOrders = await Order.find();

        const totalRevenue = allOrders.reduce(
            (acc, item) => acc + (item.grandTotal || (item.bills && item.bills.totalWithTax) || item.totalAmount || 0),
            0
        );

        // ORDERS (Supports both 'status' and 'orderStatus' schema architectures)
        const activeOrders = await Order.countDocuments({ 
            $or: [{ status: 'Pending' }, { orderStatus: /pending/i }] 
        });
        const preparingOrders = await Order.countDocuments({ 
            $or: [{ status: 'Preparing' }, { orderStatus: /preparing/i }] 
        });
        const completedOrders = await Order.countDocuments({ 
            $or: [{ status: 'Completed' }, { orderStatus: /completed/i }] 
        });

        // TABLES
        const occupiedTables = await Table.countDocuments({ status: 'Occupied' });
        const totalTables = await Table.countDocuments();

        // STAFF
        const activeStaff = await User.countDocuments();

        // MENU + CATEGORY
        const totalMenus = await Menu.countDocuments();
        const totalCategories = await Category.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                todaySales,
                totalRevenue,
                activeOrders,
                preparingOrders,
                completedOrders,
                occupiedTables,
                totalTables,
                activeStaff,
                totalMenus,
                totalCategories
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { getDashboardStats };
