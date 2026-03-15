import { CONSTANT } from "@/constants/constant";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";

import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const CX_BOT_LOGO = require("../../assets/images/logo.png");

const modules = [
    {
        id: "1",
        title: "AI Recommendations",
        description: "Get personalized internship recommendations based on your skills",
        screen: "AI Recommendations",
        icon: <MaterialCommunityIcons name="brain" size={26} color="#1F2937" />,
    },
    {
        id: "2",
        title: "My Applications",
        description: "Track your internship application status",
        screen: "My Applications",
        icon: <MaterialCommunityIcons name="briefcase-clock" size={26} color="#1F2937" />,
    },
    {
        id: "3",
        title: "My Profile",
        description: "Update your profile and upload CV for better matches",
        screen: "Profile Settings",
        icon: <FontAwesome5 name="user-circle" size={26} color="#1F2937" />,
    },
];

const StudentHomeScreen = () => {
    const navigation = useNavigation<any>();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([]);
    const [inputText, setInputText] = useState("");
    const scrollRef = useRef<ScrollView>(null);
    const [loading, setLoading] = useState(false);
    const [studentData, setStudentData] = useState<any>(null);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        fetchStudentStats();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchStudentStats();
        }, [])
    );


    const fetchStudentStats = async () => {
        try {
            const email = await AsyncStorage.getItem("studentEmail");
            if (!email) return;

            const response = await axios.get(`${CONSTANT.API_BASE_URL}/api/student/getStudent/${email}`);
            setStudentData(response.data);
        } catch (err) {
            console.log("Error fetching student stats:", err);
        } finally {
            setStatsLoading(false);
        }
    };

    const getAiResponse = (userQuery: string): string => {
        const lowerQuery = userQuery.toLowerCase();

        if (lowerQuery.includes("hello") || lowerQuery.includes("hi")) {
            return "Hello there! I'm CXbot, your CollaXion assistant. How can I help you today?";
        }
        if (lowerQuery.includes("cv") || lowerQuery.includes("upload")) {
            return "To upload your CV, go to Profile Settings and tap 'Upload CV (PDF)'. Our AI will analyze it and extract your skills!";
        }
        if (lowerQuery.includes("internship") || lowerQuery.includes("apply")) {
            return "Check out 'AI Recommendations' for personalized internship matches based on your skills!";
        }
        if (lowerQuery.includes("skill") || lowerQuery.includes("recommendation")) {
            return "Upload your CV first, then check 'AI Recommendations' for matches based on your skills!";
        }
        if (lowerQuery.includes("application") || lowerQuery.includes("status")) {
            return "View all your applications and their status in 'My Applications' section!";
        }
        if (lowerQuery.includes("thank")) {
            return "You're welcome! I'm always here to help.";
        }

        return `I'm CXbot! You said: "${userQuery}". I can help you with:\n• Uploading CV\n• Finding internships\n• Checking applications\n\nWhat would you like to know?`;
    };

    const sendMessage = async () => {
        if (!inputText.trim()) return;

        const userMessage = { sender: "user" as const, text: inputText };
        setMessages((prev) => [...prev, userMessage]);
        setInputText("");
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

        setLoading(true);

        setTimeout(() => {
            const aiText = getAiResponse(userMessage.text);
            const aiMessage = { sender: "ai" as const, text: aiText };
            setMessages((prev) => [...prev, aiMessage]);
            setLoading(false);
            setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
        }, 1000);
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
                <Text style={styles.headerTitle}>Welcome Back!</Text>
                <Text style={styles.subText}>
                    {studentData?.fullName ? `${studentData.fullName}` : "Student"}
                </Text>

                {/* Stats Cards */}
                {statsLoading ? (
                    <View style={styles.statsLoadingContainer}>
                        <ActivityIndicator size="small" color="#193648" />
                    </View>
                ) : (
                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <MaterialCommunityIcons name="brain" size={24} color="#193648" />
                            <Text style={styles.statNumber}>
                                {studentData?.extractedSkills?.length || 0}
                            </Text>
                            <Text style={styles.statLabel}>Skills</Text>
                        </View>
                        <View style={styles.statCard}>
                            <MaterialCommunityIcons name="briefcase" size={24} color="#193648" />
                            <Text style={styles.statNumber}>
                                {studentData?.totalApplications || 0}
                            </Text>
                            <Text style={styles.statLabel}>Applications</Text>
                        </View>
                        <View style={styles.statCard}>
                            <MaterialCommunityIcons name="check-circle" size={24} color="#27AE60" />
                            <Text style={styles.statNumber}>
                                {studentData?.selectedInternships || 0}
                            </Text>
                            <Text style={styles.statLabel}>Selected</Text>
                        </View>
                    </View>
                )}

                {/* CV Upload Alert */}
                {!studentData?.cvUrl && (
                    <View style={styles.alertCard}>
                        <MaterialCommunityIcons name="alert-circle" size={24} color="#F39C12" />
                        <View style={styles.alertContent}>
                            <Text style={styles.alertTitle}>Upload Your CV</Text>
                            <Text style={styles.alertText}>
                                Get AI-powered recommendations by uploading your CV
                            </Text>
                            <TouchableOpacity
                                style={styles.alertButton}
                                onPress={() => navigation.navigate("Profile Settings")}
                            >
                                <Text style={styles.alertButtonText}>Upload Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <View style={styles.aiBadge}>
                    <MaterialCommunityIcons name="robot-happy-outline" size={18} color="#fff" />
                    <Text style={styles.aiText}>Smart Recommendations powered by CollaXion AI</Text>
                </View>

                <Text style={styles.sectionTitle}>Quick Actions</Text>
                {modules.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.card}
                        onPress={() => navigation.navigate(item.screen)}
                        activeOpacity={0.8}
                    >
                        <View style={styles.iconContainer}>{item.icon}</View>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <Text style={styles.cardDesc}>{item.description}</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={20} color="#1F2937" />
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Floating AI Button */}
            <TouchableOpacity style={styles.floatingButton} onPress={() => setIsChatOpen(true)}>
                <MaterialCommunityIcons name="robot-happy-outline" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Chat Modal */}
            <Modal visible={isChatOpen} animationType="slide" transparent>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.chatModalContainer}
                >
                    <View style={styles.chatHeader}>
                        <View style={styles.chatHeaderTitleContainer}>
                            <Image source={CX_BOT_LOGO} style={styles.cxbotLogo} />
                            <Text style={styles.chatHeaderTitle}>CXbot</Text>
                        </View>
                        <TouchableOpacity onPress={() => setIsChatOpen(false)}>
                            <MaterialCommunityIcons name="close" size={24} color="#111827" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        ref={scrollRef}
                        style={styles.chatMessages}
                        contentContainerStyle={{ paddingBottom: 10 }}
                        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
                    >
                        {messages.map((msg, idx) => (
                            <View
                                key={idx}
                                style={[
                                    styles.messageBubble,
                                    msg.sender === "user" ? styles.userBubble : styles.aiBubble,
                                ]}
                            >
                                <Text style={{ color: msg.sender === "user" ? "#fff" : "#111827" }}>
                                    {msg.text}
                                </Text>
                            </View>
                        ))}
                        {loading && (
                            <View style={[styles.messageBubble, styles.aiBubble]}>
                                <Text style={{ color: "#111827" }}>AI is typing...</Text>
                            </View>
                        )}
                    </ScrollView>

                    <View style={styles.chatInputContainer}>
                        <TextInput
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Ask CXbot something..."
                            style={styles.chatInput}
                            placeholderTextColor="#9CA3AF"
                        />
                        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                            <MaterialCommunityIcons name="send" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB", paddingHorizontal: 20, paddingTop: 25 },
    headerTitle: { fontSize: 24, fontWeight: "700", color: "#111827", marginBottom: 4 },
    subText: { fontSize: 16, color: "#6B7280", marginBottom: 20 },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    statsLoadingContainer: {
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
        marginHorizontal: 5,
        elevation: 2,
    },
    statNumber: { fontSize: 24, fontWeight: "bold", color: "#193648", marginVertical: 5 },
    statLabel: { fontSize: 12, color: "#6B7280" },
    alertCard: {
        flexDirection: "row",
        backgroundColor: "#FFF3CD",
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
        alignItems: "center",
    },
    alertContent: { flex: 1, marginLeft: 10 },
    alertTitle: { fontSize: 14, fontWeight: "bold", color: "#856404", marginBottom: 4 },
    alertText: { fontSize: 12, color: "#856404", marginBottom: 8 },
    alertButton: { backgroundColor: "#F39C12", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, alignSelf: "flex-start" },
    alertButtonText: { color: "#fff", fontSize: 12, fontWeight: "600" },
    aiBadge: {
        flexDirection: "row",
        backgroundColor: "#193648",
        padding: 10,
        borderRadius: 15,
        alignItems: "center",
        marginBottom: 25,
    },
    aiText: { color: "#fff", fontSize: 12, marginLeft: 8, flex: 1 },
    sectionTitle: { fontSize: 18, fontWeight: "600", color: "#111827", marginBottom: 12 },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
        marginBottom: 16,
    },
    iconContainer: {
        width: 55,
        height: 55,
        borderRadius: 14,
        backgroundColor: "#C6D1D6",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    cardContent: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 2 },
    cardDesc: { fontSize: 13, color: "#6B7280" },
    floatingButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#193648",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
    },
    chatModalContainer: {
        flex: 1,
        backgroundColor: "#fff",
        marginTop: "auto",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: "80%",
    },
    chatHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    chatHeaderTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    chatHeaderTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
    },
    cxbotLogo: {
        width: 30,
        height: 30,
        marginRight: 8,
        resizeMode: "contain",
    },
    chatMessages: { flex: 1, paddingHorizontal: 15, marginVertical: 10 },
    messageBubble: {
        padding: 10,
        borderRadius: 12,
        marginVertical: 5,
        maxWidth: "80%",
    },
    userBubble: { backgroundColor: "#193648", alignSelf: "flex-end" },
    aiBubble: { backgroundColor: "#E5E7EB", alignSelf: "flex-start" },
    chatInputContainer: {
        flexDirection: "row",
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        alignItems: "center",
    },
    chatInput: {
        flex: 1,
        backgroundColor: "#F3F4F6",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 25,
        fontSize: 14,
        color: "#111827",
    },
    sendButton: {
        backgroundColor: "#193648",
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
    },
});

export default StudentHomeScreen;