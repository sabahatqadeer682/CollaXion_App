// import { CONSTANT } from "@/constants/constant";
// import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import axios from "axios";
// import React, { useCallback, useEffect, useState } from "react";
// import {
//     ActivityIndicator,
//     Alert,
//     FlatList,
//     Modal,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";

// const DOMAINS = ["All", "Web Development", "Artificial Intelligence", "Mobile Development", "Cybersecurity", "Design", "Backend Development"];
// const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
//     Remote: { bg: "#ECFDF5", text: "#065F46" },
//     "On-site": { bg: "#EFF6FF", text: "#1E40AF" },
//     Hybrid: { bg: "#FDF4FF", text: "#6B21A8" },
// };

// const getDaysLeft = (deadline: string) => {
//     const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
//     return diff;
// };

// const InternshipsScreen = () => {
//     const navigation = useNavigation<any>();
//     const [internships, setInternships] = useState<any[]>([]);
//     const [filtered, setFiltered] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedDomain, setSelectedDomain] = useState("All");
//     const [searchText, setSearchText] = useState("");
//     const [appliedIds, setAppliedIds] = useState<string[]>([]);
//     const [selectedInternship, setSelectedInternship] = useState<any>(null);
//     const [applyModalVisible, setApplyModalVisible] = useState(false);
//     const [coverLetter, setCoverLetter] = useState("");
//     const [applying, setApplying] = useState(false);
//     const [detailModalVisible, setDetailModalVisible] = useState(false);

//     useFocusEffect(
//         useCallback(() => {
//             fetchInternships();
//             fetchApplied();
//         }, [])
//     );

//     const fetchInternships = async () => {
//         try {
//             await axios.post(`${CONSTANT.API_BASE_URL}/api/internships/seed`);
//             const res = await axios.get(`${CONSTANT.API_BASE_URL}/api/internships`);
//             setInternships(res.data);
//             setFiltered(res.data);
//         } catch (err) {
//             console.log("Internships fetch error:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchApplied = async () => {
//         try {
//             const email = await AsyncStorage.getItem("studentEmail");
//             if (!email) return;
//             const res = await axios.get(`${CONSTANT.API_BASE_URL}/api/applications/${email}`);
//             setAppliedIds(res.data.map((a: any) => a.internshipId?._id || a.internshipId));
//         } catch (err) {
//             console.log("Applied fetch error:", err);
//         }
//     };

//     useEffect(() => {
//         let result = internships;
//         if (selectedDomain !== "All") result = result.filter((i) => i.domain === selectedDomain);
//         if (searchText.trim()) {
//             const q = searchText.toLowerCase();
//             result = result.filter(
//                 (i) => i.title.toLowerCase().includes(q) || i.company.toLowerCase().includes(q) || i.requiredSkills?.some((s: string) => s.toLowerCase().includes(q))
//             );
//         }
//         setFiltered(result);
//     }, [selectedDomain, searchText, internships]);

//     const handleApply = async () => {
//         if (!coverLetter.trim()) {
//             Alert.alert("Required", "Please write a brief cover letter");
//             return;
//         }
//         setApplying(true);
//         try {
//             const email = await AsyncStorage.getItem("studentEmail");
//             await axios.post(`${CONSTANT.API_BASE_URL}/api/internships/apply`, {
//                 studentEmail: email,
//                 internshipId: selectedInternship._id,
//                 coverLetter,
//             });
//             setAppliedIds((prev) => [...prev, selectedInternship._id]);
//             setApplyModalVisible(false);
//             setDetailModalVisible(false);
//             setCoverLetter("");
//             Alert.alert("🎉 Applied!", `Your application for "${selectedInternship.title}" has been submitted! Check status in My Applications.`);
//         } catch (err: any) {
//             Alert.alert("Error", err.response?.data?.error || "Failed to apply");
//         } finally {
//             setApplying(false);
//         }
//     };

//     const renderCard = ({ item }: { item: any }) => {
//         const isApplied = appliedIds.includes(item._id);
//         const daysLeft = getDaysLeft(item.deadline);
//         const typeColor = TYPE_COLORS[item.type] || { bg: "#F3F4F6", text: "#374151" };

//         return (
//             <TouchableOpacity style={styles.card} onPress={() => { setSelectedInternship(item); setDetailModalVisible(true); }} activeOpacity={0.85}>
//                 <View style={styles.cardHeader}>
//                     <View style={styles.companyLogoPlaceholder}>
//                         <MaterialCommunityIcons name="office-building" size={26} color="#193648" />
//                     </View>
//                     <View style={{ flex: 1, marginLeft: 12 }}>
//                         <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
//                         <Text style={styles.cardCompany}>{item.company}</Text>
//                     </View>
//                     <View style={[styles.typeBadge, { backgroundColor: typeColor.bg }]}>
//                         <Text style={[styles.typeBadgeText, { color: typeColor.text }]}>{item.type}</Text>
//                     </View>
//                 </View>

//                 <View style={styles.cardMeta}>
//                     <View style={styles.metaItem}>
//                         <Ionicons name="location-outline" size={13} color="#6B7280" />
//                         <Text style={styles.metaText}>{item.location}</Text>
//                     </View>
//                     <View style={styles.metaItem}>
//                         <Ionicons name="time-outline" size={13} color="#6B7280" />
//                         <Text style={styles.metaText}>{item.duration}</Text>
//                     </View>
//                     <View style={styles.metaItem}>
//                         <MaterialCommunityIcons name="cash" size={13} color="#6B7280" />
//                         <Text style={styles.metaText}>{item.stipend}</Text>
//                     </View>
//                 </View>

//                 <View style={styles.skillsRow}>
//                     {item.requiredSkills?.slice(0, 3).map((s: string, i: number) => (
//                         <View key={i} style={styles.skillChip}>
//                             <Text style={styles.skillChipText}>{s}</Text>
//                         </View>
//                     ))}
//                     {item.requiredSkills?.length > 3 && (
//                         <Text style={styles.moreSkills}>+{item.requiredSkills.length - 3}</Text>
//                     )}
//                 </View>

//                 <View style={styles.cardFooter}>
//                     <View style={[styles.deadlineBadge, { backgroundColor: daysLeft <= 7 ? "#FEF2F2" : "#F0FDF4" }]}>
//                         <MaterialCommunityIcons name="clock-alert" size={13} color={daysLeft <= 7 ? "#DC2626" : "#16A34A"} />
//                         <Text style={[styles.deadlineText, { color: daysLeft <= 7 ? "#DC2626" : "#16A34A" }]}>
//                             {daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"}
//                         </Text>
//                     </View>
//                     <TouchableOpacity
//                         style={[styles.applyBtn, isApplied && styles.appliedBtn]}
//                         onPress={() => {
//                             if (!isApplied) { setSelectedInternship(item); setApplyModalVisible(true); }
//                         }}
//                         disabled={isApplied}
//                     >
//                         <Text style={[styles.applyBtnText, isApplied && styles.appliedBtnText]}>
//                             {isApplied ? "✓ Applied" : "Apply Now"}
//                         </Text>
//                     </TouchableOpacity>
//                 </View>
//             </TouchableOpacity>
//         );
//     };

//     return (
//         <View style={styles.container}>
//             {/* Search */}
//             <View style={styles.searchRow}>
//                 <Ionicons name="search" size={18} color="#9CA3AF" style={{ marginLeft: 14 }} />
//                 <TextInput
//                     placeholder="Search by title, company or skill..."
//                     value={searchText}
//                     onChangeText={setSearchText}
//                     style={styles.searchInput}
//                     placeholderTextColor="#9CA3AF"
//                 />
//             </View>

//             {/* Domain Filter */}
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
//                 {DOMAINS.map((d) => (
//                     <TouchableOpacity
//                         key={d}
//                         style={[styles.filterChip, selectedDomain === d && styles.filterChipActive]}
//                         onPress={() => setSelectedDomain(d)}
//                     >
//                         <Text style={[styles.filterChipText, selectedDomain === d && styles.filterChipTextActive]}>{d}</Text>
//                     </TouchableOpacity>
//                 ))}
//             </ScrollView>

//             <Text style={styles.resultCount}>{filtered.length} internships found</Text>

//             {loading ? (
//                 <ActivityIndicator color="#193648" size="large" style={{ marginTop: 60 }} />
//             ) : (
//                 <FlatList
//                     data={filtered}
//                     keyExtractor={(item) => item._id}
//                     renderItem={renderCard}
//                     contentContainerStyle={{ padding: 16, paddingTop: 8, paddingBottom: 100 }}
//                     ListEmptyComponent={
//                         <View style={styles.emptyState}>
//                             <MaterialCommunityIcons name="briefcase-search" size={60} color="#D1D5DB" />
//                             <Text style={styles.emptyText}>No internships found</Text>
//                             <Text style={styles.emptySubText}>Try changing your search or filter</Text>
//                         </View>
//                     }
//                 />
//             )}

//             {/* Detail Modal */}
//             <Modal visible={detailModalVisible} animationType="slide" transparent>
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.detailModal}>
//                         <ScrollView showsVerticalScrollIndicator={false}>
//                             <View style={styles.detailHeader}>
//                                 <View style={styles.detailLogo}>
//                                     <MaterialCommunityIcons name="office-building" size={36} color="#193648" />
//                                 </View>
//                                 <TouchableOpacity onPress={() => setDetailModalVisible(false)} style={styles.closeBtn}>
//                                     <Ionicons name="close" size={20} color="#374151" />
//                                 </TouchableOpacity>
//                             </View>
//                             <Text style={styles.detailTitle}>{selectedInternship?.title}</Text>
//                             <Text style={styles.detailCompany}>{selectedInternship?.company}</Text>

//                             <View style={styles.detailMetaRow}>
//                                 {[
//                                     { icon: "location-outline", text: selectedInternship?.location },
//                                     { icon: "time-outline", text: selectedInternship?.duration },
//                                 ].map((m, i) => (
//                                     <View key={i} style={styles.detailMetaItem}>
//                                         <Ionicons name={m.icon as any} size={14} color="#6B7280" />
//                                         <Text style={styles.detailMetaText}>{m.text}</Text>
//                                     </View>
//                                 ))}
//                             </View>

//                             <View style={styles.detailInfoGrid}>
//                                 <View style={styles.infoBox}>
//                                     <Text style={styles.infoLabel}>Stipend</Text>
//                                     <Text style={styles.infoValue}>{selectedInternship?.stipend}</Text>
//                                 </View>
//                                 <View style={styles.infoBox}>
//                                     <Text style={styles.infoLabel}>Type</Text>
//                                     <Text style={styles.infoValue}>{selectedInternship?.type}</Text>
//                                 </View>
//                                 <View style={styles.infoBox}>
//                                     <Text style={styles.infoLabel}>Domain</Text>
//                                     <Text style={styles.infoValue}>{selectedInternship?.domain}</Text>
//                                 </View>
//                                 <View style={styles.infoBox}>
//                                     <Text style={styles.infoLabel}>Deadline</Text>
//                                     <Text style={styles.infoValue}>
//                                         {selectedInternship?.deadline ? new Date(selectedInternship.deadline).toDateString() : "N/A"}
//                                     </Text>
//                                 </View>
//                             </View>

//                             <Text style={styles.detailSectionTitle}>About the Role</Text>
//                             <Text style={styles.detailBody}>{selectedInternship?.description}</Text>

//                             <Text style={styles.detailSectionTitle}>Requirements</Text>
//                             <Text style={styles.detailBody}>{selectedInternship?.requirements}</Text>

//                             <Text style={styles.detailSectionTitle}>Required Skills</Text>
//                             <View style={styles.skillsRow}>
//                                 {selectedInternship?.requiredSkills?.map((s: string, i: number) => (
//                                     <View key={i} style={[styles.skillChip, { backgroundColor: "#EEF2FF" }]}>
//                                         <Text style={[styles.skillChipText, { color: "#3730A3" }]}>{s}</Text>
//                                     </View>
//                                 ))}
//                             </View>
//                         </ScrollView>
//                         {!appliedIds.includes(selectedInternship?._id) ? (
//                             <TouchableOpacity
//                                 style={styles.applyBtnFull}
//                                 onPress={() => { setDetailModalVisible(false); setApplyModalVisible(true); }}
//                             >
//                                 <Text style={styles.applyBtnFullText}>Apply for this Internship</Text>
//                             </TouchableOpacity>
//                         ) : (
//                             <View style={[styles.applyBtnFull, { backgroundColor: "#ECFDF5" }]}>
//                                 <Text style={[styles.applyBtnFullText, { color: "#065F46" }]}>✓ Already Applied</Text>
//                             </View>
//                         )}
//                     </View>
//                 </View>
//             </Modal>

//             {/* Apply Modal */}
//             <Modal visible={applyModalVisible} animationType="slide" transparent>
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.applyModal}>
//                         <Text style={styles.applyModalTitle}>Apply for Internship</Text>
//                         <Text style={styles.applyModalSub}>{selectedInternship?.title} • {selectedInternship?.company}</Text>
//                         <Text style={styles.coverLabel}>Cover Letter *</Text>
//                         <TextInput
//                             value={coverLetter}
//                             onChangeText={setCoverLetter}
//                             placeholder="Why are you interested in this role? What skills do you bring?..."
//                             multiline
//                             numberOfLines={6}
//                             style={styles.coverInput}
//                             placeholderTextColor="#9CA3AF"
//                             textAlignVertical="top"
//                         />
//                         <Text style={styles.coverHint}>Tip: Mention your relevant skills, projects, and why you're a great fit!</Text>
//                         <View style={styles.applyModalBtns}>
//                             <TouchableOpacity style={styles.cancelBtn} onPress={() => setApplyModalVisible(false)}>
//                                 <Text style={styles.cancelBtnText}>Cancel</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity style={styles.submitBtn} onPress={handleApply} disabled={applying}>
//                                 {applying ? (
//                                     <ActivityIndicator color="#fff" />
//                                 ) : (
//                                     <Text style={styles.submitBtnText}>Submit Application</Text>
//                                 )}
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#F0F4F8" },
//     searchRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#fff",
//         margin: 16,
//         borderRadius: 14,
//         elevation: 2,
//         borderWidth: 1,
//         borderColor: "#E5E7EB",
//     },
//     searchInput: { flex: 1, paddingVertical: 12, paddingHorizontal: 10, color: "#111827", fontSize: 14 },
//     filterScroll: { marginBottom: 4 },
//     filterChip: {
//         paddingHorizontal: 16,
//         paddingVertical: 7,
//         borderRadius: 20,
//         backgroundColor: "#fff",
//         borderWidth: 1,
//         borderColor: "#E5E7EB",
//     },
//     filterChipActive: { backgroundColor: "#193648", borderColor: "#193648" },
//     filterChipText: { fontSize: 13, color: "#374151", fontWeight: "500" },
//     filterChipTextActive: { color: "#fff" },
//     resultCount: { paddingHorizontal: 16, paddingVertical: 6, color: "#6B7280", fontSize: 12 },
//     card: { backgroundColor: "#fff", borderRadius: 20, padding: 18, marginBottom: 14, elevation: 2 },
//     cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
//     companyLogoPlaceholder: {
//         width: 52,
//         height: 52,
//         borderRadius: 14,
//         backgroundColor: "#EFF6FF",
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     cardTitle: { fontSize: 15, fontWeight: "700", color: "#111827" },
//     cardCompany: { fontSize: 13, color: "#6B7280", marginTop: 2 },
//     typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
//     typeBadgeText: { fontSize: 11, fontWeight: "600" },
//     cardMeta: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 12 },
//     metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
//     metaText: { fontSize: 12, color: "#6B7280" },
//     skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 },
//     skillChip: { backgroundColor: "#F3F4F6", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
//     skillChipText: { fontSize: 11, color: "#374151", fontWeight: "500" },
//     moreSkills: { fontSize: 11, color: "#6B7280", paddingVertical: 4 },
//     cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//     deadlineBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, gap: 4 },
//     deadlineText: { fontSize: 12, fontWeight: "600" },
//     applyBtn: { backgroundColor: "#193648", paddingHorizontal: 18, paddingVertical: 9, borderRadius: 20 },
//     appliedBtn: { backgroundColor: "#ECFDF5", borderWidth: 1, borderColor: "#059669" },
//     applyBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" },
//     appliedBtnText: { color: "#059669" },
//     emptyState: { alignItems: "center", paddingTop: 60 },
//     emptyText: { fontSize: 18, fontWeight: "700", color: "#374151", marginTop: 16 },
//     emptySubText: { fontSize: 14, color: "#9CA3AF", marginTop: 8 },
//     modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
//     detailModal: {
//         backgroundColor: "#fff",
//         borderTopLeftRadius: 28,
//         borderTopRightRadius: 28,
//         padding: 24,
//         maxHeight: "90%",
//     },
//     detailHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
//     detailLogo: {
//         width: 64,
//         height: 64,
//         borderRadius: 18,
//         backgroundColor: "#EFF6FF",
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     closeBtn: { backgroundColor: "#F3F4F6", borderRadius: 20, padding: 8 },
//     detailTitle: { fontSize: 22, fontWeight: "800", color: "#111827", marginBottom: 4 },
//     detailCompany: { fontSize: 16, color: "#6B7280", marginBottom: 12 },
//     detailMetaRow: { flexDirection: "row", gap: 16, marginBottom: 16 },
//     detailMetaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
//     detailMetaText: { fontSize: 13, color: "#6B7280" },
//     detailInfoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
//     infoBox: {
//         width: "47%",
//         backgroundColor: "#F9FAFB",
//         borderRadius: 12,
//         padding: 12,
//     },
//     infoLabel: { fontSize: 11, color: "#9CA3AF", fontWeight: "600", textTransform: "uppercase", marginBottom: 4 },
//     infoValue: { fontSize: 14, color: "#111827", fontWeight: "600" },
//     detailSectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 8 },
//     detailBody: { fontSize: 14, color: "#4B5563", lineHeight: 22, marginBottom: 16 },
//     applyBtnFull: {
//         backgroundColor: "#193648",
//         borderRadius: 16,
//         padding: 18,
//         alignItems: "center",
//         marginTop: 16,
//     },
//     applyBtnFullText: { color: "#fff", fontSize: 16, fontWeight: "700" },
//     applyModal: {
//         backgroundColor: "#fff",
//         borderTopLeftRadius: 28,
//         borderTopRightRadius: 28,
//         padding: 24,
//     },
//     applyModalTitle: { fontSize: 20, fontWeight: "800", color: "#111827", marginBottom: 4 },
//     applyModalSub: { fontSize: 13, color: "#6B7280", marginBottom: 20 },
//     coverLabel: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
//     coverInput: {
//         borderWidth: 1,
//         borderColor: "#E5E7EB",
//         borderRadius: 14,
//         padding: 14,
//         fontSize: 14,
//         color: "#111827",
//         backgroundColor: "#F9FAFB",
//         minHeight: 140,
//         marginBottom: 8,
//     },
//     coverHint: { fontSize: 12, color: "#9CA3AF", marginBottom: 20 },
//     applyModalBtns: { flexDirection: "row", gap: 12 },
//     cancelBtn: {
//         flex: 1,
//         borderWidth: 1,
//         borderColor: "#E5E7EB",
//         borderRadius: 14,
//         padding: 16,
//         alignItems: "center",
//     },
//     cancelBtnText: { fontSize: 15, color: "#374151", fontWeight: "600" },
//     submitBtn: {
//         flex: 2,
//         backgroundColor: "#193648",
//         borderRadius: 14,
//         padding: 16,
//         alignItems: "center",
//     },
//     submitBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
// });

