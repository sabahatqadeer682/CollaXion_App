

// import React, { useEffect, useState } from 'react';
// import {
//   StyleSheet, View, Text, FlatList, TouchableOpacity,
//   ActivityIndicator, Dimensions, Linking, Alert
// } from 'react-native';
// import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
// import * as Location from 'expo-location';
// import axios from 'axios';
// import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// const { width, height } = Dimensions.get('window');
// const API_BASE = 'http://192.168.0.245:5000';

// type Industry = {
//   _id: string;
//   name: string;
//   address: string;
//   location: { lat: number; lng: number };
//   isRegistered: boolean;
//   distanceKm: string;
//   rating: number;
//   internshipCount?: number;
//   website?: string;
// };

// type FilterType = 'all' | 'registered' | 'hiring' | 'nearby';

// const NearbyIndustriesScreen = () => {
//   const [userLocation, setUserLocation] = useState<any>(null);
//   const [industries, setIndustries] = useState<Industry[]>([]);
//   const [filtered, setFiltered] = useState<Industry[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeFilter, setActiveFilter] = useState<FilterType>('all');
//   const [selectedId, setSelectedId] = useState<string | null>(null);

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Denied', 'Location access is needed to find nearby industries.');
//         return;
//       }
//       let location = await Location.getCurrentPositionAsync({});
//       const coords = {
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//         latitudeDelta: 0.05,
//         longitudeDelta: 0.05,
//       };
//       setUserLocation(coords);
//       fetchData(coords.latitude, coords.longitude);
//     })();
//   }, []);

//   const fetchData = async (lat: number, lng: number) => {
//     try {
//       setLoading(true);
//       const res = await axios.post(`${API_BASE}/api/industries/nearby-students`, { lat, lng });
//       setIndustries(res.data.industries);
//       setFiltered(res.data.industries);
//     } catch (e) {
//       console.log('Error fetching:', e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const applyFilter = (type: FilterType) => {
//     setActiveFilter(type);
//     switch (type) {
//       case 'registered':
//         setFiltered(industries.filter(i => i.isRegistered));
//         break;
//       case 'hiring':
//         setFiltered(industries.filter(i => i.isRegistered && (i.internshipCount ?? 0) > 0));
//         break;
//       case 'nearby':
//         setFiltered(industries.filter(i => parseFloat(i.distanceKm) < 5));
//         break;
//       default:
//         setFiltered(industries);
//     }
//   };

//   const openWebsite = (url?: string) => {
//     if (!url) {
//       Alert.alert('No website available', 'This company has not listed a website.');
//       return;
//     }
//     const full = url.startsWith('http') ? url : `https://${url}`;
//     Linking.openURL(full).catch(() =>
//       Alert.alert('Error', 'Could not open the website.')
//     );
//   };

//   const filters: { label: string; key: FilterType }[] = [
//     { label: `All (${industries.length})`, key: 'all' },
//     { label: `Registered (${industries.filter(i => i.isRegistered).length})`, key: 'registered' },
//     { label: 'Hiring', key: 'hiring' },
//     { label: '< 5 km', key: 'nearby' },
//   ];

//   const renderCard = ({ item }: { item: Industry }) => (
//     <TouchableOpacity
//       style={[styles.card, selectedId === item._id && styles.cardSelected]}
//       onPress={() => setSelectedId(item._id === selectedId ? null : item._id)}
//       activeOpacity={0.85}
//     >
//       <View style={styles.cardHeader}>
//         <View style={[styles.iconBox, item.isRegistered ? styles.iconRegistered : styles.iconUnregistered]}>
//           <MaterialCommunityIcons
//             name="office-building"
//             size={26}
//             color={item.isRegistered ? '#193648' : '#999'}
//           />
//         </View>
//         <View style={{ flex: 1, marginLeft: 12 }}>
//           <View style={styles.nameRow}>
//             <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
//             {item.isRegistered && (
//               <View style={styles.badge}>
//                 <Ionicons name="checkmark-circle" size={11} color="white" />
//                 <Text style={styles.badgeText}>Partner</Text>
//               </View>
//             )}
//           </View>
//           <Text style={styles.cardAddr} numberOfLines={1}>📍 {item.address}</Text>
//         </View>
//       </View>

//       <View style={styles.cardFooter}>
//         <View style={styles.stats}>
//           <Text style={styles.stat}>🧭 {item.distanceKm} km</Text>
//           <Text style={styles.stat}>⭐ {item.rating || 'N/A'}</Text>
//           {item.isRegistered && item.internshipCount !== undefined && (
//             <Text style={[styles.stat, { color: '#2e7d32' }]}>
//               ● {item.internshipCount} opening{item.internshipCount !== 1 ? 's' : ''}
//             </Text>
//           )}
//         </View>

//         <View style={styles.actions}>
//           <TouchableOpacity style={styles.btnOutline} onPress={() => openWebsite(item.website)}>
//             <Ionicons name="globe-outline" size={12} color="#193648" />
//             <Text style={styles.btnOutlineText}>Website</Text>
//           </TouchableOpacity>
//           {item.isRegistered ? (
//             <TouchableOpacity style={styles.btnPrimary}>
//               <Text style={styles.btnPrimaryText}>Internships</Text>
//             </TouchableOpacity>
//           ) : (
//             <Text style={styles.notReg}>Not registered</Text>
//           )}
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       {/* MAP */}
//       <View style={styles.mapContainer}>
//         {userLocation && (
//           <MapView
//             provider={PROVIDER_GOOGLE}
//             style={StyleSheet.absoluteFillObject}
//             initialRegion={userLocation}
//             showsUserLocation
//             showsMyLocationButton
//             customMapStyle={mapStyle}
//           >
//             {industries.map((ind) => (
//               <Marker
//                 key={ind._id}
//                 coordinate={{ latitude: ind.location.lat, longitude: ind.location.lng }}
//                 pinColor={ind.isRegistered ? 'green' : '#1976D2'}
//                 onPress={() => setSelectedId(ind._id)}
//               >
//                 <Callout>
//                   <View style={styles.callout}>
//                     <Text style={styles.calloutName}>{ind.name}</Text>
//                     <Text style={styles.calloutDist}>{ind.distanceKm} km away</Text>
//                     <Text style={[styles.calloutStatus, ind.isRegistered ? styles.calloutGreen : styles.calloutGray]}>
//                       {ind.isRegistered ? '✓ Registered Partner' : 'Not on platform'}
//                     </Text>
//                   </View>
//                 </Callout>
//               </Marker>
//             ))}
//           </MapView>
//         )}

//         {/* Map Legend */}
//         <View style={styles.legend}>
//           <View style={styles.legendItem}>
//             <View style={[styles.legendDot, { backgroundColor: '#2e7d32' }]} />
//             <Text style={styles.legendText}>Registered</Text>
//           </View>
//           <View style={styles.legendItem}>
//             <View style={[styles.legendDot, { backgroundColor: '#1976D2' }]} />
//             <Text style={styles.legendText}>Google Places</Text>
//           </View>
//         </View>
//       </View>

//       {/* LIST PANEL */}
//       <View style={styles.listArea}>
//         <View style={styles.dragHandle} />

//         <View style={styles.listHeader}>
//           <View>
//             <Text style={styles.listTitle}>Nearby Opportunities</Text>
//             <Text style={styles.listSub}>{filtered.length} companies found</Text>
//           </View>
//         </View>

