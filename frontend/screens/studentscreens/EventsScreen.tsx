


// import { CONSTANT } from "@/constants/constant";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useFocusEffect } from "@react-navigation/native";
// import axios from "axios";
// import React, { useCallback, useState } from "react";
// import {
//     ActivityIndicator,
//     Alert,
//     FlatList,
//     Image,
//     Modal,
//     Platform,
//     SafeAreaView,
//     ScrollView,
//     StatusBar,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
//     useWindowDimensions,
// } from "react-native";

// interface Event {
//     _id: string;
//     title: string;
//     type: "Job Fair" | "Seminar" | "Workshop" | "Webinar" | "Networking";
//     date: string;
//     time: string;
//     location: string;
//     organizer: string;
//     description: string;
//     totalSeats: number;
//     registeredStudents: string[];
//     image: string;
//     bannerColor: string;
//     bannerTextColor: string;
// }

// const MOCK_EVENTS: Event[] = [
//     {
//         _id: "mock_1",
//         title: "Riphah Career Expo 2025",
//         type: "Job Fair",
//         date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
//         time: "9:00 AM – 4:00 PM",
//         location: "Riphah International University, Islamabad Campus — Main Hall",
//         organizer: "Riphah Career Development Center",
//         description: "Pakistan's leading IT companies, banks, and multinationals will be present to hire fresh graduates and final-year students.",
//         totalSeats: 500,
//         registeredStudents: Array(312).fill("other@example.com"),
//         image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=500&auto=format&fit=crop",
//         bannerColor: "#1A56DB",
//         bannerTextColor: "#EBF5FF",
//     },
//     {
//         _id: "mock_2",
//         title: "AI & Machine Learning in Healthcare",
//         type: "Seminar",
//         date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
//         time: "2:00 PM – 5:00 PM",
//         location: "Riphah International University, Lahore Campus — Auditorium",
//         organizer: "Dept. of Computer Science, Riphah",
//         description: "An insightful seminar on how Artificial Intelligence is transforming the healthcare industry.",
//         totalSeats: 200,
//         registeredStudents: Array(87).fill("other@example.com"),
//         image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=500&auto=format&fit=crop",
//         bannerColor: "#7C3AED",
//         bannerTextColor: "#F5F3FF",
//     },
//     {
//         _id: "mock_3",
//         title: "Full-Stack Web Dev Bootcamp",
//         type: "Workshop",
//         date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
//         time: "10:00 AM – 6:00 PM",
//         location: "Riphah International University, Rawalpindi Campus — CS Lab 3",
//         organizer: "Riphah Tech Society",
//         description: "A hands-on one-day bootcamp covering React, Node.js, and MongoDB from scratch.",
//         totalSeats: 60,
//         registeredStudents: Array(54).fill("other@example.com"),
//         image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=500&auto=format&fit=crop",
//         bannerColor: "#D97706",
//         bannerTextColor: "#FFFBEB",
//     },
//     {
//         _id: "mock_4",
//         title: "Digital Marketing Masterclass",
//         type: "Webinar",
//         date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
//         time: "6:00 PM – 8:00 PM",
//         location: "Online via Zoom — Link sent upon registration",
//         organizer: "Riphah Business School",
//         description: "Learn SEO, social media strategy, content marketing, and paid ads from professionals.",
//         totalSeats: 300,
//         registeredStudents: Array(145).fill("other@example.com"),
//         image: "https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=500&auto=format&fit=crop",
//         bannerColor: "#059669",
//         bannerTextColor: "#ECFDF5",
//     },
//     {
//         _id: "mock_5",
//         title: "Startup Founders Networking Night",
//         type: "Networking",
//         date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
//         time: "7:00 PM – 10:00 PM",
//         location: "Riphah International University, F-7 Campus — Rooftop Lounge",
//         organizer: "Riphah Innovation & Entrepreneurship Cell",
//         description: "Connect with startup founders, angel investors, and fellow student entrepreneurs.",
//         totalSeats: 80,
//         registeredStudents: Array(29).fill("other@example.com"),
//         image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=500&auto=format&fit=crop",
//         bannerColor: "#DC2626",
//         bannerTextColor: "#FEF2F2",
//     },
//     {
//         _id: "mock_6",
//         title: "Cybersecurity Essentials Workshop",
//         type: "Workshop",
//         date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
//         time: "9:00 AM – 1:00 PM",
//         location: "Riphah International University, Islamabad Campus — IT Block",
//         organizer: "Dept. of Cybersecurity, Riphah",
//         description: "Covers ethical hacking basics, network security, and OWASP Top 10 vulnerabilities.",
//         totalSeats: 50,
//         registeredStudents: Array(21).fill("other@example.com"),
//         image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=500&auto=format&fit=crop",
//         bannerColor: "#0891B2",
//         bannerTextColor: "#ECFEFF",
//     },
//     {
//     _id: "mock_7",
//     title: "Cloud Computing Basics Bootcamp",
//     type: "Workshop",
//     date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
//     time: "11:00 AM – 3:00 PM",
//     location: "Riphah Islamabad Campus — Lab 2",
//     organizer: "Cloud Tech Society",
//     description: "Learn AWS, Azure basics and deployment fundamentals in this beginner-friendly workshop.",
//     totalSeats: 70,
//     registeredStudents: Array(40).fill("other@example.com"),
//     image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=500&auto=format&fit=crop",
//     bannerColor: "#0EA5E9",
//     bannerTextColor: "#ECFEFF",
// },
// {
//     _id: "mock_8",
//     title: "Freelancing & Fiverr Growth Seminar",
//     type: "Seminar",
//     date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
//     time: "3:00 PM – 6:00 PM",
//     location: "Riphah Rawalpindi Campus — Seminar Hall",
//     organizer: "Career Development Cell",
//     description: "Learn how to start freelancing, get clients and grow your Fiverr profile.",
//     totalSeats: 150,
//     registeredStudents: Array(95).fill("other@example.com"),
//     image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=500&auto=format&fit=crop",
//     bannerColor: "#F59E0B",
//     bannerTextColor: "#FFFBEB",
// },
// {
//     _id: "mock_9",
//     title: "Mobile App Development with React Native",
//     type: "Workshop",
//     date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
//     time: "10:00 AM – 5:00 PM",
//     location: "CS Lab 1 — Islamabad Campus",
//     organizer: "Riphah Dev Society",
//     description: "Build real mobile apps using React Native, Expo, and APIs.",
//     totalSeats: 60,
//     registeredStudents: Array(50).fill("other@example.com"),
//     image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=500&auto=format&fit=crop",
//     bannerColor: "#6366F1",
//     bannerTextColor: "#EEF2FF",
// },
// {
//     _id: "mock_10",
//     title: "Data Science Career Roadmap",
//     type: "Seminar",
//     date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
//     time: "1:00 PM – 4:00 PM",
//     location: "Riphah Auditorium — Lahore Campus",
//     organizer: "AI & DS Department",
//     description: "Understand roadmap, tools, and skills needed for data science careers.",
//     totalSeats: 180,
//     registeredStudents: Array(120).fill("other@example.com"),
//     image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=500&auto=format&fit=crop",
//     bannerColor: "#14B8A6",
//     bannerTextColor: "#ECFEFF",
// },
// {
//     _id: "mock_11",
//     title: "Women in Tech Networking Event",
//     type: "Networking",
//     date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
//     time: "5:00 PM – 8:00 PM",
//     location: "Riphah F-7 Campus — Conference Hall",
//     organizer: "Women Tech Initiative",
//     description: "A networking event empowering women in tech to connect and grow together.",
//     totalSeats: 100,
//     registeredStudents: Array(60).fill("other@example.com"),
//     image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=500&auto=format&fit=crop",
//     bannerColor: "#EC4899",
//     bannerTextColor: "#FFF1F2",
// },
// {
//     _id: "mock_12",
//     title: "Ethical Hacking Hands-on Lab",
//     type: "Workshop",
//     date: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
//     time: "9:00 AM – 2:00 PM",
//     location: "Cyber Lab — Islamabad Campus",
//     organizer: "Cybersecurity Club",
//     description: "Practical lab on penetration testing, tools, and network security.",
//     totalSeats: 50,
//     registeredStudents: Array(35).fill("other@example.com"),
//     image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=500&auto=format&fit=crop",
//     bannerColor: "#EF4444",
//     bannerTextColor: "#FEF2F2",
// },
// {
//     _id: "mock_13",
//     title: "Startup Pitch Competition 2025",
//     type: "Networking",
//     date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
//     time: "10:00 AM – 6:00 PM",
//     location: "Riphah Innovation Hub — Main Hall",
//     organizer: "Entrepreneurship Cell",
//     description: "Pitch your startup idea in front of investors and win funding opportunities.",
//     totalSeats: 120,
//     registeredStudents: Array(80).fill("other@example.com"),
//     image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=500&auto=format&fit=crop",
//     bannerColor: "#22C55E",
//     bannerTextColor: "#ECFDF5",
// },
// {
//     _id: "mock_14",
//     title: "AI Tools for Students Masterclass",
//     type: "Webinar",
//     date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
//     time: "7:00 PM – 9:00 PM",
//     location: "Online via Google Meet — Link shared after registration",
//     organizer: "Riphah AI Society",
//     description: "Explore ChatGPT, automation tools, and AI productivity hacks for students and developers.",
//     totalSeats: 250,
//     registeredStudents: Array(140).fill("other@example.com"),
//     image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=500&auto=format&fit=crop",
//     bannerColor: "#8B5CF6",
//     bannerTextColor: "#F5F3FF",
// }
// ];

