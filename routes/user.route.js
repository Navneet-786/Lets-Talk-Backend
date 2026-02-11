const express = require("express");

const {
  getOtherUsers,
  getProfile,
  login,
  logout,
  register,
} = require("../controllers/user.controller.js");

const { isAuthenticated } = require("../middlewares/auth.middlware.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.get("/get-profile", isAuthenticated, getProfile);
router.get("/get-other-users", isAuthenticated, getOtherUsers);

module.exports = router;