//         {/* Filter Chips */}
//         <FlatList
//           horizontal
//           data={filters}
//           showsHorizontalScrollIndicator={false}
//           keyExtractor={f => f.key}
//           style={styles.filterRow}
//           renderItem={({ item: f }) => (
//             <TouchableOpacity
//               style={[styles.chip, activeFilter === f.key && styles.chipActive]}
//               onPress={() => applyFilter(f.key)}
//             >
//               <Text style={[styles.chipText, activeFilter === f.key && styles.chipTextActive]}>
//                 {f.label}
//               </Text>
//             </TouchableOpacity>
//           )}
//         />

//         {loading ? (
//           <ActivityIndicator size="large" color="#193648" style={{ marginTop: 40 }} />
//         ) : filtered.length > 0 ? (
//           <FlatList
//             data={filtered}
//             keyExtractor={item => item._id}
//             renderItem={renderCard}
//             contentContainerStyle={{ paddingBottom: 30 }}
//           />
//         ) : (
//           <View style={styles.emptyBox}>
//             <Ionicons name="search-outline" size={48} color="#ccc" />
//             <Text style={styles.emptyText}>No industries found.</Text>
//           </View>
//         )}
//       </View>
//     </View>
//   );
// };

// // Subtle Google Maps style override
// const mapStyle = [
//   { featureType: 'poi', stylers: [{ visibility: 'off' }] },
//   { featureType: 'transit', stylers: [{ visibility: 'off' }] },
//   { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
//   { featureType: 'landscape', stylers: [{ color: '#f0f4f0' }] },
//   { featureType: 'water', stylers: [{ color: '#c9e8f0' }] },
// ];

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f8f9fa' },
//   mapContainer: { height: height * 0.44 },

//   // Callout
//   callout: { padding: 10, minWidth: 160 },
//   calloutName: { fontWeight: '600', fontSize: 13, color: '#1a1a1a', marginBottom: 3 },
//   calloutDist: { fontSize: 11, color: '#666' },
//   calloutStatus: { fontSize: 11, marginTop: 4, fontWeight: '500' },
//   calloutGreen: { color: '#2e7d32' },
//   calloutGray: { color: '#999' },

//   // Legend
//   legend: {
//     position: 'absolute', bottom: 40, right: 12,
//     backgroundColor: 'rgba(255,255,255,0.95)',
//     borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6,
//     flexDirection: 'row', gap: 14,
//     borderWidth: 0.5, borderColor: '#e0e0e0',
//   },
//   legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
//   legendDot: { width: 10, height: 10, borderRadius: 5, borderWidth: 1.5, borderColor: 'white' },
//   legendText: { fontSize: 11, color: '#444' },

//   // List panel
//   listArea: {
//     flex: 1, backgroundColor: '#f8f9fa',
//     borderTopLeftRadius: 28, borderTopRightRadius: 28,
//     marginTop: -28, paddingHorizontal: 16, paddingTop: 14, zIndex: 10,
//   },
//   dragHandle: { width: 36, height: 4, backgroundColor: '#ddd', borderRadius: 2, alignSelf: 'center', marginBottom: 14 },
//   listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
//   listTitle: { fontSize: 20, fontWeight: '600', color: '#1a1a1a' },
//   listSub: { fontSize: 12, color: '#888', marginTop: 2 },

//   // Filter chips
//   filterRow: { marginBottom: 14 },
//   chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, borderWidth: 0.5, borderColor: '#ccc', backgroundColor: 'white', marginRight: 8 },
//   chipActive: { backgroundColor: '#193648', borderColor: '#193648' },
//   chipText: { fontSize: 12, color: '#666', fontWeight: '500' },
//   chipTextActive: { color: 'white' },

//   // Card
//   card: { backgroundColor: 'white', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 0.5, borderColor: '#e8e8e8' },
//   cardSelected: { borderColor: '#193648', borderWidth: 1 },
//   cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
//   iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
//   iconRegistered: { backgroundColor: '#e8f5e9' },
//   iconUnregistered: { backgroundColor: '#f5f5f5' },
//   nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
//   cardName: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', maxWidth: 160 },
//   badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2e7d32', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, gap: 3 },
//   badgeText: { color: 'white', fontSize: 9, fontWeight: '600' },
//   cardAddr: { fontSize: 11, color: '#888' },
//   cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 0.5, borderTopColor: '#eee' },
//   stats: { flexDirection: 'row', gap: 10 },
//   stat: { fontSize: 11, color: '#555' },
//   actions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//   btnPrimary: { backgroundColor: '#193648', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
//   btnPrimaryText: { color: 'white', fontSize: 11, fontWeight: '600' },
//   btnOutline: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 0.5, borderColor: '#193648', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8 },
//   btnOutlineText: { color: '#193648', fontSize: 11, fontWeight: '500' },
//   notReg: { fontSize: 11, color: '#bbb', fontStyle: 'italic' },
//   emptyBox: { alignItems: 'center', marginTop: 50 },
//   emptyText: { color: '#bbb', marginTop: 10, fontSize: 15 },
// });

// export default NearbyIndustriesScreen;



// import React, { useEffect, useState, useRef } from 'react';
// import {
//   StyleSheet, View, Text, FlatList, TouchableOpacity,
//   ActivityIndicator, Dimensions, Linking, Animated,
//   Platform, StatusBar
// } from 'react-native';
// import MapView, { Marker, Circle, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
// import * as Location from 'expo-location';
// import axios from 'axios';
// import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
// const MOCK_INDUSTRIES: Industry[] = [
//   {
//     _id: 'mock1',
//     name: 'TechNova Solutions',
//     address: 'Blue Area, Islamabad',
//     location: { lat: 33.707, lng: 73.055 },
//     isRegistered: true,
//     distanceKm: '2.1',
//     rating: 4.5,
//     website: 'technova.com',
//     internships: [
//       { title: 'Frontend Intern', type: 'Remote' },
//       { title: 'Backend Intern', type: 'Onsite' },
//     ],
//   },
//   {
//     _id: 'mock2',
//     name: 'Softify Labs',
//     address: 'Bahria Town, Rawalpindi',
//     location: { lat: 33.565, lng: 73.136 },
//     isRegistered: true,
//     distanceKm: '5.3',
//     rating: 4.2,
//     website: 'softify.pk',
//     internships: [
//       { title: 'AI Intern', type: 'Hybrid' },
//     ],
//   },
//   {
//     _id: 'mock3',
//     name: 'InnoTech Pvt Ltd',
//     address: 'I-8 Markaz, Islamabad',
//     location: { lat: 33.684, lng: 73.047 },
//     isRegistered: true,
//     distanceKm: '3.8',
//     rating: 4.0,
//   },
// ];



// const { width, height } = Dimensions.get('window');

// const DARK_MAP_STYLE = [
//   { elementType: 'geometry', stylers: [{ color: '#1a2332' }] },
//   { elementType: 'labels.text.fill', stylers: [{ color: '#8ec6e6' }] },
//   { elementType: 'labels.text.stroke', stylers: [{ color: '#1a2332' }] },
//   { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#2a3f5f' }] },
//   { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1e3248' }] },
//   { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#162a20' }] },
//   { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2d4a6e' }] },
//   { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#3a5f8a' }] },
//   { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#4a7ab5' }] },
//   { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#b0cce8' }] },
//   { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#1e3450' }] },
//   { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0d1f3c' }] },
//   { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4e8cbe' }] },
// ];

