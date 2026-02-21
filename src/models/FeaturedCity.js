import mongoose from 'mongoose';

const FeaturedCitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  searchCount: {
    type: Number,
    default: 0,
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.models.FeaturedCity || mongoose.model('FeaturedCity', FeaturedCitySchema);
