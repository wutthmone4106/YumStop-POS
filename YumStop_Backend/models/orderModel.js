const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerDetails: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        guests: { type: Number, required: true },
    },

    orderStatus: {
        type: String,
        required: true,
        default: "Progress"
    },

    orderDate: {
        type: Date,
        default: Date.now
    },

    bills: {
        total : { type: Number, required: true},
        tax: { type: Number, required: true },
        totalWithTax: { type: Number, required: true }
    },

    items: [],

    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Table"
    },

    orderType: {
        type: String,
        enum: ["Dine In", "Take Away"],
        required: true,
        default: "Dine In"
    },

    paymentType: {
        type: String,
        enum: ["CASH", "QR"],
        required: true,
        default: "CASH"
    },

    paymentGateway: {
        type: String,
        default: "" 
    },

    dailyOrderNumber: {
        type: Number
    },

    createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