// const { width: W, height: H } = Dimensions.get('window');

// type Industry = {
//   _id: string;
//   name: string;
//   address: string;
//   location: { lat: number; lng: number };
//   isRegistered: boolean;
//   distanceKm: string;
//   rating: number;
//   website?: string;
//   internships?: { title: string; type: string }[];
// };

// const NearbyIndustriesScreen = () => {
//   const [userLocation, setUserLocation] = useState<any>(null);
//   const [industries, setIndustries] = useState<Industry[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeFilter, setActiveFilter] = useState<'all' | 'partner' | 'hiring'>('all');
//   const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
//   const mapRef = useRef<MapView>(null);
//   const slideAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') return;
//       let loc = await Location.getCurrentPositionAsync({});
//       const coords = {
//         latitude: loc.coords.latitude,
//         longitude: loc.coords.longitude,
//         latitudeDelta: 0.05,
//         longitudeDelta: 0.05,
//       };
//       setUserLocation(coords);
//       fetchData(coords.latitude, coords.longitude);
//     })();
//   }, []);

//   // const fetchData = async (lat: number, lng: number) => {
//   //   try {
//   //     setLoading(true);
//   //     const res = await axios.post('http://192.168.0.245:5000/api/industries/nearby-students', { lat, lng });
//   //     setIndustries(res.data.industries);
//   //   } catch (e) {
//   //     console.log('Error fetching:', e);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

// const fetchData = async (lat: number, lng: number) => {
//   try {
//     setLoading(true);

//     const res = await axios.post(
//       'http://192.168.0.245:5000/api/industries/nearby-students',
//       { lat, lng }
//     );

//     const realData: Industry[] = res.data.industries || [];

//     // 🔥 Remove duplicates (based on name)
//     const uniqueData = [
//       ...realData,
//       ...MOCK_INDUSTRIES.filter(
//         mock => !realData.some(real => real.name === mock.name)
//       ),
//     ];

//     setIndustries(uniqueData);

//   } catch (e) {
//     console.log('Error fetching:', e);

//     // ❗ fallback → sirf mock
//     setIndustries(MOCK_INDUSTRIES);

//   } finally {
//     setLoading(false);
//   }
// };





//   const openWebsite = (url: string) => {
//     const fullUrl = url.startsWith('http') ? url : `https://${url}`;
//     Linking.openURL(fullUrl).catch(() =>
//       console.log('Could not open URL:', fullUrl)
//     );
//   };

//   const focusMarker = (ind: Industry) => {
//     setSelectedIndustry(ind);
//     mapRef.current?.animateToRegion({
//       latitude: ind.location.lat,
//       longitude: ind.location.lng,
//       latitudeDelta: 0.015,
//       longitudeDelta: 0.015,
//     }, 600);
//     Animated.spring(slideAnim, {
//       toValue: 1,
//       useNativeDriver: true,
//       tension: 65,
//       friction: 9,
//     }).start();
//   };

//   const filteredIndustries = industries.filter(i => {
//     if (activeFilter === 'partner') return i.isRegistered;
//     if (activeFilter === 'hiring') return i.isRegistered && (i.internships?.length ?? 0) > 0;
//     return true;
//   });

//   const partnerCount = industries.filter(i => i.isRegistered).length;
//   const hiringCount = industries.filter(i => i.isRegistered && (i.internships?.length ?? 0) > 0).length;

//   const renderStars = (rating: number) => {
//     const full = Math.floor(rating);
//     const empty = 5 - full;
//     return '★'.repeat(full) + '☆'.repeat(empty);
//   };

//   const renderCard = ({ item, index }: { item: Industry; index: number }) => {
//     const isSelected = selectedIndustry?._id === item._id;
//     return (
//       <TouchableOpacity
//         style={[styles.card, item.isRegistered && styles.cardPartner, isSelected && styles.cardSelected]}
//         onPress={() => focusMarker(item)}
//         activeOpacity={0.85}
//       >
//         {/* Left accent bar for partners */}
//         {item.isRegistered && <View style={styles.cardAccent} />}

//         <View style={styles.cardInner}>
//           {/* Header Row */}
//           <View style={styles.cardHeader}>
//             <View style={[styles.iconWrap, item.isRegistered ? styles.iconWrapGreen : styles.iconWrapGray]}>
//               <MaterialCommunityIcons
//                 name="office-building"
//                 size={22}
//                 color={item.isRegistered ? '#0F6E56' : '#888'}
//               />
//             </View>

//             <View style={styles.cardTextBlock}>
//               <View style={styles.nameRow}>
//                 <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
//                 {item.isRegistered && (
//                   <View style={styles.partnerBadge}>
//                     <Ionicons name="checkmark-circle" size={10} color="#fff" />
//                     <Text style={styles.partnerBadgeText}>Partner</Text>
//                   </View>
//                 )}
//               </View>
//               <Text style={styles.cardAddr} numberOfLines={1}>
//                 <Ionicons name="location-outline" size={11} color="#999" /> {item.address}
//               </Text>
//               <View style={styles.metaRow}>
//                 <Text style={styles.stars}>{renderStars(item.rating)}</Text>
//                 <Text style={styles.ratingNum}>{item.rating.toFixed(1)}</Text>
//                 {item.isRegistered && (item.internships?.length ?? 0) > 0 && (
//                   <View style={styles.hiringBadge}>
//                     <FontAwesome5 name="briefcase" size={8} color="#085041" />
//                     <Text style={styles.hiringText}>{item.internships!.length} open</Text>
//                   </View>
//                 )}
//               </View>
//             </View>

//             <View style={styles.distBlock}>
//               <Ionicons name="navigate" size={12} color="#185FA5" />
//               <Text style={styles.distText}>{item.distanceKm}</Text>
//               <Text style={styles.distUnit}>km</Text>
//             </View>
//           </View>

//           {/* Internship chips — only if registered & has internships */}
//           {item.isRegistered && item.internships && item.internships.length > 0 && (
//             <View style={styles.chipsRow}>
//               {item.internships.slice(0, 3).map((int, i) => (
//                 <View key={i} style={styles.chip}>
//                   <Text style={styles.chipText}>{int.title}</Text>
//                 </View>
//               ))}
//             </View>
//           )}

//           {/* Footer Actions */}
//           <View style={styles.cardFooter}>
//             {item.website ? (
//               <TouchableOpacity
//                 style={styles.webBtn}
//                 onPress={() => openWebsite(item.website!)}
//                 activeOpacity={0.7}
//               >
//                 <Ionicons name="globe-outline" size={13} color="#185FA5" />
//                 <Text style={styles.webBtnText}>Visit Website</Text>
//                 <Ionicons name="open-outline" size={11} color="#185FA5" />
//               </TouchableOpacity>
//             ) : (
//               <View style={styles.noWebsite}>
//                 <Text style={styles.noWebsiteText}>No website</Text>
//               </View>
//             )}