// const THEME_COLOR = "#193648";

// const TYPE_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
//     "Job Fair":  { icon: "briefcase",    color: "#1A56DB", bg: "#EBF5FF" },
//     Seminar:     { icon: "school",        color: "#7C3AED", bg: "#F5F3FF" },
//     Workshop:    { icon: "tools",         color: "#D97706", bg: "#FFFBEB" },
//     Webinar:     { icon: "video",         color: "#059669", bg: "#ECFDF5" },
//     Networking:  { icon: "account-group", color: "#DC2626", bg: "#FEF2F2" },
// };

// const FILTERS = ["All", "Job Fair", "Seminar", "Workshop", "Webinar", "Networking"];

// const EventsScreen = () => {
//     const { width } = useWindowDimensions();

//     const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
//     const [studentEmail, setStudentEmail] = useState<string | null>(null);
//     const [registeredIds, setRegisteredIds] = useState<string[]>([]);
//     const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [registering, setRegistering] = useState(false);
//     const [activeFilter, setActiveFilter] = useState("All");

//     const numColumns = width > 600 ? 3 : 2;

//     const filteredEvents =
//         activeFilter === "All"
//             ? events
//             : events.filter((e) => e.type === activeFilter);

//     // ─── Load student email + registered IDs from AsyncStorage ───────────────
//     useFocusEffect(
//         useCallback(() => {
//             loadRegistered();
//         }, [])
//     );

//     const loadRegistered = async () => {
//         try {
//             const email = await AsyncStorage.getItem("studentEmail");
//             setStudentEmail(email);

//             const stored = await AsyncStorage.getItem("registeredEvents");
//             const registeredEvents = stored ? JSON.parse(stored) : [];
//             const ids = registeredEvents.map((e: any) => e.eventId);
//             setRegisteredIds(ids);

//             // Update counts from stored data
//             setEvents(
//                 MOCK_EVENTS.map((mockEvent) => {
//                     const isRegistered = ids.includes(mockEvent._id);
//                     if (isRegistered && email) {
//                         const alreadyAdded = mockEvent.registeredStudents.includes(email);
//                         if (!alreadyAdded) {
//                             return {
//                                 ...mockEvent,
//                                 registeredStudents: [...mockEvent.registeredStudents, email],
//                             };
//                         }
//                     }
//                     return mockEvent;
//                 })
//             );
//         } catch (err) {
//             console.log("Load registered error:", err);
//         }
//     };

//     // ─── Register Handler — AsyncStorage only ────────────────────────────────
//     const handleRegister = async () => {
//         if (!selectedEvent || !studentEmail) return;
//         setRegistering(true);
//         try {
//             // Save to AsyncStorage
//             const stored = await AsyncStorage.getItem("registeredEvents");
//             const registeredEvents = stored ? JSON.parse(stored) : [];