// export default InternshipsScreen;





// import React, { useState, useEffect } from "react";
// import {
//     View,
//     Text,
//     StyleSheet,
//     ScrollView,
//     TouchableOpacity,
//     TextInput,
//     FlatList,
//     Modal,
//     Alert,
//     SafeAreaView,
//     Dimensions,
// } from "react-native";
// import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
// import * as Animatable from "react-native-animatable";

// const { width } = Dimensions.get("window");

// // --- MOCK DATA (As per SRS-12 requirements) ---
// const MOCK_INTERNSHIPS = [
//     {
//         id: "1",
//         title: "AI & ML Research Intern",
//         company: "CollaXion Labs",
//         domain: "Artificial Intelligence",
//         description: "Join our team to develop state-of-the-art NLP models and predictive analytics for university-industry collaboration.",
//         requiredSkills: ["Python", "TensorFlow", "NLP", "Data Analysis"],
//         duration: "3 Months",
//         deadline: "2025-11-15",
//         stipend: "$400/mo",
//         matchScore: 95, // SRS-11.3 AI Matching
//         isHighlyActive: true, // SRS-20.3 Industry Appreciation
//     },
//     {
//         id: "2",
//         title: "Full Stack Web Developer",
//         company: "TechNova Systems",
//         domain: "Web Development",
//         description: "Looking for an energetic student to help scale our React Native and Node.js infrastructure.",
//         requiredSkills: ["React Native", "Node.js", "MongoDB", "TypeScript"],
//         duration: "6 Months",
//         deadline: "2025-10-20",
//         stipend: "$350/mo",
//         matchScore: 82,
//         isHighlyActive: false,
//     },
//     {
//         id: "3",
//         title: "Cybersecurity Analyst",
//         company: "SecureNet IT",
//         domain: "Cybersecurity",
//         description: "Monitor network traffic and implement security protocols for mid-sized corporate clients.",
//         requiredSkills: ["Network Security", "Linux", "Ethical Hacking"],
//         duration: "4 Months",
//         deadline: "2025-12-01",
//         stipend: "Unpaid",
//         matchScore: 65,
//         isHighlyActive: true,
//     },
// ];

// const DOMAINS = ["All", "Artificial Intelligence", "Web Development", "Cybersecurity", "Mobile Development"];

// const InternshipsScreen = () => {
//     const [search, setSearch] = useState("");
//     const [selectedDomain, setSelectedDomain] = useState("All");
//     const [filteredData, setFilteredData] = useState(MOCK_INTERNSHIPS);
//     const [selectedItem, setSelectedItem] = useState<any>(null);
//     const [detailModalVisible, setDetailModalVisible] = useState(false);
//     const [appliedIds, setAppliedIds] = useState<string[]>([]);

//     // Filter Logic (SRS-12.3 & 12.6)
//     useEffect(() => {
//         let data = MOCK_INTERNSHIPS;
//         if (selectedDomain !== "All") {
//             data = data.filter(item => item.domain === selectedDomain);
//         }
//         if (search) {
//             data = data.filter(item => 
//                 item.title.toLowerCase().includes(search.toLowerCase()) || 
//                 item.company.toLowerCase().includes(search.toLowerCase())
//             );
//         }
//         setFilteredData(data);
//     }, [search, selectedDomain]);

//     // Application Workflow (SRS-13.1)
//     const handleApply = (id: string, title: string) => {
//         Alert.alert(
//             "Confirm Application",
//             `Do you want to apply for ${title}? Your profile and resume will be sent for review (SRS-13.2).`,
//             [
//                 { text: "Cancel", style: "cancel" },
//                 { 
//                     text: "Apply Now", 
//                     onPress: () => {
//                         setAppliedIds([...appliedIds, id]);
//                         setDetailModalVisible(false);
//                         Alert.alert("Success!", "Application sent to Internship Incharge for initial review.");
//                     }
//                 }
//             ]
//         );
//     };

//     const renderInternshipCard = ({ item }: { item: any }) => (
//         <Animatable.View 
//             animation="fadeInUp" 
//             style={[
//                 styles.card, 
//                 item.isHighlyActive && styles.activeIndustryCard // SRS-20.3 Visual recognition
//             ]}
//         >
//             {item.isHighlyActive && (
//                 <View style={styles.topPartnerBadge}>
//                     <MaterialCommunityIcons name="party-popper" size={14} color="#FFF" />
//                     <Text style={styles.topPartnerText}>Top Partner</Text>
//                 </View>
//             )}

//             <View style={styles.cardHeader}>
//                 <View style={{ flex: 1 }}>
//                     <Text style={styles.cardTitle}>{item.title}</Text>
//                     <Text style={styles.cardCompany}>{item.company}</Text>
//                 </View>
//                 {/* SRS-11.4 AI Match Badge */}
//                 <View style={styles.matchBadge}>
//                     <Text style={styles.matchText}>{item.matchScore}% Match</Text>
//                 </View>
//             </View>

//             <View style={styles.domainTag}>
//                 <Text style={styles.domainText}>{item.domain}</Text>
//             </View>

//             <View style={styles.cardFooter}>
//                 <View style={styles.iconInfo}>
//                     <Ionicons name="time-outline" size={16} color="#7F8C8D" />
//                     <Text style={styles.footerText}>{item.duration}</Text>
//                 </View>
//                 <View style={styles.iconInfo}>
//                     <Ionicons name="calendar-outline" size={16} color="#E74C3C" />
//                     <Text style={[styles.footerText, { color: '#E74C3C' }]}>Ends: {item.deadline}</Text>
//                 </View>
//             </View>

//             <TouchableOpacity 
//                 style={styles.viewButton} 
//                 onPress={() => { setSelectedItem(item); setDetailModalVisible(true); }}
//             >
//                 <Text style={styles.viewButtonText}>View Details</Text>
//                 <Ionicons name="chevron-forward" size={16} color="#193648" />
//             </TouchableOpacity>
//         </Animatable.View>
//     );

//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <View style={styles.container}>
//                 {/* Header Section */}
//                 <View style={styles.header}>
//                     <Text style={styles.headerTitle}>Opportunities</Text>
//                     <Text style={styles.headerSubtitle}>AI-Recommended Internships & Projects</Text>
//                 </View>

//                 {/* Search Bar */}
//                 <View style={styles.searchContainer}>
//                     <Ionicons name="search" size={20} color="#BDC3C7" style={{ marginLeft: 10 }} />
//                     <TextInput 
//                         placeholder="Search by role or industry..." 
//                         style={styles.searchInput}
//                         value={search}
//                         onChangeText={setSearch}
//                     />
//                 </View>

//                 {/* Domain Filter (SRS-12.3) */}
//                 <View style={{ maxHeight: 50, marginBottom: 15 }}>
//                     <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20 }}>
//                         {DOMAINS.map((domain) => (
//                             <TouchableOpacity 
//                                 key={domain} 
//                                 style={[styles.filterChip, selectedDomain === domain && styles.activeChip]}
//                                 onPress={() => setSelectedDomain(domain)}
//                             >
//                                 <Text style={[styles.chipText, selectedDomain === domain && styles.activeChipText]}>{domain}</Text>
//                             </TouchableOpacity>
//                         ))}
//                     </ScrollView>
//                 </View>

//                 <FlatList 
//                     data={filteredData}
//                     renderItem={renderInternshipCard}
//                     keyExtractor={item => item.id}
//                     contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
//                 />

//                 {/* Detail Modal (SRS-12.2 Details) */}
//                 <Modal visible={detailModalVisible} animationType="slide" transparent={true}>
//                     <View style={styles.modalOverlay}>
//                         <View style={styles.modalContent}>
//                             <TouchableOpacity style={styles.closeModal} onPress={() => setDetailModalVisible(false)}>
//                                 <Ionicons name="close" size={28} color="#2C3E50" />
//                             </TouchableOpacity>
                            
//                             {selectedItem && (
//                                 <ScrollView showsVerticalScrollIndicator={false}>
//                                     <Text style={styles.modalTitle}>{selectedItem.title}</Text>
//                                     <Text style={styles.modalCompany}>{selectedItem.company}</Text>
                                    
//                                     <View style={styles.divider} />

//                                     <Text style={styles.sectionHeader}>Description & Objectives</Text>
//                                     <Text style={styles.modalDesc}>{selectedItem.description}</Text>

//                                     <Text style={styles.sectionHeader}>Required Skills & Qualifications</Text>
//                                     <View style={styles.skillsContainer}>
//                                         {selectedItem.requiredSkills.map((skill: string, idx: number) => (
//                                             <View key={idx} style={styles.skillBadge}>
//                                                 <Text style={styles.skillText}>{skill}</Text>
//                                             </View>
//                                         ))}
//                                     </View>

//                                     <View style={styles.modalInfoRow}>
//                                         <View>
//                                             <Text style={styles.infoLabel}>Duration</Text>
//                                             <Text style={styles.infoVal}>{selectedItem.duration}</Text>
//                                         </View>
//                                         <View>
//                                             <Text style={styles.infoLabel}>Stipend</Text>
//                                             <Text style={styles.infoVal}>{selectedItem.stipend}</Text>
//                                         </View>
//                                         <View>
//                                             <Text style={styles.infoLabel}>Deadline</Text>
//                                             <Text style={[styles.infoVal, {color: '#E74C3C'}]}>{selectedItem.deadline}</Text>
//                                         </View>
//                                     </View>

//                                     {appliedIds.includes(selectedItem.id) ? (
//                                         <View style={styles.appliedBtn}>
//                                             <Ionicons name="checkmark-circle" size={20} color="#27AE60" />
//                                             <Text style={styles.appliedBtnText}>Application Submitted</Text>
//                                         </View>
//                                     ) : (
//                                         <TouchableOpacity 
//                                             style={styles.applyButton} 
//                                             onPress={() => handleApply(selectedItem.id, selectedItem.title)}
//                                         >
//                                             <Text style={styles.applyButtonText}>Apply Now</Text>
//                                         </TouchableOpacity>
//                                     )}
//                                 </ScrollView>
//                             )}
//                         </View>
//                     </View>
//                 </Modal>
//             </View>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     safeArea: { flex: 1, backgroundColor: "#F7F9FC" },
//     container: { flex: 1 },
//     header: { padding: 20 },
//     headerTitle: { fontSize: 28, fontWeight: "bold", color: "#193648" },
//     headerSubtitle: { fontSize: 14, color: "#7F8C8D", marginTop: 4 },
//     searchContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#FFF',
//         marginHorizontal: 20,
//         borderRadius: 12,
//         paddingHorizontal: 10,
//         marginBottom: 15,
//         elevation: 3,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//     },
//     searchInput: { flex: 1, height: 45, paddingLeft: 10, fontSize: 15 },
//     filterChip: {
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//         backgroundColor: '#FFF',
//         borderRadius: 20,
//         marginRight: 10,
//         borderWidth: 1,
//         borderColor: '#EAECEF'
//     },
//     activeChip: { backgroundColor: '#193648', borderColor: '#193648' },
//     chipText: { color: '#7F8C8D', fontWeight: '600' },
//     activeChipText: { color: '#FFF' },
//     card: {
//         backgroundColor: '#FFF',
//         borderRadius: 15,
//         padding: 16,
//         marginBottom: 15,
//         elevation: 4,
//         shadowColor: "#000",
//         shadowOpacity: 0.1,
//         shadowRadius: 5,
//     },
//     activeIndustryCard: {
//         borderWidth: 2,
//         borderColor: '#F1C40F', // Golden border for recognition
//     },
//     topPartnerBadge: {
//         position: 'absolute',
//         top: -10,
//         right: 15,
//         backgroundColor: '#F1C40F',
//         flexDirection: 'row',
//         paddingHorizontal: 10,
//         paddingVertical: 4,
//         borderRadius: 10,
//         alignItems: 'center'
//     },
//     topPartnerText: { color: '#FFF', fontSize: 10, fontWeight: 'bold', marginLeft: 4 },
//     cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
//     cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50' },
//     cardCompany: { fontSize: 14, color: '#7F8C8D' },
//     matchBadge: { backgroundColor: '#E8F6F3', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
//     matchText: { color: '#27AE60', fontSize: 12, fontWeight: 'bold' },
//     domainTag: { backgroundColor: '#F4F7F6', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 5, marginBottom: 12 },
//     domainText: { fontSize: 12, color: '#193648', fontWeight: '600' },
//     cardFooter: { flexDirection: 'row', marginBottom: 15 },
//     iconInfo: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
//     footerText: { fontSize: 13, color: '#7F8C8D', marginLeft: 5 },
//     viewButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderTopWidth: 1, borderTopColor: '#F4F7F6', paddingTop: 12 },
//     viewButtonText: { color: '#193648', fontWeight: 'bold', marginRight: 5 },
//     modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
//     modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25, maxHeight: '85%' },
//     closeModal: { alignSelf: 'flex-end', marginBottom: 10 },
//     modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#193648' },
//     modalCompany: { fontSize: 18, color: '#7F8C8D', marginBottom: 15 },
//     divider: { height: 1, backgroundColor: '#EAECEF', marginBottom: 20 },
//     sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50', marginBottom: 8, marginTop: 10 },
//     modalDesc: { fontSize: 15, color: '#5D6D7E', lineHeight: 22 },
//     skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 },
//     skillBadge: { backgroundColor: '#F2F4F4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8, marginBottom: 8 },
//     skillText: { fontSize: 13, color: '#2C3E50' },
//     modalInfoRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F8F9F9', padding: 15, borderRadius: 12, marginVertical: 20 },
//     infoLabel: { fontSize: 12, color: '#7F8C8D', marginBottom: 4 },
//     infoVal: { fontSize: 15, fontWeight: 'bold', color: '#193648' },
//     applyButton: { backgroundColor: '#193648', paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
//     applyButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
//     appliedBtn: { flexDirection: 'row', backgroundColor: '#E8F6F3', paddingVertical: 15, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
//     appliedBtnText: { color: '#27AE60', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
// });

// export default InternshipsScreen;







// import React, { useState, useEffect } from "react";
// import {
//     View,
//     Text,
//     StyleSheet,
//     ScrollView,
//     TouchableOpacity,
//     TextInput,
//     FlatList,
//     Modal,
//     Alert,
//     SafeAreaView,
//     Dimensions,
//     Image,
//     ImageBackground,
// } from "react-native";
// import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
// import * as Animatable from "react-native-animatable";

// const { width, height } = Dimensions.get("window");

// // --- MOCK DATA (Enriched for Professional Look) ---
// const MOCK_INTERNSHIPS = [
//     {
//         id: "1",
//         title: "AI & ML Research Intern",
//         company: "CollaXion AI Labs",
//         domain: "Artificial Intelligence",
//         image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
//         logo: "https://cdn-icons-png.flaticon.com/512/2103/2103633.png",
//         description: "Develop cutting-edge NLP models to analyze university-industry collaboration trends. You will work directly with our data science team.",
//         requiredSkills: ["Python", "TensorFlow", "NLP", "Scikit-Learn"],
//         duration: "3 Months",
//         deadline: "2025-12-05",
//         stipend: "$500/mo",
//         matchScore: 0.95, // SRS-11.3
//         isHighlyActive: true, // SRS-20.3 Visual Effect
//     },
//     {
//         id: "2",
//         title: "Senior Web Developer",
//         company: "FinTech Global",
//         domain: "Web Development",
//         image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
//         logo: "https://cdn-icons-png.flaticon.com/512/5968/5968292.png",
//         description: "Join our core engineering team to build scalable financial dashboards using React and Node.js.",
//         requiredSkills: ["React", "Node.js", "PostgreSQL", "Tailwind"],
//         duration: "6 Months",
//         deadline: "2025-11-20",
//         stipend: "$400/mo",
//         matchScore: 0.78,
//         isHighlyActive: false,
//     },
//     {
//         id: "3",
//         title: "Cyber Security Analyst",
//         company: "SafeNet Systems",
//         domain: "Cybersecurity",
//         image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
//         logo: "https://cdn-icons-png.flaticon.com/512/1055/1055651.png",
//         description: "Perform vulnerability assessments and monitor network traffic for security breaches.",
//         requiredSkills: ["Ethical Hacking", "Linux", "Wireshark"],
//         duration: "4 Months",
//         deadline: "2025-11-15",
//         stipend: "Unpaid",
//         matchScore: 0.62,
//         isHighlyActive: true,
//     },
// ];