//             {item.isRegistered ? (
//               <TouchableOpacity style={styles.internBtn} activeOpacity={0.85}>
//                 <FontAwesome5 name="briefcase" size={11} color="#fff" />
//                 <Text style={styles.internBtnText}>Internships</Text>
//               </TouchableOpacity>
//             ) : (
//               <View style={styles.notRegWrap}>
//                 <Text style={styles.notRegText}>Not on platform</Text>
//               </View>
//             )}
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#0d1f3c" />

//       {/* ───── MAP ───── */}
//       <View style={styles.mapWrap}>
       
  
//         {userLocation ? (
//           <MapView
//             ref={mapRef}
//             provider={PROVIDER_GOOGLE}
//             style={StyleSheet.absoluteFillObject}
//             initialRegion={userLocation}
//             customMapStyle={DARK_MAP_STYLE}
//             showsUserLocation={false}
//             showsCompass={false}
//             showsTraffic={false}
//             showsBuildings={true}
//           >
//             {/* User location pulse circle */}
//             <Circle
//               center={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
//               radius={300}
//               fillColor="rgba(24,95,165,0.15)"
//               strokeColor="rgba(24,95,165,0.4)"
//               strokeWidth={1}
//             />
//             <Circle
//               center={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
//               radius={80}
//               fillColor="rgba(24,95,165,0.35)"
//               strokeColor="#185FA5"
//               strokeWidth={2}
//             />
//             {/* Search radius */}
//             <Circle
//               center={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
//               radius={5000}
//               fillColor="rgba(29,158,117,0.04)"
//               strokeColor="rgba(29,158,117,0.25)"
//               strokeWidth={1}
//               lineDashPattern={[6, 4]}
//             />

// {/* 👇 YAHAN ADD KARNA HAI USER MARKER */}
// {userLocation && (
//   <Marker
//     coordinate={{
//       latitude: userLocation.latitude,
//       longitude: userLocation.longitude,
//     }}
//   >
//     <View style={styles.userMarker}>
//       <View style={styles.userDot} />
//     </View>
//   </Marker>
// )}


//             {/* Industry markers */}
//             {industries.map(ind => (
//               <Marker
//                 key={ind._id}
//                 coordinate={{ latitude: ind.location.lat, longitude: ind.location.lng }}
//                 onPress={() => focusMarker(ind)}
//               >
//                 {/* Custom marker view */}
//                 <View style={[
//                   styles.markerWrap,
//                   ind.isRegistered ? styles.markerGreen : styles.markerBlue,
//                   selectedIndustry?._id === ind._id && styles.markerSelected,
//                 ]}>
//                   <MaterialCommunityIcons
//                     name="office-building"
//                     size={14}
//                     color="#fff"
//                   />
//                 </View>
//                 <View style={[
//                   styles.markerTail,
//                   ind.isRegistered ? styles.tailGreen : styles.tailBlue,
//                 ]} />

//                 <Callout tooltip>
//                   <View style={styles.callout}>
//                     <Text style={styles.calloutName} numberOfLines={1}>{ind.name}</Text>
//                     <Text style={styles.calloutDist}>{ind.distanceKm} km away</Text>
//                     {ind.isRegistered && (
//                       <Text style={styles.calloutPartner}>✓ Partner</Text>
//                     )}
//                   </View>
//                 </Callout>
//               </Marker>
//             ))}
//           </MapView>
          
//         ) : (
//           <View style={styles.mapLoading}>
//             <ActivityIndicator size="large" color="#185FA5" />
//             <Text style={styles.mapLoadingText}>Getting your location...</Text>
//           </View>
//         )}

//         {/* Map header overlay */}
//         <View style={styles.mapHeader}>
//           <View style={styles.cityChip}>
//             <Ionicons name="location" size={12} color="#5DCAA5" />
//             <Text style={styles.cityChipText}>Rawalpindi / Islamabad</Text>
//           </View>
//           <View style={styles.radiusChip}>
//             <MaterialCommunityIcons name="radar" size={12} color="#8ec6e6" />
//             <Text style={styles.radiusChipText}>10 km radius</Text>
//           </View>
//         </View>

//         {/* Map legend */}
//         <View style={styles.legend}>
//           <View style={styles.legItem}>
//             <View style={[styles.legDot, { backgroundColor: '#1D9E75' }]} />
//             <Text style={styles.legText}>Registered</Text>
//           </View>
//           <View style={styles.legDivider} />
//           <View style={styles.legItem}>
//             <View style={[styles.legDot, { backgroundColor: '#185FA5' }]} />
//             <Text style={styles.legText}>Other</Text>
//           </View>
//           <View style={styles.legDivider} />
//           <View style={styles.legItem}>
//             <View style={[styles.legDot, { backgroundColor: '#185FA5', borderWidth: 2, borderColor: '#fff' }]} />
//             <Text style={styles.legText}>You</Text>
//           </View>
//         </View>
//         {/* 👇 CENTER LOCATION BUTTON */}
// {/* <TouchableOpacity
//   style={styles.centerBtn}
//   onPress={() => {
//     mapRef.current?.animateToRegion({
//       latitude: userLocation.latitude,
//       longitude: userLocation.longitude,
//       latitudeDelta: 0.01,
//       longitudeDelta: 0.01,
//     });
//   }}
// >
//   <Ionicons name="locate" size={22} color="#fff" />
// </TouchableOpacity> */}




// <TouchableOpacity
//   style={styles.centerBtn}
//   onPress={() => {
//     if (!userLocation) return;

//     mapRef.current?.animateToRegion({
//       latitude: userLocation.latitude,
//       longitude: userLocation.longitude,
//       latitudeDelta: 0.01,
//       longitudeDelta: 0.01,
//     });
//   }}
// >
//   <Ionicons name="locate" size={22} color="#fff" />
// </TouchableOpacity>
      
      
//       </View>

//       {/* ───── LIST PANEL ───── */}
//       <View style={styles.panel}>
//         {/* Pull handle */}
//         <View style={styles.handle} />

//         {/* Header */}
//         <View style={styles.panelHeader}>
//           <View>
//             <Text style={styles.panelTitle}>Nearby Opportunities</Text>
//             <Text style={styles.panelSub}>
//               {filteredIndustries.length} companies • sorted by distance
//             </Text>
//           </View>
//           <View style={styles.statsRow}>
//             <View style={styles.statPill}>
//               <Text style={styles.statPillNum}>{partnerCount}</Text>
//               <Text style={styles.statPillLabel}>Partners</Text>
//             </View>
//             <View style={[styles.statPill, { backgroundColor: '#E6F1FB' }]}>
//               <Text style={[styles.statPillNum, { color: '#185FA5' }]}>{hiringCount}</Text>
//               <Text style={[styles.statPillLabel, { color: '#185FA5' }]}>Hiring</Text>
//             </View>
//           </View>
//         </View>

