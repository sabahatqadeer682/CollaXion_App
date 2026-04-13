// import express from 'express';
// import axios from 'axios';
// import Industry from '../models/Industry.js';
// const router = express.Router();

// // Haversine Formula for SRS-9.1 (Distance calculation)
// const calculateDistance = (lat1, lon1, lat2, lon2) => {
//   const R = 6371; 
//   const dLat = (lat2 - lat1) * Math.PI / 180;
//   const dLon = (lon2 - lon1) * Math.PI / 180;
//   const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
//             Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
//             Math.sin(dLon/2) * Math.sin(dLon/2);
//   return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
// };

// // Route: /api/industries/nearby-students
// router.post("/nearby-students", async (req, res) => {
//   const { lat, lng } = req.body;
//   const GOOGLE_KEY = "AIzaSyB_77_ZDWGyDKgTCOgZZ4WMeUAAp4o_JNk";

//   try {
//     const googleRes = await axios.get(
//       `https://maps.googleapis.com/maps/api/place/textsearch/json?query=software+house&location=${lat},${lng}&radius=10000&key=${GOOGLE_KEY}`
//     );

//     // DB se registered industries laein
//     const registeredDB = await Industry.find(); 
//     const registeredPlaceIds = registeredDB.map(ind => ind.placeId);

//     const industries = googleRes.data.results.map((place) => {
//       const isRegistered = registeredPlaceIds.includes(place.place_id);
//       const dist = calculateDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng);
// const dbRecord = registeredDB.find(ind => ind.placeId === place.place_id);

//       return {
//         // _id: place.place_id,
//         // name: place.name,
//         // address: place.formatted_address,
//         // location: {
//         //     lat: place.geometry.location.lat,
//         //     lng: place.geometry.location.lng
//         // },
//         // isRegistered: isRegistered,
//         // distanceKm: dist.toFixed(2),
//         // rating: place.rating || 0


//         _id: place.place_id,
//   name: place.name,
//   address: place.formatted_address,
//   location: {
//     lat: place.geometry.location.lat,
//     lng: place.geometry.location.lng
//   },
//   isRegistered: !!dbRecord,
//   distanceKm: dist.toFixed(2),
//   rating: place.rating || 0,
//   website: place.website || dbRecord?.website || null,  // Google Places se website bhi aati hai
//   internshipCount: dbRecord?.internshipCount || 0,
//       };
//     });

//     res.json({ industries });
//   } catch (err) {
//     console.error("Backend Error:", err.message);
//     res.status(500).json({ error: "Failed to fetch industries" });
//   }
// });

// export default router;


import express from 'express';
import axios from 'axios';
import Industry from '../models/Industry.js';

const router = express.Router();

// ── Haversine Distance (km) ──────────────────────────────────────
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ── POST /api/industries/nearby-students ────────────────────────
router.post('/nearby-students', async (req, res) => {
  const { lat, lng } = req.body;
//   const GOOGLE_KEY = process.env.GOOGLE_MAPS_KEY || 'YOUR_GOOGLE_API_KEY';
const key = process.env.GOOGLE_MAPS_API_KEY;

  try {
    // 1. Fetch real-time companies from Google Places (city-wise)
    const googleRes = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json` +
      `?query=software+house+IT+company` +
      `&location=${lat},${lng}` +
      `&radius=10000` +
      // `&key=${GOOGLE_KEY}`
      `&key=${key}`
      
    );

    // 2. Registered industries from our DB (with internships populated)
    const registeredDB = await Industry.find({ status: 'Approved' })
      .populate('internships')
      .lean();

    const registeredMap = {};
    registeredDB.forEach(ind => {
      registeredMap[ind.placeId] = ind;
    });

    // 3. Merge Google results with DB data
    const industries = googleRes.data.results.map(place => {
      const dbEntry = registeredMap[place.place_id] || null;
      const isRegistered = !!dbEntry;
      const dist = calculateDistance(
        lat, lng,
        place.geometry.location.lat,
        place.geometry.location.lng
      );

      return {
        _id: place.place_id,
        name: place.name,
        address: place.formatted_address,
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        },
        isRegistered,
        // Website: prefer DB entry, fallback to Google Places website field
        website: dbEntry?.website || place.website || null,
        distanceKm: dist.toFixed(2),
        rating: place.rating || 0,
        // Internships only available for registered companies
        internships: isRegistered ? (dbEntry?.internships || []) : [],
      };
    });

    // Sort by distance
    industries.sort((a, b) => parseFloat(a.distanceKm) - parseFloat(b.distanceKm));

    res.json({ industries });
  } catch (err) {
    console.error('Backend Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch industries' });
  }
});

export default router;