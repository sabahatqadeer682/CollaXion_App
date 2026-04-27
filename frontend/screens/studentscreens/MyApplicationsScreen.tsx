// // export default MyApplicationsScreen;

// import { CONSTANT } from "@/constants/constant";
// import { FontAwesome5, Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "@react-navigation/native";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import {
//     ActivityIndicator,
//     Alert,
//     RefreshControl,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from "react-native";

// const MyApplicationsScreen = () => {
//     const navigation = useNavigation<any>();
//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);
//     const [applications, setApplications] = useState<any[]>([]);

//     const fetchApplications = async () => {
//         try {
//             const email = await AsyncStorage.getItem("studentEmail");
//             if (!email) {
//                 Alert.alert("Error", "Please login first");
//                 return;
//             }

//             const response = await axios.get(`${CONSTANT.API_BASE_URL}/api/student/my-applications/${email}`);
//             if (response.data.success) {
//                 setApplications(response.data.applications || []);
//             } else {
//                 setApplications([]);
//             }
//         } catch (err: any) {
//             console.error("Error fetching applications:", err);
//             Alert.alert("Error", "Failed to load applications");
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     };

//     useEffect(() => { fetchApplications(); }, []);
//     useEffect(() => {
//         const unsubscribe = navigation.addListener("focus", () => fetchApplications());
//         return unsubscribe;
//     }, [navigation]);

//     const onRefresh = () => {
//         setRefreshing(true);
//         fetchApplications();
//     };

//     const getStatusColor = (status: string) => {
//         switch (status) {
//             case "pending": return "#F39C12";
//             case "internship_approved": return "#3498DB";
//             case "industry_approved": return "#9B59B6";
//             case "selected": return "#27AE60";
//             case "rejected": return "#E74C3C";
//             default: return "#95A5A6";
//         }
//     };

//     const getStatusText = (status: string) => {
//         switch (status) {
//             case "pending": return "Pending Review";
//             case "internship_approved": return "Internship Incharge Approved";
//             case "industry_approved": return "Industry Liaison Approved";
//             case "selected": return "Selected ✅";
//             case "rejected": return "Rejected";
//             default: return status;
//         }
//     };

//     const getStatusIcon = (status: string) => {
//         switch (status) {
//             case "pending": return "hourglass-half";
//             case "internship_approved": return "check-circle";
//             case "industry_approved": return "check-double";
//             case "selected": return "trophy";
//             case "rejected": return "times-circle";
//             default: return "question-circle";
//         }
//     };

//     if (loading) {
//         return (
//             <View style={styles.loaderContainer}>
//                 <ActivityIndicator size="large" color="#193648" />
//                 <Text style={styles.loadingText}>Loading applications...</Text>
//             </View>
//         );
//     }

//     return (
//         <ScrollView
//             style={styles.container}
//             refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//         >
//             <View style={styles.headerSection}>
//                 <Text style={styles.header}> My Applications</Text>
//                 <Text style={styles.subText}>Track your internship applications</Text>
//             </View>

//             <View style={styles.statsContainer}>
//                 <View style={styles.statBox}>
//                     <Text style={styles.statNumber}>{applications.length}</Text>
//                     <Text style={styles.statLabel}>Total</Text>
//                 </View>
//                 <View style={styles.statBox}>
//                     <Text style={[styles.statNumber, { color: "#F39C12" }]}>
//                         {applications.filter(a => a.status === "pending").length}
//                     </Text>
//                     <Text style={styles.statLabel}>Pending</Text>
//                 </View>
//                 <View style={styles.statBox}>
//                     <Text style={[styles.statNumber, { color: "#27AE60" }]}>
//                         {applications.filter(a => a.status === "selected").length}
//                     </Text>
//                     <Text style={styles.statLabel}>Selected</Text>
//                 </View>
//             </View>

//             {applications.length === 0 ? (
//                 <View style={styles.emptyState}>
//                     <Ionicons name="document-text-outline" size={60} color="#BDC3C7" />
//                     <Text style={styles.emptyTitle}>No Applications Yet</Text>
//                     <Text style={styles.emptyText}>Start applying for internships to see them here</Text>
//                     <TouchableOpacity
//                         style={styles.browseButton}
//                         onPress={() => navigation.navigate("AI Recommendations")}
//                     >
//                         <Text style={styles.browseButtonText}>Browse Internships</Text>
//                     </TouchableOpacity>
//                 </View>
//             ) : (
//                 <View style={styles.applicationsSection}>
//                     {applications.map((app, idx) => (
//                         <View key={idx} style={styles.applicationCard}>
//                             <View style={[styles.statusBadge, { backgroundColor: getStatusColor(app.status) }]}>
//                                 <FontAwesome5 name={getStatusIcon(app.status)} size={12} color="#fff" />
//                                 <Text style={styles.statusBadgeText}>{getStatusText(app.status)}</Text>
//                             </View>
//                             <Text style={styles.appTitle}>{app.internshipId?.title || "N/A"}</Text>
//                             <Text style={styles.companyText}>{app.internshipId?.company || "N/A"}</Text>
//                         </View>
//                     ))}
//                 </View>
//             )}
//         </ScrollView>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#F7F9FC" },
//     loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//     loadingText: { marginTop: 10, fontSize: 14, color: "#7F8C8D" },
//     headerSection: { padding: 20, backgroundColor: "#193648", borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
//     header: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 5 },
//     subText: { fontSize: 14, color: "#BDC3C7" },
//     statsContainer: { flexDirection: "row", justifyContent: "space-around", padding: 15, marginHorizontal: 15, marginTop: -20, backgroundColor: "#fff", borderRadius: 12, elevation: 3 },
//     statBox: { alignItems: "center" },
//     statNumber: { fontSize: 24, fontWeight: "bold", color: "#193648" },
//     statLabel: { fontSize: 12, color: "#7F8C8D", marginTop: 4 },
//     applicationsSection: { padding: 15 },
//     applicationCard: { backgroundColor: "#fff", padding: 15, borderRadius: 12, marginBottom: 15, elevation: 3 },
//     statusBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, marginBottom: 10 },
//     statusBadgeText: { color: "#fff", fontSize: 11, fontWeight: "bold", marginLeft: 5 },
//     appTitle: { fontSize: 16, fontWeight: "bold", color: "#2C3E50", marginBottom: 5 },
//     companyText: { fontSize: 13, color: "#7F8C8D" },
//     emptyState: { alignItems: "center", justifyContent: "center", padding: 40, marginTop: 50 },
//     emptyTitle: { fontSize: 18, fontWeight: "bold", color: "#2C3E50", marginTop: 15, marginBottom: 8 },
//     emptyText: { fontSize: 14, color: "#7F8C8D", textAlign: "center", marginBottom: 20 },
//     browseButton: { backgroundColor: "#193648", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
//     browseButtonText: { color: "#fff", fontSize: 14, fontWeight: "600" },
// });

// export default MyApplicationsScreen;



// import { CONSTANT } from "@/constants/constant";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useFocusEffect } from "@react-navigation/native";
// import axios from "axios";
// import React, { useCallback, useState } from "react";
// import {
//     ActivityIndicator,
//     FlatList,
//     Modal,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from "react-native";

// const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: string; step: number }> = {
//     Pending: { color: "#D97706", bg: "#FFFBEB", icon: "clock-outline", step: 1 },
//     "Under Review": { color: "#2563EB", bg: "#EFF6FF", icon: "magnify", step: 2 },
//     Shortlisted: { color: "#7C3AED", bg: "#F5F3FF", icon: "star-outline", step: 3 },
//     Approved: { color: "#059669", bg: "#ECFDF5", icon: "check-circle", step: 4 },
//     Rejected: { color: "#DC2626", bg: "#FEF2F2", icon: "close-circle", step: 0 },
// };

// const STEPS = ["Pending", "Under Review", "Shortlisted", "Approved"];

// const MyApplicationsScreen = () => {
//     const [applications, setApplications] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedApp, setSelectedApp] = useState<any>(null);
//     const [detailVisible, setDetailVisible] = useState(false);

//     useFocusEffect(
//         useCallback(() => {
//             fetchApplications();
//         }, [])
//     );