//         {/* Filter tabs */}
//         <View style={styles.filterRow}>
//           {(['all', 'partner', 'hiring'] as const).map(f => (
//             <TouchableOpacity
//               key={f}
//               style={[styles.filterTab, activeFilter === f && styles.filterTabActive]}
//               onPress={() => setActiveFilter(f)}
//             >
//               <Text style={[styles.filterTabText, activeFilter === f && styles.filterTabTextActive]}>
//                 {f === 'all' ? `All (${industries.length})` :
//                  f === 'partner' ? `Partners (${partnerCount})` :
//                  `Hiring (${hiringCount})`}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* List */}
//         {loading ? (
//           <View style={styles.loadingWrap}>
//             <ActivityIndicator size="large" color="#193648" />
//             <Text style={styles.loadingText}>Finding nearby companies...</Text>
//           </View>
//         ) : filteredIndustries.length > 0 ? (
//           <FlatList
//             data={filteredIndustries}
//             keyExtractor={item => item._id}
//             renderItem={renderCard}
//             contentContainerStyle={styles.listContent}
//             showsVerticalScrollIndicator={false}
//           />
//         ) : (
//           <View style={styles.emptyWrap}>
//             <Ionicons name="search-outline" size={44} color="#ccc" />
//             <Text style={styles.emptyTitle}>No companies found</Text>
//             <Text style={styles.emptySub}>Try changing the filter or expand the search radius</Text>
//           </View>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#0d1f3c' },

//   // ── MAP ──
//   mapWrap: { height: H * 0.46, position: 'relative' },
//   mapLoading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a2d4a' },
//   mapLoadingText: { color: '#8ec6e6', marginTop: 10, fontSize: 13 },

//   mapHeader: {
//     position: 'absolute', top: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 10 : 50,
//     left: 14, right: 14,
//     flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
//   },
//   cityChip: {
//     flexDirection: 'row', alignItems: 'center', gap: 5,
//     backgroundColor: 'rgba(13,31,60,0.82)', paddingHorizontal: 12, paddingVertical: 7,
//     borderRadius: 20, borderWidth: 0.5, borderColor: 'rgba(94,202,165,0.3)',
//   },
//   cityChipText: { color: '#e2f0fb', fontSize: 12, fontWeight: '500' },
//   radiusChip: {
//     flexDirection: 'row', alignItems: 'center', gap: 5,
//     backgroundColor: 'rgba(13,31,60,0.82)', paddingHorizontal: 10, paddingVertical: 7,
//     borderRadius: 20, borderWidth: 0.5, borderColor: 'rgba(142,198,230,0.3)',
//   },
//   radiusChipText: { color: '#8ec6e6', fontSize: 11 },

//   legend: {
//     position: 'absolute', bottom: 16, left: 14,
//     flexDirection: 'row', alignItems: 'center', gap: 8,
//     backgroundColor: 'rgba(13,31,60,0.85)', paddingHorizontal: 12, paddingVertical: 7,
//     borderRadius: 20, borderWidth: 0.5, borderColor: 'rgba(142,198,230,0.2)',
//   },
//   legItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
//   legDot: { width: 8, height: 8, borderRadius: 4 },
//   legText: { color: '#b0cce8', fontSize: 10 },
//   legDivider: { width: 0.5, height: 12, backgroundColor: 'rgba(255,255,255,0.2)' },

//   // ── MARKERS ──
//   markerWrap: {
//     width: 30, height: 30, borderRadius: 15,
//     alignItems: 'center', justifyContent: 'center',
//     borderWidth: 2, borderColor: '#fff',
//   },
//   markerGreen: { backgroundColor: '#0F6E56' },
//   markerBlue: { backgroundColor: '#185FA5' },
//   markerSelected: { width: 36, height: 36, borderRadius: 18, borderWidth: 3 },
//   markerTail: { width: 4, height: 8, alignSelf: 'center', borderRadius: 2, marginTop: -2 },
//   tailGreen: { backgroundColor: '#0F6E56' },
//   tailBlue: { backgroundColor: '#185FA5' },

//   callout: {
//     backgroundColor: '#0d1f3c', borderRadius: 10, padding: 10, minWidth: 130,
//     borderWidth: 0.5, borderColor: 'rgba(142,198,230,0.3)',
//   },
//   calloutName: { color: '#e2f0fb', fontSize: 12, fontWeight: '600', maxWidth: 140 },
//   calloutDist: { color: '#8ec6e6', fontSize: 10, marginTop: 2 },
//   calloutPartner: { color: '#5DCAA5', fontSize: 10, marginTop: 3, fontWeight: '500' },

//   // ── PANEL ──
//   panel: {
//     flex: 1,
//     backgroundColor: '#f5f7fa',
//     borderTopLeftRadius: 26, borderTopRightRadius: 26,
//     marginTop: -26,
//     overflow: 'hidden',
//   },
//   handle: {
//     width: 36, height: 4, borderRadius: 2,
//     backgroundColor: '#d0d5dd', alignSelf: 'center', marginTop: 10, marginBottom: 4,
//   },

//   panelHeader: {
//     flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
//     paddingHorizontal: 18, paddingTop: 12, paddingBottom: 8,
//   },
//   panelTitle: { fontSize: 20, fontWeight: '700', color: '#101828', letterSpacing: -0.3 },
//   panelSub: { fontSize: 12, color: '#667085', marginTop: 2 },

//   statsRow: { flexDirection: 'row', gap: 6 },
//   statPill: {
//     backgroundColor: '#E1F5EE', borderRadius: 10,
//     paddingHorizontal: 10, paddingVertical: 5, alignItems: 'center',
//   },
//   statPillNum: { fontSize: 15, fontWeight: '700', color: '#0F6E56' },
//   statPillLabel: { fontSize: 9, color: '#0F6E56', fontWeight: '500' },

//   filterRow: {
//     flexDirection: 'row', paddingHorizontal: 18, gap: 8, marginBottom: 10,
//   },
//   filterTab: {
//     paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
//     borderWidth: 0.5, borderColor: '#d0d5dd', backgroundColor: '#fff',
//   },
//   filterTabActive: { backgroundColor: '#193648', borderColor: '#193648' },
//   filterTabText: { fontSize: 12, color: '#667085', fontWeight: '500' },
//   filterTabTextActive: { color: '#fff' },

//   listContent: { paddingHorizontal: 16, paddingBottom: 24 },

//   // ── CARD ──
//   card: {
//     backgroundColor: '#fff', borderRadius: 16,
//     marginBottom: 12, overflow: 'hidden',
//     borderWidth: 0.5, borderColor: '#e4e7ec',
//     shadowColor: '#101828', shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.07, shadowRadius: 6, elevation: 3,
//   },
//   cardPartner: { borderColor: '#b7e5d4' },
//   cardSelected: { borderColor: '#185FA5', borderWidth: 1.5 },
//   cardAccent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: '#1D9E75' },
//   cardInner: { padding: 14, paddingLeft: 18 },

//   cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
//   iconWrap: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
//   iconWrapGreen: { backgroundColor: '#E1F5EE' },
//   iconWrapGray: { backgroundColor: '#f2f4f7' },

//   cardTextBlock: { flex: 1 },
//   nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
//   cardName: { fontSize: 14, fontWeight: '700', color: '#101828', maxWidth: '65%' },
//   partnerBadge: {
//     flexDirection: 'row', alignItems: 'center', gap: 3,
//     backgroundColor: '#1D9E75', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6,
//   },
//   partnerBadgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
//   cardAddr: { fontSize: 11, color: '#667085', marginTop: 3 },
//   metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
//   stars: { fontSize: 11, color: '#EA9F27' },
//   ratingNum: { fontSize: 11, color: '#667085', fontWeight: '500' },
//   hiringBadge: {
//     flexDirection: 'row', alignItems: 'center', gap: 3,
//     backgroundColor: '#E1F5EE', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
//   },
//   hiringText: { fontSize: 9, color: '#085041', fontWeight: '600' },

