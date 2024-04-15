const express = require("express");
const cors = require("cors");
const adminRouter = require("./app/routes/admin.route");
const userRouter = require("./app/routes/user.route");
const ApiError = require("./app/api-error");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req,res) => {
    res.json({message: "Welcome to book application"});
});

app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);

app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

app.use((error, req, res, next) => {
    console.error("Error handling middleware triggered:", error);
    return res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
    });
});

module.exports = app;