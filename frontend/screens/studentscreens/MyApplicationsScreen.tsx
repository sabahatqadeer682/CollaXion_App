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



import { CONSTANT } from "@/constants/constant";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: string; step: number }> = {
    Pending: { color: "#D97706", bg: "#FFFBEB", icon: "clock-outline", step: 1 },
    "Under Review": { color: "#2563EB", bg: "#EFF6FF", icon: "magnify", step: 2 },
    Shortlisted: { color: "#7C3AED", bg: "#F5F3FF", icon: "star-outline", step: 3 },
    Approved: { color: "#059669", bg: "#ECFDF5", icon: "check-circle", step: 4 },
    Rejected: { color: "#DC2626", bg: "#FEF2F2", icon: "close-circle", step: 0 },
};

const STEPS = ["Pending", "Under Review", "Shortlisted", "Approved"];

const MyApplicationsScreen = () => {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<any>(null);
    const [detailVisible, setDetailVisible] = useState(false);

    useFocusEffect(
        useCallback(() => {
            fetchApplications();
        }, [])
    );

    const fetchApplications = async () => {
        try {
            const email = await AsyncStorage.getItem("studentEmail");
            if (!email) return;
            const res = await axios.get(`${CONSTANT.API_BASE_URL}/api/applications/${email}`);
            setApplications(res.data);
        } catch (err) {
            console.log("Applications fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const renderCard = ({ item }: { item: any }) => {
        const status = item.status || "Pending";
        const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Pending"];
        const internship = item.internshipId;

        return (
            <TouchableOpacity style={styles.card} onPress={() => { setSelectedApp(item); setDetailVisible(true); }}>
                <View style={styles.cardTop}>
                    <View style={styles.companyIcon}>
                        <MaterialCommunityIcons name="office-building" size={24} color="#193648" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.cardTitle} numberOfLines={1}>{internship?.title || "Internship"}</Text>
                        <Text style={styles.cardCompany}>{internship?.company || "Company"}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                        <MaterialCommunityIcons name={cfg.icon as any} size={12} color={cfg.color} />
                        <Text style={[styles.statusText, { color: cfg.color }]}>{status}</Text>
                    </View>
                </View>

                {/* Progress Bar */}
                {status !== "Rejected" && (
                    <View style={styles.progressContainer}>
                        {STEPS.map((step, i) => {
                            const isActive = i < cfg.step;
                            const isCurrent = i === cfg.step - 1;
                            return (
                                <View key={step} style={styles.progressStep}>
                                    <View style={[
                                        styles.progressDot,
                                        isActive ? styles.progressDotActive : styles.progressDotInactive,
                                        isCurrent && styles.progressDotCurrent,
                                    ]}>
                                        {isActive && !isCurrent && (
                                            <MaterialCommunityIcons name="check" size={10} color="#fff" />
                                        )}
                                    </View>
                                    {i < STEPS.length - 1 && (
                                        <View style={[styles.progressLine, isActive && styles.progressLineActive]} />
                                    )}
                                </View>
                            );
                        })}
                    </View>
                )}

                <View style={styles.cardFooter}>
                    <Text style={styles.footerText}>
                        Applied {new Date(item.appliedAt).toDateString()}
                    </Text>
                    <Text style={[styles.tapMore, { color: cfg.color }]}>View Details →</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.summaryRow}>
                <View style={styles.summaryChip}>
                    <Text style={styles.summaryNum}>{applications.length}</Text>
                    <Text style={styles.summaryLabel}>Total</Text>
                </View>
                <View style={styles.summaryChip}>
                    <Text style={[styles.summaryNum, { color: "#D97706" }]}>
                        {applications.filter(a => a.status === "Pending").length}
                    </Text>
                    <Text style={styles.summaryLabel}>Pending</Text>
                </View>
                <View style={styles.summaryChip}>
                    <Text style={[styles.summaryNum, { color: "#7C3AED" }]}>
                        {applications.filter(a => a.status === "Shortlisted").length}
                    </Text>
                    <Text style={styles.summaryLabel}>Shortlisted</Text>
                </View>
                <View style={styles.summaryChip}>
                    <Text style={[styles.summaryNum, { color: "#059669" }]}>
                        {applications.filter(a => a.status === "Approved").length}
                    </Text>
                    <Text style={styles.summaryLabel}>Approved</Text>
                </View>
            </View>

            {loading ? (
                <ActivityIndicator color="#193648" size="large" style={{ marginTop: 60 }} />
            ) : (
                <FlatList
                    data={applications}
                    keyExtractor={(item) => item._id}
                    renderItem={renderCard}
                    contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons name="briefcase-off" size={64} color="#D1D5DB" />
                            <Text style={styles.emptyTitle}>No Applications Yet</Text>
                            <Text style={styles.emptySubText}>Browse internships and start applying!</Text>
                        </View>
                    }
                />
            )}

            {/* Detail Modal */}
            <Modal visible={detailVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.detailModal}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Application Details</Text>
                            <TouchableOpacity onPress={() => setDetailVisible(false)} style={styles.closeBtn}>
                                <Ionicons name="close" size={20} color="#374151" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {selectedApp && (() => {
                                const status = selectedApp.status || "Pending";
                                const cfg = STATUS_CONFIG[status];
                                const internship = selectedApp.internshipId;
                                return (
                                    <>
                                        <View style={[styles.statusCard, { backgroundColor: cfg.bg }]}>
                                            <MaterialCommunityIcons name={cfg.icon as any} size={36} color={cfg.color} />
                                            <Text style={[styles.statusBigText, { color: cfg.color }]}>{status}</Text>
                                            <Text style={styles.statusDesc}>
                                                {status === "Pending" && "Your application is in queue for review"}
                                                {status === "Under Review" && "The team is actively reviewing your profile"}
                                                {status === "Shortlisted" && "Congratulations! You've been shortlisted 🎉"}
                                                {status === "Approved" && "You've been selected for this internship! 🎊"}
                                                {status === "Rejected" && "Unfortunately, you weren't selected this time"}
                                            </Text>
                                        </View>

                                        <Text style={styles.detailSectionTitle}>Internship Info</Text>
                                        <View style={styles.infoGrid}>
                                            <View style={styles.infoBox}><Text style={styles.infoLabel}>Position</Text><Text style={styles.infoValue}>{internship?.title}</Text></View>
                                            <View style={styles.infoBox}><Text style={styles.infoLabel}>Company</Text><Text style={styles.infoValue}>{internship?.company}</Text></View>
                                            <View style={styles.infoBox}><Text style={styles.infoLabel}>Type</Text><Text style={styles.infoValue}>{internship?.type}</Text></View>
                                            <View style={styles.infoBox}><Text style={styles.infoLabel}>Duration</Text><Text style={styles.infoValue}>{internship?.duration}</Text></View>
                                        </View>

                                        {selectedApp.coverLetter && (
                                            <>
                                                <Text style={styles.detailSectionTitle}>Your Cover Letter</Text>
                                                <View style={styles.coverLetterBox}>
                                                    <Text style={styles.coverLetterText}>{selectedApp.coverLetter}</Text>
                                                </View>
                                            </>
                                        )}

                                        <Text style={styles.detailSectionTitle}>Status History</Text>
                                        {selectedApp.statusHistory?.map((h: any, i: number) => (
                                            <View key={i} style={styles.historyItem}>
                                                <View style={[styles.historyDot, { backgroundColor: STATUS_CONFIG[h.status]?.color || "#9CA3AF" }]} />
                                                <View>
                                                    <Text style={styles.historyStatus}>{h.status}</Text>
                                                    <Text style={styles.historyDate}>{new Date(h.date).toDateString()} • {h.note}</Text>
                                                </View>
                                            </View>
                                        ))}
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
    container: { flex: 1, backgroundColor: "#F0F4F8" },
    summaryRow: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 16,
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    summaryChip: { flex: 1, alignItems: "center", paddingVertical: 8 },
    summaryNum: { fontSize: 22, fontWeight: "800", color: "#193648" },
    summaryLabel: { fontSize: 11, color: "#6B7280", marginTop: 2 },
    card: { backgroundColor: "#fff", borderRadius: 20, padding: 18, marginBottom: 14, elevation: 2 },
    cardTop: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
    companyIcon: {
        width: 52, height: 52, borderRadius: 14,
        backgroundColor: "#EFF6FF", justifyContent: "center", alignItems: "center",
    },
    cardTitle: { fontSize: 15, fontWeight: "700", color: "#111827" },
    cardCompany: { fontSize: 13, color: "#6B7280", marginTop: 2 },
    statusBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, gap: 4 },
    statusText: { fontSize: 11, fontWeight: "700" },
    progressContainer: { flexDirection: "row", alignItems: "center", marginBottom: 14, paddingHorizontal: 4 },
    progressStep: { flex: 1, flexDirection: "row", alignItems: "center" },
    progressDot: { width: 20, height: 20, borderRadius: 10, justifyContent: "center", alignItems: "center" },
    progressDotActive: { backgroundColor: "#193648" },
    progressDotCurrent: { backgroundColor: "#3B82F6", borderWidth: 2, borderColor: "#BFDBFE" },
    progressDotInactive: { backgroundColor: "#E5E7EB" },
    progressLine: { flex: 1, height: 2, backgroundColor: "#E5E7EB", marginHorizontal: 2 },
    progressLineActive: { backgroundColor: "#193648" },
    cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    footerText: { fontSize: 12, color: "#9CA3AF" },
    tapMore: { fontSize: 12, fontWeight: "600" },
    emptyState: { alignItems: "center", paddingTop: 80 },
    emptyTitle: { fontSize: 18, fontWeight: "700", color: "#374151", marginTop: 16 },
    emptySubText: { fontSize: 14, color: "#9CA3AF", marginTop: 8 },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
    detailModal: {
        backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: 24, maxHeight: "92%",
    },
    modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: "800", color: "#111827" },
    closeBtn: { backgroundColor: "#F3F4F6", borderRadius: 20, padding: 8 },
    statusCard: { borderRadius: 20, padding: 24, alignItems: "center", marginBottom: 24 },
    statusBigText: { fontSize: 22, fontWeight: "800", marginTop: 8 },
    statusDesc: { fontSize: 14, color: "#6B7280", textAlign: "center", marginTop: 6 },
    detailSectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 10 },
    infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
    infoBox: { width: "47%", backgroundColor: "#F9FAFB", borderRadius: 12, padding: 12 },
    infoLabel: { fontSize: 11, color: "#9CA3AF", fontWeight: "600", textTransform: "uppercase", marginBottom: 4 },
    infoValue: { fontSize: 14, color: "#111827", fontWeight: "600" },
    coverLetterBox: { backgroundColor: "#F9FAFB", borderRadius: 14, padding: 16, marginBottom: 20 },
    coverLetterText: { fontSize: 14, color: "#374151", lineHeight: 22 },
    historyItem: { flexDirection: "row", alignItems: "flex-start", gap: 14, marginBottom: 14 },
    historyDot: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
    historyStatus: { fontSize: 14, fontWeight: "600", color: "#111827" },
    historyDate: { fontSize: 12, color: "#6B7280", marginTop: 2 },
});

export default MyApplicationsScreen;
