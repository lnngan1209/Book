const express = require("express");
const user = require("../controllers/user.controller")

const router = express.Router();

router.route("/signin").post(user.signIn);
router.route("/signup").post(user.signUp);
router.route("/signout").post(user.signOut);

module.exports = router;