import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(email) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        },
        message: 'Please provide a valid email address'
      }
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false // Ne pas inclure le password par défaut dans les queries
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'manager', 'support', 'user'],
        message: 'Role must be one of: admin, manager, support, user'
      },
      default: 'user',
    },
    department: {
      type: String,
      trim: true,
      maxlength: [50, 'Department cannot exceed 50 characters'],
    },
    position: {
      type: String,
      trim: true,
      maxlength: [50, 'Position cannot exceed 50 characters'],
    },
    phoneNumber: {
      type: String,
      trim: true,
      validate: {
        validator: function(phone) {
          if (!phone) return true; // Optional field
          const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
          return phoneRegex.test(phone);
        },
        message: 'Please provide a valid phone number'
      }
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    language: {
      type: String,
      default: 'fr',
      enum: ['fr', 'en', 'es'],
    },
  },
  {
    timestamps: true,
    toJSON: { 
      virtuals: true,
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password; // Double sécurité
        return ret;
      }
    },
    toObject: { 
      virtuals: true,
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      }
    }
  }
);

// Index pour améliorer les performances
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) return next();

  try {
    // Vérifier la force du password
    if (this.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const salt = await bcrypt.genSalt(12); // Augmenté à 12 pour plus de sécurité
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-update hook pour les mises à jour (findOneAndUpdate, etc.)
userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  
  if (update.password) {
    try {
      if (update.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      const salt = await bcrypt.genSalt(12);
      update.password = await bcrypt.hash(update.password, salt);
    } catch (error) {
      next(error);
    }
  }
  next();
});

// Method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

// Method to check if user has specific role
userSchema.methods.hasRole = function (requiredRole) {
  const roleHierarchy = {
    user: 1,
    support: 2,
    manager: 3,
    admin: 4
  };
  
  return roleHierarchy[this.role] >= roleHierarchy[requiredRole];
};

// Method to get public profile (sans données sensibles)
userSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    department: this.department,
    position: this.position,
    phoneNumber: this.phoneNumber,
    isActive: this.isActive,
    lastLogin: this.lastLogin,
    emailVerified: this.emailVerified,
    profilePicture: this.profilePicture,
    timezone: this.timezone,
    language: this.language,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Virtual for full name (si vous avez firstName et lastName)
userSchema.virtual('fullName').get(function () {
  return this.name; // Ou si vous séparez firstName/lastName: `${this.firstName} ${this.lastName}`
});

// Static method to find active users
userSchema.statics.findActive = function () {
  return this.find({ isActive: true });
};

// Static method to find by email (inclut le password pour l'authentification)
userSchema.statics.findByEmailWithPassword = function (email) {
  return this.findOne({ email }).select('+password');
};

// Static method to find by id avec password
userSchema.statics.findByIdWithPassword = function (id) {
  return this.findById(id).select('+password');
};

// Middleware pour logger les connexions
userSchema.post('save', function (doc) {
  if (doc.isModified('lastLogin')) {
    console.log(`User ${doc.email} logged in at ${doc.lastLogin}`);
  }
});

const User = mongoose.model('User', userSchema);

export default User;