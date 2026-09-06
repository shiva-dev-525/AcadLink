const mongoose = require('mongoose');

/**
 * Organization Model
 *
 * Represents an Industry or Institutional organization profile.
 */
const OrganizationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
      default: 'Partner Organization',
    },
    category: {
      type: String,
      trim: true,
      default: 'Technology & Software',
    },
    description: {
      type: String,
      trim: true,
      default: 'Active industry partner providing internship and career opportunities.',
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: 'Bengaluru, India',
    },
    contactEmail: {
      type: String,
      trim: true,
      default: '',
    },
    contactPhone: {
      type: String,
      trim: true,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Organization', OrganizationSchema);
