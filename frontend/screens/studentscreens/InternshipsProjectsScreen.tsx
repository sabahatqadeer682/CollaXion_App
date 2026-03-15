// screens/studentscreens/InternshipsProjectsScreen.tsx
import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
    Dimensions,
    SafeAreaView,
} from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";

const { width } = Dimensions.get("window");

const InternshipsProjectsScreen = () => {
    const navigation = useNavigation<any>();

    const handleApply = (title: string, company: string, duration: string, stipend: string, location: string) => {
        Alert.alert(
            "Application Confirmation",
            `You are about to apply for "${title}" at ${company}.\nDuration: ${duration}\nStipend: ${stipend}\nLocation: ${location}\nProceed?`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Apply Now", onPress: () => Alert.alert("Success!", `Your application for "${title}" has been sent.`) },
            ]
        );
    };

    const handleViewProject = (project: any) => {
        navigation.navigate("ProjectDetails", { project });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                {/* Header */}
                <Animatable.View animation="fadeInDown" delay={200} style={{ paddingHorizontal: 20, marginTop: 15 }}>
                    <Text style={styles.mainHeader} numberOfLines={1} adjustsFontSizeToFit>
                        Find Your Next Opportunity
                    </Text>
                    <Text style={styles.subText}>Explore top internships & projects curated for you by CollaXion AI.</Text>

                    <View style={[styles.aiBadge, { backgroundColor: '#193648' }]}>
                        <MaterialCommunityIcons name="robot-happy-outline" size={20} color="#fff" />
                        <Text style={styles.aiBadgeText}>Smart AI Recommendations</Text>
                    </View>
                </Animatable.View>

                {/* Internships Section */}
                <Animatable.View animation="fadeInUp" delay={400} style={{ paddingLeft: 20 }}>
                    <Text style={styles.sectionTitle}>🔥 Trending Internships</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
                        {/* Internship 1 */}
                        <Animatable.View animation="fadeInUp" delay={100} style={styles.card}>
                            <Image source={{ uri: "https://cdn.dribbble.com/users/1162077/screenshots/3848914/programmer.gif" }} style={styles.image} />
                            <View style={styles.cardBody}>
                                <View style={[styles.tagContainer, { backgroundColor: '#D6E4F0' }]}>
                                    <Text style={[styles.tagText, { color: '#193648' }]}>Full-time</Text>
                                </View>
                                <Text style={styles.cardTitle}>Mobile App Developer Intern</Text>
                                <Text style={styles.cardCompany}>SoftLab Solutions</Text>
                                <View style={styles.infoRow}>
                                    <FontAwesome5 name="hourglass-start" size={12} color="#7F8C8D" />
                                    <Text style={styles.infoText}>2 months</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <FontAwesome5 name="money-bill-wave" size={12} color="#7F8C8D" />
                                    <Text style={styles.infoText}>Paid</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <FontAwesome5 name="map-marker-alt" size={12} color="#7F8C8D" />
                                    <Text style={styles.infoText}>Remote</Text>
                                </View>
                                <TouchableOpacity style={styles.primaryButton} onPress={() => handleApply("Mobile App Developer Intern", "SoftLab Solutions", "2 months", "Paid", "Remote")}>
                                    <MaterialCommunityIcons name="send" size={18} color="#fff" />
                                    <Text style={styles.buttonText}>Apply Now</Text>
                                </TouchableOpacity>
                            </View>
                        </Animatable.View>

                        {/* Internship 2 */}
                        <Animatable.View animation="fadeInUp" delay={200} style={styles.card}>
                            <Image source={{ uri: "data:image/png;base64,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" }} style={styles.image} />
                            <View style={styles.cardBody}>
                                <View style={[styles.tagContainer, { backgroundColor: '#D6E4F0' }]}>
                                    <Text style={[styles.tagText, { color: '#193648' }]}>Part-time</Text>
                                </View>
                                <Text style={styles.cardTitle}>Backend Developer Intern</Text>
                                <Text style={styles.cardCompany}>TechNova Systems</Text>
                                <View style={styles.infoRow}>
                                    <FontAwesome5 name="hourglass-start" size={12} color="#7F8C8D" />
                                    <Text style={styles.infoText}>3 months</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <FontAwesome5 name="money-bill-wave" size={12} color="#7F8C8D" />
                                    <Text style={styles.infoText}>Unpaid</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <FontAwesome5 name="map-marker-alt" size={12} color="#7F8C8D" />
                                    <Text style={styles.infoText}>Lahore</Text>
                                </View>
                                <TouchableOpacity style={styles.primaryButton} onPress={() => handleApply("Backend Developer Intern", "TechNova Systems", "3 months", "Unpaid", "Lahore")}>
                                    <MaterialCommunityIcons name="send" size={18} color="#fff" />
                                    <Text style={styles.buttonText}>Apply Now</Text>
                                </TouchableOpacity>
                            </View>
                        </Animatable.View>
                    </ScrollView>
                </Animatable.View>

                {/* Projects Section */}
                <Animatable.View animation="fadeInUp" delay={600} style={{ paddingLeft: 20, marginTop: 20 }}>
                    <Text style={styles.sectionTitle}>Recommended Projects</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
                        {/* Project 1 */}
                        <Animatable.View animation="fadeInUp" delay={100} style={styles.card}>
                            <Image source={{ uri: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80" }} style={styles.image} />
                            <View style={styles.cardBody}>
                                <View style={[styles.tagContainer, { backgroundColor: '#D6E4F0' }]}>
                                    <Text style={[styles.tagText, { color: '#193648' }]}>Advanced</Text>
                                </View>
                                <Text style={styles.cardTitle}>AI-Based Resume Analyzer</Text>
                                <Text style={styles.cardCompany}>CollaXion Labs</Text>
                                <View style={styles.infoRow}>
                                    <MaterialCommunityIcons name="code-tags" size={14} color="#7F8C8D" />
                                    <Text style={styles.infoText}>Artificial Intelligence</Text>
                                </View>
                                <TouchableOpacity style={styles.secondaryButton} onPress={() => handleViewProject({
                                    title: "AI-Based Resume Analyzer",
                                    company: "CollaXion Labs",
                                    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
                                    domain: "Artificial Intelligence",
                                    difficulty: "Advanced",
                                    description: "Develop an intelligent resume analyzer using AI and ML techniques.",
                                    responsibilities: ["NLP Models", "Backend API", "User-friendly interface"],
                                    requiredSkills: ["Python", "TensorFlow/PyTorch", "NLP", "RESTful APIs"],
                                    teamSize: "3-5 members",
                                    duration: "4 months",
                                    startDate: "October 1, 2024",
                                })}>
                                    <MaterialCommunityIcons name="eye" size={18} color="#193648" />
                                    <Text style={[styles.buttonText, { color: '#193648' }]}>View Details</Text>
                                </TouchableOpacity>
                            </View>
                        </Animatable.View>
                    </ScrollView>
                </Animatable.View>

                <View style={{ height: 50 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#F7F9FC" },
    container: { flex: 1 },
    mainHeader: { fontSize: 28, fontWeight: "bold", color: "#193648", marginBottom: 5 },
    subText: { fontSize: 15, color: "#7F8C8D", marginBottom: 15 },
    aiBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 25,
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
    aiBadgeText: { color: "#fff", fontSize: 13, marginLeft: 8, fontWeight: "600" },
    sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#193648", marginBottom: 15 },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        width: width * 0.75,
        marginRight: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 8,
        overflow: "hidden",
        marginBottom: 10,
    },
    image: { width: "100%", height: 140, borderTopLeftRadius: 18, borderTopRightRadius: 18, resizeMode: 'cover' },
    cardBody: { padding: 15 },
    tagContainer: { backgroundColor: "#D6E4F0", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15, alignSelf: 'flex-start', marginBottom: 8 },
    tagText: { fontSize: 11, color: "#193648", fontWeight: "bold" },
    cardTitle: { fontSize: 17, fontWeight: "bold", color: "#193648", marginBottom: 4 },
    cardCompany: { fontSize: 13, color: "#7F8C8D", marginBottom: 10 },
    infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
    infoText: { fontSize: 12, color: "#7F8C8D", marginLeft: 8 },
    primaryButton: { flexDirection: "row", backgroundColor: "#193648", paddingVertical: 10, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 15 },
    secondaryButton: { flexDirection: "row", backgroundColor: "#ECF0F1", borderWidth: 1, borderColor: "#193648", paddingVertical: 10, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 10 },
    buttonText: { color: "#fff", marginLeft: 8, fontSize: 14, fontWeight: "600" },
});

export default InternshipsProjectsScreen;
