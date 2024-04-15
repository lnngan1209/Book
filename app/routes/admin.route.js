const express = require("express");
const admin = require("../controllers/admin.controller")

const router = express.Router();

router.route("/signin").post(admin.signIn);
router.route("/signout").post(admin.signOut);
router.route("/signup").post(admin.signup)

module.exports = router;