
// export default EventsScreen;
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const events = [
    {
        id: "1",
        title: "University Job Fair 2025",
        date: "Nov 5, 2025",
        location: "Comsats University, Lahore",
        icon: "briefcase-search",
        color: "#3B82F6",
    },
    {
        id: "2",
        title: "Tech Innovators Meetup",
        date: "Nov 15, 2025",
        location: "Arfa Software Technology Park",
        icon: "lightbulb-on",
        color: "#10B981",
    },
    {
        id: "3",
        title: "AI & Data Science Workshop",
        date: "Dec 2, 2025",
        location: "FAST University, Islamabad",
        icon: "robot-outline",
        color: "#F59E0B",
    },
];

const EventsScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Upcoming Events & Job Fairs 🎫</Text>
            <Text style={styles.subText}>Stay updated with the latest opportunities</Text>

            {events.map((item) => (
                <View key={item.id} style={styles.card}>
                    <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                        <MaterialCommunityIcons name={item.icon} size={24} color="#fff" />
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.title}>{item.title}</Text>
                        <View style={styles.row}>
                            <Ionicons name="calendar" size={16} color="#64748B" />
                            <Text style={styles.info}>{item.date}</Text>
                        </View>
                        <View style={styles.row}>
                            <Ionicons name="location" size={16} color="#64748B" />
                            <Text style={styles.info}>{item.location}</Text>
                        </View>
                    </View>
                </View>
            ))}

            <TouchableOpacity style={styles.registerBtn}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.btnText}>Register for Events</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default EventsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
        padding: 20,
    },
    header: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1E293B",
        marginBottom: 6,
    },
    subText: {
        fontSize: 14,
        color: "#64748B",
        marginBottom: 20,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 15,
        marginBottom: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: 26,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    details: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1E293B",
        marginBottom: 6,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 3,
    },
    info: {
        fontSize: 13,
        color: "#64748B",
        marginLeft: 6,
    },
    registerBtn: {
        flexDirection: "row",
        backgroundColor: "#3B82F6",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 20,
    },
    btnText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
        marginLeft: 8,
    },
});
