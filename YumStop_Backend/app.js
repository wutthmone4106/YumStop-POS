require("dotenv").config(); // Load environment variables from .env file into process.env

const express = require("express"); // Importing Express framework
const app = express(); // Initializing Express application
const connectDB = require("./config/database"); // Function to connect to MongoDB database
const config = require("./config/config"); // Importing configuration variables
const globalErrorHandler = require("./middlewares/globalErrorHandler"); // Importing global error handling middleware
const cookieParser = require("cookie-parser"); // Middleware to parse cookies from incoming requests
const cors = require("cors"); // Middleware to enable Cross-Origin Resource Sharing (CORS)
const mongoose = require('mongoose');

// Importing Routes
const PORT = config.port;
connectDB();

// Temporary Index Purge Command: Wipes out hidden corrupt table rules
mongoose.connection.once('open', async () => {
    try {
        await mongoose.connection.db.collection('tables').dropIndexes();
        console.log("Stale index cache cleared successfully!");
    } catch (err) {
        // Safe to ignore if tableNo_1 index doesn't exist anymore
    }
});

// Middlewares
const allowedOrigins = [
  'https://yum-stop-pos.vercel.app',
  'http://localhost:5173'             
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json()); //parse incoming request in json format
app.use(cookieParser()); //parse incoming request cookies
app.use('/uploads', express.static('uploads')); 

// Root Endpoint
app.get("/", (req,res) => {
    res.json({message : "Hello from POS server!"});
})

// Other Endpoints
app.use("/api/user", require("./routes/userRoute")); // All user related routes will be defined in userRoute.js
app.use("/api/order", require("./routes/orderRoute")); // All order related routes will be defined in orderRoute.js
app.use("/api/table", require("./routes/tableRoute")); // All table related routes will be defined in tableRoute.js
app.use("/api/category", require("./routes/categoryRoute")); // All category related routes will be defined in categoryRoute.js
app.use("/api/menu", require("./routes/menuRoute")); // All menu related routes will be defined in menuRoute.js
app.use("/api/dashboard", require("./routes/dashboardRoute")); // All dashboard related routes will be defined in dashboardRoute.js

// Global Error Handler
app.use(globalErrorHandler);

// Server
app.listen(PORT, () => {
    console.log(`POS server is listening on port ${PORT}`);
})