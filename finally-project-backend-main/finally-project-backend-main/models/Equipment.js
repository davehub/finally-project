import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['laptop', 'desktop', 'server', 'network', 'printer', 'mobile', 'peripheral', 'other'],
      required: true,
    },
    model: {
      type: String,
      trim: true,
    },
    serialNumber: {
      type: String,
      trim: true,
      unique: true,
    },
    purchaseDate: {
      type: Date,
    },
    warrantyExpiryDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['operational', 'maintenance', 'repair', 'inactive'],
      default: 'operational',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    location: {
      type: String,
      trim: true,
    },
    specifications: {
      type: Map,
      of: String,
    },
    notes: {
      type: String,
      trim: true,
    },
    lastMaintenanceDate: {
      type: Date,
    },
    nextMaintenanceDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
equipmentSchema.index({ type: 1 });
equipmentSchema.index({ status: 1 });
equipmentSchema.index({ assignedTo: 1 });

const Equipment = mongoose.model('Equipment', equipmentSchema);

export default Equipment;