//     const fetchApplications = async () => {
//         try {
//             const email = await AsyncStorage.getItem("studentEmail");
//             if (!email) return;
//             const res = await axios.get(`${CONSTANT.API_BASE_URL}/api/applications/${email}`);
//             setApplications(res.data);
//         } catch (err) {
//             console.log("Applications fetch error:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const renderCard = ({ item }: { item: any }) => {
//         const status = item.status || "Pending";
//         const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Pending"];
//         const internship = item.internshipId;

//         return (
//             <TouchableOpacity style={styles.card} onPress={() => { setSelectedApp(item); setDetailVisible(true); }}>
//                 <View style={styles.cardTop}>
//                     <View style={styles.companyIcon}>
//                         <MaterialCommunityIcons name="office-building" size={24} color="#193648" />
//                     </View>
//                     <View style={{ flex: 1, marginLeft: 12 }}>
//                         <Text style={styles.cardTitle} numberOfLines={1}>{internship?.title || "Internship"}</Text>
//                         <Text style={styles.cardCompany}>{internship?.company || "Company"}</Text>
//                     </View>
//                     <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
//                         <MaterialCommunityIcons name={cfg.icon as any} size={12} color={cfg.color} />
//                         <Text style={[styles.statusText, { color: cfg.color }]}>{status}</Text>
//                     </View>
//                 </View>

//                 {/* Progress Bar */}
//                 {status !== "Rejected" && (
//                     <View style={styles.progressContainer}>
//                         {STEPS.map((step, i) => {
//                             const isActive = i < cfg.step;
//                             const isCurrent = i === cfg.step - 1;
//                             return (
//                                 <View key={step} style={styles.progressStep}>
//                                     <View style={[
//                                         styles.progressDot,
//                                         isActive ? styles.progressDotActive : styles.progressDotInactive,
//                                         isCurrent && styles.progressDotCurrent,
//                                     ]}>
//                                         {isActive && !isCurrent && (
//                                             <MaterialCommunityIcons name="check" size={10} color="#fff" />
//                                         )}
//                                     </View>
//                                     {i < STEPS.length - 1 && (
//                                         <View style={[styles.progressLine, isActive && styles.progressLineActive]} />
//                                     )}
//                                 </View>
//                             );
//                         })}
//                     </View>
//                 )}

//                 <View style={styles.cardFooter}>
//                     <Text style={styles.footerText}>
//                         Applied {new Date(item.appliedAt).toDateString()}
//                     </Text>
//                     <Text style={[styles.tapMore, { color: cfg.color }]}>View Details →</Text>
//                 </View>
//             </TouchableOpacity>
//         );
//     };

//     return (
//         <View style={styles.container}>
//             <View style={styles.summaryRow}>
//                 <View style={styles.summaryChip}>
//                     <Text style={styles.summaryNum}>{applications.length}</Text>
//                     <Text style={styles.summaryLabel}>Total</Text>
//                 </View>
//                 <View style={styles.summaryChip}>
//                     <Text style={[styles.summaryNum, { color: "#D97706" }]}>
//                         {applications.filter(a => a.status === "Pending").length}
//                     </Text>
//                     <Text style={styles.summaryLabel}>Pending</Text>
//                 </View>
//                 <View style={styles.summaryChip}>
//                     <Text style={[styles.summaryNum, { color: "#7C3AED" }]}>
//                         {applications.filter(a => a.status === "Shortlisted").length}
//                     </Text>
//                     <Text style={styles.summaryLabel}>Shortlisted</Text>
//                 </View>
//                 <View style={styles.summaryChip}>
//                     <Text style={[styles.summaryNum, { color: "#059669" }]}>
//                         {applications.filter(a => a.status === "Approved").length}
//                     </Text>
//                     <Text style={styles.summaryLabel}>Approved</Text>
//                 </View>
//             </View>

//             {loading ? (
//                 <ActivityIndicator color="#193648" size="large" style={{ marginTop: 60 }} />
//             ) : (
//                 <FlatList
//                     data={applications}
//                     keyExtractor={(item) => item._id}
//                     renderItem={renderCard}
//                     contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
//                     ListEmptyComponent={
//                         <View style={styles.emptyState}>
//                             <MaterialCommunityIcons name="briefcase-off" size={64} color="#D1D5DB" />
//                             <Text style={styles.emptyTitle}>No Applications Yet</Text>
//                             <Text style={styles.emptySubText}>Browse internships and start applying!</Text>
//                         </View>
//                     }
//                 />
//             )}

//             {/* Detail Modal */}
//             <Modal visible={detailVisible} animationType="slide" transparent>
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.detailModal}>
//                         <View style={styles.modalHeader}>
//                             <Text style={styles.modalTitle}>Application Details</Text>
//                             <TouchableOpacity onPress={() => setDetailVisible(false)} style={styles.closeBtn}>
//                                 <Ionicons name="close" size={20} color="#374151" />
//                             </TouchableOpacity>
//                         </View>

//                         <ScrollView showsVerticalScrollIndicator={false}>
//                             {selectedApp && (() => {
//                                 const status = selectedApp.status || "Pending";
//                                 const cfg = STATUS_CONFIG[status];
//                                 const internship = selectedApp.internshipId;
//                                 return (
//                                     <>
//                                         <View style={[styles.statusCard, { backgroundColor: cfg.bg }]}>
//                                             <MaterialCommunityIcons name={cfg.icon as any} size={36} color={cfg.color} />
//                                             <Text style={[styles.statusBigText, { color: cfg.color }]}>{status}</Text>
//                                             <Text style={styles.statusDesc}>
//                                                 {status === "Pending" && "Your application is in queue for review"}
//                                                 {status === "Under Review" && "The team is actively reviewing your profile"}
//                                                 {status === "Shortlisted" && "Congratulations! You've been shortlisted 🎉"}
//                                                 {status === "Approved" && "You've been selected for this internship! 🎊"}
//                                                 {status === "Rejected" && "Unfortunately, you weren't selected this time"}
//                                             </Text>
//                                         </View>

//                                         <Text style={styles.detailSectionTitle}>Internship Info</Text>
//                                         <View style={styles.infoGrid}>
//                                             <View style={styles.infoBox}><Text style={styles.infoLabel}>Position</Text><Text style={styles.infoValue}>{internship?.title}</Text></View>
//                                             <View style={styles.infoBox}><Text style={styles.infoLabel}>Company</Text><Text style={styles.infoValue}>{internship?.company}</Text></View>
//                                             <View style={styles.infoBox}><Text style={styles.infoLabel}>Type</Text><Text style={styles.infoValue}>{internship?.type}</Text></View>
//                                             <View style={styles.infoBox}><Text style={styles.infoLabel}>Duration</Text><Text style={styles.infoValue}>{internship?.duration}</Text></View>
//                                         </View>

//                                         {selectedApp.coverLetter && (
//                                             <>
//                                                 <Text style={styles.detailSectionTitle}>Your Cover Letter</Text>
//                                                 <View style={styles.coverLetterBox}>
//                                                     <Text style={styles.coverLetterText}>{selectedApp.coverLetter}</Text>
//                                                 </View>
//                                             </>
//                                         )}