//             // Check already registered
//             const alreadyRegistered = registeredEvents.find(
//                 (e: any) => e.eventId === selectedEvent._id
//             );
//             if (alreadyRegistered) {
//                 Alert.alert("Already Registered", "You have already registered for this event!");
//                 setRegistering(false);
//                 return;
//             }

//             registeredEvents.push({
//                 eventId: selectedEvent._id,
//                 eventTitle: selectedEvent.title,
//                 registeredAt: new Date().toISOString(),
//             });
//             await AsyncStorage.setItem("registeredEvents", JSON.stringify(registeredEvents));

//             // Save notification to AsyncStorage
//             const notifStored = await AsyncStorage.getItem("localNotifications");
//             const notifs = notifStored ? JSON.parse(notifStored) : [];
//             notifs.unshift({
//                 id: Date.now().toString(),
//                 title: "Event Registration Confirmed! 📅",
//                 message: `You're registered for "${selectedEvent.title}" on ${new Date(selectedEvent.date).toDateString()} at ${selectedEvent.time}.`,
//                 type: "event",
//                 isRead: false,
//                 createdAt: new Date().toISOString(),
//             });
//             await AsyncStorage.setItem("localNotifications", JSON.stringify(notifs));

//             // Update UI
//             setRegisteredIds((prev) => [...prev, selectedEvent._id]);
//             setEvents((prev) =>
//                 prev.map((e) =>
//                     e._id === selectedEvent._id
//                         ? { ...e, registeredStudents: [...e.registeredStudents, studentEmail] }
//                         : e
//                 )
//             );
//             setSelectedEvent((prev) =>
//                 prev
//                     ? { ...prev, registeredStudents: [...prev.registeredStudents, studentEmail] }
//                     : prev
//             );

//             setModalVisible(false);
//             Alert.alert(
//                 "✅ Registration Complete!",
//                 `You are registered for:\n"${selectedEvent.title}"\n\nCheck your notifications!`
//             );
//         } catch (err: any) {
//             Alert.alert("Error", "Registration failed. Try again.");
//         } finally {
//             setRegistering(false);
//         }
//     };

//     // ─── Card ─────────────────────────────────────────────────────────────────
//     const renderCard = ({ item }: { item: Event }) => {
//         const isRegistered = registeredIds.includes(item._id);
//         const cfg = TYPE_CONFIG[item.type] || { icon: "calendar", color: "#374151", bg: "#F3F4F6" };
//         const eventDate = new Date(item.date);
//         const daysUntil = Math.ceil(
//             (eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
//         );
//         const joinedCount = (item.registeredStudents ?? []).length;
//         const fillPct =
//             item.totalSeats > 0
//                 ? Math.min((joinedCount / item.totalSeats) * 100, 100)
//                 : 0;
//         const progressColor =
//             fillPct >= 90 ? "#DC2626" : fillPct >= 70 ? "#D97706" : "#059669";

//         return (
//             <TouchableOpacity
//                 style={[styles.card, { maxWidth: (width / numColumns) - 16 }]}
//                 activeOpacity={0.85}
//                 onPress={() => {
//                     setSelectedEvent(item);
//                     setModalVisible(true);
//                 }}
//             >
//                 <View style={[styles.cardBanner, { backgroundColor: item.bannerColor }]}>
//                     <Image source={{ uri: item.image }} style={styles.cardImage} />
//                     {daysUntil <= 7 && daysUntil > 0 && (
//                         <View style={styles.soonBadge}>
//                             <Text style={styles.soonBadgeText}>🔥 Soon</Text>
//                         </View>
//                     )}
//                 </View>

//                 <View style={styles.cardBody}>
//                     <View style={[styles.typeBadge, { backgroundColor: cfg.bg }]}>
//                         <MaterialCommunityIcons name={cfg.icon as any} size={11} color={cfg.color} />
//                         <Text style={[styles.typeText, { color: cfg.color }]}>{item.type}</Text>
//                     </View>

//                     <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>

//                     <View style={styles.metaRow}>
//                         <Ionicons name="time-outline" size={12} color="#6B7280" />
//                         <Text style={styles.metaText}>{item.time}</Text>
//                     </View>

//                     <View style={styles.metaRow}>
//                         <Ionicons name="people-outline" size={12} color="#6B7280" />
//                         <Text style={styles.metaText}>
//                             {joinedCount} / {item.totalSeats} Joined
//                         </Text>
//                     </View>

//                     <View style={styles.progressSection}>
//                         <View style={styles.progressTrack}>
//                             <View
//                                 style={[
//                                     styles.progressFill,
//                                     {
//                                         width: `${fillPct}%` as any,
//                                         backgroundColor: progressColor,
//                                     },
//                                 ]}
//                             />
//                         </View>
//                     </View>

//                     <View style={styles.cardFooter}>
//                         {isRegistered ? (
//                             <View style={styles.registeredChip}>
//                                 <MaterialCommunityIcons name="check-circle" size={14} color="#059669" />
//                                 <Text style={styles.registeredChipText}>Registered</Text>
//                             </View>
//                         ) : (
//                             <View style={[styles.registerChip, { backgroundColor: THEME_COLOR }]}>
//                                 <Text style={styles.registerChipText}>Register →</Text>
//                             </View>
//                         )}
//                     </View>
//                 </View>
//             </TouchableOpacity>
//         );
//     };

//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar backgroundColor={THEME_COLOR} barStyle="light-content" />

//             {/* Header */}
//             <View style={styles.headerBanner}>
//                 <View style={{ flex: 1 }}>
//                     <Text style={styles.bannerTitle}>Events</Text>
//                     <Text style={styles.bannerSub}>Riphah International University</Text>
//                 </View>
//                 <View style={styles.headerBadge}>
//                     <Text style={styles.headerBadgeText}>{registeredIds.length} Joined</Text>
//                 </View>
//             </View>

