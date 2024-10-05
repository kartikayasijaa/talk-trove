const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  forgotPass, 
  resetPass,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.post("/login", authUser);
router.post("/forgotpass", forgotPass);
router.post("/resetpass/:token", resetPass);

module.exports = router;
