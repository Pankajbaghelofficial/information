const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    
    // Update password if provided
    if (password) {
      user.password = password;
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        credits: user.credits
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Upgrade user plan
// @route   POST /api/users/upgrade
// @access  Private
router.post('/upgrade', protect, async (req, res) => {
  try {
    const { plan } = req.body;
    
    // Validate plan
    if (!['free', 'premium_basic', 'premium_pro'].includes(plan)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid plan'
      });
    }
    
    const user = await User.findById(req.user.id);
    
    // Update plan
    user.plan = plan;
    
    // Update credits based on new plan
    switch(plan) {
      case 'free':
        user.credits = 10000;
        break;
      case 'premium_basic':
        user.credits = 100000;
        break;
      case 'premium_pro':
        user.credits = 1000000; // Effectively unlimited
        break;
      default:
        user.credits = 10000;
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        credits: user.credits
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

module.exports = router;

