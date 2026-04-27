import { CONSTANT } from "@/constants/constant";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    Platform,
    Pressable,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import * as Animatable from "react-native-animatable";
import socket from "./utils/Socket";

/* ── Avatar palette (deterministic by name) ── */
const AVATAR_COLORS: [string, string][] = [
    ["#3A7CA5", "#1B3A57"],
    ["#10B981", "#059669"],
    ["#F59E0B", "#D97706"],
    ["#EF4444", "#DC2626"],
    ["#8B5CF6", "#7C3AED"],
    ["#EC4899", "#DB2777"],
    ["#14B8A6", "#0D9488"],
    ["#F97316", "#EA580C"],
];
const colorForName = (name: string = "") => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash << 5) - hash + name.charCodeAt(i);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const resolveAvatarUri = (raw?: string | null): string | null => {
    if (!raw) return null;
    if (raw.startsWith("data:") || raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    if (raw.startsWith("file://")) return null;
    return `${CONSTANT.API_BASE_URL}${raw.startsWith("/") ? "" : "/"}${raw}`;
};

const ChatListScreen = () => {
    const navigation = useNavigation<any>();

    const [students, setStudents] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [myEmail, setMyEmail] = useState("");
    const [myName, setMyName] = useState("");
    const [isRiphah, setIsRiphah] = useState(true);
    const [imgError, setImgError] = useState<{ [key: string]: boolean }>({});
    const [actionTarget, setActionTarget] = useState<any | null>(null);
    const [showGuide, setShowGuide] = useState(true);
    const [typingMap, setTypingMap] = useState<Record<string, boolean>>({});
    const [newChatVisible, setNewChatVisible] = useState(false);
    const [newChatSearch, setNewChatSearch] = useState("");

    const studentsRef = useRef<any[]>([]);
    const typingTimers = useRef<Record<string, any>>({});

    useFocusEffect(
        useCallback(() => {
            loadData();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    useEffect(() => {
        if (!myEmail) return;
        socket.connect(CONSTANT.API_BASE_URL, myEmail);

        const handleNewMessage = (msg: any) => {
            if (msg.receiverEmail !== myEmail) return;
            const apply = (list: any[]) => {
                const updated = list.map((s) => {
                    if (s.email === msg.senderEmail) {
                        return {
                            ...s,
                            unreadCount: (s.unreadCount || 0) + 1,
                            lastMessage: {
                                text: msg.imageUrl ? "📷 Photo" : msg.text,
                                createdAt: msg.createdAt,
                                senderEmail: msg.senderEmail,
                            },
                        };
                    }
                    return s;
                });
                updated.sort(
                    (a, b) =>
                        new Date(b.lastMessage?.createdAt || 0).getTime() -
                        new Date(a.lastMessage?.createdAt || 0).getTime()
                );
                return updated;
            };
            setStudents((prev) => apply(prev));
            // Filtered = only students with active conversations.
            // If sender wasn't in filtered yet, ensure they appear now.
            setFiltered((prev) => {
                let list = prev;
                if (!prev.some((s) => s.email === msg.senderEmail)) {
                    const fromMaster = studentsRef.current.find((s) => s.email === msg.senderEmail);
                    if (fromMaster) list = [fromMaster, ...prev];
                }
                return apply(list).filter((s) => s.lastMessage);
            });
        };

        // ── Real-time presence ──
        const handlePresence = (data: any) => {
            if (!data?.email) return;
            const update = (list: any[]) =>
                list.map((s) =>
                    s.email === data.email
                        ? { ...s, online: !!data.online, lastActive: data.lastActive || s.lastActive }
                        : s
                );
            setStudents((prev) => update(prev));
            setFiltered((prev) => update(prev));
        };

        const handlePresenceSnapshot = (data: any) => {
            const onlineSet = new Set(data?.onlineEmails || []);
            const update = (list: any[]) =>
                list.map((s) => ({ ...s, online: onlineSet.has(s.email) }));
            setStudents((prev) => update(prev));
            setFiltered((prev) => update(prev));
        };

        // ── Typing indicator ──
        const handleTyping = (data: any) => {
            const { senderEmail, isTyping } = data || {};
            if (!senderEmail) return;
            setTypingMap((prev) => ({ ...prev, [senderEmail]: !!isTyping }));

            if (typingTimers.current[senderEmail]) {
                clearTimeout(typingTimers.current[senderEmail]);
            }
            if (isTyping) {
                typingTimers.current[senderEmail] = setTimeout(() => {
                    setTypingMap((prev) => ({ ...prev, [senderEmail]: false }));
                }, 4000);
            }
        };

        socket.on("newMessage", handleNewMessage);
        socket.on("presence", handlePresence);
        socket.on("presenceSnapshot", handlePresenceSnapshot);
        socket.on("typingStatus", handleTyping);
        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.off("presence", handlePresence);
            socket.off("presenceSnapshot", handlePresenceSnapshot);
            socket.off("typingStatus", handleTyping);
        };
    }, [myEmail]);

    /* Format "last seen" relative time like Facebook */
    const formatLastSeen = (dateStr: string | null) => {
        if (!dateStr) return "Offline";
        const d = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
        if (diff < 60) return "Active just now";
        if (diff < 3600) return `Active ${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `Active ${Math.floor(diff / 3600)}h ago`;
        if (diff < 604800) return `Active ${Math.floor(diff / 86400)}d ago`;
        return `Last seen ${d.toLocaleDateString("en-PK", { day: "numeric", month: "short" })}`;
    };

    const loadData = async () => {
        try {
            const email = await AsyncStorage.getItem("studentEmail");
            const name = (await AsyncStorage.getItem("studentFullName")) || "Student";
            if (!email) return;
            setMyEmail(email);
            setMyName(name);

            const lower = email.toLowerCase();
            if (!lower.endsWith("@students.riphah.edu.pk")) {
                setIsRiphah(false);
                setLoading(false);
                return;
            }

            const res = await axios.get(`${CONSTANT.API_BASE_URL}/api/chat/students/${email}`);
            const data = res.data.students || [];
            setStudents(data);
            // Main list shows only students with active conversations (like WhatsApp)
            setFiltered(data.filter((s: any) => s.lastMessage));
            studentsRef.current = data;
        } catch (err) {
            console.log("ChatList error:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleSearch = (text: string) => {
        setSearch(text);
        // Main list shows only students with active conversations (WhatsApp style)
        const baseList = students.filter((s) => s.lastMessage);
        if (!text.trim()) {
            setFiltered(baseList);
            return;
        }
        const q = text.toLowerCase();
        setFiltered(
            baseList.filter(
                (s) =>
                    s.fullName?.toLowerCase().includes(q) ||
                    s.email?.toLowerCase().includes(q) ||
                    s.department?.toLowerCase().includes(q)
            )
        );
    };

    const formatTime = (dateStr: string) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        const now = new Date();
        const isToday =
            d.getDate() === now.getDate() &&
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear();
        if (isToday)
            return d.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" });
        const dayMs = 24 * 60 * 60 * 1000;
        if (now.getTime() - d.getTime() < 7 * dayMs)
            return d.toLocaleDateString("en-PK", { weekday: "short" });
        return d.toLocaleDateString("en-PK", { day: "numeric", month: "short" });
    };

    const deleteConversation = async (item: any) => {
        try {
            await axios.delete(
                `${CONSTANT.API_BASE_URL}/api/chat/conversation/${myEmail}/${item.email}`
            );
            const clear = (list: any[]) =>
                list.map((s) =>
                    s.email === item.email ? { ...s, lastMessage: null, unreadCount: 0 } : s
                );
            setStudents((prev) => clear(prev));
            setFiltered((prev) => clear(prev));
        } catch (err) {
            console.log("Delete chat error:", err);
            Alert.alert("Error", "Could not delete chat. Try again.");
        }
    };

    const confirmDelete = (item: any) => {
        setActionTarget(null);
        Alert.alert(
            "Delete chat?",
            `This will permanently delete your conversation with ${item.fullName}.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteConversation(item),
                },
            ]
        );
    };

    const renderAvatar = (item: any, size = 54) => {
        const uri = !imgError[item.email] ? resolveAvatarUri(item.profileImage) : null;
        const [c1, c2] = colorForName(item.fullName || item.email);
        if (uri) {
            return (
                <Image
                    source={{ uri }}
                    style={{ width: size, height: size, borderRadius: size / 2 }}
                    onError={() => setImgError((prev) => ({ ...prev, [item.email]: true }))}
                />
            );
        }
        return (
            <LinearGradient
                colors={[c1, c2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text style={[styles.avatarLetter, { fontSize: size * 0.42 }]}>
                    {(item.fullName || item.email)?.trim()?.[0]?.toUpperCase() || "S"}
                </Text>
            </LinearGradient>
        );
    };

    const renderItem = ({ item }: { item: any }) => {
        const isUnread = item.unreadCount > 0;
        const isTyping = !!typingMap[item.email];
        const isOnline = !!item.online;

        let subtitle: string;
        let subtitleColor = "#6B7280";
        let subtitleStyle: any = {};

        if (isTyping) {
            subtitle = "typing…";
            subtitleColor = "#10B981";
            subtitleStyle = { fontStyle: "italic", fontWeight: "700" };
        } else if (item.lastMessage) {
            const lm = item.lastMessage;
            const prefix = lm.senderEmail === myEmail ? "You: " : "";
            if (lm.imageUrl) subtitle = prefix + "📷 Photo";
            else if (lm.videoUrl) subtitle = prefix + "📹 Video";
            else if (lm.audioUrl) subtitle = prefix + "🎵 Voice note";
            else if (lm.documentUrl) subtitle = prefix + `📄 ${lm.documentName || "Document"}`;
            else subtitle = prefix + (lm.text || "");
        } else {
            subtitle = isOnline ? "Active now" : formatLastSeen(item.lastActive);
        }

        return (
            <Pressable
                android_ripple={{ color: "#E5E7EB" }}
                style={({ pressed }) => [
                    styles.studentRow,
                    pressed && Platform.OS === "ios" && { backgroundColor: "#F3F4F6" },
                ]}
                onLongPress={() => setActionTarget(item)}
                delayLongPress={250}
                onPress={() => {
                    const clear = (list: any[]) =>
                        list.map((s) => (s.email === item.email ? { ...s, unreadCount: 0 } : s));
                    setStudents((prev) => clear(prev));
                    setFiltered((prev) => clear(prev));
                    navigation.navigate("ChatRoom", {
                        otherEmail: item.email,
                        otherName: item.fullName,
                        otherAvatar: item.profileImage || null,
                        myEmail,
                        myName,
                    });
                }}
            >
                <View style={styles.avatarWrap}>
                    {renderAvatar(item, 54)}
                    {isOnline && <View style={styles.onlineDot} />}
                </View>

                <View style={{ flex: 1, marginLeft: 14 }}>
                    <View style={styles.rowTop}>
                        <Text
                            style={[styles.studentName, isUnread && { fontWeight: "800" }]}
                            numberOfLines={1}
                        >
                            {item.fullName}
                        </Text>
                        {item.lastMessage && (
                            <Text
                                style={[
                                    styles.timeText,
                                    isUnread && { color: "#193648", fontWeight: "700" },
                                ]}
                            >
                                {formatTime(item.lastMessage.createdAt)}
                            </Text>
                        )}
                    </View>

                    <View style={styles.rowBottom}>
                        <Text
                            style={[
                                styles.lastMsg,
                                { color: subtitleColor },
                                subtitleStyle,
                                isUnread && !isTyping && { color: "#111827", fontWeight: "600" },
                            ]}
                            numberOfLines={1}
                        >
                            {subtitle}
                        </Text>
                        {isUnread && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {item.unreadCount > 99 ? "99+" : item.unreadCount}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </Pressable>
        );
    };

    const handleBlock = async (item: any) => {
        try {
            const action = item.iBlocked ? "unblock" : "block";
            await axios.post(`${CONSTANT.API_BASE_URL}/api/chat/${action}`, {
                myEmail,
                otherEmail: item.email,
            });
            const update = (list: any[]) =>
                list.map((s) =>
                    s.email === item.email ? { ...s, iBlocked: !item.iBlocked } : s
                );
            setStudents((prev) => update(prev));
            setFiltered((prev) => update(prev));
            Alert.alert(
                item.iBlocked ? "Unblocked" : "Blocked",
                item.iBlocked
                    ? `${item.fullName} can now message you again.`
                    : `${item.fullName} won't be able to message you.`
            );
        } catch (err) {
            console.log("Block error:", err);
            Alert.alert("Error", "Could not update block status.");
        }
    };

    /* ── Restricted (non-Riphah) view ── */
    if (!isRiphah) {
        return (
            <View style={styles.restrictWrap}>
                <LinearGradient
                    colors={["#193648", "#193648"]}
                    style={styles.restrictHero}
                >
                    <MaterialCommunityIcons name="shield-lock" size={68} color="#fff" />
                </LinearGradient>
                <Text style={styles.restrictTitle}>Riphah Members Only</Text>
                <Text style={styles.restrictSub}>
                    This chat is exclusively available for verified Riphah University members.
                    Please log in with your{" "}
                    <Text style={{ fontWeight: "800", color: "#193648" }}>
                        @students.riphah.edu.pk
                    </Text>{" "}
                    email to access this feature.
                </Text>
                <TouchableOpacity
                    style={styles.restrictBtn}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.restrictBtnText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const totalChats = students.filter((s) => s.lastMessage).length;
    const totalUnread = students.reduce(
        (sum, s) => sum + (s.unreadCount || 0),
        0
    );
    const onlineUsers = students.filter((s) => s.online);
    const recentChats = students.filter((s) => s.lastMessage);

    const newChatList = students.filter((s) => {
        if (!newChatSearch.trim()) return true;
        const q = newChatSearch.toLowerCase();
        return (
            s.fullName?.toLowerCase().includes(q) ||
            s.email?.toLowerCase().includes(q) ||
            s.department?.toLowerCase().includes(q)
        );
    });

    const startChatWith = (item: any) => {
        setNewChatVisible(false);
        setNewChatSearch("");
        navigation.navigate("ChatRoom", {
            otherEmail: item.email,
            otherName: item.fullName,
            otherAvatar: item.profileImage || null,
            myEmail,
            myName,
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#193648" translucent={false} />
            {/* ── Header (premium gradient hero) ── */}
            <LinearGradient
                colors={["#193648", "#193648"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                {/* Top nav row — back button only */}
                <Animatable.View animation="fadeInDown" duration={500} style={styles.headerNavRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                        <Ionicons name="arrow-back" size={22} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.verifiedPill}>
                        <MaterialCommunityIcons name="shield-check" size={13} color="#34D399" />
                        <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                </Animatable.View>

                {/* Title block */}
                <Animatable.View animation="fadeInUp" duration={550} delay={100} style={styles.headerTitleBlock}>
                    <Text style={styles.headerTitle}>Messages</Text>
                    <Text style={styles.headerTagline}>
                        Stay connected with your Riphah peers
                    </Text>
                </Animatable.View>

                {/* Compact stats pills */}
                <Animatable.View animation="fadeInUp" duration={600} delay={200} style={styles.statsRow}>
                    <View style={styles.statPill}>
                        <Ionicons name="people" size={12} color="#fff" />
                        <Text style={styles.statPillNum}>{students.length}</Text>
                        <Text style={styles.statPillLabel}>members</Text>
                    </View>
                    <View style={styles.statPill}>
                        <MaterialCommunityIcons name="message-text" size={12} color="#34D399" />
                        <Text style={styles.statPillNum}>{totalChats}</Text>
                        <Text style={styles.statPillLabel}>chats</Text>
                    </View>
                    {totalUnread > 0 && (
                        <View style={[styles.statPill, { backgroundColor: "rgba(239,68,68,0.2)" }]}>
                            <MaterialCommunityIcons name="bell-ring" size={12} color="#FCA5A5" />
                            <Text style={styles.statPillNum}>{totalUnread}</Text>
                            <Text style={styles.statPillLabel}>unread</Text>
                        </View>
                    )}
                </Animatable.View>
            </LinearGradient>

            {/* ── Search ── */}
            <View style={styles.searchWrap}>
                <Ionicons name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
                <TextInput
                    value={search}
                    onChangeText={handleSearch}
                    placeholder="Search by name or department..."
                    placeholderTextColor="#9CA3AF"
                    style={styles.searchInput}
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => handleSearch("")}>
                        <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                )}
            </View>

            {/* ── Welcome Guide Card ── */}
            {showGuide && (
                <Animatable.View animation="fadeInDown" duration={600} delay={250} style={styles.guideCard}>
                    <View style={styles.guideHeaderRow}>
                        <View style={styles.guideIconWrap}>
                            <MaterialCommunityIcons name="school" size={20} color="#193648" />
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.guideTitle}>Welcome to Riphah Chat</Text>
                            <Text style={styles.guideSubtitle}>Your safe space to connect</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => setShowGuide(false)}
                            style={styles.guideClose}
                            hitSlop={10}
                        >
                            <Ionicons name="close" size={16} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.guideBullets}>
                        <View style={styles.guideBullet}>
                            <View style={styles.guideBulletIcon}>
                                <MaterialCommunityIcons name="shield-check" size={11} color="#193648" />
                            </View>
                            <Text style={styles.guideBulletText}>
                                <Text style={{ fontWeight: "800" }}>Verified only</Text> · Chat with real Riphah members
                            </Text>
                        </View>
                        <View style={styles.guideBullet}>
                            <View style={styles.guideBulletIcon}>
                                <MaterialCommunityIcons name="gesture-tap-hold" size={11} color="#193648" />
                            </View>
                            <Text style={styles.guideBulletText}>
                                <Text style={{ fontWeight: "800" }}>Long-press</Text> any chat for block, delete & more
                            </Text>
                        </View>
                    </View>
                </Animatable.View>
            )}

            {/* ── Online Now carousel (Instagram Stories style) ── */}
            {!search && onlineUsers.length > 0 && (
                <View style={styles.onlineSection}>
                    <View style={styles.onlineHeader}>
                        <View style={styles.onlinePulse} />
                        <Text style={styles.onlineTitle}>Active Now</Text>
                        <View style={styles.onlineCountBadge}>
                            <Text style={styles.onlineCountText}>{onlineUsers.length}</Text>
                        </View>
                    </View>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={onlineUsers}
                        keyExtractor={(item) => "online-" + item.email}
                        contentContainerStyle={{ paddingHorizontal: 14, gap: 12 }}
                        renderItem={({ item }) => (
                            <Pressable
                                style={styles.onlineCard}
                                onPress={() =>
                                    navigation.navigate("ChatRoom", {
                                        otherEmail: item.email,
                                        otherName: item.fullName,
                                        otherAvatar: item.profileImage || null,
                                        myEmail,
                                        myName,
                                    })
                                }
                            >
                                <View style={styles.onlineAvatarRing}>
                                    {renderAvatar(item, 56)}
                                    <View style={styles.onlineCardDot} />
                                </View>
                                <Text style={styles.onlineName} numberOfLines={1}>
                                    {item.fullName?.split(" ")[0]}
                                </Text>
                            </Pressable>
                        )}
                    />
                </View>
            )}

            {/* ── Section header ── */}
            <View style={styles.sectionHeader}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                    <MaterialCommunityIcons
                        name={search ? "magnify" : "message-text-outline"}
                        size={14}
                        color="#193648"
                    />
                    <Text style={styles.sectionTitle}>
                        {search
                            ? "Search Results"
                            : recentChats.length > 0
                            ? "Recent Chats"
                            : "All Connections"}
                    </Text>
                </View>
                <View style={styles.sectionCountPill}>
                    <Text style={styles.sectionCount}>{filtered.length}</Text>
                </View>
            </View>

            {loading ? (
                <View style={{ marginTop: 40, alignItems: "center" }}>
                    <ActivityIndicator color="#193648" size="large" />
                    <Text style={styles.loadingText}>Loading your network...</Text>
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.email}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 30 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => {
                                setRefreshing(true);
                                loadData();
                            }}
                            colors={["#193648"]}
                            tintColor="#193648"
                        />
                    }
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    ListEmptyComponent={
                        <View style={styles.emptyBox}>
                            <View style={styles.emptyIconWrap}>
                                <MaterialCommunityIcons
                                    name="message-plus-outline"
                                    size={48}
                                    color="#193648"
                                />
                            </View>
                            <Text style={styles.emptyTitle}>
                                {search ? "No matches found" : "Start your first chat"}
                            </Text>
                            <Text style={styles.emptySub}>
                                {search
                                    ? "Try a different name, email or department."
                                    : "Tap the + button below to find a Riphah member and start a conversation."}
                            </Text>
                            {!search && (
                                <TouchableOpacity
                                    style={styles.emptyCtaBtn}
                                    onPress={() => setNewChatVisible(true)}
                                    activeOpacity={0.85}
                                >
                                    <Ionicons name="add" size={16} color="#fff" />
                                    <Text style={styles.emptyCtaText}>New Chat</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    }
                    ListFooterComponent={
                        filtered.length > 0 ? (
                            <View style={styles.footerNote}>
                                <MaterialCommunityIcons
                                    name="lock-check"
                                    size={13}
                                    color="#94A3B8"
                                />
                                <Text style={styles.footerNoteText}>
                                    End-to-end private · Riphah verified network
                                </Text>
                            </View>
                        ) : null
                    }
                />
            )}

            {/* ── Floating "New Chat" FAB ── */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => setNewChatVisible(true)}
                activeOpacity={0.85}
            >
                <LinearGradient
                    colors={["#193648", "#193648"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.fabInner}
                >
                    <MaterialCommunityIcons name="message-plus" size={26} color="#fff" />
                </LinearGradient>
            </TouchableOpacity>

            {/* ── New Chat — Full-screen page (WhatsApp style) ── */}
            <Modal
                visible={newChatVisible}
                animationType="slide"
                onRequestClose={() => {
                    setNewChatVisible(false);
                    setNewChatSearch("");
                }}
            >
                <View style={styles.newChatScreen}>
                    <StatusBar barStyle="light-content" backgroundColor="#193648" translucent={false} />

                    {/* Compact navy navigation header */}
                    <LinearGradient
                        colors={["#193648", "#193648"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.newChatHeader}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                setNewChatVisible(false);
                                setNewChatSearch("");
                            }}
                            style={styles.newChatBackBtn}
                            hitSlop={10}
                        >
                            <Ionicons name="arrow-back" size={22} color="#fff" />
                        </TouchableOpacity>

                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={styles.newChatTitle}>New chat</Text>
                            <Text style={styles.newChatSub}>
                                {students.length} contacts available
                            </Text>
                        </View>

                        <View style={styles.newChatVerifiedPill}>
                            <MaterialCommunityIcons name="shield-check" size={12} color="#34D399" />
                            <Text style={styles.newChatVerifiedText}>Riphah</Text>
                        </View>
                    </LinearGradient>

                    {/* Search */}
                    <View style={styles.newChatSearchBar}>
                        <Ionicons name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
                        <TextInput
                            value={newChatSearch}
                            onChangeText={setNewChatSearch}
                            placeholder="Search by name, email or department"
                            placeholderTextColor="#9CA3AF"
                            style={styles.newChatSearchInput}
                            autoFocus
                        />
                        {newChatSearch.length > 0 && (
                            <TouchableOpacity onPress={() => setNewChatSearch("")}>
                                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* List of all registered Riphah students */}
                    <FlatList
                        data={newChatList}
                        keyExtractor={(item) => "new-" + item.email}
                        contentContainerStyle={{ paddingBottom: 30 }}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => (
                            <Pressable
                                android_ripple={{ color: "#E5E7EB" }}
                                style={({ pressed }) => [
                                    styles.newChatRow,
                                    pressed && Platform.OS === "ios" && { backgroundColor: "#F8FAFC" },
                                ]}
                                onPress={() => startChatWith(item)}
                            >
                                <View style={styles.avatarWrap}>
                                    {renderAvatar(item, 48)}
                                    {item.online && <View style={styles.onlineDot} />}
                                </View>
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <Text style={styles.newChatName} numberOfLines={1}>
                                        {item.fullName}
                                    </Text>
                                    <Text style={styles.newChatMeta} numberOfLines={1}>
                                        {item.department || item.email}
                                    </Text>
                                </View>
                                <View style={styles.newChatStartBtn}>
                                    <Ionicons name="chatbubble-ellipses" size={14} color="#193648" />
                                    <Text style={styles.newChatStartText}>Chat</Text>
                                </View>
                            </Pressable>
                        )}
                        ItemSeparatorComponent={() => (
                            <View style={{ height: 1, backgroundColor: "#F1F5F9", marginLeft: 76 }} />
                        )}
                        ListHeaderComponent={
                            <View style={styles.newChatTotalRow}>
                                <Ionicons name="people" size={13} color="#193648" />
                                <Text style={styles.newChatTotalText}>
                                    {newChatList.length} {newChatList.length === 1 ? "person" : "people"} available
                                </Text>
                            </View>
                        }
                        ListEmptyComponent={
                            <View style={{ alignItems: "center", padding: 50 }}>
                                <View style={styles.emptyIconWrap}>
                                    <MaterialCommunityIcons
                                        name="account-search-outline"
                                        size={48}
                                        color="#193648"
                                    />
                                </View>
                                <Text style={styles.newChatEmptyTitle}>No matches</Text>
                                <Text style={styles.newChatEmptySub}>
                                    Try a different name or email — only registered Riphah members appear here.
                                </Text>
                            </View>
                        }
                    />
                </View>
            </Modal>

            {/* ── Action sheet ── */}
            <Modal
                transparent
                visible={!!actionTarget}
                animationType="fade"
                onRequestClose={() => setActionTarget(null)}
            >
                <Pressable style={styles.sheetBackdrop} onPress={() => setActionTarget(null)}>
                    <Pressable style={styles.sheet}>
                        <View style={styles.sheetHandle} />
                        <View style={styles.sheetHeader}>
                            {actionTarget && renderAvatar(actionTarget, 46)}
                            <View style={{ marginLeft: 12, flex: 1 }}>
                                <Text style={styles.sheetName} numberOfLines={1}>
                                    {actionTarget?.fullName || "Student"}
                                </Text>
                                <Text style={styles.sheetSub} numberOfLines={1}>
                                    {actionTarget?.email}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.sheetItem}
                            onPress={() => {
                                const t = actionTarget;
                                setActionTarget(null);
                                if (t) {
                                    navigation.navigate("ChatRoom", {
                                        otherEmail: t.email,
                                        otherName: t.fullName,
                                        otherAvatar: t.profileImage || null,
                                        myEmail,
                                        myName,
                                    });
                                }
                            }}
                        >
                            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#193648" />
                            <Text style={styles.sheetItemText}>Open chat</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.sheetItem}
                            onPress={() => {
                                const t = actionTarget;
                                setActionTarget(null);
                                if (t) handleBlock(t);
                            }}
                        >
                            <Ionicons name="ban-outline" size={20} color="#F59E0B" />
                            <Text style={[styles.sheetItemText, { color: "#F59E0B" }]}>
                                {actionTarget?.iBlocked ? "Unblock user" : "Block user"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.sheetItem}
                            onPress={() => actionTarget && confirmDelete(actionTarget)}
                        >
                            <Ionicons name="trash-outline" size={20} color="#EF4444" />
                            <Text style={[styles.sheetItemText, { color: "#EF4444" }]}>
                                Delete chat
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.sheetItem, { borderTopWidth: 0 }]}
                            onPress={() => setActionTarget(null)}
                        >
                            <Ionicons name="close" size={20} color="#6B7280" />
                            <Text style={[styles.sheetItemText, { color: "#6B7280" }]}>Cancel</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5F7FA" },

    /* Header */
    header: {
        paddingTop: Platform.OS === "ios" ? 70 : 50,
        paddingBottom: 22,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        elevation: 8,
        shadowColor: "#193648",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    headerNavRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
    },
    headerTitleBlock: {
        marginBottom: 14,
    },
    headerTagline: {
        color: "rgba(255,255,255,0.72)",
        fontSize: 12.5,
        fontWeight: "500",
        marginTop: 5,
        letterSpacing: 0.2,
    },
    headerTopRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.14)",
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        color: "#fff",
        fontSize: 26,
        fontWeight: "800",
        letterSpacing: -0.3,
    },
    headerSubRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 6,
    },
    greenDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#34D399",
    },
    headerSub: {
        color: "rgba(255,255,255,0.78)",
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 0.2,
    },
    verifiedPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "rgba(52,211,153,0.18)",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    verifiedText: { color: "#34D399", fontSize: 11, fontWeight: "700" },

    /* Stats — compact pills */
    statsRow: {
        flexDirection: "row",
        marginTop: 14,
        gap: 8,
        flexWrap: "wrap",
    },
    statPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: "rgba(255,255,255,0.14)",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.18)",
    },
    statPillNum: { color: "#fff", fontSize: 12.5, fontWeight: "800" },
    statPillLabel: { color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: "600" },
    statBox: { flex: 1, alignItems: "center", gap: 4 },
    statIconBubble: {
        width: 28,
        height: 28,
        borderRadius: 9,
        backgroundColor: "rgba(255,255,255,0.18)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 2,
    },
    statValue: { color: "#fff", fontSize: 18, fontWeight: "800" },
    statLabel: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 10.5,
        marginTop: 2,
        fontWeight: "600",
        letterSpacing: 0.3,
    },
    statDivider: {
        width: 1,
        backgroundColor: "rgba(255,255,255,0.2)",
        marginHorizontal: 4,
    },

    /* Search */
    searchWrap: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        marginHorizontal: 14,
        marginTop: 14,
        marginBottom: 6,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: Platform.OS === "ios" ? 12 : 8,
        shadowColor: "#193648",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
        borderWidth: 1,
        borderColor: "#EEF1F4",
    },
    searchInput: { flex: 1, fontSize: 14, color: "#111827", padding: 0 },

    /* Guide */
    guideCard: {
        backgroundColor: "#fff",
        marginHorizontal: 14,
        marginTop: 10,
        marginBottom: 6,
        padding: 14,
        borderRadius: 16,
        borderLeftWidth: 3,
        borderLeftColor: "#193648",
        shadowColor: "#193648",
        shadowOpacity: 0.07,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 2,
    },
    guideHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    guideIconWrap: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: "rgba(25,54,72,0.08)",
        alignItems: "center",
        justifyContent: "center",
    },
    guideTitle: {
        fontSize: 14,
        fontWeight: "800",
        color: "#193648",
    },
    guideSubtitle: {
        fontSize: 11.5,
        color: "#64748B",
        marginTop: 2,
        fontWeight: "500",
    },
    guideText: {
        fontSize: 12,
        color: "#64748B",
        lineHeight: 17,
    },
    guideClose: {
        padding: 4,
    },
    guideBullets: {
        gap: 8,
        backgroundColor: "rgba(25,54,72,0.04)",
        padding: 10,
        borderRadius: 12,
    },
    guideBullet: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    guideBulletIcon: {
        width: 22,
        height: 22,
        borderRadius: 7,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    guideBulletText: {
        flex: 1,
        fontSize: 11.5,
        color: "#475569",
        lineHeight: 16,
    },

    /* Section header */
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingTop: 16,
        paddingBottom: 10,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: "800",
        color: "#193648",
        letterSpacing: 1,
        textTransform: "uppercase",
    },
    sectionCountPill: {
        backgroundColor: "#193648",
        paddingHorizontal: 9,
        paddingVertical: 2,
        borderRadius: 10,
        minWidth: 24,
        alignItems: "center",
    },
    sectionCount: {
        fontSize: 11,
        color: "#fff",
        fontWeight: "800",
    },

    /* Online Now carousel (Instagram Stories style) */
    onlineSection: {
        backgroundColor: "#fff",
        marginTop: 12,
        marginHorizontal: 14,
        borderRadius: 18,
        paddingVertical: 14,
        shadowColor: "#193648",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
        elevation: 2,
    },
    onlineHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    onlinePulse: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#10B981",
    },
    onlineTitle: {
        fontSize: 12,
        fontWeight: "800",
        color: "#193648",
        letterSpacing: 1,
        textTransform: "uppercase",
        flex: 1,
    },
    onlineCountBadge: {
        backgroundColor: "#10B981",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        minWidth: 22,
        alignItems: "center",
    },
    onlineCountText: {
        fontSize: 10.5,
        color: "#fff",
        fontWeight: "800",
    },
    onlineCard: {
        alignItems: "center",
        width: 72,
        gap: 6,
    },
    onlineAvatarRing: {
        position: "relative",
        padding: 2,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: "#10B981",
    },
    onlineCardDot: {
        position: "absolute",
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: "#10B981",
        borderWidth: 2.5,
        borderColor: "#fff",
    },
    onlineName: {
        fontSize: 11.5,
        fontWeight: "700",
        color: "#193648",
        textAlign: "center",
    },

    /* List item */
    studentRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 13,
    },
    avatarWrap: { position: "relative" },
    avatarLetter: { color: "#fff", fontWeight: "800" },
    onlineDot: {
        position: "absolute",
        bottom: 1,
        right: 1,
        width: 13,
        height: 13,
        borderRadius: 7,
        backgroundColor: "#10B981",
        borderWidth: 2.5,
        borderColor: "#fff",
    },
    rowTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    studentName: {
        fontSize: 15.5,
        fontWeight: "700",
        color: "#111827",
        flex: 1,
        marginRight: 8,
    },
    timeText: { fontSize: 11, color: "#9CA3AF" },
    rowBottom: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    lastMsg: { fontSize: 13, color: "#6B7280", flex: 1, marginRight: 8 },
    badge: {
        backgroundColor: "#193648",
        borderRadius: 11,
        minWidth: 22,
        height: 22,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 7,
    },
    badgeText: { color: "#fff", fontSize: 11, fontWeight: "800" },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: "#EEF1F4",
        marginLeft: 84,
    },

    /* Empty / loading */
    loadingText: {
        marginTop: 12,
        color: "#64748B",
        fontSize: 13,
        fontWeight: "500",
    },
    emptyBox: {
        alignItems: "center",
        padding: 32,
        marginTop: 30,
    },
    emptyIconWrap: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "rgba(25,54,72,0.08)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: "800",
        color: "#193648",
        marginBottom: 6,
    },
    emptySub: {
        fontSize: 13,
        color: "#64748B",
        textAlign: "center",
        lineHeight: 19,
        paddingHorizontal: 20,
    },
    emptyCtaBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#193648",
        paddingHorizontal: 18,
        paddingVertical: 11,
        borderRadius: 14,
        marginTop: 18,
        shadowColor: "#193648",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 4,
    },
    emptyCtaText: { color: "#fff", fontWeight: "800", fontSize: 13.5, letterSpacing: 0.3 },

    /* Footer note */
    footerNote: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        marginTop: 18,
        paddingHorizontal: 20,
    },
    footerNoteText: {
        fontSize: 11,
        color: "#94A3B8",
        fontWeight: "500",
    },

    /* Restricted view */
    restrictWrap: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 28,
    },
    restrictHero: {
        width: 130,
        height: 130,
        borderRadius: 65,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 22,
        shadowColor: "#193648",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 14,
        elevation: 10,
    },
    restrictTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#193648",
        marginBottom: 10,
    },
    restrictSub: {
        fontSize: 14,
        color: "#64748B",
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 24,
    },
    restrictBtn: {
        backgroundColor: "#193648",
        paddingHorizontal: 36,
        paddingVertical: 12,
        borderRadius: 14,
    },
    restrictBtnText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 14,
        letterSpacing: 0.5,
    },

    /* FAB (New Chat) */
    fab: {
        position: "absolute",
        bottom: 24,
        right: 18,
        borderRadius: 32,
        shadowColor: "#193648",
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 14,
        elevation: 12,
    },
    fabInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    },

    /* New Chat — full screen page */
    newChatScreen: {
        flex: 1,
        backgroundColor: "#fff",
    },
    newChatHeader: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: Platform.OS === "ios" ? 54 : 32,
        paddingBottom: 16,
        paddingHorizontal: 14,
        borderBottomLeftRadius: 22,
        borderBottomRightRadius: 22,
        elevation: 6,
        shadowColor: "#193648",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },
    newChatBackBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "rgba(255,255,255,0.14)",
        alignItems: "center",
        justifyContent: "center",
    },
    newChatTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "800",
        letterSpacing: 0.2,
    },
    newChatSub: {
        color: "rgba(255,255,255,0.72)",
        fontSize: 11.5,
        fontWeight: "500",
        marginTop: 2,
    },
    newChatVerifiedPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "rgba(52,211,153,0.18)",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(52,211,153,0.4)",
    },
    newChatVerifiedText: { color: "#34D399", fontSize: 10.5, fontWeight: "800", letterSpacing: 0.3 },
    newChatClose: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#F1F5F9",
        alignItems: "center",
        justifyContent: "center",
    },
    newChatSearchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        marginHorizontal: 16,
        marginTop: 18,
        marginBottom: 6,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: Platform.OS === "ios" ? 13 : 9,
        borderWidth: 1,
        borderColor: "#EEF2F6",
        shadowColor: "#193648",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
    },
    newChatSearchInput: {
        flex: 1,
        fontSize: 14,
        color: "#111827",
        padding: 0,
    },
    newChatTotalRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 18,
        paddingVertical: 12,
    },
    newChatTotalText: {
        fontSize: 11.5,
        fontWeight: "700",
        color: "#193648",
        letterSpacing: 0.5,
        textTransform: "uppercase",
    },
    newChatRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingVertical: 11,
        backgroundColor: "#fff",
    },
    newChatName: {
        fontSize: 14.5,
        fontWeight: "700",
        color: "#0F172A",
    },
    newChatMeta: {
        fontSize: 12,
        color: "#64748B",
        marginTop: 2,
    },
    newChatStartBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "#E8F0F5",
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 12,
    },
    newChatStartText: {
        fontSize: 12,
        fontWeight: "800",
        color: "#193648",
    },
    newChatEmptyTitle: {
        fontSize: 15,
        fontWeight: "800",
        color: "#193648",
        marginTop: 12,
    },
    newChatEmptySub: {
        fontSize: 12.5,
        color: "#64748B",
        marginTop: 4,
    },

    /* Action sheet */
    sheetBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        paddingBottom: Platform.OS === "ios" ? 28 : 14,
        paddingTop: 8,
    },
    sheetHandle: {
        alignSelf: "center",
        width: 42,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#E5E7EB",
        marginBottom: 10,
    },
    sheetHeader: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingBottom: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#E5E7EB",
    },
    sheetName: { fontSize: 15.5, fontWeight: "700", color: "#111827" },
    sheetSub: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
    sheetItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#F3F4F6",
    },
    sheetItemText: { fontSize: 15, fontWeight: "600", color: "#193648" },
});

export default ChatListScreen;
