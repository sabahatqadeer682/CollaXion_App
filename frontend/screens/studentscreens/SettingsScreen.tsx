import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons'; // Assuming you are using Expo for icons

const SettingsScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Settings</Text>
            </View>

            <View style={styles.settingsGroup}>
                <Text style={styles.groupTitle}>Account</Text>
                <TouchableOpacity style={styles.option}>
                    <Ionicons name="notifications-outline" size={24} color="#555" style={styles.optionIcon} />
                    <Text style={styles.optionText}>Notification Preferences</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.option}>
                    <Ionicons name="key-outline" size={24} color="#555" style={styles.optionIcon} />
                    <Text style={styles.optionText}>Update Password</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
            </View>

            <View style={styles.settingsGroup}>
                <Text style={styles.groupTitle}>General</Text>
                <TouchableOpacity style={styles.option}>
                    <Ionicons name="language-outline" size={24} color="#555" style={styles.optionIcon} />
                    <Text style={styles.optionText}>Language</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.option}>
                    <Ionicons name="moon-outline" size={24} color="#555" style={styles.optionIcon} />
                    <Text style={styles.optionText}>Dark Mode</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
            </View>

            <View style={styles.settingsGroup}>
                <Text style={styles.groupTitle}>Support</Text>
                <TouchableOpacity style={styles.option}>
                    <Ionicons name="help-circle-outline" size={24} color="#555" style={styles.optionIcon} />
                    <Text style={styles.optionText}>Help & FAQ</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.option}>
                    <Ionicons name="information-circle-outline" size={24} color="#555" style={styles.optionIcon} />
                    <Text style={styles.optionText}>About Us</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.option, styles.logoutButton]}>
                <Ionicons name="log-out-outline" size={24} color="#E74C3C" style={styles.optionIcon} />
                <Text style={[styles.optionText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>

            <View style={styles.versionInfo}>
                <Text style={styles.versionText}>App Version 1.0.0</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F2F5", // Lighter background for a fresh look
    },
    header: {
        paddingTop: 50, // More padding for status bar space
        paddingHorizontal: 20,
        backgroundColor: "#FFFFFF",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 20,
        paddingBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 28, // Larger title
        fontWeight: "bold",
        color: "#2C3E50", // Darker, more professional color
    },
    settingsGroup: {
        marginBottom: 25,
        marginHorizontal: 15,
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
        paddingVertical: 10,
    },
    groupTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#7F8C8D", // Muted color for group titles
        paddingHorizontal: 15,
        marginBottom: 10,
        marginTop: 5,
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#EAECEF", // Subtle separator
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 15,
        // No bottom border for the last item in a group, handled by the parent view
    },
    // To remove the border from the last item in a group
    option: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    // Add specific style for the last option in a group if you want to remove its border
    // Example: Use a specific component for the last item or conditional styling
    optionIcon: {
        marginRight: 15,
    },
    optionText: {
        flex: 1,
        fontSize: 16,
        color: "#34495E", // Professional text color
    },
    logoutButton: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        marginHorizontal: 15,
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
        marginBottom: 30, // Space at the bottom
    },
    logoutText: {
        color: "#E74C3C", // Red for logout, stands out
        fontWeight: "bold",
    },
    versionInfo: {
        alignItems: "center",
        marginBottom: 20,
    },
    versionText: {
        fontSize: 12,
        color: "#99AAB5",
    },
});

export default SettingsScreen;