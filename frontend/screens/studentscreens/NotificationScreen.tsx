


// import { CONSTANT } from "@/constants/constant";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useFocusEffect } from "@react-navigation/native";
// import axios from "axios";
// import React, { useCallback, useState } from "react";
// import {
//     ActivityIndicator,
//     FlatList,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from "react-native";

// const TYPE_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
//     application: { icon: "briefcase-check", color: "#2563EB", bg: "#EFF6FF" },
//     event:       { icon: "calendar-star",   color: "#7C3AED", bg: "#F5F3FF" },
//     deadline:    { icon: "clock-alert",     color: "#DC2626", bg: "#FEF2F2" },
//     general:     { icon: "bell",            color: "#059669", bg: "#ECFDF5" },
// };

// const timeAgo = (date: string) => {
//     const diff = Date.now() - new Date(date).getTime();
//     const mins = Math.floor(diff / 60000);
//     const hrs = Math.floor(diff / 3600000);
//     const days = Math.floor(diff / 86400000);
//     if (mins < 1) return "Just now";
//     if (mins < 60) return `${mins}m ago`;
//     if (hrs < 24) return `${hrs}h ago`;
//     return `${days}d ago`;
// };

// const NotificationScreen = () => {
//     const [notifications, setNotifications] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);

//     useFocusEffect(
//         useCallback(() => {
//             fetchNotifications();
//         }, [])
//     );

//     const fetchNotifications = async () => {
//         try {
//             const email = await AsyncStorage.getItem("studentEmail");

//             // ✅ Local notifications (mock events se)
//             // const localStored = await AsyncStorage.getItem("localNotifications");
//             // const localNotifs = localStored ? JSON.parse(localStored) : [];

//             // ✅ Backend notifications (real events se)
//             let backendNotifs: any[] = [];
//             if (email) {
//                 try {
//                     const res = await axios.get(
//                         `${CONSTANT.API_BASE_URL}/api/notifications/${email}`
//                     );
//                     backendNotifs = res.data;
//                     await axios.put(
//                         `${CONSTANT.API_BASE_URL}/api/notifications/read-all/${email}`
//                     );
//                 } catch (e) {
//                     // Backend down ho toh bhi local dikhao
//                 }
//             }

//             // ✅ Merge & sort by latest first
//             const allNotifs = [...localNotifs, ...backendNotifs].sort(
//                 (a, b) =>
//                     new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//             );

//             setNotifications(allNotifs);
//         } catch (err) {
//             console.log("Notifications error:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const markRead = async (item: any) => {
//         const itemId = item._id || item.id;

//         // Update local notifications
//         try {
//             const stored = await AsyncStorage.getItem("localNotifications");
//             const localNotifs = stored ? JSON.parse(stored) : [];
//             const updated = localNotifs.map((n: any) =>
//                 n.id === itemId ? { ...n, isRead: true } : n
//             );
//             await AsyncStorage.setItem("localNotifications", JSON.stringify(updated));
//         } catch (e) {}

//         // Update backend notification
//         if (item._id) {
//             try {
//                 await axios.put(
//                     `${CONSTANT.API_BASE_URL}/api/notifications/read/${item._id}`
//                 );
//             } catch (e) {}
//         }

//         setNotifications((prev) =>
//             prev.map((n) =>
//                 (n._id === itemId || n.id === itemId) ? { ...n, isRead: true } : n
//             )
//         );
//     };

//     const renderItem = ({ item }: { item: any }) => {
//         const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.general;
//         const isRead = item.isRead;

//         return (
//             <TouchableOpacity
//                 style={[styles.card, !isRead && styles.cardUnread]}
//                 onPress={() => markRead(item)}
//             >
//                 <View style={[styles.iconWrap, { backgroundColor: cfg.bg }]}>
//                     <MaterialCommunityIcons
//                         name={cfg.icon as any}
//                         size={22}
//                         color={cfg.color}
//                     />
//                 </View>
//                 <View style={{ flex: 1, marginLeft: 14 }}>
//                     <View style={styles.titleRow}>
//                         <Text style={styles.notifTitle}>{item.title}</Text>
//                         {!isRead && <View style={styles.unreadDot} />}
//                     </View>
//                     <Text style={styles.notifMessage}>{item.message}</Text>
//                     <Text style={styles.timeText}>{timeAgo(item.createdAt)}</Text>
//                 </View>
//             </TouchableOpacity>
//         );
//     };