// const DOMAINS = ["All", "Artificial Intelligence", "Web Development", "Cybersecurity", "Mobile Development"];

// const InternshipsScreen = () => {
//     const [search, setSearch] = useState("");
//     const [selectedDomain, setSelectedDomain] = useState("All");
//     const [filteredData, setFilteredData] = useState(MOCK_INTERNSHIPS);
//     const [selectedItem, setSelectedItem] = useState<any>(null);
//     const [detailModalVisible, setDetailModalVisible] = useState(false);
//     const [appliedIds, setAppliedIds] = useState<string[]>([]);

//     useEffect(() => {
//         let data = MOCK_INTERNSHIPS;
//         if (selectedDomain !== "All") data = data.filter(item => item.domain === selectedDomain);
//         if (search) {
//             data = data.filter(item => 
//                 item.title.toLowerCase().includes(search.toLowerCase()) || 
//                 item.company.toLowerCase().includes(search.toLowerCase())
//             );
//         }
//         setFilteredData(data);
//     }, [search, selectedDomain]);

//     const handleApply = (id: string, title: string) => {
//         Alert.alert(
//             "Submit Application",
//             `Are you sure you want to apply for "${title}"? (SRS-13.1)`,
//             [
//                 { text: "Cancel", style: "cancel" },
//                 { 
//                     text: "Apply", 
//                     onPress: () => {
//                         setAppliedIds([...appliedIds, id]);
//                         setDetailModalVisible(false);
//                         Alert.alert("🎉 Success!", "Application forwarded to Internship Incharge.");
//                     }
//                 }
//             ]
//         );
//     };

//     const renderInternshipCard = ({ item }: { item: any }) => (
//         <Animatable.View 
//             animation="fadeInUp" 
//             style={[styles.card, item.isHighlyActive && styles.activeIndustryGlow]}
//         >
//             <Image source={{ uri: item.image }} style={styles.cardImage} />
            
//             {item.isHighlyActive && (
//                 <View style={styles.activeBadge}>
//                     <MaterialCommunityIcons name="star-face" size={14} color="#FFF" />
//                     <Text style={styles.activeBadgeText}>Top Industry</Text>
//                 </View>
//             )}

//             <View style={styles.cardContent}>
//                 <View style={styles.cardHeader}>
//                     <Image source={{ uri: item.logo }} style={styles.companyLogo} />
//                     <View style={{ flex: 1, marginLeft: 12 }}>
//                         <Text style={styles.cardTitle}>{item.title}</Text>
//                         <Text style={styles.cardCompany}>{item.company}</Text>
//                     </View>
//                 </View>

//                 {/* SRS-11.3 AI Matching Visual */}
//                 <View style={styles.aiMatchContainer}>
//                     <View style={styles.aiMatchHeader}>
//                         <Text style={styles.aiMatchTitle}>AI Compatibility</Text>
//                         <Text style={styles.aiMatchPercent}>{Math.round(item.matchScore * 100)}%</Text>
//                     </View>
//                     <View style={styles.progressBarBg}>
//                         <View style={[styles.progressBarFill, { width: `${item.matchScore * 100}%` }]} />
//                     </View>
//                 </View>

//                 <View style={styles.tagRow}>
//                     <View style={styles.domainTag}><Text style={styles.domainText}>{item.domain}</Text></View>
//                     <View style={styles.stipendTag}><Text style={styles.stipendText}>{item.stipend}</Text></View>
//                 </View>

//                 <TouchableOpacity 
//                     style={styles.detailsBtn} 
//                     onPress={() => { setSelectedItem(item); setDetailModalVisible(true); }}
//                 >
//                     <Text style={styles.detailsBtnText}>View Opportunity</Text>
//                     <Ionicons name="arrow-forward" size={18} color="#FFF" />
//                 </TouchableOpacity>
//             </View>
//         </Animatable.View>
//     );

//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <ScrollView stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
//                 {/* Hero Section */}
//                 <ImageBackground 
//                     source={{ uri: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop' }}
//                     style={styles.hero}
//                 >
//                     <View style={styles.heroOverlay}>
//                         <Text style={styles.heroTitle}>Your Future Starts Here</Text>
//                         <Text style={styles.heroSubtitle}>Explore AI-matched internships curated for your skills.</Text>
//                     </View>
//                 </ImageBackground>

//                 {/* Sticky Search & Filter */}
//                 <View style={styles.filterSection}>
//                     <View style={styles.searchBar}>
//                         <Ionicons name="search" size={20} color="#95A5A6" />
//                         <TextInput 
//                             placeholder="Search industries..." 
//                             style={styles.searchInput}
//                             value={search}
//                             onChangeText={setSearch}
//                         />
//                     </View>
//                     <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.domainScroll}>
//                         {DOMAINS.map(d => (
//                             <TouchableOpacity 
//                                 key={d} 
//                                 style={[styles.chip, selectedDomain === d && styles.activeChip]}
//                                 onPress={() => setSelectedDomain(d)}
//                             >
//                                 <Text style={[styles.chipText, selectedDomain === d && styles.activeChipText]}>{d}</Text>
//                             </TouchableOpacity>
//                         ))}
//                     </ScrollView>
//                 </View>

//                 {/* List */}
//                 <FlatList 
//                     data={filteredData}
//                     renderItem={renderInternshipCard}
//                     keyExtractor={item => item.id}
//                     scrollEnabled={false}
//                     contentContainerStyle={{ padding: 20 }}
//                 />
//             </ScrollView>

//             {/* SRS-12.2 Detail Modal */}
//             <Modal visible={detailModalVisible} animationType="slide">
//                 <SafeAreaView style={{ flex: 1 }}>
//                     {selectedItem && (
//                         <View style={styles.modalRoot}>
//                             <TouchableOpacity style={styles.closeBtn} onPress={() => setDetailModalVisible(false)}>
//                                 <Ionicons name="close-circle" size={35} color="#193648" />
//                             </TouchableOpacity>
//                             <ScrollView>
//                                 <Image source={{ uri: selectedItem.image }} style={styles.modalImg} />
//                                 <View style={styles.modalPadding}>
//                                     <Text style={styles.modalTitle}>{selectedItem.title}</Text>
//                                     <View style={styles.modalCompanyRow}>
//                                         <Image source={{ uri: selectedItem.logo }} style={styles.modalLogo} />
//                                         <Text style={styles.modalCompanyName}>{selectedItem.company}</Text>
//                                     </View>

//                                     <View style={styles.divider} />
                                    
//                                     <Text style={styles.sectionTitle}>Job Description</Text>
//                                     <Text style={styles.sectionBody}>{selectedItem.description}</Text>

//                                     <Text style={styles.sectionTitle}>Required Skills (SRS-12.2)</Text>
//                                     <View style={styles.skillCloud}>
//                                         {selectedItem.requiredSkills.map((s: string) => (
//                                             <View key={s} style={styles.skillItem}><Text style={styles.skillTextSmall}>{s}</Text></View>
//                                         ))}
//                                     </View>

//                                     <View style={styles.statsGrid}>
//                                         <View style={styles.statBox}>
//                                             <Text style={styles.statLabel}>Duration</Text>
//                                             <Text style={styles.statVal}>{selectedItem.duration}</Text>
//                                         </View>
//                                         <View style={styles.statBox}>
//                                             <Text style={styles.statLabel}>Deadline</Text>
//                                             <Text style={[styles.statVal, {color: '#E74C3C'}]}>{selectedItem.deadline}</Text>
//                                         </View>
//                                     </View>

//                                     {appliedIds.includes(selectedItem.id) ? (
//                                         <View style={styles.appliedState}>
//                                             <Ionicons name="checkmark-circle" size={24} color="#27AE60" />
//                                             <Text style={styles.appliedText}>Applied Successfully</Text>
//                                         </View>
//                                     ) : (
//                                         <TouchableOpacity 
//                                             style={styles.mainApplyBtn} 
//                                             onPress={() => handleApply(selectedItem.id, selectedItem.title)}
//                                         >
//                                             <Text style={styles.mainApplyBtnText}>Submit Application</Text>
//                                         </TouchableOpacity>
//                                     )}
//                                 </View>
//                             </ScrollView>
//                         </View>
//                     )}
//                 </SafeAreaView>
//             </Modal>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     safeArea: { flex: 1, backgroundColor: "#FFF" },
//     hero: { width: '100%', height: 220 },
//     heroOverlay: { flex: 1, backgroundColor: 'rgba(25, 54, 72, 0.7)', justifyContent: 'center', padding: 25 },
//     heroTitle: { fontSize: 32, fontWeight: 'bold', color: '#FFF' },
//     heroSubtitle: { fontSize: 16, color: '#D1D5DB', marginTop: 8 },
//     filterSection: { backgroundColor: '#FFF', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F2F2F2', elevation: 2 },
//     searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F4F7F6', marginHorizontal: 20, borderRadius: 12, paddingHorizontal: 15, height: 50 },
//     searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
//     domainScroll: { marginTop: 15, paddingLeft: 20 },
//     chip: { paddingHorizontal: 18, paddingVertical: 8, backgroundColor: '#FFF', borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#D1D5DB' },
//     activeChip: { backgroundColor: '#193648', borderColor: '#193648' },
//     chipText: { color: '#7F8C8D', fontWeight: '600' },
//     activeChipText: { color: '#FFF' },
//     card: { backgroundColor: '#FFF', borderRadius: 20, marginBottom: 25, overflow: 'hidden', elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
//     activeIndustryGlow: { borderWidth: 2, borderColor: '#F1C40F' },
//     cardImage: { width: '100%', height: 160 },
//     activeBadge: { position: 'absolute', top: 15, right: 15, backgroundColor: '#F1C40F', flexDirection: 'row', padding: 6, borderRadius: 8, alignItems: 'center' },
//     activeBadgeText: { color: '#FFF', fontSize: 11, fontWeight: 'bold', marginLeft: 4 },
//     cardContent: { padding: 18 },
//     companyLogo: { width: 45, height: 45, borderRadius: 10 },
//     cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50' },
//     cardCompany: { fontSize: 15, color: '#7F8C8D' },
//     cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
//     aiMatchContainer: { marginVertical: 10 },
//     aiMatchHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
//     aiMatchTitle: { fontSize: 13, color: '#193648', fontWeight: '700' },
//     aiMatchPercent: { fontSize: 13, color: '#27AE60', fontWeight: 'bold' },
//     progressBarBg: { height: 6, backgroundColor: '#EAECEF', borderRadius: 3 },
//     progressBarFill: { height: '100%', backgroundColor: '#27AE60', borderRadius: 3 },
//     tagRow: { flexDirection: 'row', marginVertical: 15 },
//     domainTag: { backgroundColor: '#EBF5FB', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginRight: 10 },
//     domainText: { color: '#2980B9', fontSize: 12, fontWeight: 'bold' },
//     stipendTag: { backgroundColor: '#E8F8F5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
//     stipendText: { color: '#16A085', fontSize: 12, fontWeight: 'bold' },
//     detailsBtn: { backgroundColor: '#193648', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 12 },
//     detailsBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginRight: 10 },
//     modalRoot: { flex: 1, backgroundColor: '#FFF' },
//     closeBtn: { position: 'absolute', top: 20, right: 20, zIndex: 10 },
//     modalImg: { width: '100%', height: 250 },
//     modalPadding: { padding: 25 },
//     modalTitle: { fontSize: 28, fontWeight: 'bold', color: '#193648' },
//     modalCompanyRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 15 },
//     modalLogo: { width: 40, height: 40, borderRadius: 8 },
//     modalCompanyName: { fontSize: 18, color: '#7F8C8D', marginLeft: 12 },
//     divider: { height: 1, backgroundColor: '#F2F2F2', marginVertical: 20 },
//     sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50', marginBottom: 10 },
//     sectionBody: { fontSize: 16, color: '#5D6D7E', lineHeight: 24, marginBottom: 20 },
//     skillCloud: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
//     skillItem: { backgroundColor: '#F4F7F6', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 10, marginBottom: 10 },
//     skillTextSmall: { color: '#193648', fontWeight: '600' },
//     statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
//     statBox: { width: '48%', backgroundColor: '#F9FAFB', padding: 15, borderRadius: 15 },
//     statLabel: { fontSize: 12, color: '#7F8C8D', marginBottom: 5 },
//     statVal: { fontSize: 16, fontWeight: 'bold', color: '#193648' },
//     mainApplyBtn: { backgroundColor: '#193648', paddingVertical: 18, borderRadius: 15, alignItems: 'center' },
//     mainApplyBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
//     appliedState: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18 },
//     appliedText: { fontSize: 18, fontWeight: 'bold', color: '#27AE60', marginLeft: 10 }
// });

// export default InternshipsScreen;





// import React, { useState, useEffect, useCallback } from "react";
// import {
//     View,
//     Text,
//     StyleSheet,
//     ScrollView,
//     TouchableOpacity,
//     TextInput,
//     FlatList,
//     Modal,
//     Alert,
//     SafeAreaView,
//     Dimensions,
//     Image,
//     ImageBackground,
//     ActivityIndicator,
// } from "react-native";
// import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
// import * as Animatable from "react-native-animatable";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import { useFocusEffect } from "@react-navigation/native";
// import { CONSTANT } from "@/constants/constant";

// const { width } = Dimensions.get("window");

// const DOMAINS = [
//     "All",
//     "Artificial Intelligence",
//     "Web Development",
//     "Mobile Development",
//     "Cybersecurity",
//     "Data Science",
//     "DevOps",
//     "Backend Development",
//     "Design",
//     "Cloud Computing",
//     "Game Development",
// ];

// // Calculates match % between student skills and required skills
// const calculateMatch = (studentSkills: string[], requiredSkills: string[]): number => {
//     if (!studentSkills?.length || !requiredSkills?.length) return 0;
//     const sLower = studentSkills.map((s) => s.toLowerCase());
//     const rLower = requiredSkills.map((s) => s.toLowerCase());
//     const matched = rLower.filter((r) =>
//         sLower.some((s) => s.includes(r) || r.includes(s))
//     );
//     return Math.round((matched.length / rLower.length) * 100);
// };

// const getMatchColor = (score: number) => {
//     if (score >= 70) return "#059669";
//     if (score >= 40) return "#D97706";
//     return "#6B7280";
// };

// const InternshipsScreen = () => {
//     const [search, setSearch] = useState("");
//     const [selectedDomain, setSelectedDomain] = useState("All");
//     const [allInternships, setAllInternships] = useState<any[]>([]);
//     const [filteredData, setFilteredData] = useState<any[]>([]);
//     const [selectedItem, setSelectedItem] = useState<any>(null);
//     const [detailModalVisible, setDetailModalVisible] = useState(false);
//     const [appliedIds, setAppliedIds] = useState<string[]>([]);
//     const [studentSkills, setStudentSkills] = useState<string[]>([]);
//     const [studentEmail, setStudentEmail] = useState<string>("");
//     const [loading, setLoading] = useState(true);
//     const [applying, setApplying] = useState(false);
//     const [applicationCount, setApplicationCount] = useState(0);
//     const [coverLetter, setCoverLetter] = useState("");
//     const [showCoverLetter, setShowCoverLetter] = useState(false);

//     useFocusEffect(
//         useCallback(() => {
//             loadStudentAndInternships();
//         }, [])
//     );

//     const loadStudentAndInternships = async () => {
//         setLoading(true);
//         try {
//             const email = await AsyncStorage.getItem("studentEmail");
//             if (!email) return;
//             setStudentEmail(email);

//             // Load student skills + current applications in parallel
//             const [studentRes, internshipsRes, appsRes] = await Promise.all([
//                 axios.get(`${CONSTANT.API_BASE_URL}/api/student/getStudent/${email}`),
//                 axios.get(`${CONSTANT.API_BASE_URL}/api/internships`),
//                 axios.get(`${CONSTANT.API_BASE_URL}/api/applications/${email}`),
//             ]);

//             const skills: string[] = studentRes.data?.extractedSkills || [];
//             setStudentSkills(skills);

//             // Tag each internship with match score
//             const internships = internshipsRes.data.map((item: any) => ({
//                 ...item,
//                 matchScore: calculateMatch(skills, item.requiredSkills),
//             }));

//             // Sort by match score descending
//             internships.sort((a: any, b: any) => b.matchScore - a.matchScore);
//             setAllInternships(internships);
//             setFilteredData(internships);

//             // Track already applied
//             const alreadyApplied = appsRes.data.map((app: any) =>
//                 app.internshipId?._id || app.internshipId
//             );
//             setAppliedIds(alreadyApplied);
//             setApplicationCount(appsRes.data.length);
//         } catch (err) {
//             console.log("Error loading internships:", err);
//             Alert.alert("Error", "Failed to load internships. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Filter whenever search/domain changes
//     useEffect(() => {
//         let data = [...allInternships];
//         if (selectedDomain !== "All") {
//             data = data.filter((item) => item.domain === selectedDomain);
//         }
//         if (search.trim()) {
//             const q = search.toLowerCase();
//             data = data.filter(
//                 (item) =>
//                     item.title?.toLowerCase().includes(q) ||
//                     item.company?.toLowerCase().includes(q) ||
//                     item.domain?.toLowerCase().includes(q)
//             );
//         }
//         setFilteredData(data);
//     }, [search, selectedDomain, allInternships]);

//     const handleApply = async () => {
//         if (!selectedItem) return;
//         if (appliedIds.includes(selectedItem._id)) {
//             Alert.alert("Already Applied", "You have already applied for this internship.");
//             return;
//         }
//         setShowCoverLetter(true);
//     };

//     const submitApplication = async () => {
//         if (!selectedItem || !studentEmail) return;
//         setApplying(true);
//         try {
//             await axios.post(`${CONSTANT.API_BASE_URL}/api/internships/apply`, {
//                 studentEmail,
//                 internshipId: selectedItem._id,
//                 coverLetter: coverLetter.trim() || "I am interested in this internship opportunity.",
//             });

