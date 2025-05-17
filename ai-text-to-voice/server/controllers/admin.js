const User = require('../models/User');
const History = require('../models/History');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, plan, credits } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (plan) user.plan = plan;
    if (credits) user.credits = credits;
    
    await user.save();
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Delete user's history records
    await History.deleteMany({ user: req.params.id });
    
    // Delete user
    await user.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get usage statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments();
    
    // Get users by plan
    const freeUsers = await User.countDocuments({ plan: 'free' });
    const premiumBasicUsers = await User.countDocuments({ plan: 'premium_basic' });
    const premiumProUsers = await User.countDocuments({ plan: 'premium_pro' });
    
    // Get total conversions
    const totalConversions = await History.countDocuments();
    
    // Get total characters processed
    const charactersResult = await History.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$characterCount' }
        }
      }
    ]);
    
    const totalCharacters = charactersResult.length > 0 ? charactersResult[0].total : 0;
    
    // Get conversions by voice type
    const standardConversions = await History.countDocuments({ voiceType: 'standard' });
    const wavenetConversions = await History.countDocuments({ voiceType: 'wavenet' });
    
    // Get recent conversions (last 7 days)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const recentConversions = await History.countDocuments({
      createdAt: { $gte: lastWeek }
    });
    
    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          byPlan: {
            free: freeUsers,
            premiumBasic: premiumBasicUsers,
            premiumPro: premiumProUsers
          }
        },
        conversions: {
          total: totalConversions,
          recent: recentConversions,
          byVoiceType: {
            standard: standardConversions,
            wavenet: wavenetConversions
          }
        },
        characters: totalCharacters
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