//             {/* Filters */}
//             <View style={styles.filterWrapper}>
//                 <ScrollView
//                     horizontal
//                     showsHorizontalScrollIndicator={false}
//                     contentContainerStyle={styles.filterScroll}
//                 >
//                     {FILTERS.map((f) => (
//                         <TouchableOpacity
//                             key={f}
//                             style={[
//                                 styles.filterChip,
//                                 activeFilter === f && styles.filterChipActive,
//                             ]}
//                             onPress={() => setActiveFilter(f)}
//                         >
//                             <Text
//                                 style={[
//                                     styles.filterChipText,
//                                     activeFilter === f && styles.filterChipTextActive,
//                                 ]}
//                             >
//                                 {f}
//                             </Text>
//                         </TouchableOpacity>
//                     ))}
//                 </ScrollView>
//             </View>

//             {/* Events Grid */}
//             <FlatList
//                 data={filteredEvents}
//                 keyExtractor={(item) => item._id}
//                 renderItem={renderCard}
//                 numColumns={numColumns}
//                 key={numColumns}
//                 contentContainerStyle={styles.listContent}
//                 columnWrapperStyle={numColumns > 1 ? { gap: 12 } : null}
//                 ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
//             />

//             {/* Detail Modal */}
//             <Modal visible={modalVisible} animationType="slide" transparent>
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.detailModal}>
//                         <View style={styles.handleBar} />
//                         {selectedEvent &&
//                             (() => {
//                                 const joinedCount = (selectedEvent.registeredStudents ?? []).length;
//                                 const fillPct =
//                                     selectedEvent.totalSeats > 0
//                                         ? Math.min(
//                                               (joinedCount / selectedEvent.totalSeats) * 100,
//                                               100
//                                           )
//                                         : 0;
//                                 const progressColor =
//                                     fillPct >= 90
//                                         ? "#DC2626"
//                                         : fillPct >= 70
//                                         ? "#D97706"
//                                         : "#059669";
//                                 const spotsLeft = selectedEvent.totalSeats - joinedCount;
//                                 const isRegistered = registeredIds.includes(selectedEvent._id);

//                                 return (
//                                     <ScrollView showsVerticalScrollIndicator={false}>
//                                         <View style={styles.modalBannerContainer}>
//                                             <Image
//                                                 source={{ uri: selectedEvent.image }}
//                                                 style={styles.modalImage}
//                                             />
//                                             <TouchableOpacity
//                                                 style={styles.closeBtn}
//                                                 onPress={() => setModalVisible(false)}
//                                             >
//                                                 <Ionicons name="close" size={20} color="#fff" />
//                                             </TouchableOpacity>
//                                         </View>

//                                         <View style={styles.modalContent}>
//                                             <Text style={styles.detailTitle}>
//                                                 {selectedEvent.title}
//                                             </Text>
//                                             <Text style={styles.detailOrganizer}>
//                                                 by {selectedEvent.organizer}
//                                             </Text>

//                                             <View style={styles.infoGrid}>
//                                                 <DetailInfoBox
//                                                     label="Date"
//                                                     value={new Date(
//                                                         selectedEvent.date
//                                                     ).toDateString()}
//                                                 />
//                                                 <DetailInfoBox
//                                                     label="Time"
//                                                     value={selectedEvent.time}
//                                                 />
//                                                 <DetailInfoBox
//                                                     label="Location"
//                                                     value={selectedEvent.location}
//                                                     full
//                                                 />
//                                             </View>

//                                             {/* Seats */}
//                                             <View style={styles.seatsSection}>
//                                                 <View style={styles.seatsRow}>
//                                                     <Text style={styles.seatsLabel}>
//                                                         👥 {joinedCount} joined
//                                                     </Text>
//                                                     <Text
//                                                         style={[
//                                                             styles.seatsLabel,
//                                                             {
//                                                                 color: progressColor,
//                                                                 fontWeight: "700",
//                                                             },
//                                                         ]}
//                                                     >
//                                                         {spotsLeft > 0
//                                                             ? `${spotsLeft} spots left`
//                                                             : "FULL"}
//                                                     </Text>
//                                                 </View>
//                                                 <View style={styles.progressTrack}>
//                                                     <View
//                                                         style={[
//                                                             styles.progressFill,
//                                                             {
//                                                                 width: `${fillPct}%` as any,
//                                                                 backgroundColor: progressColor,
//                                                             },
//                                                         ]}
//                                                     />
//                                                 </View>
//                                             </View>

//                                             <Text style={styles.sectionTitle}>
//                                                 About this Event
//                                             </Text>
//                                             <Text style={styles.detailDesc}>
//                                                 {selectedEvent.description}
//                                             </Text>

//                                             {isRegistered ? (
//                                                 <View style={styles.registeredBanner}>
//                                                     <Text style={styles.registeredBannerTitle}>
//                                                          You're registered!
//                                                     </Text>
//                                                     <Text
//                                                         style={{
//                                                             color: "#166534",
//                                                             fontSize: 13,
//                                                             marginTop: 4,
//                                                         }}
//                                                     >
//                                                         Check your notifications for details.
//                                                     </Text>
//                                                 </View>
//                                             ) : spotsLeft <= 0 ? (
//                                                 <View
//                                                     style={[
//                                                         styles.registeredBanner,
//                                                         { backgroundColor: "#FEF2F2" },
//                                                     ]}
//                                                 >
//                                                     <Text
//                                                         style={[
//                                                             styles.registeredBannerTitle,
//                                                             { color: "#DC2626" },
//                                                         ]}
//                                                     >
//                                                         ❌ Event is Full
//                                                     </Text>
//                                                 </View>
//                                             ) : (
//                                                 <TouchableOpacity
//                                                     style={[
//                                                         styles.registerBtn,
//                                                         { backgroundColor: THEME_COLOR },
//                                                     ]}
//                                                     onPress={handleRegister}
//                                                     disabled={registering}
//                                                 >
//                                                     {registering ? (
//                                                         <ActivityIndicator color="#fff" />
//                                                     ) : (
//                                                         <Text style={styles.registerBtnText}>
//                                                             Register Now
//                                                         </Text>
//                                                     )}
//                                                 </TouchableOpacity>
//                                             )}
//                                         </View>
//                                     </ScrollView>
//                                 );
//                             })()}
//                     </View>
//                 </View>
//             </Modal>
//         </SafeAreaView>
//     );
// };