//   distBlock: { alignItems: 'center', paddingTop: 2 },
//   distText: { fontSize: 15, fontWeight: '700', color: '#185FA5', lineHeight: 18 },
//   distUnit: { fontSize: 9, color: '#185FA5', fontWeight: '500' },

//   chipsRow: { flexDirection: 'row', gap: 6, marginTop: 10, flexWrap: 'wrap' },
//   chip: {
//     backgroundColor: '#EBF5FF', paddingHorizontal: 9, paddingVertical: 3, borderRadius: 6,
//     borderWidth: 0.5, borderColor: '#b3d4f4',
//   },
//   chipText: { fontSize: 10, color: '#185FA5', fontWeight: '500' },

//   cardFooter: {
//     flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
//     marginTop: 12, paddingTop: 10,
//     borderTopWidth: 0.5, borderTopColor: '#f2f4f7',
//   },
//   webBtn: {
//     flexDirection: 'row', alignItems: 'center', gap: 5,
//     borderWidth: 1, borderColor: '#b3d4f4',
//     paddingHorizontal: 12, paddingVertical: 7, borderRadius: 9,
//     backgroundColor: '#EBF5FF',
//   },
//   webBtnText: { color: '#185FA5', fontSize: 12, fontWeight: '600' },
//   noWebsite: { paddingVertical: 7 },
//   noWebsiteText: { fontSize: 11, color: '#b0b7c3', fontStyle: 'italic' },
//   internBtn: {
//     flexDirection: 'row', alignItems: 'center', gap: 6,
//     backgroundColor: '#193648', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 9,
//   },
//   internBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
//   notRegWrap: { paddingVertical: 8 },
//   notRegText: { fontSize: 11, color: '#b0b7c3', fontStyle: 'italic' },

//   loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 40 },
//   loadingText: { color: '#667085', marginTop: 12, fontSize: 14 },
//   emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 },
//   emptyTitle: { fontSize: 16, fontWeight: '600', color: '#344054', marginTop: 14 },
//   emptySub: { fontSize: 13, color: '#667085', marginTop: 6, textAlign: 'center', paddingHorizontal: 40 },
// //   searchBar: {
// //   position: 'absolute',
// //   top: 100,
// //   left: 14,
// //   right: 14,
// //   flexDirection: 'row',
// //   alignItems: 'center',
// //   gap: 8,
// //   backgroundColor: 'rgba(13,31,60,0.9)',
// //   padding: 10,
// //   borderRadius: 12,
// //   borderWidth: 0.5,
// //   borderColor: 'rgba(142,198,230,0.3)',
// //   zIndex: 10,
// // },
// // searchText: {
// //   color: '#8ec6e6',
// //   fontSize: 12,
// // },

// centerBtn: {
//   position: 'absolute',
//   right: 16,
//   bottom: 90, // 👈 legend se upar rakha
//   backgroundColor: '#185FA5',
//   padding: 12,
//   borderRadius: 30,
//   elevation: 5,
//   shadowColor: '#000',
//   shadowOpacity: 0.2,
// },
// });

// export default NearbyIndustriesScreen;












import { CONSTANT } from "@/constants/constant";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, Animated, Dimensions, Easing,
  FlatList, Linking, Platform, StatusBar, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';

const { width: W, height: H } = Dimensions.get('window');

type Industry = {
  _id: string;
  name: string;
  address: string;
  location: { lat: number; lng: number };
  isRegistered: boolean;
  distanceKm: string;
  rating: number;
  website?: string;
  internships?: { title: string; type: string }[];
};

// --- 10 Mock Industries ---
const MOCK_INDUSTRIES: Industry[] = [
  {
    _id: 'mock1',
    name: 'TechNova Solutions',
    address: 'Blue Area, Islamabad',
    location: { lat: 33.707, lng: 73.055 },
    isRegistered: true,
    distanceKm: '2.1',
    rating: 4.5,
    website: 'technova.com',
  },
  {
    _id: 'mock2',
    name: 'Softify Labs',
    address: 'Bahria Town, Rawalpindi',
    location: { lat: 33.565, lng: 73.136 },
    isRegistered: true,
    distanceKm: '5.3',
    rating: 4.2,
    website: 'softify.pk',
  },
  {
    _id: 'mock3',
    name: 'InnoTech Pvt Ltd',
    address: 'I-8 Markaz, Islamabad',
    location: { lat: 33.684, lng: 73.047 },
    isRegistered: true,
    distanceKm: '3.8',
    rating: 4.0,
  },
  {
    _id: 'mock4',
    name: 'CyberShield Security',
    address: 'F-10 Markaz, Islamabad',
    location: { lat: 33.691, lng: 73.011 },
    isRegistered: true,
    distanceKm: '4.2',
    rating: 4.8,
    website: 'cybershield.com',
  },
  {
    _id: 'mock5',
    name: 'DataSync Analytics',
    address: 'Saddar, Rawalpindi',
    location: { lat: 33.595, lng: 73.054 },
    isRegistered: true,
    distanceKm: '6.1',
    rating: 4.3,
  },
  {
    _id: 'mock6',
    name: 'PixelPerfect Design',
    address: 'E-11, Islamabad',
    location: { lat: 33.698, lng: 72.983 },
    isRegistered: true,
    distanceKm: '7.5',
    rating: 4.6,
    website: 'pixelperfect.io',
  },
  {
    _id: 'mock7',
    name: 'CloudScale Systems',
    address: 'G-11 Markaz, Islamabad',
    location: { lat: 33.668, lng: 72.998 },
    isRegistered: true,
    distanceKm: '3.9',
    rating: 4.1,
  },
  {
    _id: 'mock8',
    name: 'AppVantage Mobile',
    address: 'Satellite Town, Pindi',
    location: { lat: 33.642, lng: 73.076 },
    isRegistered: false,
    distanceKm: '1.8',
    rating: 3.9,
  },
  {
    _id: 'mock9',
    name: 'GameGenic Studios',
    address: 'DHA Phase 2, Islamabad',
    location: { lat: 33.524, lng: 73.149 },
    isRegistered: true,
    distanceKm: '12.4',
    rating: 4.7,
    website: 'gamegenic.pk',
  },
  {
    _id: 'mock10',
    name: 'MetaLogic AI',
    address: 'Gulberg Greens, Islamabad',
    location: { lat: 33.601, lng: 73.141 },
    isRegistered: true,
    distanceKm: '9.2',
    rating: 4.4,
  },
];

const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#1a2332' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec6e6' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a2332' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2d4a6e' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0d1f3c' }] },
];