//     const unreadCount = notifications.filter((n) => !n.isRead).length;

//     return (
//         <View style={styles.container}>
//             <View style={styles.header}>
//                 <View>
//                     <Text style={styles.headerTitle}>Notifications</Text>
//                     {unreadCount > 0 && (
//                         <Text style={styles.unreadText}>{unreadCount} unread</Text>
//                     )}
//                 </View>
//             </View>

//             {loading ? (
//                 <ActivityIndicator
//                     color="#193648"
//                     size="large"
//                     style={{ marginTop: 60 }}
//                 />
//             ) : (
//                 <FlatList
//                     data={notifications}
//                     keyExtractor={(item) => item._id || item.id}
//                     renderItem={renderItem}
//                     contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
//                     ListEmptyComponent={
//                         <View style={styles.emptyState}>
//                             <MaterialCommunityIcons
//                                 name="bell-off-outline"
//                                 size={64}
//                                 color="#D1D5DB"
//                             />
//                             <Text style={styles.emptyTitle}>No Notifications</Text>
//                             <Text style={styles.emptySub}>
//                                 Register for events to get notified!
//                             </Text>
//                         </View>
//                     }
//                 />
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#F0F4F8" },
//     header: {
//         backgroundColor: "#193648",
//         padding: 20,
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//     },
//     headerTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
//     unreadText: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 },
//     card: {
//         flexDirection: "row",
//         backgroundColor: "#fff",
//         borderRadius: 16,
//         padding: 16,
//         marginBottom: 10,
//         elevation: 1,
//         alignItems: "flex-start",
//     },
//     cardUnread: {
//         borderLeftWidth: 3,
//         borderLeftColor: "#193648",
//         backgroundColor: "#FAFBFF",
//     },
//     iconWrap: {
//         width: 46,
//         height: 46,
//         borderRadius: 14,
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     titleRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         gap: 8,
//         marginBottom: 4,
//     },
//     notifTitle: { fontSize: 14, fontWeight: "700", color: "#111827", flex: 1 },
//     unreadDot: {
//         width: 8,
//         height: 8,
//         borderRadius: 4,
//         backgroundColor: "#2563EB",
//     },
//     notifMessage: { fontSize: 13, color: "#4B5563", lineHeight: 19, marginBottom: 6 },
//     timeText: { fontSize: 11, color: "#9CA3AF" },
//     emptyState: { alignItems: "center", paddingTop: 80 },
//     emptyTitle: { fontSize: 18, fontWeight: "700", color: "#374151", marginTop: 16 },
//     emptySub: {
//         fontSize: 14,
//         color: "#9CA3AF",
//         marginTop: 8,
//         textAlign: "center",
//         paddingHorizontal: 32,
//     },
// });

// export default NotificationScreen;







import { CONSTANT } from "@/constants/constant";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import socket from "./utils/Socket";

const TYPE_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
    application: { icon: "briefcase-check", color: "#2563EB", bg: "#EFF6FF" },
    event:       { icon: "calendar-star",   color: "#7C3AED", bg: "#F5F3FF" },
    deadline:    { icon: "clock-alert",     color: "#DC2626", bg: "#FEF2F2" },
    general:     { icon: "bell",            color: "#059669", bg: "#ECFDF5" },
};

const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs  = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1)  return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24)  return `${hrs}h ago`;
    return `${days}d ago`;
};