//                                         <Text style={styles.detailSectionTitle}>Status History</Text>
//                                         {selectedApp.statusHistory?.map((h: any, i: number) => (
//                                             <View key={i} style={styles.historyItem}>
//                                                 <View style={[styles.historyDot, { backgroundColor: STATUS_CONFIG[h.status]?.color || "#9CA3AF" }]} />
//                                                 <View>
//                                                     <Text style={styles.historyStatus}>{h.status}</Text>
//                                                     <Text style={styles.historyDate}>{new Date(h.date).toDateString()} • {h.note}</Text>
//                                                 </View>
//                                             </View>
//                                         ))}
//                                     </>
//                                 );
//                             })()}
//                         </ScrollView>
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#F0F4F8" },
//     summaryRow: {
//         flexDirection: "row",
//         backgroundColor: "#fff",
//         padding: 16,
//         gap: 8,
//         borderBottomWidth: 1,
//         borderBottomColor: "#F3F4F6",
//     },
//     summaryChip: { flex: 1, alignItems: "center", paddingVertical: 8 },
//     summaryNum: { fontSize: 22, fontWeight: "800", color: "#193648" },
//     summaryLabel: { fontSize: 11, color: "#6B7280", marginTop: 2 },
//     card: { backgroundColor: "#fff", borderRadius: 20, padding: 18, marginBottom: 14, elevation: 2 },
//     cardTop: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
//     companyIcon: {
//         width: 52, height: 52, borderRadius: 14,
//         backgroundColor: "#EFF6FF", justifyContent: "center", alignItems: "center",
//     },
//     cardTitle: { fontSize: 15, fontWeight: "700", color: "#111827" },
//     cardCompany: { fontSize: 13, color: "#6B7280", marginTop: 2 },
//     statusBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, gap: 4 },
//     statusText: { fontSize: 11, fontWeight: "700" },
//     progressContainer: { flexDirection: "row", alignItems: "center", marginBottom: 14, paddingHorizontal: 4 },
//     progressStep: { flex: 1, flexDirection: "row", alignItems: "center" },
//     progressDot: { width: 20, height: 20, borderRadius: 10, justifyContent: "center", alignItems: "center" },
//     progressDotActive: { backgroundColor: "#193648" },
//     progressDotCurrent: { backgroundColor: "#3B82F6", borderWidth: 2, borderColor: "#BFDBFE" },
//     progressDotInactive: { backgroundColor: "#E5E7EB" },
//     progressLine: { flex: 1, height: 2, backgroundColor: "#E5E7EB", marginHorizontal: 2 },
//     progressLineActive: { backgroundColor: "#193648" },
//     cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//     footerText: { fontSize: 12, color: "#9CA3AF" },
//     tapMore: { fontSize: 12, fontWeight: "600" },
//     emptyState: { alignItems: "center", paddingTop: 80 },
//     emptyTitle: { fontSize: 18, fontWeight: "700", color: "#374151", marginTop: 16 },
//     emptySubText: { fontSize: 14, color: "#9CA3AF", marginTop: 8 },
//     modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
//     detailModal: {
//         backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28,
//         padding: 24, maxHeight: "92%",
//     },
//     modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
//     modalTitle: { fontSize: 20, fontWeight: "800", color: "#111827" },
//     closeBtn: { backgroundColor: "#F3F4F6", borderRadius: 20, padding: 8 },
//     statusCard: { borderRadius: 20, padding: 24, alignItems: "center", marginBottom: 24 },
//     statusBigText: { fontSize: 22, fontWeight: "800", marginTop: 8 },
//     statusDesc: { fontSize: 14, color: "#6B7280", textAlign: "center", marginTop: 6 },
//     detailSectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 10 },
//     infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
//     infoBox: { width: "47%", backgroundColor: "#F9FAFB", borderRadius: 12, padding: 12 },
//     infoLabel: { fontSize: 11, color: "#9CA3AF", fontWeight: "600", textTransform: "uppercase", marginBottom: 4 },
//     infoValue: { fontSize: 14, color: "#111827", fontWeight: "600" },
//     coverLetterBox: { backgroundColor: "#F9FAFB", borderRadius: 14, padding: 16, marginBottom: 20 },
//     coverLetterText: { fontSize: 14, color: "#374151", lineHeight: 22 },
//     historyItem: { flexDirection: "row", alignItems: "flex-start", gap: 14, marginBottom: 14 },
//     historyDot: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
//     historyStatus: { fontSize: 14, fontWeight: "600", color: "#111827" },
//     historyDate: { fontSize: 12, color: "#6B7280", marginTop: 2 },
// });

// export default MyApplicationsScreen;






// import { CONSTANT } from "@/constants/constant";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useFocusEffect } from "@react-navigation/native";
// import axios from "axios";
// import React, { useCallback, useState } from "react";
// import {
//     ActivityIndicator,
//     FlatList,
//     Modal,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from "react-native";

// // ─── Status config ────────────────────────────────────────────────────────────
// // "Send to Liaison" and "Send to Industry" are sub-states of the Shortlisted
// // phase from the industry side. They live at step 3 (same as Shortlisted).
// const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: string; step: number; label?: string }> = {
//     Pending:            { color: "#D97706", bg: "#FFFBEB", icon: "clock-outline",      step: 1 },
//     "Under Review":     { color: "#2563EB", bg: "#EFF6FF", icon: "magnify",             step: 2 },
//     Shortlisted:        { color: "#7C3AED", bg: "#F5F3FF", icon: "star-outline",        step: 3 },
//     "Send to Liaison":  { color: "#7C3AED", bg: "#F5F3FF", icon: "account-arrow-right", step: 3, label: "Shortlisted" },
//     "Send to Industry": { color: "#7C3AED", bg: "#F5F3FF", icon: "domain",              step: 3, label: "Shortlisted" },
//     Approved:           { color: "#059669", bg: "#ECFDF5", icon: "check-decagram",      step: 4 },
//     Rejected:           { color: "#DC2626", bg: "#FEF2F2", icon: "close-circle",        step: 0 },
// };

// const STEPS = ["Pending", "Under Review", "Shortlisted", "Approved"];

// // Helper: group "Send to Liaison" / "Send to Industry" as Approved for the
// // Approved filter on the home screen (they are NOT approved here — keep them
// // as step 3). Only "Approved" itself counts as selected.
// const isApproved  = (s: string) => s === "Approved";
// const isShortlist = (s: string) => ["Shortlisted", "Send to Liaison", "Send to Industry"].includes(s);

// const MyApplicationsScreen = () => {
//     const [applications, setApplications] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedApp, setSelectedApp] = useState<any>(null);
//     const [detailVisible, setDetailVisible] = useState(false);

//     useFocusEffect(
//         useCallback(() => {
//             fetchApplications();
//         }, [])
//     );

//     const fetchApplications = async () => {
//         try {
//             const email = await AsyncStorage.getItem("studentEmail");
//             if (!email) return;
//             const res = await axios.get(`${CONSTANT.API_BASE_URL}/api/applications/${email}`);
//             setApplications(res.data);
//         } catch (err) {
//             console.log("Applications fetch error:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const renderCard = ({ item }: { item: any }) => {
//         const status = item.status || "Pending";
//         const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Pending"];
//         // Display label: "Send to Liaison" → show badge as "Shortlisted" with sub-text
//         const displayLabel = cfg.label || status;
//         const internship = item.internshipId;

//         return (
//             <TouchableOpacity
//                 style={[styles.card, isApproved(status) && styles.cardApproved]}
//                 onPress={() => { setSelectedApp(item); setDetailVisible(true); }}
//             >
//                 {/* Green top accent bar for Approved */}
//                 {isApproved(status) && <View style={styles.approvedAccent} />}

//                 <View style={styles.cardTop}>
//                     <View style={[styles.companyIcon, isApproved(status) && styles.companyIconApproved]}>
//                         <MaterialCommunityIcons
//                             name={isApproved(status) ? "check-decagram" : "office-building"}
//                             size={24}
//                             color={isApproved(status) ? "#059669" : "#193648"}
//                         />
//                     </View>
//                     <View style={{ flex: 1, marginLeft: 12 }}>
//                         <Text style={styles.cardTitle} numberOfLines={1}>{internship?.title || "Internship"}</Text>
//                         <Text style={styles.cardCompany}>{internship?.company || "Company"}</Text>
//                     </View>
//                     <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
//                         <MaterialCommunityIcons name={cfg.icon as any} size={12} color={cfg.color} />
//                         <Text style={[styles.statusText, { color: cfg.color }]}>{displayLabel}</Text>
//                     </View>
//                 </View>

//                 {/* Sub-label for industry-side shortlist statuses */}
//                 {(status === "Send to Liaison" || status === "Send to Industry") && (
//                     <View style={styles.subStatusRow}>
//                         <MaterialCommunityIcons name={cfg.icon as any} size={13} color={cfg.color} />
//                         <Text style={[styles.subStatusText, { color: cfg.color }]}>
//                             {status === "Send to Liaison"
//                                 ? "Forwarded to liaison office"
//                                 : "Forwarded to industry partner"}
//                         </Text>
//                     </View>
//                 )}