// const DetailInfoBox = ({ label, value, full }: any) => (
//     <View style={[styles.infoBox, full && { width: "100%" }]}>
//         <Text style={styles.infoLabel}>{label}</Text>
//         <Text style={styles.infoValue}>{value}</Text>
//     </View>
// );

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#F1F5F9" },
//     headerBanner: {
//         flexDirection: "row",
//         backgroundColor: THEME_COLOR,
//         paddingHorizontal: 20,
//         paddingVertical: 20,
//         alignItems: "center",
//         paddingTop: Platform.OS === "android" ? 15 : 10,
//     },
//     bannerTitle: { color: "#fff", fontSize: 20, fontWeight: "800" },
//     bannerSub: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 },
//     headerBadge: {
//         backgroundColor: "rgba(255,255,255,0.2)",
//         borderRadius: 12,
//         paddingHorizontal: 10,
//         paddingVertical: 5,
//     },
//     headerBadgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
//     filterWrapper: {
//         backgroundColor: "#fff",
//         borderBottomWidth: 1,
//         borderBottomColor: "#E2E8F0",
//     },
//     filterScroll: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
//     filterChip: {
//         paddingHorizontal: 14,
//         paddingVertical: 8,
//         borderRadius: 20,
//         backgroundColor: "#F1F5F9",
//         borderWidth: 1,
//         borderColor: "#E2E8F0",
//     },
//     filterChipActive: { backgroundColor: THEME_COLOR, borderColor: THEME_COLOR },
//     filterChipText: { fontSize: 12, fontWeight: "600", color: "#64748B" },
//     filterChipTextActive: { color: "#fff" },
//     listContent: { padding: 12, paddingBottom: 30 },
//     card: {
//         flex: 1,
//         backgroundColor: "#fff",
//         borderRadius: 16,
//         overflow: "hidden",
//         elevation: 3,
//         shadowColor: "#000",
//         shadowOpacity: 0.05,
//         shadowRadius: 10,
//     },
//     cardBanner: { height: 100, width: "100%", position: "relative" },
//     cardImage: { width: "100%", height: "100%", resizeMode: "cover" },
//     soonBadge: {
//         position: "absolute",
//         top: 8,
//         right: 8,
//         backgroundColor: "rgba(0,0,0,0.6)",
//         borderRadius: 12,
//         paddingHorizontal: 6,
//         paddingVertical: 2,
//     },
//     soonBadgeText: { fontSize: 9, color: "#fff", fontWeight: "700" },
//     cardBody: { padding: 12 },
//     typeBadge: {
//         flexDirection: "row",
//         alignItems: "center",
//         paddingHorizontal: 7,
//         paddingVertical: 3,
//         borderRadius: 12,
//         alignSelf: "flex-start",
//         marginBottom: 6,
//     },
//     typeText: { fontSize: 9, fontWeight: "700", marginLeft: 3 },
//     cardTitle: {
//         fontSize: 13,
//         fontWeight: "800",
//         color: "#1E293B",
//         marginBottom: 6,
//         lineHeight: 18,
//         height: 36,
//     },
//     metaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 3 },
//     metaText: { fontSize: 10, color: "#64748B", flex: 1 },
//     progressSection: { marginTop: 6 },
//     progressTrack: {
//         height: 4,
//         backgroundColor: "#E2E8F0",
//         borderRadius: 10,
//         overflow: "hidden",
//     },
//     progressFill: { height: "100%", borderRadius: 10 },
//     cardFooter: { marginTop: 10 },
//     registeredChip: {
//         flexDirection: "row",
//         alignItems: "center",
//         gap: 4,
//         backgroundColor: "#F0FDF4",
//         borderRadius: 12,
//         paddingHorizontal: 8,
//         paddingVertical: 5,
//         alignSelf: "flex-start",
//     },
//     registeredChipText: { fontSize: 10, color: "#166534", fontWeight: "700" },
//     registerChip: {
//         borderRadius: 12,
//         paddingHorizontal: 10,
//         paddingVertical: 6,
//         alignSelf: "flex-start",
//     },
//     registerChipText: { fontSize: 10, color: "#fff", fontWeight: "700" },
//     modalOverlay: {
//         flex: 1,
//         backgroundColor: "rgba(0,0,0,0.5)",
//         justifyContent: "flex-end",
//     },
//     detailModal: {
//         backgroundColor: "#fff",
//         borderTopLeftRadius: 25,
//         borderTopRightRadius: 25,
//         maxHeight: "90%",
//         overflow: "hidden",
//     },
//     handleBar: {
//         width: 40,
//         height: 4,
//         backgroundColor: "#E2E8F0",
//         borderRadius: 2,
//         alignSelf: "center",
//         marginTop: 10,
//     },
//     modalBannerContainer: { height: 200, width: "100%" },
//     modalImage: { width: "100%", height: "100%", resizeMode: "cover" },
//     closeBtn: {
//         position: "absolute",
//         top: 15,
//         right: 15,
//         backgroundColor: "rgba(0,0,0,0.4)",
//         borderRadius: 15,
//         padding: 5,
//     },
//     modalContent: { padding: 20 },
//     detailTitle: { fontSize: 22, fontWeight: "800", color: "#1E293B" },
//     detailOrganizer: { fontSize: 14, color: "#64748B", marginBottom: 20 },
//     infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
//     infoBox: {
//         flex: 1,
//         backgroundColor: "#F8FAFC",
//         borderRadius: 12,
//         padding: 12,
//         minWidth: "45%",
//     },
//     infoLabel: { fontSize: 10, color: "#94A3B8", fontWeight: "700", marginBottom: 2 },
//     infoValue: { fontSize: 13, color: "#1E293B", fontWeight: "700" },
//     seatsSection: { marginBottom: 20 },
//     seatsRow: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         marginBottom: 6,
//     },
//     seatsLabel: { fontSize: 13, color: "#64748B" },
//     sectionTitle: { fontSize: 16, fontWeight: "800", color: "#1E293B", marginBottom: 8 },
//     detailDesc: { fontSize: 14, color: "#475569", lineHeight: 22, marginBottom: 25 },
//     registeredBanner: {
//         backgroundColor: "#F0FDF4",
//         borderRadius: 15,
//         padding: 15,
//         alignItems: "center",
//     },
//     registeredBannerTitle: { color: "#166534", fontWeight: "800", fontSize: 16 },
//     registerBtn: { borderRadius: 15, padding: 16, alignItems: "center" },
//     registerBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
// });