//             // Update local state immediately
//             setAppliedIds((prev) => [...prev, selectedItem._id]);
//             setApplicationCount((prev) => prev + 1);
//             setShowCoverLetter(false);
//             setCoverLetter("");
//             setDetailModalVisible(false);

//             Alert.alert(
//                 "🎉 Application Submitted!",
//                 `Your application for "${selectedItem.title}" at ${selectedItem.company} has been submitted successfully. You can track its status in My Applications.`
//             );
//         } catch (err: any) {
//             const msg = err?.response?.data?.error || "Failed to submit application.";
//             Alert.alert("Error", msg);
//         } finally {
//             setApplying(false);
//         }
//     };

//     const renderSkillBadge = (skill: string, isMatched: boolean) => (
//         <View
//             key={skill}
//             style={[styles.skillItem, isMatched && styles.skillItemMatched]}
//         >
//             {isMatched && (
//                 <MaterialCommunityIcons name="check-circle" size={11} color="#059669" style={{ marginRight: 3 }} />
//             )}
//             <Text style={[styles.skillText, isMatched && styles.skillTextMatched]}>
//                 {skill}
//             </Text>
//         </View>
//     );

//     const renderInternshipCard = ({ item }: { item: any }) => {
//         const isApplied = appliedIds.includes(item._id);
//         const matchColor = getMatchColor(item.matchScore);
//         const isHighMatch = item.matchScore >= 70;
//         const studentSkillsLower = studentSkills.map((s) => s.toLowerCase());

//         return (
//             <Animatable.View
//                 animation="fadeInUp"
//                 style={[styles.card, isHighMatch && styles.highMatchCard]}
//             >
//                 {isHighMatch && (
//                     <View style={styles.topMatchBadge}>
//                         <MaterialCommunityIcons name="star" size={12} color="#FFF" />
//                         <Text style={styles.topMatchText}>Top Match</Text>
//                     </View>
//                 )}

//                 <View style={styles.cardContent}>
//                     <View style={styles.cardHeader}>
//                         <Image
//                             source={{ uri: item.logo || "https://img.icons8.com/color/96/briefcase.png" }}
//                             style={styles.companyLogo}
//                         />
//                         <View style={{ flex: 1, marginLeft: 12 }}>
//                             <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
//                             <Text style={styles.cardCompany}>{item.company}</Text>
//                             <View style={styles.locationRow}>
//                                 <Ionicons name="location-outline" size={12} color="#9CA3AF" />
//                                 <Text style={styles.locationText}>{item.location}</Text>
//                             </View>
//                         </View>
//                     </View>

//                     {/* AI Match Score */}
//                     <View style={styles.aiMatchContainer}>
//                         <View style={styles.aiMatchHeader}>
//                             <View style={{ flexDirection: "row", alignItems: "center" }}>
//                                 <MaterialCommunityIcons name="brain" size={14} color="#193648" />
//                                 <Text style={styles.aiMatchTitle}> Skill Match</Text>
//                             </View>
//                             <Text style={[styles.aiMatchPercent, { color: matchColor }]}>
//                                 {item.matchScore}%
//                             </Text>
//                         </View>
//                         <View style={styles.progressBarBg}>
//                             <View
//                                 style={[
//                                     styles.progressBarFill,
//                                     {
//                                         width: `${Math.max(item.matchScore, 5)}%`,
//                                         backgroundColor: matchColor,
//                                     },
//                                 ]}
//                             />
//                         </View>
//                         {studentSkills.length === 0 && (
//                             <Text style={styles.noSkillsHint}>
//                                 Upload your CV to see skill matching
//                             </Text>
//                         )}
//                     </View>

//                     {/* Tags */}
//                     <View style={styles.tagRow}>
//                         <View style={styles.domainTag}>
//                             <Text style={styles.domainText}>{item.domain}</Text>
//                         </View>
//                         <View style={styles.typeTag}>
//                             <Text style={styles.typeText}>{item.type}</Text>
//                         </View>
//                         <View style={styles.stipendTag}>
//                             <Text style={styles.stipendText}>{item.stipend}</Text>
//                         </View>
//                     </View>

//                     {/* Skills preview */}
//                     <View style={styles.skillsRow}>
//                         {item.requiredSkills?.slice(0, 4).map((skill: string) => {
//                             const matched = studentSkillsLower.some(
//                                 (s) => s.includes(skill.toLowerCase()) || skill.toLowerCase().includes(s)
//                             );
//                             return renderSkillBadge(skill, matched);
//                         })}
//                         {item.requiredSkills?.length > 4 && (
//                             <View style={styles.skillItem}>
//                                 <Text style={styles.skillText}>+{item.requiredSkills.length - 4}</Text>
//                             </View>
//                         )}
//                     </View>

//                     <TouchableOpacity
//                         style={[styles.detailsBtn, isApplied && styles.appliedBtn]}
//                         onPress={() => {
//                             setSelectedItem(item);
//                             setDetailModalVisible(true);
//                         }}
//                     >
//                         {isApplied ? (
//                             <>
//                                 <Ionicons name="checkmark-circle" size={18} color="#059669" />
//                                 <Text style={[styles.detailsBtnText, { color: "#059669" }]}>
//                                     Applied
//                                 </Text>
//                             </>
//                         ) : (
//                             <>
//                                 <Text style={styles.detailsBtnText}>View & Apply</Text>
//                                 <Ionicons name="arrow-forward" size={18} color="#FFF" />
//                             </>
//                         )}
//                     </TouchableOpacity>
//                 </View>
//             </Animatable.View>
//         );
//     };

//     const studentSkillsLower = studentSkills.map((s) => s.toLowerCase());

//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <ScrollView stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
//                 {/* Hero */}
//                 <ImageBackground
//                     source={{
//                         uri: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop",
//                     }}
//                     style={styles.hero}
//                 >
//                     <View style={styles.heroOverlay}>
//                         <Text style={styles.heroTitle}>Matched For You</Text>
//                         <Text style={styles.heroSubtitle}>
//                             {studentSkills.length > 0
//                                 ? `Showing internships based on ${studentSkills.length} skills from your CV`
//                                 : "Upload your CV to unlock skill-matched internships"}
//                         </Text>
//                         {/* Application count badge */}
//                         <View style={styles.appCountBadge}>
//                             <MaterialCommunityIcons name="briefcase-check" size={16} color="#FFF" />
//                             <Text style={styles.appCountText}>
//                                 {applicationCount} Application{applicationCount !== 1 ? "s" : ""} Submitted
//                             </Text>
//                         </View>
//                     </View>
//                 </ImageBackground>

//                 {/* Sticky Filter */}
//                 <View style={styles.filterSection}>
//                     <View style={styles.searchBar}>
//                         <Ionicons name="search" size={20} color="#95A5A6" />
//                         <TextInput
//                             placeholder="Search by title, company, domain..."
//                             style={styles.searchInput}
//                             value={search}
//                             onChangeText={setSearch}
//                             placeholderTextColor="#9CA3AF"
//                         />
//                         {search.length > 0 && (
//                             <TouchableOpacity onPress={() => setSearch("")}>
//                                 <Ionicons name="close-circle" size={18} color="#9CA3AF" />
//                             </TouchableOpacity>
//                         )}
//                     </View>
//                     <ScrollView
//                         horizontal
//                         showsHorizontalScrollIndicator={false}
//                         style={styles.domainScroll}
//                         contentContainerStyle={{ paddingRight: 20 }}
//                     >
//                         {DOMAINS.map((d) => (
//                             <TouchableOpacity
//                                 key={d}
//                                 style={[styles.chip, selectedDomain === d && styles.activeChip]}
//                                 onPress={() => setSelectedDomain(d)}
//                             >
//                                 <Text style={[styles.chipText, selectedDomain === d && styles.activeChipText]}>
//                                     {d}
//                                 </Text>
//                             </TouchableOpacity>
//                         ))}
//                     </ScrollView>
//                 </View>

//                 {/* Results */}
//                 {loading ? (
//                     <View style={{ paddingTop: 60, alignItems: "center" }}>
//                         <ActivityIndicator size="large" color="#193648" />
//                         <Text style={{ marginTop: 12, color: "#6B7280" }}>
//                             Loading matched internships...
//                         </Text>
//                     </View>
//                 ) : filteredData.length === 0 ? (
//                     <View style={styles.emptyState}>
//                         <MaterialCommunityIcons name="briefcase-off" size={64} color="#D1D5DB" />
//                         <Text style={styles.emptyTitle}>No Internships Found</Text>
//                         <Text style={styles.emptySubText}>
//                             Try a different domain or search term
//                         </Text>
//                     </View>
//                 ) : (
//                     <>
//                         <View style={styles.resultsHeader}>
//                             <Text style={styles.resultsCount}>
//                                 {filteredData.length} Opportunit{filteredData.length !== 1 ? "ies" : "y"}
//                             </Text>
//                             {studentSkills.length > 0 && (
//                                 <Text style={styles.sortedByText}>Sorted by skill match</Text>
//                             )}
//                         </View>
//                         <FlatList
//                             data={filteredData}
//                             renderItem={renderInternshipCard}
//                             keyExtractor={(item) => item._id}
//                             scrollEnabled={false}
//                             contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}
//                         />
//                     </>
//                 )}
//             </ScrollView>

//             {/* Detail Modal */}
//             <Modal visible={detailModalVisible} animationType="slide">
//                 <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
//                     {selectedItem && (
//                         <View style={styles.modalRoot}>
//                             <TouchableOpacity
//                                 style={styles.closeBtn}
//                                 onPress={() => {
//                                     setDetailModalVisible(false);
//                                     setShowCoverLetter(false);
//                                     setCoverLetter("");
//                                 }}
//                             >
//                                 <Ionicons name="close-circle" size={36} color="#193648" />
//                             </TouchableOpacity>

//                             <ScrollView showsVerticalScrollIndicator={false}>
//                                 {/* Header banner */}
//                                 <View style={styles.modalBanner}>
//                                     <Image
//                                         source={{
//                                             uri: selectedItem.logo ||
//                                                 "https://img.icons8.com/color/96/briefcase.png",
//                                         }}
//                                         style={styles.modalLogo}
//                                     />
//                                     <Text style={styles.modalTitle}>{selectedItem.title}</Text>
//                                     <Text style={styles.modalCompany}>{selectedItem.company}</Text>
//                                     <View style={styles.modalLocationRow}>
//                                         <Ionicons name="location" size={14} color="rgba(255,255,255,0.8)" />
//                                         <Text style={styles.modalLocationText}>{selectedItem.location}</Text>
//                                     </View>
//                                 </View>

//                                 <View style={styles.modalBody}>
//                                     {/* Match Score */}
//                                     <View style={styles.matchCard}>
//                                         <MaterialCommunityIcons name="brain" size={22} color="#193648" />
//                                         <View style={{ flex: 1, marginLeft: 12 }}>
//                                             <Text style={styles.matchCardTitle}>
//                                                 Your Skill Match: {selectedItem.matchScore}%
//                                             </Text>
//                                             <View style={styles.progressBarBg}>
//                                                 <View
//                                                     style={[
//                                                         styles.progressBarFill,
//                                                         {
//                                                             width: `${Math.max(selectedItem.matchScore, 5)}%`,
//                                                             backgroundColor: getMatchColor(selectedItem.matchScore),
//                                                         },
//                                                     ]}
//                                                 />
//                                             </View>
//                                         </View>
//                                     </View>

//                                     {/* Stats */}
//                                     <View style={styles.statsGrid}>
//                                         <View style={styles.statBox}>
//                                             <MaterialCommunityIcons name="clock-outline" size={18} color="#193648" />
//                                             <Text style={styles.statLabel}>Duration</Text>
//                                             <Text style={styles.statVal}>{selectedItem.duration}</Text>
//                                         </View>
//                                         <View style={styles.statBox}>
//                                             <MaterialCommunityIcons name="cash" size={18} color="#193648" />
//                                             <Text style={styles.statLabel}>Stipend</Text>
//                                             <Text style={styles.statVal}>{selectedItem.stipend}</Text>
//                                         </View>
//                                         <View style={styles.statBox}>
//                                             <MaterialCommunityIcons name="office-building" size={18} color="#193648" />
//                                             <Text style={styles.statLabel}>Type</Text>
//                                             <Text style={styles.statVal}>{selectedItem.type}</Text>
//                                         </View>
//                                         <View style={styles.statBox}>
//                                             <MaterialCommunityIcons name="calendar" size={18} color="#E74C3C" />
//                                             <Text style={styles.statLabel}>Deadline</Text>
//                                             <Text style={[styles.statVal, { color: "#E74C3C", fontSize: 12 }]}>
//                                                 {selectedItem.deadline
//                                                     ? new Date(selectedItem.deadline).toDateString()
//                                                     : "Open"}
//                                             </Text>
//                                         </View>
//                                     </View>

//                                     {/* Description */}
//                                     <Text style={styles.sectionTitle}>About the Role</Text>
//                                     <Text style={styles.sectionBody}>{selectedItem.description}</Text>

//                                     {/* Requirements */}
//                                     {selectedItem.requirements && (
//                                         <>
//                                             <Text style={styles.sectionTitle}>Requirements</Text>
//                                             <Text style={styles.sectionBody}>{selectedItem.requirements}</Text>
//                                         </>
//                                     )}

//                                     {/* Required Skills with match highlight */}
//                                     <Text style={styles.sectionTitle}>Required Skills</Text>
//                                     <View style={styles.skillCloud}>
//                                         {selectedItem.requiredSkills?.map((skill: string) => {
//                                             const matched = studentSkillsLower.some(
//                                                 (s) =>
//                                                     s.includes(skill.toLowerCase()) ||
//                                                     skill.toLowerCase().includes(s)
//                                             );
//                                             return renderSkillBadge(skill, matched);
//                                         })}
//                                     </View>
//                                     {studentSkills.length > 0 && (
//                                         <Text style={styles.skillLegend}>
//                                             ✓ Green = matches your CV skills
//                                         </Text>
//                                     )}

//                                     {/* Cover Letter section */}
//                                     {!appliedIds.includes(selectedItem._id) && showCoverLetter && (
//                                         <View style={styles.coverLetterSection}>
//                                             <Text style={styles.sectionTitle}>Cover Letter (optional)</Text>
//                                             <TextInput
//                                                 style={styles.coverLetterInput}
//                                                 placeholder="Tell the company why you're a great fit..."
//                                                 placeholderTextColor="#9CA3AF"
//                                                 multiline
//                                                 numberOfLines={5}
//                                                 value={coverLetter}
//                                                 onChangeText={setCoverLetter}
//                                                 textAlignVertical="top"
//                                             />
//                                         </View>
//                                     )}