const NotificationScreen = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [])
    );

    // Live updates — new notifications pushed via WS get prepended to the list
    useEffect(() => {
        let cleanup = () => {};
        (async () => {
            const email = await AsyncStorage.getItem("studentEmail");
            if (!email) return;
            socket.connect(CONSTANT.API_BASE_URL, email);

            const handleNewNotification = (notif: any) => {
                if (!notif || notif.studentEmail !== email) return;
                setNotifications((prev) => {
                    if (notif._id && prev.some((n) => n._id === notif._id)) return prev;
                    return [notif, ...prev];
                });
            };

            socket.on("newNotification", handleNewNotification);
            cleanup = () => socket.off("newNotification", handleNewNotification);
        })();
        return () => cleanup();
    }, []);

    const fetchNotifications = async () => {
        try {
            const email = await AsyncStorage.getItem("studentEmail");

            // ✅ Sirf backend notifications — per student
            let backendNotifs: any[] = [];
            if (email) {
                try {
                    const res = await axios.get(
                        `${CONSTANT.API_BASE_URL}/api/notifications/${email}`
                    );
                    backendNotifs = res.data;

                    // Mark all as read
                    await axios.put(
                        `${CONSTANT.API_BASE_URL}/api/notifications/read-all/${email}`
                    );
                } catch (e) {
                    console.log("Backend notifications error:", e);
                }
            }

            // ✅ Sort by latest first
            const sorted = backendNotifs.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            setNotifications(sorted);
        } catch (err) {
            console.log("Notifications error:", err);
        } finally {
            setLoading(false);
        }
    };

    const markRead = async (item: any) => {
        const itemId = item._id;

        // ✅ Sirf backend update
        if (itemId) {
            try {
                await axios.put(
                    `${CONSTANT.API_BASE_URL}/api/notifications/read/${itemId}`
                );
            } catch (e) {}
        }

        setNotifications((prev) =>
            prev.map((n) =>
                n._id === itemId ? { ...n, isRead: true } : n
            )
        );
    };

    const renderItem = ({ item }: { item: any }) => {
        const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.general;
        const isRead = item.isRead;

        return (
            <TouchableOpacity
                style={[styles.card, !isRead && styles.cardUnread]}
                onPress={() => markRead(item)}
            >
                <View style={[styles.iconWrap, { backgroundColor: cfg.bg }]}>
                    <MaterialCommunityIcons
                        name={cfg.icon as any}
                        size={22}
                        color={cfg.color}
                    />
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                    <View style={styles.titleRow}>
                        <Text style={styles.notifTitle}>{item.title}</Text>
                        {!isRead && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.notifMessage}>{item.message}</Text>
                    <Text style={styles.timeText}>{timeAgo(item.createdAt)}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Notifications</Text>
                    {unreadCount > 0 && (
                        <Text style={styles.unreadText}>{unreadCount} unread</Text>
                    )}
                </View>
            </View>

            {loading ? (
                <ActivityIndicator
                    color="#193648"
                    size="large"
                    style={{ marginTop: 60 }}
                />
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons
                                name="bell-off-outline"
                                size={64}
                                color="#D1D5DB"
                            />
                            <Text style={styles.emptyTitle}>No Notifications</Text>
                            <Text style={styles.emptySub}>
                                Register for events to get notified!
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F0F4F8" },
    header: {
        backgroundColor: "#193648",
        padding: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
    unreadText: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
        elevation: 1,
        alignItems: "flex-start",
    },
    cardUnread: {
        borderLeftWidth: 3,
        borderLeftColor: "#193648",
        backgroundColor: "#FAFBFF",
    },
    iconWrap: {
        width: 46,
        height: 46,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 4,
    },
    notifTitle: { fontSize: 14, fontWeight: "700", color: "#111827", flex: 1 },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#2563EB",
    },
    notifMessage: { fontSize: 13, color: "#4B5563", lineHeight: 19, marginBottom: 6 },
    timeText: { fontSize: 11, color: "#9CA3AF" },
    emptyState: { alignItems: "center", paddingTop: 80 },
    emptyTitle: { fontSize: 18, fontWeight: "700", color: "#374151", marginTop: 16 },
    emptySub: {
        fontSize: 14,
        color: "#9CA3AF",
        marginTop: 8,
        textAlign: "center",
        paddingHorizontal: 32,
    },
});

export default NotificationScreen;