// export default EventsScreen;










import { CONSTANT } from "@/constants/constant";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";

// ─── Interface ────────────────────────────────────────────────────────────────
interface Event {
    _id: string;
    title: string;
    type: "Job Fair" | "Seminar" | "Workshop" | "Webinar" | "Networking";
    date: string;
    time: string;
    location: string;
    organizer: string;
    description: string;
    totalSeats: number;
    registeredCount: number;   // ✅ only count, not full array
    isRegistered: boolean;     // ✅ per-student flag from backend
    image: string;
    bannerColor: string;
    bannerTextColor: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const THEME_COLOR = "#193648";

const COLOR_MAP: Record<string, { bannerColor: string; bannerTextColor: string }> = {
    "Job Fair":  { bannerColor: "#1A56DB", bannerTextColor: "#EBF5FF" },
    Seminar:     { bannerColor: "#7C3AED", bannerTextColor: "#F5F3FF" },
    Workshop:    { bannerColor: "#D97706", bannerTextColor: "#FFFBEB" },
    Webinar:     { bannerColor: "#059669", bannerTextColor: "#ECFDF5" },
    Networking:  { bannerColor: "#DC2626", bannerTextColor: "#FEF2F2" },
};

const TYPE_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
    "Job Fair":  { icon: "briefcase",    color: "#1A56DB", bg: "#EBF5FF" },
    Seminar:     { icon: "school",        color: "#7C3AED", bg: "#F5F3FF" },
    Workshop:    { icon: "tools",         color: "#D97706", bg: "#FFFBEB" },
    Webinar:     { icon: "video",         color: "#059669", bg: "#ECFDF5" },
    Networking:  { icon: "account-group", color: "#DC2626", bg: "#FEF2F2" },
};

const FILTERS = ["All", "Job Fair", "Seminar", "Workshop", "Webinar", "Networking"];