//                 {/* Approved celebration row */}
//                 {isApproved(status) && (
//                     <View style={styles.approvedRow}>
//                         <MaterialCommunityIcons name="party-popper" size={16} color="#059669" />
//                         <Text style={styles.approvedRowText}>Congratulations! You've been selected 🎉</Text>
//                     </View>
//                 )}

//                 {/* Progress bar */}
//                 {status !== "Rejected" && (
//                     <View style={styles.progressContainer}>
//                         {STEPS.map((step, i) => {
//                             const isActive  = i < cfg.step;
//                             const isCurrent = i === cfg.step - 1;
//                             return (
//                                 <View key={step} style={styles.progressStep}>
//                                     <View style={[
//                                         styles.progressDot,
//                                         isActive  ? styles.progressDotActive   : styles.progressDotInactive,
//                                         isCurrent && (isApproved(status) ? styles.progressDotApproved : styles.progressDotCurrent),
//                                     ]}>
//                                         {isActive && !isCurrent && (
//                                             <MaterialCommunityIcons name="check" size={10} color="#fff" />
//                                         )}
//                                     </View>
//                                     {i < STEPS.length - 1 && (
//                                         <View style={[
//                                             styles.progressLine,
//                                             isActive && (isApproved(status) ? styles.progressLineApproved : styles.progressLineActive),
//                                         ]} />
//                                     )}
//                                 </View>
//                             );
//                         })}
//                     </View>
//                 )}

//                 <View style={styles.cardFooter}>
//                     <Text style={styles.footerText}>Applied {new Date(item.appliedAt).toDateString()}</Text>
//                     <Text style={[styles.tapMore, { color: cfg.color }]}>View Details →</Text>
//                 </View>
//             </TouchableOpacity>
//         );
//     };

//     return (
//         <View style={styles.container}>
//             {/* Summary chips */}
//             <View style={styles.summaryRow}>
//                 <View style={styles.summaryChip}>
//                     <Text style={styles.summaryNum}>{applications.length}</Text>
//                     <Text style={styles.summaryLabel}>Total</Text>
//                 </View>
//                 <View style={styles.summaryChip}>
//                     <Text style={[styles.summaryNum, { color: "#D97706" }]}>
//                         {applications.filter(a => a.status === "Pending").length}
//                     </Text>
//                     <Text style={styles.summaryLabel}>Pending</Text>
//                 </View>
//                 <View style={styles.summaryChip}>
//                     <Text style={[styles.summaryNum, { color: "#7C3AED" }]}>
//                         {applications.filter(a => isShortlist(a.status)).length}
//                     </Text>
//                     <Text style={styles.summaryLabel}>Shortlisted</Text>
//                 </View>
//                 <View style={styles.summaryChip}>
//                     <Text style={[styles.summaryNum, { color: "#059669" }]}>
//                         {applications.filter(a => isApproved(a.status)).length}
//                     </Text>
//                     <Text style={styles.summaryLabel}>Approved</Text>
//                 </View>
//             </View>

//             {loading ? (
//                 <ActivityIndicator color="#193648" size="large" style={{ marginTop: 60 }} />
//             ) : (
//                 <FlatList
//                     data={applications}
//                     keyExtractor={(item) => item._id}
//                     renderItem={renderCard}
//                     contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
//                     ListEmptyComponent={
//                         <View style={styles.emptyState}>
//                             <MaterialCommunityIcons name="briefcase-off" size={64} color="#D1D5DB" />
//                             <Text style={styles.emptyTitle}>No Applications Yet</Text>
//                             <Text style={styles.emptySubText}>Browse internships and start applying!</Text>
//                         </View>
//                     }
//                 />
//             )}

//             {/* Detail Modal */}
//             <Modal visible={detailVisible} animationType="slide" transparent>
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.detailModal}>
//                         <View style={styles.modalHeader}>
//                             <Text style={styles.modalTitle}>Application Details</Text>
//                             <TouchableOpacity onPress={() => setDetailVisible(false)} style={styles.closeBtn}>
//                                 <Ionicons name="close" size={20} color="#374151" />
//                             </TouchableOpacity>
//                         </View>

//                         <ScrollView showsVerticalScrollIndicator={false}>
//                             {selectedApp && (() => {
//                                 const status = selectedApp.status || "Pending";
//                                 const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Pending"];
//                                 const displayLabel = cfg.label || status;
//                                 const internship = selectedApp.internshipId;
//                                 return (
//                                     <>
//                                         <View style={[styles.statusCard, { backgroundColor: cfg.bg }]}>
//                                             <MaterialCommunityIcons name={cfg.icon as any} size={36} color={cfg.color} />
//                                             <Text style={[styles.statusBigText, { color: cfg.color }]}>{displayLabel}</Text>
//                                             <Text style={styles.statusDesc}>
//                                                 {status === "Pending"            && "Your application is in queue for review"}
//                                                 {status === "Under Review"        && "The team is actively reviewing your profile"}
//                                                 {status === "Shortlisted"         && "Congratulations! You've been shortlisted 🎉"}
//                                                 {status === "Send to Liaison"     && "Your profile has been forwarded to the liaison office 📋"}
//                                                 {status === "Send to Industry"    && "Your profile has been forwarded to the industry partner 🏢"}
//                                                 {status === "Approved"            && "You've been selected for this internship! 🎊"}
//                                                 {status === "Rejected"            && "Unfortunately, you weren't selected this time"}
//                                             </Text>
//                                         </View>

//                                         <Text style={styles.detailSectionTitle}>Internship Info</Text>
//                                         <View style={styles.infoGrid}>
//                                             <View style={styles.infoBox}><Text style={styles.infoLabel}>Position</Text><Text style={styles.infoValue}>{internship?.title}</Text></View>
//                                             <View style={styles.infoBox}><Text style={styles.infoLabel}>Company</Text><Text style={styles.infoValue}>{internship?.company}</Text></View>
//                                             <View style={styles.infoBox}><Text style={styles.infoLabel}>Type</Text><Text style={styles.infoValue}>{internship?.type}</Text></View>
//                                             <View style={styles.infoBox}><Text style={styles.infoLabel}>Duration</Text><Text style={styles.infoValue}>{internship?.duration}</Text></View>
//                                         </View>

//                                         {selectedApp.coverLetter && (
//                                             <>
//                                                 <Text style={styles.detailSectionTitle}>Your Cover Letter</Text>
//                                                 <View style={styles.coverLetterBox}>
//                                                     <Text style={styles.coverLetterText}>{selectedApp.coverLetter}</Text>
//                                                 </View>
//                                             </>
//                                         )}

//                                         <Text style={styles.detailSectionTitle}>Status History</Text>
//                                         {selectedApp.statusHistory?.map((h: any, i: number) => {
//                                             const hCfg = STATUS_CONFIG[h.status] || STATUS_CONFIG["Pending"];
//                                             return (
//                                                 <View key={i} style={styles.historyItem}>
//                                                     <View style={[styles.historyDot, { backgroundColor: hCfg.color }]} />
//                                                     <View>
//                                                         <Text style={styles.historyStatus}>{hCfg.label || h.status}</Text>
//                                                         <Text style={styles.historyDate}>{new Date(h.date).toDateString()} • {h.note}</Text>
//                                                     </View>
//                                                 </View>
//                                             );
//                                         })}
//                                     </>
//                                 );
//                             })()}
//                         </ScrollView>
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#F0F4F8" },
//     summaryRow: {
//         flexDirection: "row",
//         backgroundColor: "#fff",
//         padding: 16,
//         gap: 8,
//         borderBottomWidth: 1,
//         borderBottomColor: "#F3F4F6",
//     },
//     summaryChip: { flex: 1, alignItems: "center", paddingVertical: 8 },
//     summaryNum: { fontSize: 22, fontWeight: "800", color: "#193648" },
//     summaryLabel: { fontSize: 11, color: "#6B7280", marginTop: 2 },

