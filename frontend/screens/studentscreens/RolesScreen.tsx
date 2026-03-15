import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const { width } = Dimensions.get("window");

const RolesScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#1B3A57" barStyle="light-content" />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <LinearGradient
                    colors={["#1B3A57", "#2C5064"]}
                    style={styles.header}
                >
                    <View style={styles.logoWrapper}>
                        <Image
                            source={require("../../assets/images/logo.png")}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.appName}>CollaXion</Text>
                    <Text style={styles.headerSubtitle}>
                        Connecting Students & Industry for Growth
                    </Text>
                </LinearGradient>

                {/* Main Content */}
                <View style={styles.mainContent}>
                    {/* Welcome */}
                    <View style={styles.welcomeSection}>
                        <Text style={styles.welcomeTitle}>Get Started</Text>
                        <Text style={styles.welcomeText}>
                            Choose your role to access features and opportunities tailored for you.
                        </Text>
                    </View>

                    {/* Role Cards */}
                    <View style={styles.cardsWrapper}>
                        {/* Student Card */}
                        <TouchableOpacity
                            style={[styles.roleCard, { backgroundColor: "#F5F9FF" }]}
                            onPress={() => navigation.navigate("StudentLogin")}
                            activeOpacity={0.9}
                        >
                            <View style={styles.iconWrapperCard}>
                                <LinearGradient
                                    colors={["#D5E8F0", "#E8F4F8"]}
                                    style={styles.iconGradientCard}
                                >
                                    <MaterialIcons name="school" size={36} color="#1B3A57" />
                                </LinearGradient>
                            </View>
                            <Text style={styles.cardTitle}>Student</Text>
                            <Text style={styles.cardSubtitle}>Academic Excellence</Text>
                            <Text style={styles.cardDescription}>
                                Collaborate on projects, connect with mentors, and showcase your skills.
                            </Text>

                            <View style={styles.featuresList}>
                                <View style={styles.featureItem}>
                                    <Ionicons name="checkmark-circle" size={16} color="#1B3A57" />
                                    <Text style={styles.featureText}>Project Collaboration</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <Ionicons name="checkmark-circle" size={16} color="#1B3A57" />
                                    <Text style={styles.featureText}>Industry Mentorship</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <Ionicons name="checkmark-circle" size={16} color="#1B3A57" />
                                    <Text style={styles.featureText}>Career Resources</Text>
                                </View>
                            </View>

                            {/* Button design only, parent card handles navigation */}
                            <View style={styles.cardButton}>
                                <Text style={styles.buttonText}>Continue as Student</Text>
                                <MaterialIcons name="arrow-forward" size={20} color="#fff" />
                            </View>
                        </TouchableOpacity>

                        {/* Industry Card */}
                        <TouchableOpacity
                            style={[styles.roleCard, { backgroundColor: "#F5F9FF" }]}
                            onPress={() => navigation.navigate("IndustryLogin")}

                            activeOpacity={0.9}
                        >
                            <View style={styles.iconWrapperCard}>
                                <LinearGradient
                                    colors={["#E8F4F8", "#E8F4F8"]}
                                    style={styles.iconGradientCard}
                                >
                                    <FontAwesome5 name="building" size={32} color="#1B3A57" />
                                </LinearGradient>
                            </View>
                            <Text style={styles.cardTitle}>Industry Partner</Text>
                            <Text style={styles.cardSubtitle}>Business Growth</Text>
                            <Text style={styles.cardDescription}>
                                Discover talent, post opportunities, and build strategic partnerships.
                            </Text>

                            <View style={styles.featuresList}>
                                <View style={styles.featureItem}>
                                    <Ionicons name="checkmark-circle" size={16} color="#1B3A57" />
                                    <Text style={styles.featureText}>Talent Discovery</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <Ionicons name="checkmark-circle" size={16} color="#1B3A57" />
                                    <Text style={styles.featureText}>Project Posting</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <Ionicons name="checkmark-circle" size={16} color="#1B3A57" />
                                    <Text style={styles.featureText}>Analytics Dashboard</Text>
                                </View>
                            </View>

                            <View style={styles.cardButton}>
                                <Text style={styles.buttonText}>Continue as Partner</Text>
                                <MaterialIcons name="arrow-forward" size={20} color="#fff" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Trust Section */}
                    <View style={styles.trustSection}>
                        <View style={styles.trustItem}>
                            <MaterialIcons name="verified-user" size={24} color="#1B3A57" />
                            <Text style={styles.trustTitle}>Secure</Text>
                            <Text style={styles.trustText}>Bank-level encryption</Text>
                        </View>
                        <View style={styles.trustItem}>
                            <MaterialIcons name="people" size={24} color="#1B3A57" />
                            <Text style={styles.trustTitle}>Active</Text>
                            <Text style={styles.trustText}>10K+ users</Text>
                        </View>
                        <View style={styles.trustItem}>
                            <MaterialIcons name="star" size={24} color="#1B3A57" />
                            <Text style={styles.trustTitle}>Trusted</Text>
                            <Text style={styles.trustText}>4.8 rating</Text>
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Building the future of academic-industry collaboration
                        </Text>
                        <Text style={styles.footerSubtext}>
                            © 2025 CollaXion. All rights reserved.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5F7FA" },
    scrollView: { flex: 1 },
    scrollContent: { flexGrow: 1 },
    header: {
        paddingTop: 50,
        paddingBottom: 40,
        paddingHorizontal: 25,
        alignItems: "center",
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    logoWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(255,255,255,0.1)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    logo: { width: 60, height: 60 },
    appName: { fontSize: 28, fontWeight: "900", color: "#fff", letterSpacing: 1, marginBottom: 6 },
    headerSubtitle: { fontSize: 14, color: "#C5D9E2", fontWeight: "500", textAlign: "center" },
    mainContent: { flex: 1, paddingTop: 25, paddingHorizontal: 20, paddingBottom: 25 },
    welcomeSection: { marginBottom: 25, alignItems: "center" },
    welcomeTitle: { fontSize: 26, fontWeight: "800", color: "#1B3A57", marginBottom: 6 },
    welcomeText: { fontSize: 14, color: "#64748B", textAlign: "center", lineHeight: 21, paddingHorizontal: 10 },
    cardsWrapper: { gap: 20, marginBottom: 25 },
    roleCard: { borderRadius: 25, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
    iconWrapperCard: { position: "absolute", top: -25, left: 20 },
    iconGradientCard: { width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center" },
    cardTitle: { fontSize: 22, fontWeight: "800", color: "#1B3A57", marginTop: 40 },
    cardSubtitle: { fontSize: 13, color: "#64748B", fontWeight: "600", marginBottom: 8 },
    cardDescription: { fontSize: 13, color: "#475569", lineHeight: 20, marginBottom: 12 },
    featuresList: { gap: 8, marginBottom: 15 },
    featureItem: { flexDirection: "row", alignItems: "center", gap: 8 },
    featureText: { fontSize: 12, color: "#64748B", fontWeight: "500" },
    cardButton: { backgroundColor: "#1B3A57", flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14, borderRadius: 20, gap: 8 },
    buttonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
    trustSection: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#fff", borderRadius: 16, padding: 20, marginBottom: 25, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
    trustItem: { alignItems: "center", flex: 1 },
    trustTitle: { fontSize: 13, fontWeight: "700", color: "#1B3A57", marginTop: 5 },
    trustText: { fontSize: 11, color: "#64748B", fontWeight: "500" },
    footer: { alignItems: "center", paddingTop: 10 },
    footerText: { fontSize: 13, color: "#64748B", textAlign: "center", fontWeight: "500", marginBottom: 4 },
    footerSubtext: { fontSize: 11, color: "#94A3B8", fontWeight: "400" },
});

export default RolesScreen;






