// ─── Component ────────────────────────────────────────────────────────────────
const EventsScreen = () => {
    const { width } = useWindowDimensions();

    const [events, setEvents] = useState<Event[]>([]);
    const [studentEmail, setStudentEmail] = useState<string | null>(null);
    const [registeredIds, setRegisteredIds] = useState<string[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [registering, setRegistering] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");

    const numColumns = width > 600 ? 3 : 2;

    const filteredEvents =
        activeFilter === "All"
            ? events
            : events.filter((e) => e.type === activeFilter);

    // ─── Load events from backend (per-student) ───────────────────────────────
    useFocusEffect(
        useCallback(() => {
            loadEvents();
        }, [])
    );

    const loadEvents = async () => {
        try {
            setLoading(true);
            const email = await AsyncStorage.getItem("studentEmail");
            setStudentEmail(email);

            // ✅ Pass email so backend returns isRegistered per student
            const res = await axios.get(
                `${CONSTANT.API_BASE_URL}/api/events${email ? `?email=${encodeURIComponent(email)}` : ""}`
            );

            // ✅ Attach bannerColor/bannerTextColor (not stored in DB)
            const eventsWithColors: Event[] = res.data.map((e: any) => ({
                ...e,
                ...(COLOR_MAP[e.type] || { bannerColor: "#374151", bannerTextColor: "#F3F4F6" }),
            }));

            setEvents(eventsWithColors);

            // ✅ Set registeredIds based on per-student isRegistered flag
            const ids = eventsWithColors
                .filter((e) => e.isRegistered)
                .map((e) => e._id);
            setRegisteredIds(ids);
        } catch (err) {
            console.log("Load events error:", err);
            Alert.alert("Error", "Could not load events. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ─── Register Handler ─────────────────────────────────────────────────────
    const handleRegister = async () => {
        if (!selectedEvent || !studentEmail) return;
        setRegistering(true);
        try {
            // ✅ Call backend to register
            await axios.post(`${CONSTANT.API_BASE_URL}/api/events/register`, {
                studentEmail,
                eventTitle: selectedEvent.title,
            });

            // Save local notification to AsyncStorage
            // const notifStored = await AsyncStorage.getItem("localNotifications");
            // const notifs = notifStored ? JSON.parse(notifStored) : [];
            // notifs.unshift({
            //     id: Date.now().toString(),
            //     title: "Event Registration Confirmed! 📅",
            //     message: `You're registered for "${selectedEvent.title}" on ${new Date(
            //         selectedEvent.date
            //     ).toDateString()} at ${selectedEvent.time}.`,
            //     type: "event",
            //     isRead: false,
            //     createdAt: new Date().toISOString(),
            // });
            // await AsyncStorage.setItem("localNotifications", JSON.stringify(notifs));

            setModalVisible(false);

            // ✅ Reload fresh data from backend so counts & isRegistered are accurate
            await loadEvents();

            Alert.alert(
                "✅ Registration Complete!",
                `You are registered for:\n"${selectedEvent.title}"\n\nCheck your notifications!`
            );
        } catch (err: any) {
            const msg =
                err?.response?.data?.error || "Registration failed. Try again.";
            Alert.alert("Error", msg);
        } finally {
            setRegistering(false);
        }
    };

    // ─── Card ─────────────────────────────────────────────────────────────────
    const renderCard = ({ item }: { item: Event }) => {
        const isRegistered = item.isRegistered; // ✅ from backend
        const cfg = TYPE_CONFIG[item.type] || { icon: "calendar", color: "#374151", bg: "#F3F4F6" };
        const eventDate = new Date(item.date);
        const daysUntil = Math.ceil(
            (eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        const joinedCount = item.registeredCount ?? 0; // ✅ use registeredCount
        const fillPct =
            item.totalSeats > 0
                ? Math.min((joinedCount / item.totalSeats) * 100, 100)
                : 0;
        const progressColor =
            fillPct >= 90 ? "#DC2626" : fillPct >= 70 ? "#D97706" : "#059669";

        return (
            <TouchableOpacity
                style={[styles.card, { maxWidth: (width / numColumns) - 16 }]}
                activeOpacity={0.85}
                onPress={() => {
                    setSelectedEvent(item);
                    setModalVisible(true);
                }}
            >
                <View style={[styles.cardBanner, { backgroundColor: item.bannerColor }]}>
                    <Image source={{ uri: item.image }} style={styles.cardImage} />
                    {daysUntil <= 7 && daysUntil > 0 && (
                        <View style={styles.soonBadge}>
                            <Text style={styles.soonBadgeText}>🔥 Soon</Text>
                        </View>
                    )}
                </View>

                <View style={styles.cardBody}>
                    <View style={[styles.typeBadge, { backgroundColor: cfg.bg }]}>
                        <MaterialCommunityIcons name={cfg.icon as any} size={11} color={cfg.color} />
                        <Text style={[styles.typeText, { color: cfg.color }]}>{item.type}</Text>
                    </View>

                    <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>

                    <View style={styles.metaRow}>
                        <Ionicons name="time-outline" size={12} color="#6B7280" />
                        <Text style={styles.metaText}>{item.time}</Text>
                    </View>

                    <View style={styles.metaRow}>
                        <Ionicons name="people-outline" size={12} color="#6B7280" />
                        <Text style={styles.metaText}>
                            {joinedCount} / {item.totalSeats} Joined
                        </Text>
                    </View>

                    <View style={styles.progressSection}>
                        <View style={styles.progressTrack}>
                            <View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: `${fillPct}%` as any,
                                        backgroundColor: progressColor,
                                    },
                                ]}
                            />
                        </View>
                    </View>

                    <View style={styles.cardFooter}>
                        {isRegistered ? (
                            <View style={styles.registeredChip}>
                                <MaterialCommunityIcons name="check-circle" size={14} color="#059669" />
                                <Text style={styles.registeredChipText}>Registered</Text>
                            </View>
                        ) : (
                            <View style={[styles.registerChip, { backgroundColor: THEME_COLOR }]}>
                                <Text style={styles.registerChipText}>Register →</Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    // ─── Loading State ────────────────────────────────────────────────────────
    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color={THEME_COLOR} />
                <Text style={{ marginTop: 12, color: "#64748B", fontSize: 14 }}>Loading Events...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={THEME_COLOR} barStyle="light-content" />

            {/* Header */}
            <View style={styles.headerBanner}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.bannerTitle}>Events</Text>
                    <Text style={styles.bannerSub}>Riphah International University</Text>
                </View>
                <View style={styles.headerBadge}>
                    <Text style={styles.headerBadgeText}>{registeredIds.length} Joined</Text>
                </View>
            </View>

            {/* Filters */}
            <View style={styles.filterWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScroll}
                >
                    {FILTERS.map((f) => (
                        <TouchableOpacity
                            key={f}
                            style={[
                                styles.filterChip,
                                activeFilter === f && styles.filterChipActive,
                            ]}
                            onPress={() => setActiveFilter(f)}
                        >
                            <Text
                                style={[
                                    styles.filterChipText,
                                    activeFilter === f && styles.filterChipTextActive,
                                ]}
                            >
                                {f}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Events Grid */}
            <FlatList
                data={filteredEvents}
                keyExtractor={(item) => item._id}
                renderItem={renderCard}
                numColumns={numColumns}
                key={numColumns}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={numColumns > 1 ? { gap: 12 } : null}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                ListEmptyComponent={
                    <View style={{ alignItems: "center", marginTop: 60 }}>
                        <Text style={{ color: "#94A3B8", fontSize: 15 }}>No events found.</Text>
                    </View>
                }
            />

            {/* Detail Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.detailModal}>
                        <View style={styles.handleBar} />
                        {selectedEvent &&
                            (() => {
                                const joinedCount = selectedEvent.registeredCount ?? 0; // ✅ use registeredCount
                                const fillPct =
                                    selectedEvent.totalSeats > 0
                                        ? Math.min(
                                              (joinedCount / selectedEvent.totalSeats) * 100,
                                              100
                                          )
                                        : 0;
                                const progressColor =
                                    fillPct >= 90
                                        ? "#DC2626"
                                        : fillPct >= 70
                                        ? "#D97706"
                                        : "#059669";
                                const spotsLeft = selectedEvent.totalSeats - joinedCount;
                                const isRegistered = selectedEvent.isRegistered; // ✅ from backend

                                return (
                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        <View style={styles.modalBannerContainer}>
                                            <Image
                                                source={{ uri: selectedEvent.image }}
                                                style={styles.modalImage}
                                            />
                                            <TouchableOpacity
                                                style={styles.closeBtn}
                                                onPress={() => setModalVisible(false)}
                                            >
                                                <Ionicons name="close" size={20} color="#fff" />
                                            </TouchableOpacity>
                                        </View>

                                        <View style={styles.modalContent}>
                                            <Text style={styles.detailTitle}>
                                                {selectedEvent.title}
                                            </Text>
                                            <Text style={styles.detailOrganizer}>
                                                by {selectedEvent.organizer}
                                            </Text>

                                            <View style={styles.infoGrid}>
                                                <DetailInfoBox
                                                    label="Date"
                                                    value={new Date(
                                                        selectedEvent.date
                                                    ).toDateString()}
                                                />
                                                <DetailInfoBox
                                                    label="Time"
                                                    value={selectedEvent.time}
                                                />
                                                <DetailInfoBox
                                                    label="Location"
                                                    value={selectedEvent.location}
                                                    full
                                                />
                                            </View>

                                            {/* Seats */}
                                            <View style={styles.seatsSection}>
                                                <View style={styles.seatsRow}>
                                                    <Text style={styles.seatsLabel}>
                                                        👥 {joinedCount} joined
                                                    </Text>
                                                    <Text
                                                        style={[
                                                            styles.seatsLabel,
                                                            {
                                                                color: progressColor,
                                                                fontWeight: "700",
                                                            },
                                                        ]}
                                                    >
                                                        {spotsLeft > 0
                                                            ? `${spotsLeft} spots left`
                                                            : "FULL"}
                                                    </Text>
                                                </View>
                                                <View style={styles.progressTrack}>
                                                    <View
                                                        style={[
                                                            styles.progressFill,
                                                            {
                                                                width: `${fillPct}%` as any,
                                                                backgroundColor: progressColor,
                                                            },
                                                        ]}
                                                    />
                                                </View>
                                            </View>

                                            <Text style={styles.sectionTitle}>
                                                About this Event
                                            </Text>
                                            <Text style={styles.detailDesc}>
                                                {selectedEvent.description}
                                            </Text>

                                            {isRegistered ? (
                                                <View style={styles.registeredBanner}>
                                                    <Text style={styles.registeredBannerTitle}>
                                                        ✅ You're registered!
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            color: "#166534",
                                                            fontSize: 13,
                                                            marginTop: 4,
                                                        }}
                                                    >
                                                        Check your notifications for details.
                                                    </Text>
                                                </View>
                                            ) : spotsLeft <= 0 ? (
                                                <View
                                                    style={[
                                                        styles.registeredBanner,
                                                        { backgroundColor: "#FEF2F2" },
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.registeredBannerTitle,
                                                            { color: "#DC2626" },
                                                        ]}
                                                    >
                                                        ❌ Event is Full
                                                    </Text>
                                                </View>
                                            ) : (
                                                <TouchableOpacity
                                                    style={[
                                                        styles.registerBtn,
                                                        { backgroundColor: THEME_COLOR },
                                                    ]}
                                                    onPress={handleRegister}
                                                    disabled={registering}
                                                >
                                                    {registering ? (
                                                        <ActivityIndicator color="#fff" />
                                                    ) : (
                                                        <Text style={styles.registerBtnText}>
                                                            Register Now
                                                        </Text>
                                                    )}
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </ScrollView>
                                );
                            })()}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

// ─── Helper Component ─────────────────────────────────────────────────────────
const DetailInfoBox = ({ label, value, full }: any) => (
    <View style={[styles.infoBox, full && { width: "100%" }]}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
    </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F1F5F9" },
    headerBanner: {
        flexDirection: "row",
        backgroundColor: THEME_COLOR,
        paddingHorizontal: 20,
        paddingVertical: 20,
        alignItems: "center",
        paddingTop: Platform.OS === "android" ? 15 : 10,
    },
    bannerTitle: { color: "#fff", fontSize: 20, fontWeight: "800" },
    bannerSub: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 },
    headerBadge: {
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    headerBadgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
    filterWrapper: {
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#E2E8F0",
    },
    filterScroll: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
    filterChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#F1F5F9",
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    filterChipActive: { backgroundColor: THEME_COLOR, borderColor: THEME_COLOR },
    filterChipText: { fontSize: 12, fontWeight: "600", color: "#64748B" },
    filterChipTextActive: { color: "#fff" },
    listContent: { padding: 12, paddingBottom: 30 },
    card: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    cardBanner: { height: 100, width: "100%", position: "relative" },
    cardImage: { width: "100%", height: "100%", resizeMode: "cover" },
    soonBadge: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "rgba(0,0,0,0.6)",
        borderRadius: 12,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    soonBadgeText: { fontSize: 9, color: "#fff", fontWeight: "700" },
    cardBody: { padding: 12 },
    typeBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 12,
        alignSelf: "flex-start",
        marginBottom: 6,
    },
    typeText: { fontSize: 9, fontWeight: "700", marginLeft: 3 },
    cardTitle: {
        fontSize: 13,
        fontWeight: "800",
        color: "#1E293B",
        marginBottom: 6,
        lineHeight: 18,
        height: 36,
    },
    metaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 3 },
    metaText: { fontSize: 10, color: "#64748B", flex: 1 },
    progressSection: { marginTop: 6 },
    progressTrack: {
        height: 4,
        backgroundColor: "#E2E8F0",
        borderRadius: 10,
        overflow: "hidden",
    },
    progressFill: { height: "100%", borderRadius: 10 },
    cardFooter: { marginTop: 10 },
    registeredChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "#F0FDF4",
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 5,
        alignSelf: "flex-start",
    },
    registeredChipText: { fontSize: 10, color: "#166534", fontWeight: "700" },
    registerChip: {
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 6,
        alignSelf: "flex-start",
    },
    registerChipText: { fontSize: 10, color: "#fff", fontWeight: "700" },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    detailModal: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        maxHeight: "90%",
        overflow: "hidden",
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: "#E2E8F0",
        borderRadius: 2,
        alignSelf: "center",
        marginTop: 10,
    },
    modalBannerContainer: { height: 200, width: "100%" },
    modalImage: { width: "100%", height: "100%", resizeMode: "cover" },
    closeBtn: {
        position: "absolute",
        top: 15,
        right: 15,
        backgroundColor: "rgba(0,0,0,0.4)",
        borderRadius: 15,
        padding: 5,
    },
    modalContent: { padding: 20 },
    detailTitle: { fontSize: 22, fontWeight: "800", color: "#1E293B" },
    detailOrganizer: { fontSize: 14, color: "#64748B", marginBottom: 20 },
    infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
    infoBox: {
        flex: 1,
        backgroundColor: "#F8FAFC",
        borderRadius: 12,
        padding: 12,
        minWidth: "45%",
    },
    infoLabel: { fontSize: 10, color: "#94A3B8", fontWeight: "700", marginBottom: 2 },
    infoValue: { fontSize: 13, color: "#1E293B", fontWeight: "700" },
    seatsSection: { marginBottom: 20 },
    seatsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    seatsLabel: { fontSize: 13, color: "#64748B" },
    sectionTitle: { fontSize: 16, fontWeight: "800", color: "#1E293B", marginBottom: 8 },
    detailDesc: { fontSize: 14, color: "#475569", lineHeight: 22, marginBottom: 25 },
    registeredBanner: {
        backgroundColor: "#F0FDF4",
        borderRadius: 15,
        padding: 15,
        alignItems: "center",
    },
    registeredBannerTitle: { color: "#166534", fontWeight: "800", fontSize: 16 },
    registerBtn: { borderRadius: 15, padding: 16, alignItems: "center" },
    registerBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});

export default EventsScreen;