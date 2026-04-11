// seedIndustries.js
// Run: node seedIndustries.js
// Seeds mock registered partner companies into MongoDB

import mongoose from 'mongoose';
import Industry from './models/Industry.js';

// const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/internship_db';

const MONGO_URI = process.env.MONGO_URI;

const mockIndustries = [
  {
    placeId: 'MOCK_TECHVISION_001',
    name: 'TechVision Solutions',
    address: 'Blue Area, Islamabad, Pakistan',
    website: 'https://techvision.com.pk',
    location: { lat: 33.7294, lng: 73.0931 },
    status: 'Approved',
    internships: [
      { title: 'Frontend Developer', type: 'Onsite', duration: '3 months', stipend: 'Rs. 15,000/mo', isOpen: true },
      { title: 'React Native Dev',   type: 'Hybrid', duration: '2 months', stipend: 'Rs. 10,000/mo', isOpen: true },
    ],
  },
  {
    placeId: 'MOCK_CODECRAFT_002',
    name: 'CodeCraft Pvt Ltd',
    address: 'F-7 Markaz, Islamabad, Pakistan',
    website: 'https://codecraft.pk',
    location: { lat: 33.7215, lng: 73.0566 },
    status: 'Approved',
    internships: [
      { title: 'Full Stack (MERN)',  type: 'Remote',  duration: '2 months', stipend: 'Rs. 12,000/mo', isOpen: true },
      { title: 'UI/UX Designer',    type: 'Onsite',  duration: '3 months', stipend: 'Unpaid',         isOpen: true },
      { title: 'Node.js Backend',   type: 'Hybrid',  duration: '2 months', stipend: 'Rs. 8,000/mo',  isOpen: true },
      { title: 'DevOps Intern',     type: 'Remote',  duration: '4 months', stipend: 'Rs. 20,000/mo', isOpen: false },
      { title: 'QA Tester',         type: 'Onsite',  duration: '2 months', stipend: 'Unpaid',         isOpen: true },
    ],
  },
  {
    placeId: 'MOCK_ARFA_003',
    name: 'Arfa Software Technology Park',
    address: 'Ferozepur Road, Lahore, Pakistan',
    website: 'https://arfatechpark.com',
    location: { lat: 31.5204, lng: 74.3587 },
    status: 'Approved',
    internships: [
      { title: 'Python ML Intern',  type: 'Onsite', duration: '3 months', stipend: 'Rs. 18,000/mo', isOpen: true },
    ],
  },
];

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    for (const data of mockIndustries) {
      await Industry.findOneAndUpdate(
        { placeId: data.placeId },
        data,
        { upsert: true, new: true }
      );
      console.log(`✔  Seeded: ${data.name}`);
    }

    console.log('\n🎉 All mock industries seeded successfully!');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();