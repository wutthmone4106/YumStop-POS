// Import
require("dotenv").config();

// Identify config
const config = Object.freeze({
    port: process.env.PORT || 3000, // Port number on which the server will listen. It can be set in the .env file or defaults to 3000 if not specified.
    databaseURI: process.env.MONGODB_URI || "mongodb://localhost:27017/YumStop POS", // MongoDB connection URI. It can be set in the .env file or defaults to a local MongoDB instance with the database name "YumStop POS".
    nodeENV: process.env.NODE_ENV || "development", // The environment in which the application is running. It can be set to "development", "production", etc. It defaults to "development" if not specified.
    accessTokenSecret: process.env.JWT_SECRET || "your-access-token-secret" // Secret key used for signing JWT access tokens. It can be set in the .env file or defaults to "your-access-token-secret" if not specified. In a production environment, it is crucial to set this to a strong, unique value to ensure the security of the tokens.
});

// Export
module.exports = config;