//     // Card
//     card: { backgroundColor: "#fff", borderRadius: 20, padding: 18, marginBottom: 14, elevation: 2, overflow: "hidden" },
//     cardApproved: {
//         backgroundColor: "#F0FDF4",
//         borderWidth: 1.5,
//         borderColor: "#86EFAC",
//         elevation: 4,
//         shadowColor: "#059669",
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.12,
//         shadowRadius: 10,
//     },
//     approvedAccent: {
//         position: "absolute",
//         top: 0, left: 0, right: 0,
//         height: 4,
//         backgroundColor: "#059669",
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//     },
//     approvedRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#DCFCE7",
//         borderRadius: 10,
//         paddingHorizontal: 12,
//         paddingVertical: 7,
//         marginBottom: 14,
//         gap: 6,
//     },
//     approvedRowText: { fontSize: 12, fontWeight: "700", color: "#059669", flex: 1 },

//     subStatusRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#F5F3FF",
//         borderRadius: 10,
//         paddingHorizontal: 12,
//         paddingVertical: 7,
//         marginBottom: 14,
//         gap: 6,
//     },
//     subStatusText: { fontSize: 12, fontWeight: "600" },

//     cardTop: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
//     companyIcon: {
//         width: 52, height: 52, borderRadius: 14,
//         backgroundColor: "#EFF6FF", justifyContent: "center", alignItems: "center",
//     },
//     companyIconApproved: { backgroundColor: "#DCFCE7" },
//     cardTitle: { fontSize: 15, fontWeight: "700", color: "#111827" },
//     cardCompany: { fontSize: 13, color: "#6B7280", marginTop: 2 },
//     statusBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, gap: 4 },
//     statusText: { fontSize: 11, fontWeight: "700" },

//     // Progress
//     progressContainer: { flexDirection: "row", alignItems: "center", marginBottom: 14, paddingHorizontal: 4 },
//     progressStep: { flex: 1, flexDirection: "row", alignItems: "center" },
//     progressDot: { width: 20, height: 20, borderRadius: 10, justifyContent: "center", alignItems: "center" },
//     progressDotActive:   { backgroundColor: "#193648" },
//     progressDotCurrent:  { backgroundColor: "#3B82F6", borderWidth: 2, borderColor: "#BFDBFE" },
//     progressDotApproved: { backgroundColor: "#059669", borderWidth: 2, borderColor: "#A7F3D0" },
//     progressDotInactive: { backgroundColor: "#E5E7EB" },
//     progressLine:         { flex: 1, height: 2, backgroundColor: "#E5E7EB", marginHorizontal: 2 },
//     progressLineActive:   { backgroundColor: "#193648" },
//     progressLineApproved: { backgroundColor: "#059669" },

//     cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//     footerText: { fontSize: 12, color: "#9CA3AF" },
//     tapMore: { fontSize: 12, fontWeight: "600" },
//     emptyState: { alignItems: "center", paddingTop: 80 },
//     emptyTitle: { fontSize: 18, fontWeight: "700", color: "#374151", marginTop: 16 },
//     emptySubText: { fontSize: 14, color: "#9CA3AF", marginTop: 8 },

//     // Modal
//     modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
//     detailModal: { backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, maxHeight: "92%" },
//     modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
//     modalTitle: { fontSize: 20, fontWeight: "800", color: "#111827" },
//     closeBtn: { backgroundColor: "#F3F4F6", borderRadius: 20, padding: 8 },
//     statusCard: { borderRadius: 20, padding: 24, alignItems: "center", marginBottom: 24 },
//     statusBigText: { fontSize: 22, fontWeight: "800", marginTop: 8 },
//     statusDesc: { fontSize: 14, color: "#6B7280", textAlign: "center", marginTop: 6 },
//     detailSectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 10 },
//     infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
//     infoBox: { width: "47%", backgroundColor: "#F9FAFB", borderRadius: 12, padding: 12 },
//     infoLabel: { fontSize: 11, color: "#9CA3AF", fontWeight: "600", textTransform: "uppercase", marginBottom: 4 },
//     infoValue: { fontSize: 14, color: "#111827", fontWeight: "600" },
//     coverLetterBox: { backgroundColor: "#F9FAFB", borderRadius: 14, padding: 16, marginBottom: 20 },
//     coverLetterText: { fontSize: 14, color: "#374151", lineHeight: 22 },
//     historyItem: { flexDirection: "row", alignItems: "flex-start", gap: 14, marginBottom: 14 },
//     historyDot: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
//     historyStatus: { fontSize: 14, fontWeight: "600", color: "#111827" },
//     historyDate: { fontSize: 12, color: "#6B7280", marginTop: 2 },
// });

// export default MyApplicationsScreen;







import { CONSTANT } from "@/constants/constant";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const NAVY = "#193648";
const NAVY_LIGHT = "#2A5A72";
const NAVY_DEEP = "#0F2438";

// Company logo helper — known mock companies use real brand logos,
// any other company falls back to auto domain guess, then letter avatar.
const COMPANY_DOMAINS: Record<string, string> = {
    "TechNest Solutions": "microsoft.com",
    "DataSphere AI": "openai.com",
    "AppForge Pakistan": "apple.com",
    "SecureNet Corp": "cloudflare.com",
    "PixelCraft Studio": "adobe.com",
    "CloudBase Technologies": "google.com",
    "InnovateHub": "atlassian.com",
};

const guessDomain = (company: string) => {
    const slug = company.toLowerCase().replace(/[^a-z0-9]/g, "");
    return slug ? `${slug}.com` : "";
};

