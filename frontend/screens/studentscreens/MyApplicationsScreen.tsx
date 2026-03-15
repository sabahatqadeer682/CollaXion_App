// export default MyApplicationsScreen;

import { CONSTANT } from "@/constants/constant";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const MyApplicationsScreen = () => {
    const navigation = useNavigation<any>();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [applications, setApplications] = useState<any[]>([]);

    const fetchApplications = async () => {
        try {
            const email = await AsyncStorage.getItem("studentEmail");
            if (!email) {
                Alert.alert("Error", "Please login first");
                return;
            }

            const response = await axios.get(`${CONSTANT.API_BASE_URL}/api/student/my-applications/${email}`);
            if (response.data.success) {
                setApplications(response.data.applications || []);
            } else {
                setApplications([]);
            }
        } catch (err: any) {
            console.error("Error fetching applications:", err);
            Alert.alert("Error", "Failed to load applications");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchApplications(); }, []);
    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => fetchApplications());
        return unsubscribe;
    }, [navigation]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchApplications();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "#F39C12";
            case "internship_approved": return "#3498DB";
            case "industry_approved": return "#9B59B6";
            case "selected": return "#27AE60";
            case "rejected": return "#E74C3C";
            default: return "#95A5A6";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "pending": return "Pending Review";
            case "internship_approved": return "Internship Incharge Approved";
            case "industry_approved": return "Industry Liaison Approved";
            case "selected": return "Selected ✅";
            case "rejected": return "Rejected";
            default: return status;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending": return "hourglass-half";
            case "internship_approved": return "check-circle";
            case "industry_approved": return "check-double";
            case "selected": return "trophy";
            case "rejected": return "times-circle";
            default: return "question-circle";
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#193648" />
                <Text style={styles.loadingText}>Loading applications...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={styles.headerSection}>
                <Text style={styles.header}> My Applications</Text>
                <Text style={styles.subText}>Track your internship applications</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{applications.length}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={[styles.statNumber, { color: "#F39C12" }]}>
                        {applications.filter(a => a.status === "pending").length}
                    </Text>
                    <Text style={styles.statLabel}>Pending</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={[styles.statNumber, { color: "#27AE60" }]}>
                        {applications.filter(a => a.status === "selected").length}
                    </Text>
                    <Text style={styles.statLabel}>Selected</Text>
                </View>
            </View>

            {applications.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="document-text-outline" size={60} color="#BDC3C7" />
                    <Text style={styles.emptyTitle}>No Applications Yet</Text>
                    <Text style={styles.emptyText}>Start applying for internships to see them here</Text>
                    <TouchableOpacity
                        style={styles.browseButton}
                        onPress={() => navigation.navigate("AI Recommendations")}
                    >
                        <Text style={styles.browseButtonText}>Browse Internships</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.applicationsSection}>
                    {applications.map((app, idx) => (
                        <View key={idx} style={styles.applicationCard}>
                            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(app.status) }]}>
                                <FontAwesome5 name={getStatusIcon(app.status)} size={12} color="#fff" />
                                <Text style={styles.statusBadgeText}>{getStatusText(app.status)}</Text>
                            </View>
                            <Text style={styles.appTitle}>{app.internshipId?.title || "N/A"}</Text>
                            <Text style={styles.companyText}>{app.internshipId?.company || "N/A"}</Text>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F7F9FC" },
    loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    loadingText: { marginTop: 10, fontSize: 14, color: "#7F8C8D" },
    headerSection: { padding: 20, backgroundColor: "#193648", borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
    header: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 5 },
    subText: { fontSize: 14, color: "#BDC3C7" },
    statsContainer: { flexDirection: "row", justifyContent: "space-around", padding: 15, marginHorizontal: 15, marginTop: -20, backgroundColor: "#fff", borderRadius: 12, elevation: 3 },
    statBox: { alignItems: "center" },
    statNumber: { fontSize: 24, fontWeight: "bold", color: "#193648" },
    statLabel: { fontSize: 12, color: "#7F8C8D", marginTop: 4 },
    applicationsSection: { padding: 15 },
    applicationCard: { backgroundColor: "#fff", padding: 15, borderRadius: 12, marginBottom: 15, elevation: 3 },
    statusBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, marginBottom: 10 },
    statusBadgeText: { color: "#fff", fontSize: 11, fontWeight: "bold", marginLeft: 5 },
    appTitle: { fontSize: 16, fontWeight: "bold", color: "#2C3E50", marginBottom: 5 },
    companyText: { fontSize: 13, color: "#7F8C8D" },
    emptyState: { alignItems: "center", justifyContent: "center", padding: 40, marginTop: 50 },
    emptyTitle: { fontSize: 18, fontWeight: "bold", color: "#2C3E50", marginTop: 15, marginBottom: 8 },
    emptyText: { fontSize: 14, color: "#7F8C8D", textAlign: "center", marginBottom: 20 },
    browseButton: { backgroundColor: "#193648", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
    browseButtonText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});

export default MyApplicationsScreen;
