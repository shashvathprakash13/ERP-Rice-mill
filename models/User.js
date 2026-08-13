const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'supervisor', 'operator', 'viewer'],
      default: 'viewer',
      description: 'User role for RBAC',
    },
    department: {
      type: String,
      enum: ['warehouse', 'production', 'hr', 'finance', 'procurement', 'it'],
      required: [true, 'Department is required'],
    },
    phone: {
      type: String,
      required: false,
      match: [/^\d{10}$/, 'Phone must be 10 digits'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    permissions: {
      type: [String],
      default: [],
      description: 'Additional granular permissions',
    },
  },
  { timestamps: true }
);

// Hash password before saving
// Use async middleware without the `next` callback to avoid calling an undefined next
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return; // nothing to do
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove sensitive fields from JSON response
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