const NearbyIndustriesScreen = () => {
  const navigation = useNavigation<any>();
  const [userLocation, setUserLocation] = useState<any>(null);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'partner' | 'hiring'>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const mapRef = useRef<MapView>(null);
  // Per-screen fade + slide animation; replays on every focus so returning
  // from the dashboard feels alive.
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  // Locate the user once on mount; subsequent focuses just refresh the
  // industries list using the cached userLocation.
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let loc = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setUserLocation(coords);
      fetchData(coords.latitude, coords.longitude);
    })();
  }, []);

  // Auto-refresh whenever the screen is focused (back from dashboard etc.).
  useFocusEffect(
    useCallback(() => {
      // Replay the fade-in + slide-up animation each time we land here.
      fadeAnim.setValue(0);
      slideAnim.setValue(24);
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();

      if (userLocation) {
        setRefreshing(true);
        fetchData(userLocation.latitude, userLocation.longitude).finally(() => setRefreshing(false));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userLocation?.latitude, userLocation?.longitude])
  );

  // "Website" button — opens a Google search for the company so the user
  // gets Google's knowledge panel + the official site link, even when the
  // record doesn't carry a `website` field.
  const openWebsite = async (item: Industry) => {
    const query = `${item.name} ${item.address || ""}`.trim();
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    try {
      await WebBrowser.openBrowserAsync(url, {
        toolbarColor: "#193648",
        controlsColor: "#fff",
        showTitle: true,
      });
    } catch {
      try { await Linking.openURL(url); }
      catch { Alert.alert("Couldn't open", "We couldn't open the search right now."); }
    }
  };

  const fetchData = async (lat: number, lng: number) => {
    try {
      setLoading(true);
      // const res = await axios.post('${CONSTANT.API_BASE_URL}/api/industries/nearby-students', { lat, lng });


      const res = await axios.post(
  `${CONSTANT.API_BASE_URL}/api/industries/nearby-students`,
  { lat, lng }
);
      const realData: Industry[] = res.data.industries || [];
      const uniqueData = [
        ...realData,
        ...MOCK_INDUSTRIES.filter(mock => !realData.some(real => real.name === mock.name)),
      ];
      setIndustries(uniqueData);
    } catch (e) {
      setIndustries(MOCK_INDUSTRIES);
    } finally {
      setLoading(false);
    }
  };

  const focusMarker = (ind: Industry) => {
    setSelectedIndustry(ind);
    mapRef.current?.animateToRegion({
      latitude: ind.location.lat,
      longitude: ind.location.lng,
      latitudeDelta: 0.015,
      longitudeDelta: 0.015,
    }, 600);
  };

  const filteredIndustries = industries.filter(i => {
    if (activeFilter === 'partner') return i.isRegistered;
    return true;
  });

  const renderCard = ({ item }: { item: Industry }) => {
    const isSelected = selectedIndustry?._id === item._id;
    return (
      <TouchableOpacity
        style={[styles.card, item.isRegistered && styles.cardPartner, isSelected && styles.cardSelected]}
        onPress={() => focusMarker(item)}
        activeOpacity={0.85}
      >
        {item.isRegistered && <View style={styles.cardAccent} />}
        <View style={styles.cardInner}>
          {/* ── Top row: logo block + identity + distance pill ── */}
          <View style={styles.cardHeader}>
            <View style={[styles.iconWrap, item.isRegistered ? styles.iconWrapGreen : styles.iconWrapGray]}>
              <MaterialCommunityIcons
                name="office-building"
                size={26}
                color={item.isRegistered ? '#0F6E56' : '#94A3B8'}
              />
            </View>

            <View style={styles.cardTextBlock}>
              <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
              <View style={styles.addrRow}>
                <Ionicons name="location-sharp" size={12} color="#94A3B8" />
                <Text style={styles.cardAddr} numberOfLines={1}>{item.address}</Text>
              </View>
            </View>

            <View style={styles.distBlock}>
              <Text style={styles.distText}>{item.distanceKm}</Text>
              <Text style={styles.distUnit}>KM</Text>
            </View>
          </View>

          {/* ── Tags / status row ── */}
          <View style={styles.tagRow}>
            <View style={styles.ratingPill}>
              <Ionicons name="star" size={11} color="#F59E0B" />
              <Text style={styles.ratingPillTxt}>{item.rating.toFixed(1)}</Text>
              <Text style={styles.ratingPillSub}>
                {'★'.repeat(Math.floor(item.rating))}{'☆'.repeat(5 - Math.floor(item.rating))}
              </Text>
            </View>
            {item.isRegistered ? (
              <View style={styles.partnerPill}>
                <Ionicons name="checkmark-circle" size={11} color="#10B981" />
                <Text style={styles.partnerPillTxt}>VERIFIED PARTNER</Text>
              </View>
            ) : (
              <View style={styles.notRegPill}>
                <Ionicons name="ellipse-outline" size={10} color="#94A3B8" />
                <Text style={styles.notRegPillTxt}>Not on CollaXion</Text>
              </View>
            )}
          </View>

          <View style={styles.cardDivider} />

          {/* ── Action row ── */}
          <View style={styles.cardFooter}>
            <TouchableOpacity
              style={styles.webBtn}
              onPress={() => openWebsite(item)}
              activeOpacity={0.85}
            >
              <Ionicons name="globe-outline" size={14} color="#193648" />
              <Text style={styles.webBtnText}>Website</Text>
            </TouchableOpacity>

            {item.isRegistered ? (
              <TouchableOpacity
                style={styles.internBtn}
                onPress={() => navigation.navigate("Internships")}
                activeOpacity={0.85}
              >
                <FontAwesome5 name="briefcase" size={11} color="#fff" />
                <Text style={styles.internBtnText}>View Internships</Text>
                <Ionicons name="arrow-forward" size={12} color="#fff" style={{ marginLeft: 2 }} />
              </TouchableOpacity>
            ) : (
              <View style={styles.disabledIntern}>
                <Ionicons name="lock-closed" size={11} color="#94A3B8" />
                <Text style={styles.disabledInternTxt}>No openings</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* MAP */}
      <View style={styles.mapWrap}>
        {userLocation && (
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFillObject}
            initialRegion={userLocation}
            customMapStyle={DARK_MAP_STYLE}
          >
            {/* User location marker — bright red so the student can spot
                their own position on the dark map at a glance. */}
            <Marker
              coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
              anchor={{ x: 0.5, y: 0.5 }}
              zIndex={999}
            >
              <View style={styles.userMarkerOuter}>
                <View style={styles.userMarkerInner}>
                  <Ionicons name="person" size={12} color="#fff" />
                </View>
              </View>
            </Marker>

            {industries.map(ind => (
              <Marker
                key={ind._id}
                coordinate={{ latitude: ind.location.lat, longitude: ind.location.lng }}
                onPress={() => focusMarker(ind)}
              >
                <View style={[styles.markerWrap, ind.isRegistered ? styles.markerGreen : styles.markerBlue, selectedIndustry?._id === ind._id && styles.markerSelected]}>
                  <MaterialCommunityIcons name="office-building" size={14} color="#fff" />
                </View>
              </Marker>
            ))}
          </MapView>
        )}
        <TouchableOpacity style={styles.centerBtn} onPress={() => mapRef.current?.animateToRegion(userLocation)}>
          <Ionicons name="locate" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* LIST PANEL — fade + slide up on every focus */}
      <Animated.View
        style={[
          styles.panel,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.handle} />
        <View style={styles.panelHeader}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={styles.panelTitle}>Nearby Industries</Text>
            {refreshing ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <ActivityIndicator size="small" color="#193648" />
                <Text style={{ fontSize: 11, color: "#64748B", fontWeight: "700" }}>Refreshing…</Text>
              </View>
            ) : (
              <Text style={{ fontSize: 11.5, color: "#64748B", fontWeight: "700" }}>
                {filteredIndustries.length} found
              </Text>
            )}
          </View>
          <View style={styles.filterRow}>
            {(['all', 'partner'] as const).map(f => (
              <TouchableOpacity
                key={f}
                style={[styles.filterTab, activeFilter === f && styles.filterTabActive]}
                onPress={() => setActiveFilter(f)}
                activeOpacity={0.85}
              >
                <Text style={[styles.filterTabText, activeFilter === f && styles.filterTabTextActive]}>
                  {f.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {loading ? <ActivityIndicator size="large" style={{marginTop: 50}} color="#193648" /> : (
          <FlatList
            data={filteredIndustries}
            keyExtractor={item => item._id}
            renderItem={renderCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F1E33" },

  // ── MAP ──
  mapWrap: { height: H * 0.46, position: "relative" },
  centerBtn: {
    position: "absolute", right: 16, bottom: 30,
    backgroundColor: "#193648",
    width: 48, height: 48, borderRadius: 24,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.35, shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 }, elevation: 8,
    borderWidth: 1.5, borderColor: "rgba(255,255,255,0.2)",
  },

  // ── Markers ──
  markerWrap: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: "center", justifyContent: "center",
    borderWidth: 2.5, borderColor: "#fff",
    shadowColor: "#000", shadowOpacity: 0.35, shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 }, elevation: 6,
  },
  markerGreen: { backgroundColor: "#10B981" },
  markerBlue:  { backgroundColor: "#3B82F6" },
  markerSelected: {
    width: 44, height: 44, borderRadius: 22, borderWidth: 3.5,
    backgroundColor: "#193648",
  },
  userMarkerOuter: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(239,68,68,0.25)",
    alignItems: "center", justifyContent: "center",
  },
  userMarkerInner: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: "#EF4444",
    alignItems: "center", justifyContent: "center",
    borderWidth: 2.5, borderColor: "#fff",
    shadowColor: "#EF4444", shadowOpacity: 0.45, shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }, elevation: 8,
  },

  // ── Bottom-sheet panel ──
  panel: {
    flex: 1,
    backgroundColor: "#F4F8FB",
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    marginTop: -28,
    shadowColor: "#000", shadowOpacity: 0.18, shadowRadius: 18,
    shadowOffset: { width: 0, height: -8 }, elevation: 14,
  },
  handle: {
    width: 44, height: 5, backgroundColor: "#CBD5E1",
    alignSelf: "center", marginTop: 10, marginBottom: 6, borderRadius: 10,
  },
  panelHeader: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 4 },
  panelTitle: { fontSize: 22, fontWeight: "800", color: "#193648", letterSpacing: 0.3 },

  filterRow: { flexDirection: "row", gap: 10, marginTop: 12 },
  filterTab: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10,
    backgroundColor: "#fff", borderWidth: 1, borderColor: "#E2EAF0",
  },
  filterTabActive: {
    backgroundColor: "#193648",
    borderColor: "#193648",
    shadowColor: "#193648", shadowOpacity: 0.25, shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  filterTabText: { fontSize: 11, color: "#64748B", fontWeight: "700", letterSpacing: 0.6 },
  filterTabTextActive: { color: "#fff" },

  listContent: { padding: 16, paddingBottom: 32 },

  // ── Industry card ──
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#0F1E33", shadowOpacity: 0.10, shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 }, elevation: 4,
    borderWidth: 1, borderColor: "#EEF2F7",
  },
  cardPartner: { borderColor: "#BBF7D0" },
  cardSelected: {
    borderColor: "#193648", borderWidth: 1.5,
    shadowOpacity: 0.22, shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 }, elevation: 10,
  },
  cardAccent: {
    position: "absolute", left: 0, top: 0, bottom: 0, width: 5,
    backgroundColor: "#10B981",
    borderTopLeftRadius: 20, borderBottomLeftRadius: 20,
  },
  cardInner: { paddingHorizontal: 18, paddingVertical: 16 },
  cardHeader: { flexDirection: "row", gap: 14, alignItems: "center" },

  iconWrap: {
    width: 54, height: 54, borderRadius: 16,
    alignItems: "center", justifyContent: "center",
  },
  iconWrapGreen: { backgroundColor: "#ECFDF5", borderWidth: 1.2, borderColor: "#A7F3D0" },
  iconWrapGray:  { backgroundColor: "#F1F5F9", borderWidth: 1.2, borderColor: "#E2E8F0" },

  cardTextBlock: { flex: 1, paddingTop: 0 },
  cardName: { fontSize: 16, fontWeight: "800", color: "#0F1E33", letterSpacing: 0.2 },
  addrRow:  { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  cardAddr: { flex: 1, fontSize: 12, color: "#64748B", fontWeight: "500" },

  // ── Tag row (rating + partner status) ──
  tagRow: {
    flexDirection: "row", alignItems: "center", flexWrap: "wrap",
    gap: 8, marginTop: 14,
  },
  ratingPill: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "#FFFBEB",
    borderWidth: 1, borderColor: "#FDE68A",
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 8,
  },
  ratingPillTxt: { color: "#92400E", fontWeight: "800", fontSize: 12 },
  ratingPillSub: { color: "#F59E0B", fontSize: 10.5, letterSpacing: 0.8 },
  partnerPill: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "#ECFDF5",
    borderWidth: 1, borderColor: "#A7F3D0",
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 8,
  },
  partnerPillTxt: { color: "#0F6E56", fontWeight: "800", fontSize: 10, letterSpacing: 0.6 },
  notRegPill: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "#F8FAFC",
    borderWidth: 1, borderColor: "#E2E8F0",
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 8,
  },
  notRegPillTxt: { color: "#64748B", fontWeight: "700", fontSize: 10.5, letterSpacing: 0.4 },

  cardDivider: {
    height: 1, backgroundColor: "#F1F5F9",
    marginTop: 14, marginBottom: 12,
  },

  distBlock: {
    alignItems: "center", justifyContent: "center",
    backgroundColor: "#EEF4FA",
    paddingHorizontal: 12, paddingVertical: 9,
    borderRadius: 12, minWidth: 60,
    borderWidth: 1, borderColor: "#DBE7F3",
  },
  distText: { color: "#193648", fontWeight: "800", fontSize: 16.5, lineHeight: 18 },
  distUnit: { color: "#5B7080", fontSize: 9.5, fontWeight: "800", letterSpacing: 1, marginTop: 2 },

  // ── Footer ──
  cardFooter: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    gap: 10,
  },
  disabledIntern: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "#F1F5F9", borderWidth: 1, borderColor: "#E2E8F0",
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
  },
  disabledInternTxt: { color: "#94A3B8", fontWeight: "700", fontSize: 11.5 },
  webBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    borderWidth: 1.2, borderColor: "#DBE7F3",
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10,
    backgroundColor: "#F8FAFC",
  },
  webBtnText: { color: "#193648", fontSize: 12, fontWeight: "700" },
  internBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#193648",
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
    shadowColor: "#193648", shadowOpacity: 0.25, shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  internBtnText: { color: "#fff", fontSize: 12, fontWeight: "800", letterSpacing: 0.3 },

  notRegWrap: {
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
    backgroundColor: "#F1F5F9", borderWidth: 1, borderColor: "#E2E8F0",
  },
  notRegText: { color: "#94A3B8", fontStyle: "italic", fontSize: 11, fontWeight: "600" },
});

export default NearbyIndustriesScreen;