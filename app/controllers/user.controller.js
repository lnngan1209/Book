const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util")
const ApiError = require("../api-error")
const jwt = require("jsonwebtoken")
//Đăng ký tài khoản
exports.signUp = async (req, res, next) => {
    if (!req.body.email) {
        return next(new ApiError(400, "Email is required"));
    }
    if (!req.body.name) {
        return next(new ApiError(400, "Name is required"));
    }
    if (!req.body.password) {
        return next(new ApiError(400, "Password is required"));
    }
    if (!req.body.address) {
        return next(new ApiError(400, "Address is required"));
    }
    if (!req.body.phone) {
        return next(new ApiError(400, "Phone is required"));
    }
    try {
        const userService = new UserService(MongoDB.client);
        const existingUser = await userService.findByEmail(req.body.email);
        if (existingUser) {
            return next(new ApiError(400, "Email is already taken"));
        }
        const user = await userService.signUp(req.body);
        if (user) {
            return res.send({message: "Signup successfully"});
        }
    } catch(error) {
        return next(new ApiError(500, "An error occurred while signing up"));
    }
}

exports.signIn = async (req, res, next) => {
    if (!req.body.email) {
        return next(new ApiError(400, "Email is required"));
    }
    if (!req.body.password) {
        return next(new ApiError(400, "Password is required"));
    }
    try {
        const userService = new UserService(MongoDB.client);
        const user = await userService.signIn(req.body);
        if (!user) {
            return next(new ApiError(401, "Invalid email or password"));
        }
        const userToken = jwt.sign(user, "jwtoken", {expiresIn: "1h"})
        res.cookie("userToken", userToken, {httpOnly: false})
        return res.send({message: "Signin Successfully", userToken, user: user._id })
    } catch(error) {
        console.log(error);
        return next(new ApiError(500, "An error occurred while signing in"));
    }
}
exports.signOut = async (req, res, next) => {
    return res.send({message: "Signout successfully"})
}


