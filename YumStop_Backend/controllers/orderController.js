const Order = require("../models/orderModel");
const Table = require("../models/tableModel");
const createHttpError = require("http-errors");
const mongoose = require("mongoose");


const addOrder = async (req, res, next) => {
    try {
        if (req.body.orderType === "Take Away") {
            req.body.table = null;
        }

        // Stamp logged-in account ID onto order so it tracks by account
        req.body.createdBy = req.user._id;

        // RESET ORDER NUMBERS DAILY
        // Get the timestamp for midnight (00:00:00) of the current day
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // Count how many orders have been placed since midnight today
        const ordersTodayCount = await Order.countDocuments({
            createdAt: { $gte: startOfToday }
        });

        // Daily sequence number is the count of today's orders + 1
        // (e.g., If 0 orders today, this becomes Order #1. Next one is #2, etc.)
        req.body.dailyOrderNumber = ordersTodayCount + 1;

        // Create and save the new restaurant order safely
        const order = new Order(req.body);
        await order.save();

        // Process table booking rules ONLY if it's a Dine In order with a table
        if (req.body.orderType === "Dine In" && req.body.table) {
            const fallbackName = req.body.customerName || "Walk In";
            const rawName = req.body.customerDetails?.name || fallbackName;
            
            console.log("EXTRACTED NAME FOR INITIALS:", rawName);

            const initials = rawName
                .trim()
                .split(/\s+/)
                .map(word => word.charAt(0))
                .join("")
                .toUpperCase()
                .slice(0, 2);

            const updatedTable = await Table.findByIdAndUpdate(
                req.body.table, 
                {
                    status: "Booked",
                    initials: initials || "WI", 
                    initial: initials || "WI",
                    activeOrderId: order._id 
                },
                { new: true }
            );

            console.log("Table status updated successfully:", updatedTable);
        }

        res.status(201).json({ success: true, data: order });

    } catch (error) {
        next(error);
    }
};


const getOrderById = async (req, res, next) => {

    try {

        // Extract order id from request parameters
        const { id } = req.params;

        // Validate order id
        if(!mongoose.Types.ObjectId.isValid(id)) {
            const error = createHttpError(400, "Invalid order id!");
            return next(error);
        }

        // Check if order exists
        const order = await Order.findById(id);
        if (!order) {
            const error = createHttpError(404, "Order not found!");
            return next(error);
        }

        res.status(200).json({ success: true, data: order });

    } catch (error) {
        next(error);
    }

};

const getOrders = async (req, res, next) => {
    try {
        const loggedInUser = req.user;
        const now = new Date();

        // Create a safe boundary for TODAY (Midnight to Midnight local time)
        // This ensures old orders disappear automatically when the day rolls over
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        // Start our search condition with the date filter
        let queryCondition = {
            createdAt: { $gte: startOfToday, $lte: endOfToday }
        };

        // If they are a staff, also restrict it to ONLY their own orders
        if (loggedInUser.role.toLowerCase() !== 'admin') {
            queryCondition.createdBy = loggedInUser._id;
        }

        // Fetch today's fresh orders from the database
        const orders = await Order.find(queryCondition)
            .populate("table")
            .populate("createdBy")
            .sort({ createdAt: 1 }); // Sorts oldest to newest so Order 1 stays at the top

        res.status(200).json({ data: orders });

    } catch (error) {
        next(error);
    }
};


const updateOrder = async (req, res, next) => {

    try {

        // Update order status
        const { orderStatus } = req.body;

        // Extract order id from request parameters
        const { id } = req.params;

        // Validate order id
        if(!mongoose.Types.ObjectId.isValid(id)) {
            const error = createHttpError(400, "Invalid order id!");
            return next(error);
        }
        
        // Check if order exists and update
        const order = await Order.findByIdAndUpdate(
            id, 
            { orderStatus }, 
            { new: true }
        );
        if(!order) {
            const error = createHttpError(404, "Order not found!");
            return next(error);
        }
        res.status(200).json({ success: true, message: "Order updated successfully", data: order });

    } catch (error) {
        next(error);
    }

};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;

        // Find the order by ID and update its status field with the new value ('Ready' or 'Completed')
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { orderStatus: orderStatus },
            { new: true, runValidators: true } // Returns the newly updated document
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({
            success: true,
            message: `Order status updated to ${orderStatus} successfully!`,
            data: updatedOrder
        });
    } catch (error) {
        console.error("Backend error updating order status:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


module.exports = { addOrder, getOrderById, getOrders, updateOrder, updateOrderStatus };