const getLogoUrl = (company: string) => {
    const domain = COMPANY_DOMAINS[company] || guessDomain(company);
    if (!domain) return "";
    return `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
};

const getFallbackLogo = (company: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(company || "Co")}&background=193648&color=fff&size=128&bold=true&font-size=0.42&format=png`;

const CompanyLogo = ({ company, size = 48 }: { company: string; size?: number }) => {
    const [failed, setFailed] = useState(false);
    const uri = failed ? getFallbackLogo(company) : getLogoUrl(company);
    return (
        <View
            style={{
                width: size,
                height: size,
                borderRadius: 14,
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#E2E8F0",
                padding: 6,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: NAVY,
                shadowOpacity: 0.12,
                shadowOffset: { width: 0, height: 3 },
                shadowRadius: 5,
                elevation: 2,
            }}
        >
            <Image
                key={uri}
                source={{ uri }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
                onError={() => setFailed(true)}
            />
        </View>
    );
};

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, {
    color: string;
    bg: string;
    icon: string;
    step: number;
    label?: string;
    activeColor: string;
    lineColor: string;
}> = {
    Pending: {
        color: "#D97706",
        bg: "#FFFBEB",
        icon: "clock-outline",
        step: 1,
        activeColor: "#D97706",
        lineColor: "#D97706",
    },
    "Under Review": {
        color: NAVY_LIGHT,
        bg: "#EFF4F8",
        icon: "magnify",
        step: 2,
        activeColor: NAVY_LIGHT,
        lineColor: NAVY_LIGHT,
    },
    Shortlisted: {
        color: NAVY,
        bg: "#E8F0F5",
        icon: "star-outline",
        step: 3,
        activeColor: NAVY,
        lineColor: NAVY,
    },
    "Send to Liaison": {
        color: NAVY,
        bg: "#E8F0F5",
        icon: "account-arrow-right",
        step: 3,
        label: "Shortlisted",
        activeColor: NAVY,
        lineColor: NAVY,
    },
    "Send to Industry": {
        color: NAVY,
        bg: "#E8F0F5",
        icon: "domain",
        step: 3,
        label: "Shortlisted",
        activeColor: NAVY,
        lineColor: NAVY,
    },
    Approved: {
        color: "#059669",
        bg: "#ECFDF5",
        icon: "check-decagram",
        step: 4,
        activeColor: "#059669",
        lineColor: "#059669",
    },
    Rejected: {
        color: "#DC2626",
        bg: "#FEF2F2",
        icon: "close-circle",
        step: 0,
        activeColor: "#DC2626",
        lineColor: "#DC2626",
    },
};


const mapStatus = (s: string | undefined | null): string => {
    if (!s) return "Pending";

    switch (s.toLowerCase()) {
        case "pending":
            return "Pending";
        case "under_review":
            return "Under Review";
        case "shortlisted":
            return "Shortlisted";
        case "sent_to_liaison":
            return "Send to Liaison";
        case "sent_to_industry":
            return "Send to Industry";
        case "approved":
            return "Approved";
        case "rejected":
            return "Rejected";
        default:
            return "Pending";
    }
};
const STEPS = ["Pending", "Under Review", "Shortlisted", "Approved"];

const isApproved  = (s: string) => s === "Approved";
const isRejected  = (s: string) => s === "Rejected";
const isShortlist = (s: string) =>
    ["Shortlisted", "Send to Liaison", "Send to Industry"].includes(s);

const MyApplicationsScreen = () => {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading]           = useState(true);
    const [selectedApp, setSelectedApp]   = useState<any>(null);
    const [detailVisible, setDetailVisible] = useState(false);
    const [filter, setFilter] = useState<"All" | "Pending" | "Shortlisted" | "Approved" | "Rejected">("All");

    const stats = useMemo(() => {
        const total = applications.length;
        const pending = applications.filter((a) => mapStatus(a.status) === "Pending" || mapStatus(a.status) === "Under Review").length;
        const shortlisted = applications.filter((a) => isShortlist(mapStatus(a.status))).length;
        const approved = applications.filter((a) => isApproved(mapStatus(a.status))).length;
        const rejected = applications.filter((a) => isRejected(mapStatus(a.status))).length;
        return { total, pending, shortlisted, approved, rejected };
    }, [applications]);

    const filteredApps = useMemo(() => {
        if (filter === "All") return applications;
        return applications.filter((a) => {
            const s = mapStatus(a.status);
            if (filter === "Pending") return s === "Pending" || s === "Under Review";
            if (filter === "Shortlisted") return isShortlist(s);
            if (filter === "Approved") return isApproved(s);
            if (filter === "Rejected") return isRejected(s);
            return true;
        });
    }, [applications, filter]);

    useFocusEffect(
        useCallback(() => {
            fetchApplications();
        }, [])
    );

    const fetchApplications = async () => {
        try {
            const email = await AsyncStorage.getItem("studentEmail");
            if (!email) return;
            const res = await axios.get(
                `${CONSTANT.API_BASE_URL}/api/applications/${email}`
            );
            setApplications(res.data);
        } catch (err) {
            console.log("Applications fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    // ─── Card ─────────────────────────────────────────────────────────────────
    const renderCard = ({ item }: { item: any }) => {
        // const status       = item.status || "Pending";


        const status = mapStatus(item.status);
        const cfg          = STATUS_CONFIG[status] || STATUS_CONFIG["Pending"];
        const displayLabel = cfg.label || status;
        const internship   = item.internshipId;

        return (
            <TouchableOpacity
                style={[
                    styles.card,
                    isApproved(status) && styles.cardApproved,
                    isRejected(status) && styles.cardRejected,
                ]}
                onPress={() => {
                    setSelectedApp(item);
                    setDetailVisible(true);
                }}
                activeOpacity={0.85}
            >
                {/* Top accent bar */}
                {isApproved(status) && <View style={[styles.accentBar, { backgroundColor: "#059669" }]} />}
                {isRejected(status) && <View style={[styles.accentBar, { backgroundColor: "#DC2626" }]} />}

                {/* Card top row */}
                <View style={styles.cardTop}>
                    <CompanyLogo company={internship?.company || "Other"} size={52} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.cardTitle} numberOfLines={1}>
                            {internship?.title || "Internship"}
                        </Text>
                        <View style={styles.companyRow}>
                            <MaterialCommunityIcons name="office-building" size={11} color="#64748B" />
                            <Text style={styles.cardCompany} numberOfLines={1}>
                                {internship?.company || "Company"}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={[
                            styles.statusBadge,
                            { backgroundColor: cfg.bg },
                        ]}
                    >
                        <MaterialCommunityIcons
                            name={cfg.icon as any}
                            size={12}
                            color={cfg.color}
                        />
                        <Text style={[styles.statusText, { color: cfg.color }]}>
                            {displayLabel}
                        </Text>
                    </View>
                </View>

                {/* Sub-label for Send to Liaison / Send to Industry */}
                {(status === "Send to Liaison" ||
                    status === "Send to Industry") && (
                    <View
                        style={[
                            styles.subStatusRow,
                            { backgroundColor: cfg.bg },
                        ]}
                    >
                        <MaterialCommunityIcons
                            name={cfg.icon as any}
                            size={13}
                            color={cfg.color}
                        />
                        <Text
                            style={[
                                styles.subStatusText,
                                { color: cfg.color },
                            ]}
                        >
                            {status === "Send to Liaison"
                                ? "Forwarded to liaison office"
                                : "Forwarded to industry partner"}
                        </Text>
                    </View>
                )}

                {/* Approved celebration row */}
                {isApproved(status) && (
                    <View style={styles.approvedRow}>
                        <MaterialCommunityIcons
                            name="party-popper"
                            size={16}
                            color="#059669"
                        />
                        <Text style={styles.approvedRowText}>
                            Congratulations! You&apos;ve been selected 🎉
                        </Text>
                    </View>
                )}

                {/* Rejected row */}
                {isRejected(status) && (
                    <View style={styles.rejectedRow}>
                        <MaterialCommunityIcons
                            name="emoticon-sad-outline"
                            size={16}
                            color="#DC2626"
                        />
                        <Text style={styles.rejectedRowText}>
                            Unfortunately not selected this time
                        </Text>
                    </View>
                )}

                {/* ── Progress bar ── */}
                {!isRejected(status) && (
                    <View style={styles.progressContainer}>
                        {STEPS.map((step, i) => {
                            const isFilled  = i < cfg.step;
                            const isLastFilled = i === cfg.step - 1;

                            return (
                                <View key={step} style={styles.progressStep}>
                                    {/* Dot */}
                                    <View
                                        style={[
                                            styles.progressDot,
                                            isFilled
                                                ? {
                                                      backgroundColor:
                                                          cfg.activeColor,
                                                  }
                                                : styles.progressDotInactive,
                                            isLastFilled && {
                                                borderWidth: 2.5,
                                                borderColor:
                                                    cfg.activeColor + "55",
                                            },
                                        ]}
                                    >
                                        {isFilled && !isLastFilled && (
                                            <MaterialCommunityIcons
                                                name="check"
                                                size={10}
                                                color="#fff"
                                            />
                                        )}
                                    </View>

                                    {/* Connector line */}
                                    {i < STEPS.length - 1 && (
                                        <View
                                            style={[
                                                styles.progressLine,
                                                isFilled && {
                                                    backgroundColor:
                                                        cfg.lineColor,
                                                },
                                            ]}
                                        />
                                    )}
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* Rejected — red "X" bar */}
                {isRejected(status) && (
                    <View style={styles.rejectedBar}>
                        <View style={styles.rejectedBarLine} />
                        <View
                            style={[
                                styles.progressDot,
                                { backgroundColor: "#DC2626" },
                            ]}
                        >
                            <MaterialCommunityIcons
                                name="close"
                                size={10}
                                color="#fff"
                            />
                        </View>
                        <View style={styles.rejectedBarLine} />
                    </View>
                )}

                <View style={styles.cardFooter}>
                    <Text style={styles.footerText}>
                        Applied{" "}
                        {new Date(item.appliedAt).toDateString()}
                    </Text>
                    <Text style={[styles.tapMore, { color: cfg.color }]}>
                        View Details →
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    // ─── Screen ───────────────────────────────────────────────────────────────
    const FILTERS: { key: typeof filter; label: string; count: number; color: string }[] = [
        { key: "All",         label: "All",         count: stats.total,       color: NAVY },
        { key: "Pending",     label: "Pending",     count: stats.pending,     color: "#D97706" },
        { key: "Shortlisted", label: "Shortlisted", count: stats.shortlisted, color: NAVY },
        { key: "Approved",    label: "Approved",    count: stats.approved,    color: "#059669" },
        { key: "Rejected",    label: "Rejected",    count: stats.rejected,    color: "#DC2626" },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={NAVY} />

            {/* HERO HEADER */}
            <LinearGradient
                colors={[NAVY_DEEP, NAVY, NAVY_LIGHT]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.hero}
            >
                <View style={styles.heroBadge}>
                    <MaterialCommunityIcons name="briefcase-check" size={12} color="#FFFFFF" />
                    <Text style={styles.heroBadgeText}>APPLICATION TRACKER</Text>
                </View>
                <Text style={styles.heroTitle}>My Applications</Text>
                <Text style={styles.heroSubtitle}>
                    Track every step from apply to offer
                </Text>

                {/* Hero stats grid */}
                <View style={styles.heroStatsRow}>
                    <View style={styles.heroStat}>
                        <View style={styles.heroStatIcon}>
                            <MaterialCommunityIcons name="briefcase" size={14} color="#fff" />
                        </View>
                        <Text style={styles.heroStatVal}>{stats.total}</Text>
                        <Text style={styles.heroStatLab}>Total</Text>
                    </View>
                    <View style={styles.heroStatDivider} />
                    <View style={styles.heroStat}>
                        <View style={[styles.heroStatIcon, { backgroundColor: "rgba(217,119,6,0.25)" }]}>
                            <MaterialCommunityIcons name="clock-outline" size={14} color="#FBBF24" />
                        </View>
                        <Text style={styles.heroStatVal}>{stats.pending}</Text>
                        <Text style={styles.heroStatLab}>In Review</Text>
                    </View>
                    <View style={styles.heroStatDivider} />
                    <View style={styles.heroStat}>
                        <View style={[styles.heroStatIcon, { backgroundColor: "rgba(16,185,129,0.25)" }]}>
                            <MaterialCommunityIcons name="check-decagram" size={14} color="#34D399" />
                        </View>
                        <Text style={styles.heroStatVal}>{stats.approved}</Text>
                        <Text style={styles.heroStatLab}>Approved</Text>
                    </View>
                </View>
            </LinearGradient>

            {/* Filter tabs */}
            <View style={styles.filterWrap}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
                >
                    {FILTERS.map((f) => {
                        const active = filter === f.key;
                        return (
                            <Pressable
                                key={f.key}
                                onPress={() => setFilter(f.key)}
                                style={[
                                    styles.filterChip,
                                    active && {
                                        backgroundColor: f.color,
                                        borderColor: f.color,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.filterChipText,
                                        active && { color: "#fff" },
                                    ]}
                                >
                                    {f.label}
                                </Text>
                                <View
                                    style={[
                                        styles.filterCountBox,
                                        active && { backgroundColor: "rgba(255,255,255,0.25)" },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.filterCountText,
                                            active && { color: "#fff" },
                                        ]}
                                    >
                                        {f.count}
                                    </Text>
                                </View>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </View>

            {loading ? (
                <View style={{ marginTop: 50, alignItems: "center" }}>
                    <ActivityIndicator color={NAVY} size="large" />
                    <Text style={styles.loadingText}>Loading your applications...</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredApps}
                    keyExtractor={(item) => item._id}
                    renderItem={renderCard}
                    contentContainerStyle={{
                        padding: 16,
                        paddingBottom: 100,
                    }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIconWrap}>
                                <MaterialCommunityIcons
                                    name="briefcase-search-outline"
                                    size={48}
                                    color={NAVY}
                                />
                            </View>
                            <Text style={styles.emptyTitle}>
                                {filter === "All" ? "No Applications Yet" : `No ${filter} Applications`}
                            </Text>
                            <Text style={styles.emptySubText}>
                                {filter === "All"
                                    ? "Browse internships and start applying to track them here."
                                    : "Try a different filter to see your applications."}
                            </Text>
                        </View>
                    }
                />
            )}

            {/* ── Detail Modal ── */}
            <Modal visible={detailVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.detailModal}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                Application Details
                            </Text>
                            <TouchableOpacity
                                onPress={() => setDetailVisible(false)}
                                style={styles.closeBtn}
                            >
                                <Ionicons
                                    name="close"
                                    size={20}
                                    color="#374151"
                                />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {selectedApp &&
                                (() => {
                                    // const status =
                                    //     selectedApp.status || "Pending";

                                    const status = mapStatus(selectedApp.status);
                                    const cfg =
                                        STATUS_CONFIG[status] ||
                                        STATUS_CONFIG["Pending"];
                                    const displayLabel =
                                        cfg.label || status;
                                    const internship =
                                        selectedApp.internshipId;

                                    return (
                                        <>
                                            {/* Status card */}
                                            <View
                                                style={[
                                                    styles.statusCard,
                                                    {
                                                        backgroundColor:
                                                            cfg.bg,
                                                        borderColor:
                                                            cfg.color +
                                                            "40",
                                                        borderWidth: 1.5,
                                                    },
                                                ]}
                                            >
                                                <MaterialCommunityIcons
                                                    name={cfg.icon as any}
                                                    size={40}
                                                    color={cfg.color}
                                                />
                                                <Text
                                                    style={[
                                                        styles.statusBigText,
                                                        { color: cfg.color },
                                                    ]}
                                                >
                                                    {displayLabel}
                                                </Text>
                                                <Text
                                                    style={styles.statusDesc}
                                                >
                                                    {status === "Pending" &&
                                                        "Your application is in queue for review"}
                                                    {status ===
                                                        "Under Review" &&
                                                        "The team is actively reviewing your profile"}
                                                    {status ===
                                                        "Shortlisted" &&
                                                        "Congratulations! You've been shortlisted 🎉"}
                                                    {status ===
                                                        "Send to Liaison" &&
                                                        "Your profile has been forwarded to the liaison office 📋"}
                                                    {status ===
                                                        "Send to Industry" &&
                                                        "Your profile has been forwarded to the industry partner 🏢"}
                                                    {status === "Approved" &&
                                                        "You've been selected for this internship! 🎊"}
                                                    {status === "Rejected" &&
                                                        "Unfortunately, you weren't selected this time"}
                                                </Text>
                                            </View>

                                            {/* Modal progress bar */}
                                            {!isRejected(status) && (
                                                <View style={styles.modalProgressWrapper}>
                                                    <View style={styles.progressContainer}>
                                                        {STEPS.map((step, i) => {
                                                            const isFilled = i < cfg.step;
                                                            const isLastFilled = i === cfg.step - 1;
                                                            return (
                                                                <View key={step} style={styles.progressStep}>
                                                                    <View style={[
                                                                        styles.progressDot,
                                                                        isFilled
                                                                            ? { backgroundColor: cfg.activeColor }
                                                                            : styles.progressDotInactive,
                                                                        isLastFilled && {
                                                                            borderWidth: 2.5,
                                                                            borderColor: cfg.activeColor + "55",
                                                                        },
                                                                    ]}>
                                                                        {isFilled && !isLastFilled && (
                                                                            <MaterialCommunityIcons name="check" size={10} color="#fff" />
                                                                        )}
                                                                    </View>
                                                                    {i < STEPS.length - 1 && (
                                                                        <View style={[
                                                                            styles.progressLine,
                                                                            isFilled && { backgroundColor: cfg.lineColor },
                                                                        ]} />
                                                                    )}
                                                                </View>
                                                            );
                                                        })}
                                                    </View>
                                                    <View style={styles.stepLabelsRow}>
                                                        {STEPS.map((step, i) => (
                                                            <Text key={step} style={[
                                                                styles.stepLabel,
                                                                i < cfg.step && { color: cfg.activeColor, fontWeight: "700" },
                                                            ]}>
                                                                {step}
                                                            </Text>
                                                        ))}
                                                    </View>
                                                </View>
                                            )}

                                            {/* Internship info */}
                                            <Text style={styles.detailSectionTitle}>
                                                Internship Info
                                            </Text>
                                            <View style={styles.infoGrid}>
                                                <View style={styles.infoBox}>
                                                    <Text style={styles.infoLabel}>Position</Text>
                                                    <Text style={styles.infoValue}>{internship?.title}</Text>
                                                </View>
                                                <View style={styles.infoBox}>
                                                    <Text style={styles.infoLabel}>Company</Text>
                                                    <Text style={styles.infoValue}>{internship?.company}</Text>
                                                </View>
                                                <View style={styles.infoBox}>
                                                    <Text style={styles.infoLabel}>Type</Text>
                                                    <Text style={styles.infoValue}>{internship?.type}</Text>
                                                </View>
                                                <View style={styles.infoBox}>
                                                    <Text style={styles.infoLabel}>Duration</Text>
                                                    <Text style={styles.infoValue}>{internship?.duration}</Text>
                                                </View>
                                            </View>

                                            {/* Cover letter */}
                                            {selectedApp.coverLetter && (
                                                <>
                                                    <Text style={styles.detailSectionTitle}>
                                                        Your Cover Letter
                                                    </Text>
                                                    <View style={styles.coverLetterBox}>
                                                        <Text style={styles.coverLetterText}>
                                                            {selectedApp.coverLetter}
                                                        </Text>
                                                    </View>
                                                </>
                                            )}

                                            {/* Status history */}
                                            <Text style={styles.detailSectionTitle}>
                                                Status History
                                            </Text>
                                            {selectedApp.statusHistory?.map(
                                                (h: any, i: number) => {
                                                    const hCfg =
                                                        STATUS_CONFIG[
                                                            h.status
                                                        ] ||
                                                        STATUS_CONFIG[
                                                            "Pending"
                                                        ];
                                                    return (
                                                        <View
                                                            key={i}
                                                            style={styles.historyItem}
                                                        >
                                                            <View
                                                                style={[
                                                                    styles.historyDot,
                                                                    {
                                                                        backgroundColor:
                                                                            hCfg.color,
                                                                    },
                                                                ]}
                                                            />
                                                            <View style={{ flex: 1 }}>
                                                                <Text style={styles.historyStatus}>
                                                                    {hCfg.label || h.status}
                                                                </Text>
                                                                <Text style={styles.historyDate}>
                                                                    {new Date(h.date).toDateString()} • {h.note}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    );
                                                }
                                            )}
                                        </>
                                    );
                                })()}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F4F7FB" },

    // ── Hero header ───────────────────────────────────────────────────────────
    hero: {
        paddingTop: Platform.OS === "android" ? 26 : 56,
        paddingBottom: 26,
        paddingHorizontal: 22,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: NAVY,
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 14,
        elevation: 10,
    },
    heroBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: "rgba(255,255,255,0.18)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        alignSelf: "flex-start",
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.25)",
    },
    heroBadgeText: { color: "#FFFFFF", fontSize: 10, fontWeight: "800", letterSpacing: 1 },
    heroTitle: { color: "#fff", fontSize: 26, fontWeight: "800", letterSpacing: -0.3 },
    heroSubtitle: { color: "rgba(255,255,255,0.75)", fontSize: 12.5, marginTop: 4 },
    heroStatsRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.10)",
        borderRadius: 16,
        paddingVertical: 14,
        marginTop: 18,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",
    },
    heroStat: { flex: 1, alignItems: "center", gap: 3 },
    heroStatIcon: {
        width: 28,
        height: 28,
        borderRadius: 9,
        backgroundColor: "rgba(255,255,255,0.18)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 2,
    },
    heroStatVal: { color: "#fff", fontSize: 19, fontWeight: "800" },
    heroStatLab: { color: "rgba(255,255,255,0.75)", fontSize: 10.5, fontWeight: "600", marginTop: 1 },
    heroStatDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.18)", height: 50 },

    // ── Filter tabs ───────────────────────────────────────────────────────────
    filterWrap: {
        marginTop: 14,
        marginBottom: 4,
    },
    filterChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        backgroundColor: "#fff",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    filterChipText: { fontSize: 12.5, fontWeight: "700", color: "#475569" },
    filterCountBox: {
        backgroundColor: "#F1F5F9",
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: 10,
        minWidth: 22,
        alignItems: "center",
    },
    filterCountText: { fontSize: 11, fontWeight: "800", color: "#475569" },

    loadingText: { marginTop: 12, color: "#64748B", fontSize: 13 },

    // ── Card ──────────────────────────────────────────────────────────────────
    card: {
        backgroundColor: "#fff",
        borderRadius: 22,
        padding: 18,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#EDF2F7",
        shadowColor: NAVY,
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 12,
        elevation: 3,
        overflow: "hidden",
    },
    cardApproved: {
        backgroundColor: "#F0FDF4",
        borderWidth: 1.5,
        borderColor: "#86EFAC",
        elevation: 4,
        shadowColor: "#059669",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
    },
    cardRejected: {
        backgroundColor: "#FFF5F5",
        borderWidth: 1.5,
        borderColor: "#FECACA",
        elevation: 2,
    },
    accentBar: {
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: 4,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    cardTop: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
    companyIcon: {
        width: 52, height: 52,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    cardTitle:   { fontSize: 15, fontWeight: "700", color: "#111827" },
    cardCompany: { fontSize: 13, color: "#6B7280", marginTop: 2, flex: 1 },
    companyRow:  { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 3 },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        gap: 4,
    },
    statusText: { fontSize: 11, fontWeight: "700" },

    subStatusRow: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 7,
        marginBottom: 12,
        gap: 6,
    },
    subStatusText: { fontSize: 12, fontWeight: "600" },

    approvedRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#DCFCE7",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 7,
        marginBottom: 12,
        gap: 6,
    },
    approvedRowText: { fontSize: 12, fontWeight: "700", color: "#059669", flex: 1 },

    rejectedRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FEE2E2",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 7,
        marginBottom: 12,
        gap: 6,
    },
    rejectedRowText: { fontSize: 12, fontWeight: "700", color: "#DC2626", flex: 1 },

    // ── Progress ──────────────────────────────────────────────────────────────
    progressContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    progressStep: { flex: 1, flexDirection: "row", alignItems: "center" },
    progressDot: {
        width: 20, height: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    progressDotInactive: { backgroundColor: "#E5E7EB" },
    progressLine:  { flex: 1, height: 2, backgroundColor: "#E5E7EB", marginHorizontal: 2 },

    // Rejected bar (single red dot centred)
    rejectedBar: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    rejectedBarLine: {
        flex: 1,
        height: 2,
        backgroundColor: "#FECACA",
        marginHorizontal: 2,
    },

    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    footerText: { fontSize: 12, color: "#9CA3AF" },
    tapMore:    { fontSize: 12, fontWeight: "600" },

    // ── Empty ─────────────────────────────────────────────────────────────────
    emptyState:   { alignItems: "center", paddingTop: 60 },
    emptyIconWrap: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: "#E8F0F5",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    emptyTitle:   { fontSize: 18, fontWeight: "800", color: NAVY, marginTop: 6 },
    emptySubText: { fontSize: 13.5, color: "#64748B", marginTop: 8, textAlign: "center", paddingHorizontal: 28, lineHeight: 20 },

    // ── Modal ─────────────────────────────────────────────────────────────────
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    detailModal: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 24,
        maxHeight: "92%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    modalTitle: { fontSize: 20, fontWeight: "800", color: "#111827" },
    closeBtn: {
        backgroundColor: "#F3F4F6",
        borderRadius: 20,
        padding: 8,
    },

    statusCard: {
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
        marginBottom: 20,
    },
    statusBigText: { fontSize: 22, fontWeight: "800", marginTop: 8 },
    statusDesc: {
        fontSize: 14,
        color: "#6B7280",
        textAlign: "center",
        marginTop: 6,
    },

    // Modal progress with step labels
    modalProgressWrapper: {
        marginBottom: 20,
        paddingHorizontal: 4,
    },
    stepLabelsRow: {
        flexDirection: "row",
        marginTop: 6,
    },
    stepLabel: {
        flex: 1,
        fontSize: 9,
        color: "#9CA3AF",
        textAlign: "center",
        fontWeight: "600",
        textTransform: "uppercase",
    },

    detailSectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 10,
    },
    infoGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 20,
    },
    infoBox: {
        width: "47%",
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        padding: 12,
    },
    infoLabel: {
        fontSize: 11,
        color: "#9CA3AF",
        fontWeight: "600",
        textTransform: "uppercase",
        marginBottom: 4,
    },
    infoValue:      { fontSize: 14, color: "#111827", fontWeight: "600" },
    coverLetterBox: {
        backgroundColor: "#F9FAFB",
        borderRadius: 14,
        padding: 16,
        marginBottom: 20,
    },
    coverLetterText: { fontSize: 14, color: "#374151", lineHeight: 22 },
    historyItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 14,
        marginBottom: 14,
    },
    historyDot:   { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
    historyStatus:{ fontSize: 14, fontWeight: "600", color: "#111827" },
    historyDate:  { fontSize: 12, color: "#6B7280", marginTop: 2 },
});

export default MyApplicationsScreen;