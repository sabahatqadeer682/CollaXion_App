// screens/NotificationScreen.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// Mock notifications
const mockNotifications = [
    {
        id: "1",
        type: "internship",
        title: "New Internship Available",
        description: "Frontend Developer at TechCorp",
        timestamp: "2 hours ago",
        read: false,
        targetScreen: "InternshipDetails",
        targetId: "101",
    },
    {
        id: "2",
        type: "reminder",
        title: "Upload Your CV",
        description: "Don't forget to upload your latest CV",
        timestamp: "1 day ago",
        read: false,
        targetScreen: "Profile Settings",
        targetId: "",
    },
];

// Helper functions
const getIcon = (type: string) => {
    switch (type) {
        case "internship":
            return "briefcase-outline";
        case "reminder":
            return "bell-outline";
        default:
            return "bell-outline";
    }
};

const getColor = (type: string) => {
    switch (type) {
        case "internship":
            return "#2F80ED";
        case "reminder":
            return "#F2994A";
        default:
            return "#000";
    }
};

const NotificationScreen = () => {
    const navigation = useNavigation();
    const [notifications, setNotifications] = useState(mockNotifications);

    const handlePress = (item) => {
        // Mark notification as read
        setNotifications((prev) =>
            prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
        );

        // Navigate only if targetScreen exists
        if (item.targetScreen && item.targetScreen !== "EventsScreen") {
            navigation.navigate(item.targetScreen, { id: item.targetId });
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.card, !item.read && styles.unreadCard]}
            onPress={() => handlePress(item)}
        >
            <MaterialCommunityIcons
                name={getIcon(item.type)}
                size={28}
                color={getColor(item.type)}
            />
            <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={[styles.title, !item.read && { fontWeight: "bold" }]}>
                    {item.title}
                </Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#193648" barStyle="light-content" />
            <Text style={styles.header}>Notifications</Text>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F2F3F4" },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#193648",
        padding: 15,
        backgroundColor: "#EAF3FA",
    },
    card: {
        flexDirection: "row",
        padding: 15,
        marginHorizontal: 15,
        marginVertical: 7,
        backgroundColor: "#fff",
        borderRadius: 10,
        elevation: 2,
    },
    unreadCard: { backgroundColor: "#DFF0FF" },
    title: { fontSize: 16, color: "#193648" },
    description: { fontSize: 14, color: "#555", marginTop: 2 },
    timestamp: { fontSize: 12, color: "#999", marginTop: 4 },
});

export default NotificationScreen;