//                                     {/* Apply Button */}
//                                     {appliedIds.includes(selectedItem._id) ? (
//                                         <View style={styles.appliedState}>
//                                             <Ionicons name="checkmark-circle" size={28} color="#059669" />
//                                             <Text style={styles.appliedText}>Applied Successfully</Text>
//                                         </View>
//                                     ) : showCoverLetter ? (
//                                         <View style={{ gap: 12 }}>
//                                             <TouchableOpacity
//                                                 style={styles.mainApplyBtn}
//                                                 onPress={submitApplication}
//                                                 disabled={applying}
//                                             >
//                                                 {applying ? (
//                                                     <ActivityIndicator color="#FFF" />
//                                                 ) : (
//                                                     <Text style={styles.mainApplyBtnText}>
//                                                         Confirm & Submit Application
//                                                     </Text>
//                                                 )}
//                                             </TouchableOpacity>
//                                             <TouchableOpacity
//                                                 style={styles.cancelBtn}
//                                                 onPress={() => {
//                                                     setShowCoverLetter(false);
//                                                     setCoverLetter("");
//                                                 }}
//                                             >
//                                                 <Text style={styles.cancelBtnText}>Cancel</Text>
//                                             </TouchableOpacity>
//                                         </View>
//                                     ) : (
//                                         <TouchableOpacity
//                                             style={styles.mainApplyBtn}
//                                             onPress={handleApply}
//                                         >
//                                             <Text style={styles.mainApplyBtnText}>Apply Now</Text>
//                                         </TouchableOpacity>
//                                     )}
//                                 </View>
//                             </ScrollView>
//                         </View>
//                     )}
//                 </SafeAreaView>
//             </Modal>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     safeArea: { flex: 1, backgroundColor: "#F0F4F8" },
//     hero: { width: "100%", height: 200 },
//     heroOverlay: {
//         flex: 1,
//         backgroundColor: "rgba(25, 54, 72, 0.78)",
//         justifyContent: "center",
//         padding: 24,
//     },
//     heroTitle: { fontSize: 28, fontWeight: "bold", color: "#FFF" },
//     heroSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 6, lineHeight: 18 },
//     appCountBadge: {
//         flexDirection: "row",
//         alignItems: "center",
//         marginTop: 12,
//         backgroundColor: "rgba(255,255,255,0.15)",
//         alignSelf: "flex-start",
//         paddingHorizontal: 12,
//         paddingVertical: 6,
//         borderRadius: 20,
//         gap: 6,
//     },
//     appCountText: { color: "#FFF", fontSize: 13, fontWeight: "600" },
//     filterSection: {
//         backgroundColor: "#FFF",
//         paddingVertical: 12,
//         borderBottomWidth: 1,
//         borderBottomColor: "#F2F2F2",
//         elevation: 3,
//         shadowColor: "#000",
//         shadowOpacity: 0.06,
//         shadowRadius: 4,
//     },
//     searchBar: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#F4F7F6",
//         marginHorizontal: 16,
//         borderRadius: 12,
//         paddingHorizontal: 14,
//         height: 46,
//         gap: 8,
//     },
//     searchInput: { flex: 1, fontSize: 15, color: "#111827" },
//     domainScroll: { marginTop: 12, paddingLeft: 16 },
//     chip: {
//         paddingHorizontal: 16,
//         paddingVertical: 7,
//         backgroundColor: "#FFF",
//         borderRadius: 20,
//         marginRight: 8,
//         borderWidth: 1,
//         borderColor: "#D1D5DB",
//     },
//     activeChip: { backgroundColor: "#193648", borderColor: "#193648" },
//     chipText: { color: "#7F8C8D", fontWeight: "600", fontSize: 13 },
//     activeChipText: { color: "#FFF" },
//     resultsHeader: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//     },
//     resultsCount: { fontSize: 15, fontWeight: "700", color: "#111827" },
//     sortedByText: { fontSize: 12, color: "#6B7280" },
//     emptyState: { alignItems: "center", paddingTop: 80 },
//     emptyTitle: { fontSize: 18, fontWeight: "700", color: "#374151", marginTop: 16 },
//     emptySubText: { fontSize: 14, color: "#9CA3AF", marginTop: 8 },
//     card: {
//         backgroundColor: "#FFF",
//         borderRadius: 18,
//         marginBottom: 14,
//         elevation: 2,
//         shadowColor: "#000",
//         shadowOpacity: 0.07,
//         shadowRadius: 8,
//     },
//     highMatchCard: { borderWidth: 1.5, borderColor: "#059669" },
//     topMatchBadge: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#059669",
//         alignSelf: "flex-start",
//         marginLeft: 16,
//         marginTop: 12,
//         paddingHorizontal: 10,
//         paddingVertical: 4,
//         borderRadius: 8,
//         gap: 4,
//     },
//     topMatchText: { color: "#FFF", fontSize: 11, fontWeight: "bold" },
//     cardContent: { padding: 16 },
//     cardHeader: { flexDirection: "row", alignItems: "flex-start", marginBottom: 14 },
//     companyLogo: { width: 50, height: 50, borderRadius: 12, backgroundColor: "#F0F4F8" },
//     cardTitle: { fontSize: 16, fontWeight: "700", color: "#111827", flex: 1 },
//     cardCompany: { fontSize: 14, color: "#6B7280", marginTop: 2 },
//     locationRow: { flexDirection: "row", alignItems: "center", marginTop: 3, gap: 3 },
//     locationText: { fontSize: 12, color: "#9CA3AF" },
//     aiMatchContainer: { marginBottom: 12 },
//     aiMatchHeader: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: 6,
//     },
//     aiMatchTitle: { fontSize: 13, color: "#193648", fontWeight: "600" },
//     aiMatchPercent: { fontSize: 14, fontWeight: "bold" },
//     progressBarBg: { height: 7, backgroundColor: "#E5E7EB", borderRadius: 4, overflow: "hidden" },
//     progressBarFill: { height: "100%", borderRadius: 4 },
//     noSkillsHint: { fontSize: 11, color: "#9CA3AF", marginTop: 4 },
//     tagRow: { flexDirection: "row", gap: 8, marginBottom: 12, flexWrap: "wrap" },
//     domainTag: {
//         backgroundColor: "#EBF5FB",
//         paddingHorizontal: 10,
//         paddingVertical: 4,
//         borderRadius: 6,
//     },
//     domainText: { color: "#2980B9", fontSize: 11, fontWeight: "600" },
//     typeTag: {
//         backgroundColor: "#F5F3FF",
//         paddingHorizontal: 10,
//         paddingVertical: 4,
//         borderRadius: 6,
//     },
//     typeText: { color: "#7C3AED", fontSize: 11, fontWeight: "600" },
//     stipendTag: {
//         backgroundColor: "#ECFDF5",
//         paddingHorizontal: 10,
//         paddingVertical: 4,
//         borderRadius: 6,
//     },
//     stipendText: { color: "#059669", fontSize: 11, fontWeight: "600" },
//     skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 14 },
//     skillItem: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#F3F4F6",
//         paddingHorizontal: 10,
//         paddingVertical: 5,
//         borderRadius: 12,
//     },
//     skillItemMatched: { backgroundColor: "#ECFDF5", borderWidth: 1, borderColor: "#A7F3D0" },
//     skillText: { color: "#374151", fontSize: 11, fontWeight: "500" },
//     skillTextMatched: { color: "#059669" },
//     detailsBtn: {
//         backgroundColor: "#193648",
//         flexDirection: "row",
//         justifyContent: "center",
//         alignItems: "center",
//         paddingVertical: 13,
//         borderRadius: 12,
//         gap: 8,
//     },
//     appliedBtn: {
//         backgroundColor: "#F0FDF4",
//         borderWidth: 1,
//         borderColor: "#A7F3D0",
//     },
//     detailsBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 15 },
//     // Modal
//     modalRoot: { flex: 1, backgroundColor: "#FFF" },
//     closeBtn: { position: "absolute", top: 14, right: 14, zIndex: 10 },
//     modalBanner: {
//         backgroundColor: "#193648",
//         padding: 30,
//         paddingTop: 40,
//         alignItems: "center",
//     },
//     modalLogo: {
//         width: 70,
//         height: 70,
//         borderRadius: 16,
//         backgroundColor: "#FFF",
//         marginBottom: 14,
//     },
//     modalTitle: { fontSize: 22, fontWeight: "bold", color: "#FFF", textAlign: "center" },
//     modalCompany: { fontSize: 15, color: "rgba(255,255,255,0.75)", marginTop: 4 },
//     modalLocationRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         marginTop: 8,
//         gap: 4,
//     },
//     modalLocationText: { color: "rgba(255,255,255,0.7)", fontSize: 13 },
//     modalBody: { padding: 20 },
//     matchCard: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#F0F4F8",
//         padding: 16,
//         borderRadius: 14,
//         marginBottom: 20,
//     },
//     matchCardTitle: {
//         fontSize: 14,
//         fontWeight: "700",
//         color: "#111827",
//         marginBottom: 8,
//     },
//     statsGrid: {
//         flexDirection: "row",
//         flexWrap: "wrap",
//         gap: 10,
//         marginBottom: 20,
//     },
//     statBox: {
//         width: "47%",
//         backgroundColor: "#F9FAFB",
//         padding: 14,
//         borderRadius: 12,
//         alignItems: "center",
//         gap: 4,
//     },
//     statLabel: { fontSize: 11, color: "#9CA3AF", fontWeight: "600" },
//     statVal: { fontSize: 14, fontWeight: "bold", color: "#193648", textAlign: "center" },
//     sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 8 },
//     sectionBody: { fontSize: 14, color: "#5D6D7E", lineHeight: 22, marginBottom: 18 },
//     skillCloud: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
//     skillLegend: { fontSize: 11, color: "#059669", marginBottom: 18 },
//     coverLetterSection: { marginBottom: 16 },
//     coverLetterInput: {
//         backgroundColor: "#F9FAFB",
//         borderWidth: 1,
//         borderColor: "#E5E7EB",
//         borderRadius: 12,
//         padding: 14,
//         fontSize: 14,
//         color: "#111827",
//         minHeight: 120,
//         marginTop: 8,
//     },
//     mainApplyBtn: {
//         backgroundColor: "#193648",
//         paddingVertical: 16,
//         borderRadius: 14,
//         alignItems: "center",
//         marginBottom: 8,
//     },
//     mainApplyBtnText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
//     cancelBtn: {
//         backgroundColor: "#F3F4F6",
//         paddingVertical: 14,
//         borderRadius: 14,
//         alignItems: "center",
//         marginBottom: 20,
//     },
//     cancelBtnText: { color: "#6B7280", fontSize: 15, fontWeight: "600" },
//     appliedState: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "center",
//         paddingVertical: 18,
//         gap: 10,
//         marginBottom: 20,
//     },
//     appliedText: { fontSize: 18, fontWeight: "bold", color: "#059669" },
// });

// export default InternshipsScreen;











// import React, { useState, useEffect, useCallback } from "react";
// import {
//     View,
//     Text,
//     StyleSheet,
//     ScrollView,
//     TouchableOpacity,
//     TextInput,
//     FlatList,
//     Modal,
//     Alert,
//     SafeAreaView,
//     Dimensions,
//     Image,
//     ImageBackground,
//     ActivityIndicator,
// } from "react-native";
// import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
// import * as Animatable from "react-native-animatable";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import { useFocusEffect } from "@react-navigation/native";
// import { CONSTANT } from "@/constants/constant";

// const { width } = Dimensions.get("window");

// const DOMAINS = [
//     "All",
//     "Artificial Intelligence",
//     "Web Development",
//     "Mobile Development",
//     "Cybersecurity",
//     "Data Science",
//     "DevOps",
//     "Backend Development",
//     "Design",
//     "Cloud Computing",
//     "Game Development",
// ];

// const calculateMatch = (studentSkills: string[], requiredSkills: string[]): number => {
//     if (!studentSkills?.length || !requiredSkills?.length) return 0;
//     const sLower = studentSkills.map((s) => s.toLowerCase());
//     const rLower = requiredSkills.map((s) => s.toLowerCase());
//     const matched = rLower.filter(
//         (r) => r.length > 2 && sLower.some((s) => s.includes(r) || r.includes(s))
//     );
//     return Math.round((matched.length / rLower.length) * 100);
// };

// const getMatchColor = (score: number) => {
//     if (score >= 70) return "#059669";
//     if (score >= 40) return "#D97706";
//     return "#6B7280";
// };

// const InternshipsScreen = () => {
//     const [search, setSearch] = useState("");
//     const [selectedDomain, setSelectedDomain] = useState("All");
//     const [allInternships, setAllInternships] = useState<any[]>([]);
//     const [filteredData, setFilteredData] = useState<any[]>([]);
//     const [selectedItem, setSelectedItem] = useState<any>(null);
//     const [detailModalVisible, setDetailModalVisible] = useState(false);
//     const [appliedIds, setAppliedIds] = useState<string[]>([]);
//     const [studentSkills, setStudentSkills] = useState<string[]>([]);
//     const [studentEmail, setStudentEmail] = useState<string>("");
//     const [loading, setLoading] = useState(true);
//     const [applying, setApplying] = useState(false);
//     const [applicationCount, setApplicationCount] = useState(0);
//     const [coverLetter, setCoverLetter] = useState("");
//     const [showCoverLetter, setShowCoverLetter] = useState(false);

//     useFocusEffect(
//         useCallback(() => {
//             loadStudentAndInternships();
//         }, [])
//     );

//     const loadStudentAndInternships = async () => {
//         setLoading(true);
//         try {
//             const email = await AsyncStorage.getItem("studentEmail");
//             if (!email) return;
//             setStudentEmail(email);

//             const [studentRes, internshipsRes, appsRes] = await Promise.all([
//                 axios.get(`${CONSTANT.API_BASE_URL}/api/student/getStudent/${email}`),
//                 axios.get(`${CONSTANT.API_BASE_URL}/api/internships`),
//                 axios.get(`${CONSTANT.API_BASE_URL}/api/applications/${email}`),
//             ]);

//             // --- FIX: try all possible skill field names ---
//             const raw = studentRes.data;
//             const skills: string[] =
//                 raw?.extractedSkills?.length ? raw.extractedSkills :
//                 raw?.parsedSkills?.length   ? raw.parsedSkills   :
//                 raw?.cvSkills?.length       ? raw.cvSkills       :
//                 raw?.skills?.length         ? raw.skills         : [];

//             console.log("[Skills loaded]", skills.length, skills);
//             setStudentSkills(skills);

//             const internships = internshipsRes.data.map((item: any) => ({
//                 ...item,
//                 matchScore: calculateMatch(skills, item.requiredSkills),
//             }));

//             internships.sort((a: any, b: any) => b.matchScore - a.matchScore);
//             setAllInternships(internships);
//             setFilteredData(internships);

//             const alreadyApplied = appsRes.data.map((app: any) =>
//                 app.internshipId?._id || app.internshipId
//             );
//             setAppliedIds(alreadyApplied);
//             setApplicationCount(appsRes.data.length);
//         } catch (err) {
//             console.log("Error loading internships:", err);
//             Alert.alert("Error", "Failed to load internships. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         let data = [...allInternships];
//         if (selectedDomain !== "All") {
//             data = data.filter((item) => item.domain === selectedDomain);
//         }
//         if (search.trim()) {
//             const q = search.toLowerCase();
//             data = data.filter(
//                 (item) =>
//                     item.title?.toLowerCase().includes(q) ||
//                     item.company?.toLowerCase().includes(q) ||
//                     item.domain?.toLowerCase().includes(q)
//             );
//         }
//         setFilteredData(data);
//     }, [search, selectedDomain, allInternships]);

//     const handleApply = async () => {
//         if (!selectedItem) return;
//         if (appliedIds.includes(selectedItem._id)) {
//             Alert.alert("Already Applied", "You have already applied for this internship.");
//             return;
//         }
//         setShowCoverLetter(true);
//     };

//     const submitApplication = async () => {
//         if (!selectedItem || !studentEmail) return;
//         setApplying(true);
//         try {
//             await axios.post(`${CONSTANT.API_BASE_URL}/api/internships/apply`, {
//                 studentEmail,
//                 internshipId: selectedItem._id,
//                 coverLetter: coverLetter.trim() || "I am interested in this internship opportunity.",
//             });

//             setAppliedIds((prev) => [...prev, selectedItem._id]);
//             setApplicationCount((prev) => prev + 1);
//             setShowCoverLetter(false);
//             setCoverLetter("");
//             setDetailModalVisible(false);

//             Alert.alert(
//                 "🎉 Application Submitted!",
//                 `Your application for "${selectedItem.title}" at ${selectedItem.company} has been submitted successfully. You can track its status in My Applications.`
//             );
//         } catch (err: any) {
//             if (err?.response?.status === 409) {
//                 Alert.alert("Already Applied", "You have already applied for this internship.");
//             } else {
//                 Alert.alert("Error", err?.response?.data?.error || "Failed to submit application.");
//             }
//         } finally {
//             setApplying(false);
//         }
//     };

//     const renderSkillBadge = (skill: string, isMatched: boolean) => (
//         <View
//             key={skill}
//             style={[styles.skillItem, isMatched && styles.skillItemMatched]}
//         >
//             {isMatched && (
//                 <MaterialCommunityIcons
//                     name="check-circle"
//                     size={11}
//                     color="#059669"
//                     style={{ marginRight: 3 }}
//                 />
//             )}
//             <Text style={[styles.skillText, isMatched && styles.skillTextMatched]}>
//                 {skill}
//             </Text>
//         </View>
//     );

//     const renderInternshipCard = ({ item }: { item: any }) => {
//         const isApplied = appliedIds.includes(item._id);
//         const matchColor = getMatchColor(item.matchScore);
//         const isHighMatch = item.matchScore >= 70;
//         const studentSkillsLower = studentSkills.map((s) => s.toLowerCase());

//         return (
//             <Animatable.View
//                 animation="fadeInUp"
//                 style={[styles.card, isHighMatch && styles.highMatchCard]}
//             >
//                 {isHighMatch && (
//                     <View style={styles.topMatchBadge}>
//                         <MaterialCommunityIcons name="star" size={12} color="#FFF" />
//                         <Text style={styles.topMatchText}>Top Match</Text>
//                     </View>
//                 )}

//                 <View style={styles.cardContent}>
//                     <View style={styles.cardHeader}>
//                         <Image
//                             source={{
//                                 uri: item.logo || "https://img.icons8.com/color/96/briefcase.png",
//                             }}
//                             style={styles.companyLogo}
//                         />
//                         <View style={{ flex: 1, marginLeft: 12 }}>
//                             <Text style={styles.cardTitle} numberOfLines={2}>
//                                 {item.title}
//                             </Text>
//                             <Text style={styles.cardCompany}>{item.company}</Text>
//                             <View style={styles.locationRow}>
//                                 <Ionicons name="location-outline" size={12} color="#9CA3AF" />
//                                 <Text style={styles.locationText}>{item.location}</Text>
//                             </View>
//                         </View>
//                     </View>

//                     {/* AI Match Score */}
//                     <View style={styles.aiMatchContainer}>
//                         <View style={styles.aiMatchHeader}>
//                             <View style={{ flexDirection: "row", alignItems: "center" }}>
//                                 <MaterialCommunityIcons name="brain" size={14} color="#193648" />
//                                 <Text style={styles.aiMatchTitle}> Skill Match</Text>
//                             </View>
//                             <Text style={[styles.aiMatchPercent, { color: matchColor }]}>
//                                 {item.matchScore}%
//                             </Text>
//                         </View>
//                         <View style={styles.progressBarBg}>
//                             <View
//                                 style={[
//                                     styles.progressBarFill,
//                                     {
//                                         width: `${Math.max(item.matchScore, 5)}%`,
//                                         backgroundColor: matchColor,
//                                     },
//                                 ]}
//                             />
//                         </View>
//                         {studentSkills.length === 0 && (
//                             <Text style={styles.noSkillsHint}>
//                                 Upload your CV to see skill matching
//                             </Text>
//                         )}
//                     </View>

//                     {/* Tags */}
//                     <View style={styles.tagRow}>
//                         <View style={styles.domainTag}>
//                             <Text style={styles.domainText}>{item.domain}</Text>
//                         </View>
//                         <View style={styles.typeTag}>
//                             <Text style={styles.typeText}>{item.type}</Text>
//                         </View>
//                         <View style={styles.stipendTag}>
//                             <Text style={styles.stipendText}>{item.stipend}</Text>
//                         </View>
//                     </View>

//                     {/* Skills preview */}
//                     <View style={styles.skillsRow}>
//                         {item.requiredSkills?.slice(0, 4).map((skill: string) => {
//                             const matched = studentSkillsLower.some(
//                                 (s) =>
//                                     s.includes(skill.toLowerCase()) ||
//                                     skill.toLowerCase().includes(s)
//                             );
//                             return renderSkillBadge(skill, matched);
//                         })}
//                         {item.requiredSkills?.length > 4 && (
//                             <View style={styles.skillItem}>
//                                 <Text style={styles.skillText}>
//                                     +{item.requiredSkills.length - 4}
//                                 </Text>
//                             </View>
//                         )}
//                     </View>

