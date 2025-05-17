const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  plan: {
    type: String,
    enum: ['free', 'premium_basic', 'premium_pro'],
    default: 'free'
  },
  credits: {
    type: Number,
    default: 10000 // Free tier starts with 10,000 credits
  },
  creditsResetDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Reset user credits on the first day of each month
UserSchema.methods.resetCreditsIfNeeded = function() {
  const now = new Date();
  const resetDate = new Date(this.creditsResetDate);
  
  // Check if it's a new month since the last reset
  if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
    // Reset credits based on plan
    switch(this.plan) {
      case 'free':
        this.credits = 10000;
        break;
      case 'premium_basic':
        this.credits = 100000;
        break;
      case 'premium_pro':
        this.credits = 1000000; // Effectively unlimited
        break;
      default:
        this.credits = 10000;
    }
    
    this.creditsResetDate = now;
    return true;
  }
  
  return false;
};

module.exports = mongoose.model('User', UserSchema);

