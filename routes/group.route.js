const express = require("express");
const { createGroup, getGroups } = require("../controllers/group.controller.js");
const { isAuthenticated } = require("../middlewares/auth.middlware.js");
const router = express.Router();

router.route("/create").post(isAuthenticated, createGroup);
router.route("/all").get(isAuthenticated, getGroups);

module.exports = router;