//                     <TouchableOpacity
//                         style={[styles.detailsBtn, isApplied && styles.appliedBtn]}
//                         onPress={() => {
//                             setSelectedItem(item);
//                             setDetailModalVisible(true);
//                         }}
//                     >
//                         {isApplied ? (
//                             <>
//                                 <Ionicons name="checkmark-circle" size={18} color="#059669" />
//                                 <Text style={[styles.detailsBtnText, { color: "#059669" }]}>
//                                     Applied
//                                 </Text>
//                             </>
//                         ) : (
//                             <>
//                                 <Text style={styles.detailsBtnText}>View & Apply</Text>
//                                 <Ionicons name="arrow-forward" size={18} color="#FFF" />
//                             </>
//                         )}
//                     </TouchableOpacity>
//                 </View>
//             </Animatable.View>
//         );
//     };

//     const studentSkillsLower = studentSkills.map((s) => s.toLowerCase());

//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <ScrollView stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
//                 {/* Hero */}
//                 <ImageBackground
//                     source={{
//                         uri: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop",
//                     }}
//                     style={styles.hero}
//                 >
//                     <View style={styles.heroOverlay}>
//                         <Text style={styles.heroTitle}>Matched For You</Text>
//                         <Text style={styles.heroSubtitle}>
//                             {studentSkills.length > 0
//                                 ? `Showing internships based on ${studentSkills.length} skills from your CV`
//                                 : "Upload your CV to unlock skill-matched internships"}
//                         </Text>
//                         <View style={styles.appCountBadge}>
//                             <MaterialCommunityIcons
//                                 name="briefcase-check"
//                                 size={16}
//                                 color="#FFF"
//                             />
//                             <Text style={styles.appCountText}>
//                                 {applicationCount} Application
//                                 {applicationCount !== 1 ? "s" : ""} Submitted
//                             </Text>
//                         </View>
//                     </View>
//                 </ImageBackground>

//                 {/* Sticky Filter */}
//                 <View style={styles.filterSection}>
//                     <View style={styles.searchBar}>
//                         <Ionicons name="search" size={20} color="#95A5A6" />
//                         <TextInput
//                             placeholder="Search by title, company, domain..."
//                             style={styles.searchInput}
//                             value={search}
//                             onChangeText={setSearch}
//                             placeholderTextColor="#9CA3AF"
//                         />
//                         {search.length > 0 && (
//                             <TouchableOpacity onPress={() => setSearch("")}>
//                                 <Ionicons name="close-circle" size={18} color="#9CA3AF" />
//                             </TouchableOpacity>
//                         )}
//                     </View>
//                     <ScrollView
//                         horizontal
//                         showsHorizontalScrollIndicator={false}
//                         style={styles.domainScroll}
//                         contentContainerStyle={{ paddingRight: 20 }}
//                     >
//                         {DOMAINS.map((d) => (
//                             <TouchableOpacity
//                                 key={d}
//                                 style={[styles.chip, selectedDomain === d && styles.activeChip]}
//                                 onPress={() => setSelectedDomain(d)}
//                             >
//                                 <Text
//                                     style={[
//                                         styles.chipText,
//                                         selectedDomain === d && styles.activeChipText,
//                                     ]}
//                                 >
//                                     {d}
//                                 </Text>
//                             </TouchableOpacity>
//                         ))}
//                     </ScrollView>
//                 </View>

//                 {/* Results */}
//                 {loading ? (
//                     <View style={{ paddingTop: 60, alignItems: "center" }}>
//                         <ActivityIndicator size="large" color="#193648" />
//                         <Text style={{ marginTop: 12, color: "#6B7280" }}>
//                             Loading matched internships...
//                         </Text>
//                     </View>
//                 ) : filteredData.length === 0 ? (
//                     <View style={styles.emptyState}>
//                         <MaterialCommunityIcons
//                             name="briefcase-off"
//                             size={64}
//                             color="#D1D5DB"
//                         />
//                         <Text style={styles.emptyTitle}>No Internships Found</Text>
//                         <Text style={styles.emptySubText}>
//                             Try a different domain or search term
//                         </Text>
//                     </View>
//                 ) : (
//                     <>
//                         <View style={styles.resultsHeader}>
//                             <Text style={styles.resultsCount}>
//                                 {filteredData.length} Opportunit
//                                 {filteredData.length !== 1 ? "ies" : "y"}
//                             </Text>
//                             {studentSkills.length > 0 && (
//                                 <Text style={styles.sortedByText}>Sorted by skill match</Text>
//                             )}
//                         </View>
//                         <FlatList
//                             data={filteredData}
//                             renderItem={renderInternshipCard}
//                             keyExtractor={(item) => item._id}
//                             scrollEnabled={false}
//                             contentContainerStyle={{
//                                 paddingHorizontal: 16,
//                                 paddingBottom: 30,
//                             }}
//                         />
//                     </>
//                 )}
//             </ScrollView>

//             {/* Detail Modal */}
//             <Modal visible={detailModalVisible} animationType="slide">
//                 <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
//                     {selectedItem && (
//                         <View style={styles.modalRoot}>
//                             <TouchableOpacity
//                                 style={styles.closeBtn}
//                                 onPress={() => {
//                                     setDetailModalVisible(false);
//                                     setShowCoverLetter(false);
//                                     setCoverLetter("");
//                                 }}
//                             >
//                                 <Ionicons name="close-circle" size={36} color="#193648" />
//                             </TouchableOpacity>

//                             <ScrollView showsVerticalScrollIndicator={false}>
//                                 {/* Header banner */}
//                                 <View style={styles.modalBanner}>
//                                     <Image
//                                         source={{
//                                             uri:
//                                                 selectedItem.logo ||
//                                                 "https://img.icons8.com/color/96/briefcase.png",
//                                         }}
//                                         style={styles.modalLogo}
//                                     />
//                                     <Text style={styles.modalTitle}>{selectedItem.title}</Text>
//                                     <Text style={styles.modalCompany}>
//                                         {selectedItem.company}
//                                     </Text>
//                                     <View style={styles.modalLocationRow}>
//                                         <Ionicons
//                                             name="location"
//                                             size={14}
//                                             color="rgba(255,255,255,0.8)"
//                                         />
//                                         <Text style={styles.modalLocationText}>
//                                             {selectedItem.location}
//                                         </Text>
//                                     </View>
//                                 </View>

//                                 <View style={styles.modalBody}>
//                                     {/* Match Score */}
//                                     <View style={styles.matchCard}>
//                                         <MaterialCommunityIcons
//                                             name="brain"
//                                             size={22}
//                                             color="#193648"
//                                         />
//                                         <View style={{ flex: 1, marginLeft: 12 }}>
//                                             <Text style={styles.matchCardTitle}>
//                                                 Your Skill Match: {selectedItem.matchScore}%
//                                             </Text>
//                                             <View style={styles.progressBarBg}>
//                                                 <View
//                                                     style={[
//                                                         styles.progressBarFill,
//                                                         {
//                                                             width: `${Math.max(
//                                                                 selectedItem.matchScore,
//                                                                 5
//                                                             )}%`,
//                                                             backgroundColor: getMatchColor(
//                                                                 selectedItem.matchScore
//                                                             ),
//                                                         },
//                                                     ]}
//                                                 />
//                                             </View>
//                                         </View>
//                                     </View>

//                                     {/* Stats */}
//                                     <View style={styles.statsGrid}>
//                                         <View style={styles.statBox}>
//                                             <MaterialCommunityIcons
//                                                 name="clock-outline"
//                                                 size={18}
//                                                 color="#193648"
//                                             />
//                                             <Text style={styles.statLabel}>Duration</Text>
//                                             <Text style={styles.statVal}>
//                                                 {selectedItem.duration}
//                                             </Text>
//                                         </View>
//                                         <View style={styles.statBox}>
//                                             <MaterialCommunityIcons
//                                                 name="cash"
//                                                 size={18}
//                                                 color="#193648"
//                                             />
//                                             <Text style={styles.statLabel}>Stipend</Text>
//                                             <Text style={styles.statVal}>
//                                                 {selectedItem.stipend}
//                                             </Text>
//                                         </View>
//                                         <View style={styles.statBox}>
//                                             <MaterialCommunityIcons
//                                                 name="office-building"
//                                                 size={18}
//                                                 color="#193648"
//                                             />
//                                             <Text style={styles.statLabel}>Type</Text>
//                                             <Text style={styles.statVal}>{selectedItem.type}</Text>
//                                         </View>
//                                         <View style={styles.statBox}>
//                                             <MaterialCommunityIcons
//                                                 name="calendar"
//                                                 size={18}
//                                                 color="#E74C3C"
//                                             />
//                                             <Text style={styles.statLabel}>Deadline</Text>
//                                             <Text
//                                                 style={[
//                                                     styles.statVal,
//                                                     { color: "#E74C3C", fontSize: 12 },
//                                                 ]}
//                                             >
//                                                 {selectedItem.deadline
//                                                     ? new Date(
//                                                           selectedItem.deadline
//                                                       ).toDateString()
//                                                     : "Open"}
//                                             </Text>
//                                         </View>
//                                     </View>

//                                     {/* Description */}
//                                     <Text style={styles.sectionTitle}>About the Role</Text>
//                                     <Text style={styles.sectionBody}>
//                                         {selectedItem.description}
//                                     </Text>

//                                     {/* Requirements */}
//                                     {selectedItem.requirements && (
//                                         <>
//                                             <Text style={styles.sectionTitle}>Requirements</Text>
//                                             <Text style={styles.sectionBody}>
//                                                 {selectedItem.requirements}
//                                             </Text>
//                                         </>
//                                     )}

//                                     {/* Required Skills */}
//                                     <Text style={styles.sectionTitle}>Required Skills</Text>
//                                     <View style={styles.skillCloud}>
//                                         {selectedItem.requiredSkills?.map((skill: string) => {
//                                             const matched = studentSkillsLower.some(
//                                                 (s) =>
//                                                     s.includes(skill.toLowerCase()) ||
//                                                     skill.toLowerCase().includes(s)
//                                             );
//                                             return renderSkillBadge(skill, matched);
//                                         })}
//                                     </View>
//                                     {studentSkills.length > 0 && (
//                                         <Text style={styles.skillLegend}>
//                                             ✓ Green = matches your CV skills
//                                         </Text>
//                                     )}

//                                     {/* Cover Letter */}
//                                     {!appliedIds.includes(selectedItem._id) &&
//                                         showCoverLetter && (
//                                             <View style={styles.coverLetterSection}>
//                                                 <Text style={styles.sectionTitle}>
//                                                     Cover Letter (optional)
//                                                 </Text>
//                                                 <TextInput
//                                                     style={styles.coverLetterInput}
//                                                     placeholder="Tell the company why you're a great fit..."
//                                                     placeholderTextColor="#9CA3AF"
//                                                     multiline
//                                                     numberOfLines={5}
//                                                     value={coverLetter}
//                                                     onChangeText={setCoverLetter}
//                                                     textAlignVertical="top"
//                                                 />
//                                             </View>
//                                         )}

//                                     {/* Apply Button */}
//                                     {appliedIds.includes(selectedItem._id) ? (
//                                         <View style={styles.appliedState}>
//                                             <Ionicons
//                                                 name="checkmark-circle"
//                                                 size={28}
//                                                 color="#059669"
//                                             />
//                                             <Text style={styles.appliedText}>
//                                                 Applied Successfully
//                                             </Text>
//                                         </View>
//                                     ) : showCoverLetter ? (
//                                         <View style={{ gap: 12 }}>
//                                             <TouchableOpacity
//                                                 style={styles.mainApplyBtn}
//                                                 onPress={submitApplication}
//                                                 disabled={applying}
//                                             >
//                                                 {applying ? (
//                                                     <ActivityIndicator color="#FFF" />
//                                                 ) : (
//                                                     <Text style={styles.mainApplyBtnText}>
//                                                         Confirm & Submit Application
//                                                     </Text>
//                                                 )}
//                                             </TouchableOpacity>
//                                             <TouchableOpacity
//                                                 style={styles.cancelBtn}
//                                                 onPress={() => {
//                                                     setShowCoverLetter(false);
//                                                     setCoverLetter("");
//                                                 }}
//                                             >
//                                                 <Text style={styles.cancelBtnText}>Cancel</Text>
//                                             </TouchableOpacity>
//                                         </View>
//                                     ) : (
//                                         <TouchableOpacity
//                                             style={styles.mainApplyBtn}
//                                             onPress={handleApply}
//                                         >
//                                             <Text style={styles.mainApplyBtnText}>Apply Now</Text>
//                                         </TouchableOpacity>
//                                     )}
//                                 </View>
//                             </ScrollView>
//                         </View>
//                     )}
//                 </SafeAreaView>
//             </Modal>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     safeArea: { flex: 1, backgroundColor: "#F0F4F8" },
//     hero: { width: "100%", height: 200 },
//     heroOverlay: {
//         flex: 1,
//         backgroundColor: "rgba(25, 54, 72, 0.78)",
//         justifyContent: "center",
//         padding: 24,
//     },
//     heroTitle: { fontSize: 28, fontWeight: "bold", color: "#FFF" },
//     heroSubtitle: {
//         fontSize: 13,
//         color: "rgba(255,255,255,0.8)",
//         marginTop: 6,
//         lineHeight: 18,
//     },
//     appCountBadge: {
//         flexDirection: "row",
//         alignItems: "center",
//         marginTop: 12,
//         backgroundColor: "rgba(255,255,255,0.15)",
//         alignSelf: "flex-start",
//         paddingHorizontal: 12,
//         paddingVertical: 6,
//         borderRadius: 20,
//         gap: 6,
//     },
//     appCountText: { color: "#FFF", fontSize: 13, fontWeight: "600" },
//     filterSection: {
//         backgroundColor: "#FFF",
//         paddingVertical: 12,
//         borderBottomWidth: 1,
//         borderBottomColor: "#F2F2F2",
//         elevation: 3,
//         shadowColor: "#000",
//         shadowOpacity: 0.06,
//         shadowRadius: 4,
//     },
//     searchBar: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#F4F7F6",
//         marginHorizontal: 16,
//         borderRadius: 12,
//         paddingHorizontal: 14,
//         height: 46,
//         gap: 8,
//     },
//     searchInput: { flex: 1, fontSize: 15, color: "#111827" },
//     domainScroll: { marginTop: 12, paddingLeft: 16 },
//     chip: {
//         paddingHorizontal: 16,
//         paddingVertical: 7,
//         backgroundColor: "#FFF",
//         borderRadius: 20,
//         marginRight: 8,
//         borderWidth: 1,
//         borderColor: "#D1D5DB",
//     },
//     activeChip: { backgroundColor: "#193648", borderColor: "#193648" },
//     chipText: { color: "#7F8C8D", fontWeight: "600", fontSize: 13 },
//     activeChipText: { color: "#FFF" },
//     resultsHeader: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//     },
//     resultsCount: { fontSize: 15, fontWeight: "700", color: "#111827" },
//     sortedByText: { fontSize: 12, color: "#6B7280" },
//     emptyState: { alignItems: "center", paddingTop: 80 },
//     emptyTitle: { fontSize: 18, fontWeight: "700", color: "#374151", marginTop: 16 },
//     emptySubText: { fontSize: 14, color: "#9CA3AF", marginTop: 8 },
//     card: {
//         backgroundColor: "#FFF",
//         borderRadius: 18,
//         marginBottom: 14,
//         elevation: 2,
//         shadowColor: "#000",
//         shadowOpacity: 0.07,
//         shadowRadius: 8,
//     },
//     highMatchCard: { borderWidth: 1.5, borderColor: "#059669" },
//     topMatchBadge: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#059669",
//         alignSelf: "flex-start",
//         marginLeft: 16,
//         marginTop: 12,
//         paddingHorizontal: 10,
//         paddingVertical: 4,
//         borderRadius: 8,
//         gap: 4,
//     },
//     topMatchText: { color: "#FFF", fontSize: 11, fontWeight: "bold" },
//     cardContent: { padding: 16 },
//     cardHeader: { flexDirection: "row", alignItems: "flex-start", marginBottom: 14 },
//     companyLogo: { width: 50, height: 50, borderRadius: 12, backgroundColor: "#F0F4F8" },
//     cardTitle: { fontSize: 16, fontWeight: "700", color: "#111827", flex: 1 },
//     cardCompany: { fontSize: 14, color: "#6B7280", marginTop: 2 },
//     locationRow: { flexDirection: "row", alignItems: "center", marginTop: 3, gap: 3 },
//     locationText: { fontSize: 12, color: "#9CA3AF" },
//     aiMatchContainer: { marginBottom: 12 },
//     aiMatchHeader: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: 6,
//     },
//     aiMatchTitle: { fontSize: 13, color: "#193648", fontWeight: "600" },
//     aiMatchPercent: { fontSize: 14, fontWeight: "bold" },
//     progressBarBg: {
//         height: 7,
//         backgroundColor: "#E5E7EB",
//         borderRadius: 4,
//         overflow: "hidden",
//     },
//     progressBarFill: { height: "100%", borderRadius: 4 },
//     noSkillsHint: { fontSize: 11, color: "#9CA3AF", marginTop: 4 },
//     tagRow: { flexDirection: "row", gap: 8, marginBottom: 12, flexWrap: "wrap" },
//     domainTag: {
//         backgroundColor: "#EBF5FB",
//         paddingHorizontal: 10,
//         paddingVertical: 4,
//         borderRadius: 6,
//     },
//     domainText: { color: "#2980B9", fontSize: 11, fontWeight: "600" },
//     typeTag: {
//         backgroundColor: "#F5F3FF",
//         paddingHorizontal: 10,
//         paddingVertical: 4,
//         borderRadius: 6,
//     },
//     typeText: { color: "#7C3AED", fontSize: 11, fontWeight: "600" },
//     stipendTag: {
//         backgroundColor: "#ECFDF5",
//         paddingHorizontal: 10,
//         paddingVertical: 4,
//         borderRadius: 6,
//     },
//     stipendText: { color: "#059669", fontSize: 11, fontWeight: "600" },
//     skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 14 },
//     skillItem: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#F3F4F6",
//         paddingHorizontal: 10,
//         paddingVertical: 5,
//         borderRadius: 12,
//     },
//     skillItemMatched: {
//         backgroundColor: "#ECFDF5",
//         borderWidth: 1,
//         borderColor: "#A7F3D0",
//     },
//     skillText: { color: "#374151", fontSize: 11, fontWeight: "500" },
//     skillTextMatched: { color: "#059669" },
//     detailsBtn: {
//         backgroundColor: "#193648",
//         flexDirection: "row",
//         justifyContent: "center",
//         alignItems: "center",
//         paddingVertical: 13,
//         borderRadius: 12,
//         gap: 8,
//     },
//     appliedBtn: {
//         backgroundColor: "#F0FDF4",
//         borderWidth: 1,
//         borderColor: "#A7F3D0",
//     },
//     detailsBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 15 },
//     modalRoot: { flex: 1, backgroundColor: "#FFF" },
//     closeBtn: { position: "absolute", top: 14, right: 14, zIndex: 10 },
//     modalBanner: {
//         backgroundColor: "#193648",
//         padding: 30,
//         paddingTop: 40,
//         alignItems: "center",
//     },
//     modalLogo: {
//         width: 70,
//         height: 70,
//         borderRadius: 16,
//         backgroundColor: "#FFF",
//         marginBottom: 14,
//     },
//     modalTitle: {
//         fontSize: 22,
//         fontWeight: "bold",
//         color: "#FFF",
//         textAlign: "center",
//     },
//     modalCompany: { fontSize: 15, color: "rgba(255,255,255,0.75)", marginTop: 4 },
//     modalLocationRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         marginTop: 8,
//         gap: 4,
//     },
//     modalLocationText: { color: "rgba(255,255,255,0.7)", fontSize: 13 },
//     modalBody: { padding: 20 },
//     matchCard: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#F0F4F8",
//         padding: 16,
//         borderRadius: 14,
//         marginBottom: 20,
//     },
//     matchCardTitle: {
//         fontSize: 14,
//         fontWeight: "700",
//         color: "#111827",
//         marginBottom: 8,
//     },
//     statsGrid: {
//         flexDirection: "row",
//         flexWrap: "wrap",
//         gap: 10,
//         marginBottom: 20,
//     },
//     statBox: {
//         width: "47%",
//         backgroundColor: "#F9FAFB",
//         padding: 14,
//         borderRadius: 12,
//         alignItems: "center",
//         gap: 4,
//     },
//     statLabel: { fontSize: 11, color: "#9CA3AF", fontWeight: "600" },
//     statVal: {
//         fontSize: 14,
//         fontWeight: "bold",
//         color: "#193648",
//         textAlign: "center",
//     },
//     sectionTitle: {
//         fontSize: 16,
//         fontWeight: "700",
//         color: "#111827",
//         marginBottom: 8,
//     },
//     sectionBody: {
//         fontSize: 14,
//         color: "#5D6D7E",
//         lineHeight: 22,
//         marginBottom: 18,
//     },
//     skillCloud: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
//     skillLegend: { fontSize: 11, color: "#059669", marginBottom: 18 },
//     coverLetterSection: { marginBottom: 16 },
//     coverLetterInput: {
//         backgroundColor: "#F9FAFB",
//         borderWidth: 1,
//         borderColor: "#E5E7EB",
//         borderRadius: 12,
//         padding: 14,
//         fontSize: 14,
//         color: "#111827",
//         minHeight: 120,
//         marginTop: 8,
//     },
//     mainApplyBtn: {
//         backgroundColor: "#193648",
//         paddingVertical: 16,
//         borderRadius: 14,
//         alignItems: "center",
//         marginBottom: 8,
//     },
//     mainApplyBtnText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
//     cancelBtn: {
//         backgroundColor: "#F3F4F6",
//         paddingVertical: 14,
//         borderRadius: 14,
//         alignItems: "center",
//         marginBottom: 20,
//     },
//     cancelBtnText: { color: "#6B7280", fontSize: 15, fontWeight: "600" },
//     appliedState: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "center",
//         paddingVertical: 18,
//         gap: 10,
//         marginBottom: 20,
//     },
//     appliedText: { fontSize: 18, fontWeight: "bold", color: "#059669" },
// });

