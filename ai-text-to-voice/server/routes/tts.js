const express = require('express');
const { convertTextToSpeech, getVoices, getHistory } = require('../controllers/tts');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/convert', protect, convertTextToSpeech);
router.get('/voices', protect, getVoices);
router.get('/history', protect, getHistory);

module.exports = router;

