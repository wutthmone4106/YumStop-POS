const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../models/userModel");

const isVerifiedUser = async (req, res, next) => {
    try {

        // Check if token is present in cookies
        const { accessToken } = req.cookies;
        if(!accessToken) {
            const error = createHttpError(401, "Please provide token!");
            return next(error);
        }

        // Verify the token
        const decodeToken = jwt.verify(accessToken, config.accessTokenSecret);

        // Check if user exists in database
        const user = await User.findById(decodeToken._id);
        if(!user) {
            const error = createHttpError(401, "User not exists!");
            return next(error);
        }

        // If everything is fine, pass the user data to the next middleware
        req.user = user;
        next();

    }catch (error) {
        const err = createHttpError(401, "Invalid Token!");
        next(err);
    }
};

module.exports = { isVerifiedUser };