// export default InternshipsScreen;






import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    FlatList,
    Modal,
    Alert,
    SafeAreaView,
    Dimensions,
    Image,
    ImageBackground,
    ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { CONSTANT } from "@/constants/constant";

const { width } = Dimensions.get("window");

const DOMAINS = [
    "All",
    "Artificial Intelligence",
    "Web Development",
    "Mobile Development",
    "Cybersecurity",
    "Data Science",
    "DevOps",
    "Backend Development",
    "Design",
    "Cloud Computing",
    "Game Development",
];

const calculateMatch = (studentSkills: string[], requiredSkills: string[]): number => {
    if (!studentSkills?.length || !requiredSkills?.length) return 0;
    const sLower = studentSkills.map((s) => s.toLowerCase());
    const rLower = requiredSkills.map((s) => s.toLowerCase());
    const matched = rLower.filter(
        (r) => r.length > 2 && sLower.some((s) => s.includes(r) || r.includes(s))
    );
    return Math.round((matched.length / rLower.length) * 100);
};

const getMatchColor = (score: number) => {
    if (score >= 70) return "#193648";
    if (score >= 40) return "#2A5A72";
    return "#64748B";
};

// Hero auto-cycling cinematic images — internship/career related
const HERO_IMAGES = [
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200&auto=format&fit=crop",
];

