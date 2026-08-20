import mongoose from 'mongoose';

const dashboardSchema = new mongoose.Schema({
  storeName: { type: String, default: 'SS Trendy Mart' },
  ownerPhone: { type: String, default: '9342044060' },
  tagline: { type: String, default: 'Hand Crafted • Trendy Products. Easy Shopping.' },
  adminPassword: { type: String, default: 'ChaNish@1724' },
  instagramProfileUrl: { type: String, default: 'https://instagram.com/ss_trendy_mart' },
  bannerCards: [
    {
      id: String,
      title: String,
      imageUrl: String,
      linkUrl: String
    }
  ],
  announcementText: { type: String, default: 'Hand Crafted • SS Trendy Mart • Special Coupon: TRENDY10' }
}, {
  timestamps: true
});

export const Dashboard = mongoose.models.Dashboard || mongoose.model('Dashboard', dashboardSchema);
