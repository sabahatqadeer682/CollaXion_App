import { CONSTANT } from "@/constants/constant";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Easing,
    Platform,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    Vibration,
    View,
} from "react-native";
import socket from "./utils/Socket";

type Notif = {
    _id?: string;
    title: string;
    message: string;
    type?: string;
};

const TYPE_ICON: Record<string, { icon: string; color: string }> = {
    application: { icon: "briefcase-check", color: "#2563EB" },
    event: { icon: "calendar-star", color: "#7C3AED" },
    deadline: { icon: "clock-alert", color: "#DC2626" },
    general: { icon: "bell-ring", color: "#059669" },
};

const TOP_OFFSET =
    Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) + 8 : 50;

const NotificationOverlay = () => {
    const navigation = useNavigation<any>();
    const [current, setCurrent] = useState<Notif | null>(null);
    const translateY = useRef(new Animated.Value(-160)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const hide = () => {
        if (dismissTimer.current) clearTimeout(dismissTimer.current);
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -160,
                duration: 220,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => setCurrent(null));
    };

    const show = (notif: Notif) => {
        setCurrent(notif);

        // Sound-like feedback: short vibration burst + heavy haptic.
        // Pattern is [wait, vibrate, wait, vibrate] — feels like a "ding ding".
        try {
            Vibration.vibrate(
                Platform.OS === "android" ? [0, 80, 60, 80] : 250
            );
        } catch {}
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
            () => {}
        );

        translateY.setValue(-160);
        opacity.setValue(0);

        Animated.parallel([
            Animated.spring(translateY, {
                toValue: 0,
                tension: 80,
                friction: 10,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 220,
                useNativeDriver: true,
            }),
        ]).start();

        if (dismissTimer.current) clearTimeout(dismissTimer.current);
        dismissTimer.current = setTimeout(hide, 4200);
    };

    useEffect(() => {
        let cleanup = () => {};
        (async () => {
            const email = await AsyncStorage.getItem("studentEmail");
            if (!email) return;
            socket.connect(CONSTANT.API_BASE_URL, email);

            const handler = (notif: any) => {
                if (!notif) return;
                show({
                    _id: notif._id,
                    title: notif.title || "Notification",
                    message: notif.message || "",
                    type: notif.type || "general",
                });
            };

            socket.on("newNotification", handler);
            cleanup = () => socket.off("newNotification", handler);
        })();

        return () => {
            cleanup();
            if (dismissTimer.current) clearTimeout(dismissTimer.current);
        };
    }, []);

    if (!current) return null;

    const cfg = TYPE_ICON[current.type || "general"] || TYPE_ICON.general;

    return (
        <Animated.View
            pointerEvents="box-none"
            style={[styles.wrap, { opacity, transform: [{ translateY }] }]}
        >
            <Pressable
                onPress={() => {
                    hide();
                    navigation.navigate?.("Notifications");
                }}
                style={styles.banner}
                android_ripple={{ color: "#1E3A4A" }}
            >
                <View style={[styles.iconBg, { backgroundColor: cfg.color + "22" }]}>
                    <MaterialCommunityIcons
                        name={cfg.icon as any}
                        size={22}
                        color={cfg.color}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title} numberOfLines={1}>
                        {current.title}
                    </Text>
                    <Text style={styles.body} numberOfLines={2}>
                        {current.message}
                    </Text>
                </View>
                <Pressable hitSlop={10} onPress={hide} style={styles.closeBtn}>
                    <MaterialCommunityIcons name="close" size={16} color="#9CA3AF" />
                </Pressable>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    wrap: {
        position: "absolute",
        top: TOP_OFFSET,
        left: 12,
        right: 12,
        zIndex: 9999,
        elevation: 30,
    },
    banner: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 14,
        gap: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 14,
        borderWidth: 1,
        borderColor: "#EEF1F4",
    },
    iconBg: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: "center",
        alignItems: "center",
    },
    title: { fontSize: 14, fontWeight: "800", color: "#111827" },
    body: { fontSize: 12.5, color: "#4B5563", marginTop: 2 },
    closeBtn: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#F3F4F6",
        justifyContent: "center",
        alignItems: "center",
    },
});

export default NotificationOverlay;