const InternshipsScreen = () => {
    const [search, setSearch] = useState("");
    const [selectedDomain, setSelectedDomain] = useState("All");
    const [allInternships, setAllInternships] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [appliedIds, setAppliedIds] = useState<string[]>([]);
    const [studentSkills, setStudentSkills] = useState<string[]>([]);
    const [studentEmail, setStudentEmail] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [applicationCount, setApplicationCount] = useState(0);
    const [coverLetter, setCoverLetter] = useState("");
    const [showCoverLetter, setShowCoverLetter] = useState(false);
    const [heroIdx, setHeroIdx] = useState(0);

    // Auto-cycle hero background every 4 seconds (video-like effect)
    useEffect(() => {
        const id = setInterval(() => {
            setHeroIdx((i) => (i + 1) % HERO_IMAGES.length);
        }, 4000);
        return () => clearInterval(id);
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadStudentAndInternships();
        }, [])
    );

    const loadStudentAndInternships = async () => {
        setLoading(true);
        try {
            const email = await AsyncStorage.getItem("studentEmail");
            if (!email) return;
            setStudentEmail(email);

            const [studentRes, internshipsRes, appsRes] = await Promise.all([
                axios.get(`${CONSTANT.API_BASE_URL}/api/student/getStudent/${email}`),
                axios.get(`${CONSTANT.API_BASE_URL}/api/internships`),
                axios.get(`${CONSTANT.API_BASE_URL}/api/applications/${email}`),
            ]);

            const raw = studentRes.data;
            const skills: string[] =
                raw?.extractedSkills?.length ? raw.extractedSkills :
                raw?.parsedSkills?.length   ? raw.parsedSkills   :
                raw?.cvSkills?.length       ? raw.cvSkills       :
                raw?.skills?.length         ? raw.skills         : [];

            setStudentSkills(skills);

            const now = new Date();

            // --- FILTERING LOGIC: Relevancy & Expiry ---
            const processedInternships = internshipsRes.data
                .map((item: any) => ({
                    ...item,
                    matchScore: calculateMatch(skills, item.requiredSkills),
                }))
                .filter((item: any) => {
                    // 1. Sirf wo internships dikhayein jin ka match score kam se kam 15% ho
                    const isRelevant = item.matchScore >= 15;
                    
                    // 2. Sirf wo dikhayein jin ki deadline guzar nahi chuki (Expired hide karein)
                    const isNotExpired = !item.deadline || new Date(item.deadline) >= now;

                    return isRelevant && isNotExpired;
                });

            // Sorting by match score (best match on top)
            processedInternships.sort((a: any, b: any) => b.matchScore - a.matchScore);

            setAllInternships(processedInternships);
            setFilteredData(processedInternships);

            const alreadyApplied = appsRes.data.map((app: any) =>
                app.internshipId?._id || app.internshipId
            );
            setAppliedIds(alreadyApplied);
            setApplicationCount(appsRes.data.length);
        } catch (err) {
            console.log("Error loading internships:", err);
            Alert.alert("Error", "Failed to load internships. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let data = [...allInternships];
        if (selectedDomain !== "All") {
            data = data.filter((item) => item.domain === selectedDomain);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            data = data.filter(
                (item) =>
                    item.title?.toLowerCase().includes(q) ||
                    item.company?.toLowerCase().includes(q) ||
                    item.domain?.toLowerCase().includes(q)
            );
        }
        setFilteredData(data);
    }, [search, selectedDomain, allInternships]);

    const handleApply = async () => {
        if (!selectedItem) return;
        if (appliedIds.includes(selectedItem._id)) {
            Alert.alert("Already Applied", "You have already applied for this internship.");
            return;
        }
        setShowCoverLetter(true);
    };

    const submitApplication = async () => {
        if (!selectedItem || !studentEmail) return;
        setApplying(true);
        try {
            await axios.post(`${CONSTANT.API_BASE_URL}/api/internships/apply`, {
                studentEmail,
                internshipId: selectedItem._id,
                coverLetter: coverLetter.trim() || "I am interested in this internship opportunity.",
            });

            setAppliedIds((prev) => [...prev, selectedItem._id]);
            setApplicationCount((prev) => prev + 1);
            setShowCoverLetter(false);
            setCoverLetter("");
            setDetailModalVisible(false);

            Alert.alert(
                "🎉 Application Submitted!",
                `Your application for "${selectedItem.title}" at ${selectedItem.company} has been submitted successfully.`
            );
        } catch (err: any) {
            Alert.alert("Error", err?.response?.data?.error || "Failed to submit application.");
        } finally {
            setApplying(false);
        }
    };

    const renderSkillBadge = (skill: string, isMatched: boolean) => (
        <View key={skill} style={[styles.skillItem, isMatched && styles.skillItemMatched]}>
            {isMatched && (
                <MaterialCommunityIcons name="check-circle" size={11} color="#059669" style={{ marginRight: 3 }} />
            )}
            <Text style={[styles.skillText, isMatched && styles.skillTextMatched]}>{skill}</Text>
        </View>
    );

    const renderInternshipCard = ({ item }: { item: any }) => {
        const isApplied = appliedIds.includes(item._id);
        const matchColor = getMatchColor(item.matchScore);
        const isHighMatch = item.matchScore >= 70;
        const studentSkillsLower = studentSkills.map((s) => s.toLowerCase());

        return (
            <Animatable.View animation="fadeInUp" style={[styles.card, isHighMatch && styles.highMatchCard, isApplied && styles.appliedCard]}>
                {isHighMatch && (
                    <View style={styles.topMatchBadge}>
                        <MaterialCommunityIcons name="star" size={12} color="#FFF" />
                        <Text style={styles.topMatchText}>Top Match</Text>
                    </View>
                )}

                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Image source={{ uri: item.logo || "https://img.icons8.com/color/96/briefcase.png" }} style={styles.companyLogo} />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                            <Text style={styles.cardCompany}>{item.company}</Text>
                            <View style={styles.locationRow}>
                                <Ionicons name="location-outline" size={12} color="#9CA3AF" />
                                <Text style={styles.locationText}>{item.location}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.aiMatchContainer}>
                        <View style={styles.aiMatchHeader}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <MaterialCommunityIcons name="brain" size={14} color="#193648" />
                                <Text style={styles.aiMatchTitle}> Skill Match</Text>
                            </View>
                            <Text style={[styles.aiMatchPercent, { color: matchColor }]}>{item.matchScore}%</Text>
                        </View>
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: `${Math.max(item.matchScore, 5)}%`, backgroundColor: matchColor }]} />
                        </View>
                    </View>

                    <View style={styles.tagRow}>
                        <View style={styles.domainTag}><Text style={styles.domainText}>{item.domain}</Text></View>
                        <View style={styles.typeTag}><Text style={styles.typeText}>{item.type}</Text></View>
                        <View style={styles.stipendTag}><Text style={styles.stipendText}>{item.stipend}</Text></View>
                    </View>

                    <View style={styles.skillsRow}>
                        {item.requiredSkills?.slice(0, 4).map((skill: string) => {
                            const matched = studentSkillsLower.some(s => s.includes(skill.toLowerCase()) || skill.toLowerCase().includes(s));
                            return renderSkillBadge(skill, matched);
                        })}
                    </View>

                    <TouchableOpacity
                        style={[styles.detailsBtn, isApplied && styles.appliedBtn]}
                        onPress={() => { setSelectedItem(item); setDetailModalVisible(true); }}
                    >
                        {isApplied ? (
                            <>
                                <Ionicons name="checkmark-circle" size={18} color="#059669" />
                                <Text style={[styles.detailsBtnText, { color: "#059669" }]}>Applied</Text>
                            </>
                        ) : (
                            <>
                                <Text style={styles.detailsBtnText}>View & Apply</Text>
                                <Ionicons name="arrow-forward" size={18} color="#FFF" />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
                <View style={styles.hero}>
                    {/* Cycling background images (video-like) */}
                    {HERO_IMAGES.map((uri, i) => (
                        <Animatable.View
                            key={uri}
                            style={[StyleSheet.absoluteFillObject, { opacity: heroIdx === i ? 1 : 0 }]}
                            animation={heroIdx === i ? "fadeIn" : undefined}
                            duration={1200}
                        >
                            <ImageBackground source={{ uri }} style={{ flex: 1 }} resizeMode="cover" />
                        </Animatable.View>
                    ))}

                    {/* Dark navy gradient overlay */}
                    <View style={styles.heroOverlay}>
                        {/* Live pulse dot — feels like a video */}
                        <View style={styles.heroLiveRow}>
                            <Animatable.View
                                animation={{ 0: { opacity: 1 }, 0.5: { opacity: 0.3 }, 1: { opacity: 1 } }}
                                iterationCount="infinite"
                                duration={1400}
                                style={styles.liveDot}
                            />
                            <Text style={styles.liveText}>EXPLORE • LIVE OPPORTUNITIES</Text>
                        </View>

                        <Animatable.Text
                            animation="fadeInUp"
                            duration={700}
                            style={styles.heroTitle}
                        >
                            Smart Matches
                        </Animatable.Text>

                        <Animatable.Text
                            animation="fadeInUp"
                            delay={150}
                            duration={700}
                            style={styles.heroSubtitle}
                        >
                            {studentSkills.length > 0
                                ? `Filtered by ${studentSkills.length} skills from your CV`
                                : "Upload CV for personalized matching"}
                        </Animatable.Text>

                        <Animatable.View
                            animation="fadeInUp"
                            delay={300}
                            duration={700}
                            style={styles.heroBadgeRow}
                        >
                            <View style={styles.appCountBadge}>
                                <MaterialCommunityIcons name="briefcase-check" size={14} color="#FFF" />
                                <Text style={styles.appCountText}>{applicationCount} Applied</Text>
                            </View>
                            <View style={[styles.appCountBadge, { backgroundColor: "rgba(245,158,11,0.25)" }]}>
                                <MaterialCommunityIcons name="lightning-bolt" size={14} color="#FBBF24" />
                                <Text style={[styles.appCountText, { color: "#FBBF24" }]}>AI Powered</Text>
                            </View>
                        </Animatable.View>

                        {/* Slide indicator dots */}
                        <View style={styles.heroDots}>
                            {HERO_IMAGES.map((_, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.heroDot,
                                        heroIdx === i && styles.heroDotActive,
                                    ]}
                                />
                            ))}
                        </View>
                    </View>
                </View>

                <View style={styles.filterSection}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color="#95A5A6" />
                        <TextInput placeholder="Search by title, company, domain..." style={styles.searchInput} value={search} onChangeText={setSearch} placeholderTextColor="#9CA3AF" />
                        {search.length > 0 && (
                            <TouchableOpacity onPress={() => setSearch("")}><Ionicons name="close-circle" size={18} color="#9CA3AF" /></TouchableOpacity>
                        )}
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.domainScroll} contentContainerStyle={{ paddingRight: 20 }}>
                        {DOMAINS.map((d) => (
                            <TouchableOpacity key={d} style={[styles.chip, selectedDomain === d && styles.activeChip]} onPress={() => setSelectedDomain(d)}>
                                <Text style={[styles.chipText, selectedDomain === d && styles.activeChipText]}>{d}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {loading ? (
                    <View style={{ paddingTop: 60, alignItems: "center" }}>
                        <ActivityIndicator size="large" color="#193648" />
                        <Text style={{ marginTop: 12, color: "#6B7280" }}>Finding best matches...</Text>
                    </View>
                ) : filteredData.length === 0 ? (
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons name="briefcase-off" size={64} color="#D1D5DB" />
                        <Text style={styles.emptyTitle}>No Matching Internships</Text>
                        <Text style={styles.emptySubText}>We couldn't find internships matching your skills</Text>
                    </View>
                ) : (
                    <>
                        <View style={styles.resultsHeader}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                <View style={styles.resultsIconBox}>
                                    <MaterialCommunityIcons name="lightning-bolt" size={14} color="#193648" />
                                </View>
                                <Text style={styles.resultsCount}>Opportunities for you</Text>
                            </View>
                            <View style={styles.resultsCountBadge}>
                                <Text style={styles.resultsCountBadgeText}>{filteredData.length}</Text>
                            </View>
                        </View>
                        <FlatList
                            data={filteredData}
                            renderItem={renderInternshipCard}
                            keyExtractor={(item) => item._id}
                            scrollEnabled={false}
                            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}
                        />
                    </>
                )}
            </ScrollView>

            {/* ── DETAIL MODAL — premium ── */}
            <Modal visible={detailModalVisible} animationType="slide">
                <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F7FB" }}>
                    {selectedItem && (
                        <View style={styles.modalRoot}>
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
                                {/* Hero banner with navy gradient */}
                                <View style={styles.modalBanner}>
                                    {/* Top bar: back + share */}
                                    <View style={styles.modalTopBar}>
                                        <TouchableOpacity
                                            style={styles.modalBackBtn}
                                            onPress={() => { setDetailModalVisible(false); setShowCoverLetter(false); setCoverLetter(""); }}
                                        >
                                            <Ionicons name="arrow-back" size={20} color="#FFF" />
                                        </TouchableOpacity>
                                        <View style={styles.modalLiveBadge}>
                                            <View style={styles.modalLiveDot} />
                                            <Text style={styles.modalLiveText}>OPEN POSITION</Text>
                                        </View>
                                    </View>

                                    {/* Logo + title */}
                                    <View style={styles.modalLogoBox}>
                                        <Image
                                            source={{ uri: selectedItem.logo || "https://img.icons8.com/color/96/briefcase.png" }}
                                            style={styles.modalLogoImg}
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                                    <View style={styles.modalCompanyRow}>
                                        <MaterialCommunityIcons name="office-building" size={14} color="rgba(255,255,255,0.85)" />
                                        <Text style={styles.modalCompany}>{selectedItem.company}</Text>
                                    </View>

                                    {/* Key info pills inside hero */}
                                    <View style={styles.modalPillRow}>
                                        {selectedItem.location && (
                                            <View style={styles.modalPill}>
                                                <Ionicons name="location" size={11} color="#FFF" />
                                                <Text style={styles.modalPillText}>{selectedItem.location}</Text>
                                            </View>
                                        )}
                                        {selectedItem.type && (
                                            <View style={styles.modalPill}>
                                                <MaterialCommunityIcons name="briefcase-clock" size={11} color="#FFF" />
                                                <Text style={styles.modalPillText}>{selectedItem.type}</Text>
                                            </View>
                                        )}
                                        {selectedItem.stipend && (
                                            <View style={styles.modalPill}>
                                                <MaterialCommunityIcons name="cash-multiple" size={11} color="#FFF" />
                                                <Text style={styles.modalPillText}>{selectedItem.stipend}</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>

                                <View style={styles.modalBody}>
                                    {/* Match score card */}
                                    <View style={styles.matchCard}>
                                        <View style={styles.matchIconBox}>
                                            <MaterialCommunityIcons name="brain" size={20} color="#193648" />
                                        </View>
                                        <View style={{ flex: 1, marginLeft: 12 }}>
                                            <Text style={styles.matchCardTitle}>AI Skill Match</Text>
                                            <View style={styles.matchProgressBg}>
                                                <View style={[styles.matchProgressFill, { width: `${Math.max(selectedItem.matchScore || 0, 5)}%` }]} />
                                            </View>
                                        </View>
                                        <Text style={styles.matchScoreVal}>{selectedItem.matchScore || 0}%</Text>
                                    </View>

                                    {/* Quick stats grid */}
                                    {selectedItem.duration && (
                                        <View style={styles.statsGrid}>
                                            <View style={styles.statBox}>
                                                <MaterialCommunityIcons name="calendar-clock" size={18} color="#193648" />
                                                <Text style={styles.statLabel}>Duration</Text>
                                                <Text style={styles.statValue}>{selectedItem.duration}</Text>
                                            </View>
                                            {selectedItem.domain && (
                                                <View style={styles.statBox}>
                                                    <MaterialCommunityIcons name="tag-outline" size={18} color="#193648" />
                                                    <Text style={styles.statLabel}>Domain</Text>
                                                    <Text style={styles.statValue} numberOfLines={1}>{selectedItem.domain}</Text>
                                                </View>
                                            )}
                                        </View>
                                    )}

                                    {/* About section */}
                                    <View style={styles.sectionHeader}>
                                        <View style={styles.sectionDot} />
                                        <Text style={styles.sectionTitle}>About the Role</Text>
                                    </View>
                                    <View style={styles.sectionCard}>
                                        <Text style={styles.sectionBody}>{selectedItem.description || "No description provided."}</Text>
                                    </View>

                                    {/* Required skills */}
                                    {selectedItem.requiredSkills?.length > 0 && (
                                        <>
                                            <View style={styles.sectionHeader}>
                                                <View style={styles.sectionDot} />
                                                <Text style={styles.sectionTitle}>Required Skills</Text>
                                            </View>
                                            <View style={styles.skillsCloud}>
                                                {selectedItem.requiredSkills.map((skill: string, i: number) => {
                                                    const matched = studentSkills.map(s => s.toLowerCase()).some(s => s.includes(skill.toLowerCase()) || skill.toLowerCase().includes(s));
                                                    return (
                                                        <View key={i} style={[styles.skillChip, matched && styles.skillChipMatched]}>
                                                            {matched && <Ionicons name="checkmark-circle" size={11} color="#193648" />}
                                                            <Text style={[styles.skillChipText, matched && styles.skillChipTextMatched]}>{skill}</Text>
                                                        </View>
                                                    );
                                                })}
                                            </View>
                                        </>
                                    )}

                                    {/* Cover letter or apply */}
                                    {showCoverLetter ? (
                                        <View>
                                            <View style={styles.sectionHeader}>
                                                <View style={styles.sectionDot} />
                                                <Text style={styles.sectionTitle}>Your Cover Letter</Text>
                                            </View>
                                            <TextInput
                                                style={styles.coverLetterInput}
                                                placeholder="Tell us why you'd be a great fit for this role..."
                                                placeholderTextColor="#94A3B8"
                                                multiline
                                                value={coverLetter}
                                                onChangeText={setCoverLetter}
                                                textAlignVertical="top"
                                            />
                                            <Text style={styles.coverLetterHint}>
                                                {coverLetter.length} characters · Optional but recommended
                                            </Text>
                                            <TouchableOpacity
                                                style={[styles.mainApplyBtn, applying && { opacity: 0.7 }]}
                                                onPress={submitApplication}
                                                disabled={applying}
                                                activeOpacity={0.85}
                                            >
                                                {applying ? (
                                                    <ActivityIndicator color="#FFF" />
                                                ) : (
                                                    <>
                                                        <Ionicons name="send" size={16} color="#FFF" />
                                                        <Text style={styles.mainApplyBtnText}>Submit Application</Text>
                                                    </>
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    ) : !appliedIds.includes(selectedItem._id) ? (
                                        <TouchableOpacity
                                            style={styles.mainApplyBtn}
                                            onPress={handleApply}
                                            activeOpacity={0.85}
                                        >
                                            <Ionicons name="rocket-outline" size={16} color="#FFF" />
                                            <Text style={styles.mainApplyBtnText}>Apply Now</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <View style={styles.appliedState}>
                                            <View style={styles.appliedIconCircle}>
                                                <Ionicons name="checkmark" size={26} color="#FFF" />
                                            </View>
                                            <Text style={styles.appliedText}>Application Submitted</Text>
                                            <Text style={styles.appliedSubText}>
                                                We&apos;ll notify you once the company responds
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </ScrollView>
                        </View>
                    )}
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#F0F4F8" },
    hero: {
        width: "100%",
        height: 230,
        position: "relative",
        overflow: "hidden",
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },
    heroOverlay: {
        flex: 1,
        backgroundColor: "rgba(15, 36, 56, 0.78)",
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingVertical: 22,
    },
    heroLiveRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 10,
        backgroundColor: "rgba(0,0,0,0.3)",
        alignSelf: "flex-start",
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(239,68,68,0.5)",
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#EF4444",
    },
    liveText: {
        color: "#FFFFFF",
        fontSize: 9.5,
        fontWeight: "800",
        letterSpacing: 1.2,
    },
    heroTitle: { fontSize: 28, fontWeight: "800", color: "#FFF", letterSpacing: -0.5 },
    heroSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 4 },
    heroBadgeRow: { flexDirection: "row", gap: 8, marginTop: 12 },
    appCountBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.18)",
        paddingHorizontal: 11,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 5,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
    },
    appCountText: { color: "#FFF", fontSize: 11.5, fontWeight: "700" },
    heroDots: {
        flexDirection: "row",
        gap: 5,
        position: "absolute",
        bottom: 14,
        right: 24,
    },
    heroDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "rgba(255,255,255,0.35)",
    },
    heroDotActive: {
        width: 18,
        backgroundColor: "#FFFFFF",
    },
    filterSection: {
        backgroundColor: "#FFF",
        paddingVertical: 14,
        paddingTop: 16,
        shadowColor: "#193648",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 3,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F4F7FB",
        marginHorizontal: 16,
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 48,
        borderWidth: 1,
        borderColor: "#EEF2F6",
    },
    searchInput: { flex: 1, fontSize: 14.5, color: "#111827", marginLeft: 8, padding: 0 },
    domainScroll: { marginTop: 14, paddingLeft: 16 },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: "#fff",
        borderRadius: 22,
        marginRight: 8,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    activeChip: {
        backgroundColor: "#193648",
        borderColor: "#193648",
        shadowColor: "#193648",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 4,
    },
    chipText: { color: "#64748B", fontWeight: "700", fontSize: 12.5 },
    activeChipText: { color: "#FFF" },

    resultsHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        paddingTop: 16,
        paddingBottom: 6,
    },
    resultsCount: { fontSize: 13, fontWeight: "800", color: "#193648", letterSpacing: 0.5, textTransform: "uppercase" },
    resultsIconBox: {
        width: 26,
        height: 26,
        borderRadius: 8,
        backgroundColor: "#E8F0F5",
        alignItems: "center",
        justifyContent: "center",
    },
    resultsCountBadge: {
        backgroundColor: "#193648",
        minWidth: 28,
        height: 24,
        borderRadius: 12,
        paddingHorizontal: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    resultsCountBadgeText: { color: "#fff", fontSize: 12, fontWeight: "800" },

    card: {
        backgroundColor: "#FFF",
        borderRadius: 20,
        marginBottom: 14,
        marginHorizontal: 16,
        shadowColor: "#193648",
        shadowOpacity: 0.10,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 16,
        elevation: 5,
        overflow: "hidden",
    },
    highMatchCard: {
        shadowColor: "#193648",
        shadowOpacity: 0.18,
    },
    appliedCard: {
        backgroundColor: "#F0FDF4",
    },
    topMatchBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#193648",
        alignSelf: "flex-start",
        marginLeft: 16,
        marginTop: 14,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        gap: 5,
    },
    topMatchText: { color: "#FFF", fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
    cardContent: { padding: 18 },
    cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 14, gap: 12 },
    companyLogo: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: "#F4F7FB",
    },
    cardTitle: { fontSize: 15, fontWeight: "800", color: "#0F172A", flex: 1, lineHeight: 20 },
    cardCompany: { fontSize: 13, color: "#475569", fontWeight: "600", marginTop: 4 },
    locationRow: { flexDirection: "row", alignItems: "center", marginTop: 5, gap: 4 },
    locationText: { fontSize: 11.5, color: "#94A3B8", fontWeight: "500" },

    aiMatchContainer: {
        marginBottom: 14,
        backgroundColor: "#F4F7FB",
        borderRadius: 12,
        paddingVertical: 11,
        paddingHorizontal: 12,
    },
    aiMatchHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
    aiMatchTitle: { fontSize: 12, color: "#193648", fontWeight: "700", marginLeft: 4 },
    aiMatchPercent: { fontSize: 14, fontWeight: "800", color: "#193648" },
    progressBarBg: { height: 6, backgroundColor: "#E2E8F0", borderRadius: 3, overflow: "hidden" },
    progressBarFill: { height: "100%", borderRadius: 3, backgroundColor: "#193648" },

    tagRow: { flexDirection: "row", gap: 6, marginBottom: 14, flexWrap: "wrap" },
    domainTag: {
        backgroundColor: "#E8F0F5",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    domainText: { color: "#193648", fontSize: 10.5, fontWeight: "700" },
    typeTag: {
        backgroundColor: "#EFF4F8",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    typeText: { color: "#2A5A72", fontSize: 10.5, fontWeight: "700" },
    stipendTag: {
        backgroundColor: "#F0F4F8",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    stipendText: { color: "#0F2438", fontSize: 10.5, fontWeight: "700" },

    skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 16 },
    skillItem: {
        backgroundColor: "#F1F5F9",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    skillItemMatched: { backgroundColor: "#E8F0F5" },
    skillText: { color: "#475569", fontSize: 11, fontWeight: "600" },
    skillTextMatched: { color: "#193648", fontWeight: "800" },

    detailsBtn: {
        backgroundColor: "#193648",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 13,
        borderRadius: 14,
        gap: 8,
        shadowColor: "#193648",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 4,
    },
    appliedBtn: {
        backgroundColor: "#DCFCE7",
        shadowOpacity: 0,
        elevation: 0,
    },
    detailsBtnText: { color: "#FFF", fontWeight: "800", fontSize: 13.5, letterSpacing: 0.3 },

    emptyState: { alignItems: "center", paddingTop: 60, paddingHorizontal: 24 },
    emptyTitle: { fontSize: 18, fontWeight: "800", color: "#193648", marginTop: 16 },
    emptySubText: { fontSize: 13.5, color: "#64748B", textAlign: "center", paddingHorizontal: 16, marginTop: 8, lineHeight: 20 },
    modalRoot: { flex: 1 },
    closeBtn: { position: "absolute", top: 10, right: 10, zIndex: 10 },

    /* Banner */
    modalBanner: {
        backgroundColor: "#193648",
        paddingHorizontal: 22,
        paddingTop: 16,
        paddingBottom: 28,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: "center",
        shadowColor: "#193648",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 14,
        elevation: 10,
    },
    modalTopBar: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    modalBackBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "rgba(255,255,255,0.18)",
        alignItems: "center",
        justifyContent: "center",
    },
    modalLiveBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: "rgba(34,197,94,0.2)",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(34,197,94,0.5)",
    },
    modalLiveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#22C55E" },
    modalLiveText: { color: "#86EFAC", fontSize: 9.5, fontWeight: "800", letterSpacing: 1 },

    modalLogoBox: {
        width: 78,
        height: 78,
        borderRadius: 22,
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
        padding: 10,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 4,
    },
    modalLogoImg: { width: "100%", height: "100%" },
    modalTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#FFF",
        textAlign: "center",
        letterSpacing: -0.3,
    },
    modalCompanyRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginTop: 4,
    },
    modalCompany: { fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: "600" },

    modalPillRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 6,
        marginTop: 14,
    },
    modalPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "rgba(255,255,255,0.18)",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
    },
    modalPillText: { color: "#FFF", fontSize: 11, fontWeight: "700" },

    /* Body */
    modalBody: { paddingHorizontal: 18, paddingTop: 18 },

    /* Match score card */
    matchCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#193648",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 3,
    },
    matchIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#E8F0F5",
        alignItems: "center",
        justifyContent: "center",
    },
    matchCardTitle: { fontSize: 12, color: "#64748B", fontWeight: "700", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
    matchProgressBg: { height: 6, backgroundColor: "#E2E8F0", borderRadius: 3, overflow: "hidden" },
    matchProgressFill: { height: "100%", backgroundColor: "#193648", borderRadius: 3 },
    matchScoreVal: { fontSize: 22, fontWeight: "800", color: "#193648", marginLeft: 12 },

    /* Stats grid */
    statsGrid: { flexDirection: "row", gap: 10, marginBottom: 18 },
    statBox: {
        flex: 1,
        backgroundColor: "#FFF",
        padding: 14,
        borderRadius: 14,
        gap: 4,
        shadowColor: "#193648",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
        elevation: 2,
    },
    statLabel: { fontSize: 10.5, color: "#94A3B8", fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.3, marginTop: 4 },
    statValue: { fontSize: 13.5, color: "#193648", fontWeight: "800" },

    /* Section */
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
        marginTop: 6,
    },
    sectionDot: { width: 4, height: 18, backgroundColor: "#193648", borderRadius: 2 },
    sectionTitle: { fontSize: 15, fontWeight: "800", color: "#193648", letterSpacing: 0.2 },
    sectionCard: {
        backgroundColor: "#FFF",
        padding: 14,
        borderRadius: 14,
        marginBottom: 18,
        shadowColor: "#193648",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 1,
    },
    sectionBody: { fontSize: 13.5, color: "#475569", lineHeight: 21 },

    /* Skills cloud */
    skillsCloud: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
        marginBottom: 22,
    },
    skillChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "#fff",
        paddingHorizontal: 11,
        paddingVertical: 7,
        borderRadius: 12,
        shadowColor: "#193648",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 1,
    },
    skillChipMatched: { backgroundColor: "#E8F0F5" },
    skillChipText: { fontSize: 12, color: "#64748B", fontWeight: "600" },
    skillChipTextMatched: { color: "#193648", fontWeight: "800" },

    /* Cover letter */
    coverLetterInput: {
        backgroundColor: "#FFF",
        borderRadius: 14,
        padding: 14,
        minHeight: 130,
        marginBottom: 6,
        fontSize: 14,
        color: "#0F172A",
        shadowColor: "#193648",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
        elevation: 2,
    },
    coverLetterHint: {
        fontSize: 11,
        color: "#94A3B8",
        textAlign: "right",
        marginBottom: 16,
        fontWeight: "500",
    },

    /* Apply button */
    mainApplyBtn: {
        backgroundColor: "#193648",
        flexDirection: "row",
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        marginTop: 6,
        shadowColor: "#193648",
        shadowOpacity: 0.35,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
        elevation: 6,
    },
    mainApplyBtnText: { color: "#FFF", fontWeight: "800", fontSize: 15, letterSpacing: 0.4 },

    /* Applied state */
    appliedState: {
        alignItems: "center",
        padding: 28,
        backgroundColor: "#F0FDF4",
        borderRadius: 16,
        marginTop: 10,
    },
    appliedIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#10B981",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
        shadowColor: "#10B981",
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 4,
    },
    appliedText: { fontSize: 17, fontWeight: "800", color: "#059669" },
    appliedSubText: { fontSize: 12.5, color: "#475569", marginTop: 4, textAlign: "center" }
});

export default InternshipsScreen;