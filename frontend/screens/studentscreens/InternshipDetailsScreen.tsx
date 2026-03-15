// screens/studentscreens/InternshipDetailsScreen.tsx
import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    SafeAreaView,
} from "react-native";
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from 'react-native-animatable';

const InternshipDetailsScreen = ({ route }: any) => {
    const defaultInternship = {
        title: "AI Internship Program",
        company: "CollaXion Labs",
        image: "data:image/jpeg;base64,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",
        domain: "Artificial Intelligence",
        difficulty: "Intermediate",
        description:
            "Join our AI Internship program to gain hands-on experience in AI and Machine Learning. Interns will work on real-world projects, gain mentorship from experts, and enhance their technical skills.",
        responsibilities: [
            "Assist in developing AI models.",
            "Perform data preprocessing and analysis.",
            "Collaborate with team members on project tasks.",
            "Document project work and progress.",
        ],
        requiredSkills: [
            "Python",
            "Machine Learning",
            "Data Analysis",
            "TensorFlow/PyTorch",
            "Git",
        ],
        duration: "3 months",
        startDate: "November 15, 2025",
        stipend: "$300/month",
    };

    const { internship } = route.params || { internship: defaultInternship };
    const navigation = useNavigation();

    const handleApply = () => {
        Alert.alert(
            "Application Sent!",
            `Your application for "${internship?.title || defaultInternship.title}" has been submitted. The company will review it.`
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F9FC" }}>
            <ScrollView style={styles.container}>
                {/* Back Button and Share */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#2C3E50" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Alert.alert("Share", "Sharing internship details...")} style={styles.shareButton}>
                        <Ionicons name="share-social-outline" size={24} color="#2C3E50" />
                    </TouchableOpacity>
                </View>

                {/* Internship Image */}
                <Animatable.View animation="fadeIn" delay={200} style={styles.imageContainer}>
                    <Image
                        source={{ uri: internship?.image || defaultInternship.image }}
                        style={styles.internshipImage}
                    />
                </Animatable.View>

                {/* Title and Company */}
                <Animatable.View animation="fadeInUp" delay={300} style={styles.titleSection}>
                    <Text style={styles.internshipTitle}>{internship?.title || defaultInternship.title}</Text>

                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                        <FontAwesome5 name="building" size={14} color="#7F8C8D" />
                        <Text style={[styles.companyText, { marginLeft: 5 }]}>
                            {internship?.company || defaultInternship.company}
                        </Text>
                    </View>

                    <View style={styles.tagBadge}>
                        <Text style={styles.tagText}>{internship?.domain || defaultInternship.domain}</Text>
                    </View>
                </Animatable.View>

                {/* Overview Section */}
                <Animatable.View animation="fadeInUp" delay={400} style={styles.sectionCard}>
                    <Text style={styles.sectionHeader}>Internship Overview</Text>
                    <Text style={styles.descriptionText}>
                        {internship?.description || defaultInternship.description}
                    </Text>

                    <View style={styles.detailRow}>
                        <FontAwesome5 name="chart-line" size={16} color="#3498DB" />
                        <Text style={styles.detailText}>Difficulty: <Text style={styles.highlightText}>{internship?.difficulty || defaultInternship.difficulty}</Text></Text>
                    </View>

                    <View style={styles.detailRow}>
                        <FontAwesome5 name="calendar-alt" size={16} color="#3498DB" />
                        <Text style={styles.detailText}>Duration: <Text style={styles.highlightText}>{internship?.duration || defaultInternship.duration}</Text></Text>
                    </View>

                    <View style={styles.detailRow}>
                        <FontAwesome5 name="play-circle" size={16} color="#3498DB" />
                        <Text style={styles.detailText}>Start Date: <Text style={styles.highlightText}>{internship?.startDate || defaultInternship.startDate}</Text></Text>
                    </View>

                    <View style={styles.detailRow}>
                        <MaterialCommunityIcons name="cash" size={16} color="#27AE60" />
                        <Text style={styles.detailText}>Stipend: <Text style={styles.highlightText}>{internship?.stipend || defaultInternship.stipend}</Text></Text>
                    </View>
                </Animatable.View>

                {/* Skills Section */}
                <Animatable.View animation="fadeInUp" delay={500} style={styles.sectionCard}>
                    <Text style={styles.sectionHeader}>Required Skills</Text>
                    <View style={styles.skillsContainer}>
                        {(internship?.requiredSkills || defaultInternship.requiredSkills).map(
                            (skill: string, index: number) => (
                                <View key={index} style={styles.skillBadge}>
                                    <MaterialCommunityIcons name="check-circle-outline" size={14} color="#27AE60" />
                                    <Text style={styles.skillText}>{skill}</Text>
                                </View>
                            )
                        )}
                    </View>
                </Animatable.View>

                {/* Responsibilities Section */}
                <Animatable.View animation="fadeInUp" delay={600} style={styles.sectionCard}>
                    <Text style={styles.sectionHeader}>Responsibilities</Text>
                    {(internship?.responsibilities || defaultInternship.responsibilities).map(
                        (responsibility: string, index: number) => (
                            <View key={index} style={styles.responsibilityItem}>
                                <Ionicons name="arrow-forward-circle-outline" size={18} color="#5DADE2" />
                                <Text style={styles.responsibilityText}>{responsibility}</Text>
                            </View>
                        )
                    )}
                </Animatable.View>

                {/* Action Button */}
                <Animatable.View animation="bounceIn" delay={700}>
                    <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                        <MaterialCommunityIcons name="handshake-outline" size={24} color="#fff" />
                        <Text style={styles.applyButtonText}>Apply</Text>
                    </TouchableOpacity>
                </Animatable.View>

                <View style={{ height: 50 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F7F9FC" },
    headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingTop: 10, marginBottom: 10 },
    backButton: { padding: 8 },
    shareButton: { padding: 8 },
    imageContainer: { width: '100%', height: 220, backgroundColor: '#EAECEF', justifyContent: 'center', alignItems: 'center', marginBottom: 20, overflow: 'hidden' },
    internshipImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    titleSection: { paddingHorizontal: 20, marginBottom: 20 },
    internshipTitle: { fontSize: 26, fontWeight: "bold", color: "#2C3E50", marginBottom: 8 },
    companyText: { fontSize: 16, color: "#7F8C8D" },
    tagBadge: { backgroundColor: "#E8F6F3", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start', marginTop: 5 },
    tagText: { fontSize: 13, color: "#27AE60", fontWeight: "bold" },
    sectionCard: { backgroundColor: "#FFFFFF", borderRadius: 15, marginHorizontal: 15, padding: 20, marginBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 6 },
    sectionHeader: { fontSize: 19, fontWeight: "bold", color: "#34495E", marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#EAECEF', paddingBottom: 10 },
    descriptionText: { fontSize: 15, color: "#555", lineHeight: 22, marginBottom: 20 },
    detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    detailText: { fontSize: 14, color: "#555", marginLeft: 10 },
    highlightText: { fontWeight: '600', color: '#2C3E50' },
    skillsContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 5 },
    skillBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: "#ECF0F1", borderRadius: 20, paddingVertical: 7, paddingHorizontal: 12, marginRight: 10, marginBottom: 10 },
    skillText: { fontSize: 13, color: "#34495E", marginLeft: 5, fontWeight: '500' },
    responsibilityItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
    responsibilityText: { fontSize: 15, color: "#555", marginLeft: 10, flex: 1 },
    applyButton: { flexDirection: "row", backgroundColor: "#193648", borderRadius: 15, paddingVertical: 15, alignItems: "center", justifyContent: "center", marginHorizontal: 15, marginTop: 20, shadowColor: "#3498DB", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 10 },
    applyButtonText: { color: "#fff", fontWeight: "700", fontSize: 18, marginLeft: 10 },
});

export default InternshipDetailsScreen;
