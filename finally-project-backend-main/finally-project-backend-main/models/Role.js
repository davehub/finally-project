const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du rôle est requis.'],
    unique: true,
    trim: true,
    lowercase: true
  },
  permissions: {
    type: [String], // Tableau de chaînes de caractères représentant les permissions
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Role', RoleSchema);