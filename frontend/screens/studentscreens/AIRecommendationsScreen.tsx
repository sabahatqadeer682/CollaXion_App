
// export default AIRecommendationsScreen;

import { CONSTANT } from "@/constants/constant";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const AIRecommendationsScreen = () => {
    const navigation = useNavigation<any>();
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [studentSkills, setStudentSkills] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [infoMessage, setInfoMessage] = useState<string>("");

    const fetchRecommendations = async () => {
        if (!refreshing) setLoading(true);
        setInfoMessage("");

        try {
            const email = await AsyncStorage.getItem("studentEmail");
            if (!email) {
                Alert.alert("Error", "Please login first");
                return;
            }

            const response = await axios.get(
                `${CONSTANT.API_BASE_URL}/api/student/recommendations/${email}`
            );

            if (response.data.success) {
                setRecommendations(response.data.recommendations || []);
                setStudentSkills(response.data.studentSkills || []);

                if (response.data.message) {
                    setInfoMessage(response.data.message);
                }

                console.log("Recommendations fetched:", response.data.recommendations.length);
            }

        } catch (err: any) {
            console.error("Fetch recommendations error:", err.response?.data || err.message);

            if (err.response?.status === 404) {
                Alert.alert("Error", "Student profile not found");
            } else if (err.response?.status === 500) {
                Alert.alert("Error", "Server error. Please try again later");
            } else {
                Alert.alert("Error", "Failed to fetch recommendations");
            }

            setRecommendations([]);
            setStudentSkills([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Fetch on mount
    useFocusEffect(
        useCallback(() => {
            fetchRecommendations();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchRecommendations();
    };

    const handleApplyInternship = async (id: string, title: string) => {
        try {
            const email = await AsyncStorage.getItem("studentEmail");
            if (!email) {
                Alert.alert("Error", "Please login first");
                return;
            }

            Alert.alert("Confirm Application", `Apply for ${title}?`, [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Apply",
                    onPress: async () => {
                        try {
                            const response = await axios.post(
                                `${CONSTANT.API_BASE_URL}/api/student/apply-internship`,
                                { studentEmail: email, internshipId: id }
                            );

                            if (response.data.success) {
                                Alert.alert(
                                    "Success",
                                    `Your application for the ${title} has been submitted for review by the Internship Incharge. \n\nMatch Score: ${response.data.matchData?.matchScore || 0}%`,
                                    [
                                        {
                                            text: "OK",
                                            onPress: () => fetchRecommendations()
                                        }
                                    ]
                                );
                            }
                        } catch (applyErr: any) {
                            if (applyErr.response?.status === 409) {
                                Alert.alert("Already Applied", "You have already applied for this internship");
                            } else {
                                Alert.alert("Error", "Failed to apply. Please try again");
                            }
                        }
                    },
                },
            ]);
        } catch (err) {
            Alert.alert("Error", "Failed to process application");
        }
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#193648" />
                <Text style={styles.loadingText}>Analyzing your profile...</Text>
            </View>
        );
    }

    const getScoreColor = (score: number) =>
        score >= 80 ? "#27AE60" : score >= 60 ? "#F39C12" : "#E74C3C";

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerIcon}>
                    <MaterialIcons name="psychology" size={32} color="#193648" />
                </View>
                <Text style={styles.headerTitle}>AI-Powered Recommendations</Text>
                <Text style={styles.headerSubtitle}>
                    Based on your skills and profile
                </Text>
            </View>

            {/* Skills Section */}
            {studentSkills.length > 0 && (
                <View style={styles.skillsSection}>
                    <Text style={styles.sectionTitle}>Your Skills ({studentSkills.length})</Text>
                    <View style={styles.skillsContainer}>
                        {studentSkills.map((skill, idx) => (
                            <View key={idx} style={styles.skillBadge}>
                                <MaterialIcons
                                    name="check-circle"
                                    size={14}
                                    color="#27AE60"
                                />
                                <Text style={styles.skillText}>{skill}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Info Message Banner */}
            {infoMessage && recommendations.length === 0 && (
                <View style={styles.infoBanner}>
                    <Ionicons name="information-circle" size={20} color="#3498DB" />
                    <Text style={styles.infoText}>{infoMessage}</Text>
                </View>
            )}

            {/* No CV uploaded */}
            {recommendations.length === 0 && studentSkills.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="bulb-outline" size={64} color="#BDC3C7" />
                    <Text style={styles.emptyText}>No recommendations yet</Text>
                    <Text style={styles.emptySubtext}>
                        Upload your CV to get AI-powered internship suggestions
                    </Text>
                    <TouchableOpacity
                        style={styles.uploadButton}
                        onPress={() => navigation.navigate("Profile Settings")}
                    >
                        <Ionicons name="cloud-upload" size={18} color="#fff" />
                        <Text style={styles.uploadButtonText}>Upload CV</Text>
                    </TouchableOpacity>
                </View>
            ) : recommendations.length === 0 && studentSkills.length > 0 ? (
                /* Empty State: Skills saved but no matches */
                <View style={styles.emptyState}>
                    <Ionicons name="checkmark-circle" size={64} color="#27AE60" />
                    <Text style={styles.emptyText}>Skills Saved Successfully!</Text>
                    <Text style={styles.emptySubtext}>
                        {infoMessage || "We'll notify you when new internships match your profile"}
                    </Text>
                    <View style={styles.notificationNote}>
                        <Ionicons name="notifications" size={16} color="#7F8C8D" />
                        <Text style={styles.notificationText}>
                            Keep your profile updated for better matches
                        </Text>
                    </View>
                </View>
            ) : (
                /* Recommendations List */
                <>
                    <View style={styles.recommendationHeader}>
                        <Text style={styles.recommendationCount}>
                            {recommendations.length} Matching Internship
                            {recommendations.length > 1 ? "s" : ""}
                        </Text>
                    </View>
                    {recommendations.map((rec: any, idx: number) => (
                        <View key={idx} style={styles.recommendationCard}>
                            {rec.internshipId?.image && (
                                <Image
                                    source={{ uri: rec.internshipId.image }}
                                    style={styles.internshipImage}
                                />
                            )}
                            <View style={styles.cardHeader}>
                                <View
                                    style={[
                                        styles.scoreCircle,
                                        { borderColor: getScoreColor(rec.matchScore) },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.scoreText,
                                            { color: getScoreColor(rec.matchScore) },
                                        ]}
                                    >
                                        {rec.matchScore}%
                                    </Text>
                                </View>
                                <View style={styles.cardHeaderText}>
                                    <Text style={styles.cardTitle}>
                                        {rec.internshipId?.title || "Internship"}
                                    </Text>
                                    <Text style={styles.cardCompany}>
                                        {rec.internshipId?.company || "Company"}
                                    </Text>
                                </View>
                            </View>

                            {/* Matching Skills */}
                            {rec.matchingSkills?.length > 0 && (
                                <View style={styles.skillSection}>
                                    <Text style={styles.skillSectionTitle}>
                                        ✓ Matching Skills ({rec.matchingSkills.length})
                                    </Text>
                                    <View style={styles.skillRow}>
                                        {rec.matchingSkills.map((skill: string, i: number) => (
                                            <View
                                                key={i}
                                                style={[
                                                    styles.skillBadge,
                                                    { backgroundColor: "#D5F5E3" },
                                                ]}
                                            >
                                                <MaterialIcons
                                                    name="check-circle"
                                                    size={14}
                                                    color="#27AE60"
                                                />
                                                <Text style={styles.skillText}>{skill}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {/* Missing Skills */}
                            {rec.missingSkills?.length > 0 && (
                                <View style={styles.skillSection}>
                                    <Text style={styles.skillSectionTitle}>
                                        ⚠ Skills to Learn ({rec.missingSkills.length})
                                    </Text>
                                    <View style={styles.skillRow}>
                                        {rec.missingSkills.map((skill: string, i: number) => (
                                            <View
                                                key={i}
                                                style={[
                                                    styles.skillBadge,
                                                    { backgroundColor: "#FDEDEC" },
                                                ]}
                                            >
                                                <MaterialIcons
                                                    name="cancel"
                                                    size={14}
                                                    color="#E74C3C"
                                                />
                                                <Text style={styles.skillText}>{skill}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}

                            <View style={styles.cardActions}>
                                <TouchableOpacity
                                    style={styles.applyButton}
                                    onPress={() =>
                                        handleApplyInternship(
                                            rec.internshipId._id,
                                            rec.internshipId.title
                                        )
                                    }
                                >
                                    <Ionicons name="send" size={16} color="#fff" />
                                    <Text style={styles.applyButtonText}>Apply Now</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F7F9FC" },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F7F9FC",
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: "#193648",
        fontWeight: "600",
    },
    header: {
        backgroundColor: "#fff",
        padding: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 2,
        alignItems: "center",
    },
    headerIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#E8F6F3",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#193648",
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: "#7F8C8D",
        textAlign: "center",
    },
    skillsSection: {
        backgroundColor: "#fff",
        margin: 15,
        padding: 15,
        borderRadius: 12,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#193648",
        marginBottom: 10,
    },
    skillsContainer: { flexDirection: "row", flexWrap: "wrap" },
    skillBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 15,
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: "#E8F6F3",
    },
    skillText: {
        fontSize: 12,
        color: "#193648",
        marginLeft: 4,
        fontWeight: "500",
    },
    infoBanner: {
        flexDirection: "row",
        backgroundColor: "#EBF5FB",
        marginHorizontal: 15,
        marginTop: 10,
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        borderLeftWidth: 4,
        borderLeftColor: "#3498DB",
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: "#2C3E50",
        marginLeft: 10,
        lineHeight: 18,
    },
    recommendationHeader: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    recommendationCount: {
        fontSize: 16,
        fontWeight: "600",
        color: "#193648",
    },
    skillRow: { flexDirection: "row", flexWrap: "wrap" },
    skillSection: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#EAECEF",
    },
    skillSectionTitle: {
        fontSize: 13,
        fontWeight: "600",
        color: "#7F8C8D",
        marginBottom: 8,
    },
    recommendationCard: {
        backgroundColor: "#fff",
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 15,
        elevation: 3,
        overflow: "hidden",
    },
    internshipImage: { width: "100%", height: 150, resizeMode: "cover" },
    cardHeader: {
        flexDirection: "row",
        padding: 15,
        backgroundColor: "#F8F9FA",
    },
    scoreCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 3,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,

    },
    scoreText: { fontSize: 16, fontWeight: "bold" },
    cardHeaderText: { flex: 1, justifyContent: "center" },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#193648",
        marginBottom: 4,
    },
    cardCompany: { fontSize: 14, color: "#7F8C8D" },
    cardActions: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: "#EAECEF",
    },
    applyButton: {
        flex: 1,
        flexDirection: "row",
        padding: 15,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#193648",
        gap: 6,
    },
    applyButtonText: {
        fontSize: 14,
        color: "#fff",
        fontWeight: "600",
        marginLeft: 6,
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
        paddingHorizontal: 30,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#193648",
        marginTop: 15,
    },
    emptySubtext: {
        fontSize: 14,
        color: "#7F8C8D",
        textAlign: "center",
        marginTop: 8,
        lineHeight: 20,
    },
    uploadButton: {
        marginTop: 20,
        backgroundColor: "#193648",
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    uploadButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
        marginLeft: 6,
    },
    notificationNote: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        backgroundColor: "#F8F9FA",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
    },
    notificationText: {
        fontSize: 12,
        color: "#7F8C8D",
        marginLeft: 8,
    },
})

export default AIRecommendationsScreen;