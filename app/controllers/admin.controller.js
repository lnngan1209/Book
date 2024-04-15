const AdminService = require("../services/admin.service")
const MongoDB = require("../utils/mongodb.util")
const ApiError = require("../api-error")
const jwt = require("jsonwebtoken")
exports.signup = async (req, res, next) => {
    if (!req.body.fullname) {
        return next(new ApiError(400, "Fullname are required"));
    }
    if (!req.body.username) {
        return next(new ApiError(400, "Username are required"));
    }
    if (!req.body.password) {
        return next(new ApiError(400, "Password are required"));
    }
    if (!req.body.position) {
        return next(new ApiError(400, "Position are required"));
    }
    if (!req.body.address) {
        return next(new ApiError(400, "Address are required"));
    }
    if (!req.body.phone) {
        return next(new ApiError(400, "Phone are required"));
    }
    try {
        const adminService = new AdminService(MongoDB.client);
        const existingAdmin = await adminService.findByUserName(req.body.username);
        if (existingAdmin) {
            return next(new ApiError(400, "Username is already taken"));
        }
        const admin = await adminService.signup(req.body);
        if (admin) {
            return res.send({message: "Signup successfully"});
        }
        
    } catch(error) {
        return next(new ApiError(500, "An error occured while signing up"))
    }
}

exports.signIn = async (req, res, next) => {
    if (!req.body.username) {
        return next(new ApiError(400, "Username are required"));
    }
    if (!req.body.password) {
        return next(new ApiError(400, "Password are required"));
    }
    try {
        const adminService = new AdminService(MongoDB.client);
        const admin = await adminService.signIn(req.body);
        if (!admin) {
            return next(new ApiError(401, "Invalid username or password"));
        }
        const token = jwt.sign(admin, "jwtoken", {expiresIn: "1h"})
        res.cookie("token", token, {httpOnly: false})
        return res.send({message: "Signin successfully", token, admin});
    } catch(error) {
        console.log(error)
        return next(new ApiError(500, "An error occurred while signing in"));
    }
}
exports.signOut = async (req, res, next) => {
    return res.send({message: "Signout successfully"})
}