const textToSpeech = require('@google-cloud/text-to-speech');
const User = require('../models/User');
const History = require('../models/History');

// Initialize Google Cloud TTS client
const client = new textToSpeech.TextToSpeechClient();

// @desc    Convert text to speech
// @route   POST /api/tts/convert
// @access  Private
exports.convertTextToSpeech = async (req, res) => {
  try {
    const { text, language = 'en-US', voiceType = 'standard', voiceName = 'en-US-Standard-A' } = req.body;

    // Validate input
    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Please provide text to convert'
      });
    }

    // Get character count
    const characterCount = text.length;

    // Check if user has enough credits
    const user = await User.findById(req.user.id);
    
    // Calculate credits to be used
    // WaveNet voices cost more than standard voices
    const creditsMultiplier = voiceType === 'wavenet' ? 2 : 1;
    const creditsToUse = characterCount * creditsMultiplier;

    // Check if user has enough credits
    if (user.credits < creditsToUse) {
      return res.status(400).json({
        success: false,
        error: 'Not enough credits. Please upgrade your plan or wait for the monthly reset.'
      });
    }

    // Check if user's plan allows WaveNet voices
    if (voiceType === 'wavenet' && user.plan === 'free') {
      return res.status(400).json({
        success: false,
        error: 'WaveNet voices are only available for premium users. Please upgrade your plan.'
      });
    }

    // Construct the request
    const request = {
      input: { text },
      voice: {
        languageCode: language,
        name: voiceName,
      },
      audioConfig: { audioEncoding: 'MP3' },
    };

    // Call Google Cloud TTS API
    const [response] = await client.synthesizeSpeech(request);
    
    // Deduct credits from user
    user.credits -= creditsToUse;
    await user.save();

    // Create history record
    await History.create({
      user: user._id,
      text,
      characterCount,
      creditsUsed: creditsToUse,
      language,
      voiceType
    });

    // Return audio content as base64
    res.status(200).json({
      success: true,
      data: {
        audioContent: response.audioContent.toString('base64'),
        creditsUsed: creditsToUse,
        remainingCredits: user.credits
      }
    });
  } catch (err) {
    console.error('Error in TTS conversion:', err);
    res.status(500).json({
      success: false,
      error: 'Error converting text to speech'
    });
  }
};

// @desc    Get available voices
// @route   GET /api/tts/voices
// @access  Private
exports.getVoices = async (req, res) => {
  try {
    // Call Google Cloud TTS API to get available voices
    const [response] = await client.listVoices({});
    
    // Filter voices based on user's plan
    const user = await User.findById(req.user.id);
    let voices = response.voices;
    
    if (user.plan === 'free') {
      // Filter out WaveNet voices for free users
      voices = voices.filter(voice => !voice.name.includes('Wavenet'));
    }
    
    res.status(200).json({
      success: true,
      data: voices
    });
  } catch (err) {
    console.error('Error getting voices:', err);
    res.status(500).json({
      success: false,
      error: 'Error retrieving available voices'
    });
  }
};

// @desc    Get user's TTS history
// @route   GET /api/tts/history
// @access  Private
exports.getHistory = async (req, res) => {
  try {
    const history = await History.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error retrieving history'
    });
  }
};

