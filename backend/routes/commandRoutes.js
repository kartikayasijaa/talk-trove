const express = require('express');
const gemini = require('../controllers/commandControllers/geminiControllers');
const chatgpt = require('../controllers/commandControllers/chatgptControllers');
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route('/chatgpt').post(protect, chatgpt);
router.route('/gemini').post(protect, gemini);

module.exports = router;