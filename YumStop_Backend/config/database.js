const mongoose = require("mongoose"); // Importing Mongoose library to interact with MongoDB database
const config = require("./config"); // Importing configuration variables from config.js file

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.databaseURI); // Connecting to MongoDB database using the URI specified in config.databaseURI
        console.log(`MongoDB is connected: ${conn.connection.host}`); 
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit();
    }
}

module.exports = connectDB;