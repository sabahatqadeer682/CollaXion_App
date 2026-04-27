import { CONSTANT } from "@/constants/constant";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const C = {
    primary: "#193648",
    primaryLight: "#2A5A72",
    primaryDeep: "#0F2438",
    primarySoft: "#E8F0F5",
    accent: "#193648",
    gold: "#F59E0B",
    goldSoft: "#FFF7ED",
    success: "#10B981",
    danger: "#EF4444",
    background: "#F4F7FB",
    white: "#FFFFFF",
    textPrimary: "#0F172A",
    textSecondary: "#64748B",
    textMuted: "#94A3B8",
    border: "#E2E8F0",
};

// Company logo mapping — real brand logos via Google favicon API (reliable + fast)
const COMPANY_LOGOS: Record<string, { icon: string; colors: [string, string]; domain: string }> = {
    "TechNest Solutions":     { icon: "code-tags",       colors: ["#1F4357", "#193648"], domain: "microsoft.com" },
    "DataSphere AI":          { icon: "brain",           colors: ["#2A5A72", "#193648"], domain: "openai.com" },
    "AppForge Pakistan":      { icon: "cellphone-cog",   colors: ["#3A7CA5", "#1F4357"], domain: "apple.com" },
    "SecureNet Corp":         { icon: "shield-lock",     colors: ["#193648", "#0F2438"], domain: "cloudflare.com" },
    "PixelCraft Studio":      { icon: "palette",         colors: ["#2A5A72", "#3A7CA5"], domain: "adobe.com" },
    "CloudBase Technologies": { icon: "cloud",           colors: ["#3A7CA5", "#2A5A72"], domain: "google.com" },
    "InnovateHub":            { icon: "rocket-launch",   colors: ["#1F4357", "#2A5A72"], domain: "atlassian.com" },
    "Other":                  { icon: "office-building", colors: ["#193648", "#2A5A72"], domain: "github.com" },
};

const getCompanyLogo = (name: string) =>
    COMPANY_LOGOS[name] || COMPANY_LOGOS["Other"];

// Google favicon API — highly reliable, returns PNG of any site's logo
const getLogoImageUrl = (companyName: string) =>
    `https://www.google.com/s2/favicons?sz=128&domain=${getCompanyLogo(companyName).domain}`;

// Fallback URL using ui-avatars (always works) when primary fails
const getFallbackLogoUrl = (companyName: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=193648&color=fff&size=128&bold=true&font-size=0.42&format=png`;

const CATEGORIES = [
    { key: "Overall", icon: "star-circle", color: "#193648" },
    { key: "Internship", icon: "briefcase-outline", color: "#2A5A72" },
    { key: "Culture", icon: "account-group-outline", color: "#3A7CA5" },
    { key: "Mentorship", icon: "school-outline", color: "#1F4357" },
    { key: "Work Environment", icon: "office-building-outline", color: "#0F2438" },
];

const COMPANIES = [
    "TechNest Solutions",
    "DataSphere AI",
    "AppForge Pakistan",
    "SecureNet Corp",
    "PixelCraft Studio",
    "CloudBase Technologies",
    "InnovateHub",
    "Other",
];

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
const RATING_EMOJIS = ["", "😞", "😐", "🙂", "😊", "🤩"];

// Image component that auto-falls back to letter avatar if primary fails
const CompanyLogoImage = ({
    companyName,
    style,
}: {
    companyName: string;
    style?: any;
}) => {
    const [failed, setFailed] = useState(false);
    const uri = failed
        ? getFallbackLogoUrl(companyName)
        : getLogoImageUrl(companyName);
    return (
        <Image
            key={uri}
            source={{ uri }}
            style={style}
            resizeMode="contain"
            onError={() => setFailed(true)}
        />
    );
};

const StarRating = ({
    rating,
    onRate,
    size = 22,
}: {
    rating: number;
    onRate?: (r: number) => void;
    size?: number;
}) => (
    <View style={{ flexDirection: "row", gap: 3 }}>
        {[1, 2, 3, 4, 5].map((s) => (
            <TouchableOpacity
                key={s}
                onPress={() => onRate?.(s)}
                disabled={!onRate}
                activeOpacity={0.7}
            >
                <MaterialCommunityIcons
                    name={s <= rating ? "star" : "star-outline"}
                    size={size}
                    color={s <= rating ? C.gold : "#CBD5E1"}
                />
            </TouchableOpacity>
        ))}
    </View>
);

export default function FeedbackScreen() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modal, setModal] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    const [selected, setSelected] = useState<any>(null);
    const [editMode, setEditMode] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [filter, setFilter] = useState<number | null>(null);

    const [form, setForm] = useState({
        companyName: "",
        rating: 0,
        category: "Overall",
        comment: "",
        isAnonymous: false,
    });

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const fetchData = async () => {
        try {
            const email = await AsyncStorage.getItem("studentEmail");
            if (!email) return;
            const res = await axios.get(
                `${CONSTANT.API_BASE_URL}/api/feedback/student/${email}`
            );
            setData(res.data || []);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const filtered = useMemo(() => {
        if (filter === null) return data;
        return data.filter((d) => Math.floor(d.rating) === filter);
    }, [data, filter]);

    const stats = useMemo(() => {
        if (!data.length) return { total: 0, avg: 0, highest: 0, fiveCount: 0 };
        const sum = data.reduce((a, b) => a + b.rating, 0);
        const highest = Math.max(...data.map((d) => d.rating));
        const fiveCount = data.filter((d) => d.rating === 5).length;
        return {
            total: data.length,
            avg: (sum / data.length).toFixed(1),
            highest,
            fiveCount,
        };
    }, [data]);

    const ratingDistribution = useMemo(() => {
        const dist = [0, 0, 0, 0, 0];
        data.forEach((d) => {
            const r = Math.floor(d.rating);
            if (r >= 1 && r <= 5) dist[r - 1]++;
        });
        return dist;
    }, [data]);

    const resetForm = () => {
        setForm({ companyName: "", rating: 0, category: "Overall", comment: "", isAnonymous: false });
        setEditMode(false);
        setSelected(null);
    };

    const openSubmitModal = () => {
        resetForm();
        setModal(true);
    };

    const editFeedback = (item: any) => {
        setForm({
            companyName: item.companyName,
            rating: item.rating,
            category: item.category,
            comment: item.comment,
            isAnonymous: item.isAnonymous,
        });
        setSelected(item);
        setEditMode(true);
        setDetailModal(false);
        setModal(true);
    };

    const deleteFeedback = (id: string) => {
        Alert.alert(
            "Delete Review",
            "Are you sure you want to permanently remove this feedback?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await axios.delete(`${CONSTANT.API_BASE_URL}/api/feedback/${id}`);
                            setDetailModal(false);
                            fetchData();
                        } catch {
                            Alert.alert("Error", "Could not delete review.");
                        }
                    },
                },
            ]
        );
    };

    const submit = async () => {
        if (!form.companyName) return Alert.alert("Required", "Please select a company.");
        if (!form.rating) return Alert.alert("Required", "Please tap to give a star rating.");
        if (form.comment.trim().length < 15)
            return Alert.alert("Tell us more", "Please write at least 15 characters.");

        setSubmitting(true);
        try {
            const email = await AsyncStorage.getItem("studentEmail");
            if (editMode && selected?._id) {
                await axios.put(`${CONSTANT.API_BASE_URL}/api/feedback/${selected._id}`, {
                    ...form,
                    studentEmail: email,
                });
            } else {
                await axios.post(`${CONSTANT.API_BASE_URL}/api/feedback/submit`, {
                    studentEmail: email,
                    ...form,
                });
            }
            setModal(false);
            fetchData();
            setTimeout(() => {
                Alert.alert(
                    "✓ " + (editMode ? "Updated!" : "Submitted!"),
                    editMode
                        ? "Your review has been updated."
                        : "Thank you! Your review will help other students."
                );
            }, 200);
        } catch {
            Alert.alert("Error", "Could not submit your review.");
        } finally {
            setSubmitting(false);
        }
    };

    const formatTimeAgo = (date: string) => {
        const diff = (Date.now() - new Date(date).getTime()) / 1000;
        if (diff < 60) return "just now";
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
        return new Date(date).toLocaleDateString("en-PK", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const getCategoryMeta = (cat: string) => {
        return CATEGORIES.find((c) => c.key === cat) || CATEGORIES[0];
    };

    const Card = ({ item }: any) => {
        const meta = getCategoryMeta(item.category);
        return (
            <Pressable
                onPress={() => {
                    setSelected(item);
                    setDetailModal(true);
                }}
                style={({ pressed }) => [styles.card, pressed && { opacity: 0.95, transform: [{ scale: 0.99 }] }]}
            >
                {/* Soft watermark star top-right */}
                <MaterialCommunityIcons
                    name="format-quote-open"
                    size={70}
                    color={C.primarySoft}
                    style={styles.cardWatermark}
                />

                <View style={styles.cardHeader}>
                    {/* Company logo — real brand image */}
                    <View style={styles.logoOuter}>
                        <View style={styles.logoBg}>
                            <CompanyLogoImage
                                companyName={item.companyName}
                                style={styles.logoImage}
                            />
                        </View>
                        {/* Verified gold check on bottom-right */}
                        <View style={styles.logoVerified}>
                            <MaterialCommunityIcons name="check-decagram" size={14} color={C.gold} />
                        </View>
                    </View>

                    <View style={{ flex: 1, marginLeft: 14 }}>
                        <Text style={styles.company} numberOfLines={1}>
                            {item.companyName}
                        </Text>
                        <View style={styles.subRow}>
                            <View
                                style={[
                                    styles.categoryBadge,
                                    { backgroundColor: meta.color + "1A" },
                                ]}
                            >
                                <MaterialCommunityIcons
                                    name={meta.icon as any}
                                    size={10}
                                    color={meta.color}
                                />
                                <Text style={[styles.categoryText, { color: meta.color }]}>
                                    {item.category}
                                </Text>
                            </View>
                            {item.isAnonymous && (
                                <View style={styles.anonBadge}>
                                    <Ionicons name="eye-off" size={9} color={C.textSecondary} />
                                    <Text style={styles.anonText}>Anonymous</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                {/* Star row (gold) + rating value */}
                <View style={styles.starRowCard}>
                    <StarRating rating={item.rating} size={16} />
                    <Text style={styles.starValue}>{item.rating.toFixed(1)}</Text>
                </View>

                {/* Comment with quote left border */}
                <View style={styles.commentBox}>
                    <Text style={styles.comment} numberOfLines={3}>
                        {item.comment}
                    </Text>
                </View>

                <View style={styles.cardFooter}>
                    <View style={styles.footerLeft}>
                        <Ionicons name="time-outline" size={12} color={C.textMuted} />
                        <Text style={styles.date}>{formatTimeAgo(item.createdAt)}</Text>
                    </View>
                    <View style={styles.actions}>
                        <TouchableOpacity
                            onPress={() => editFeedback(item)}
                            style={[styles.iconBtn, { backgroundColor: C.primarySoft }]}
                        >
                            <Ionicons name="pencil" size={14} color={C.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => deleteFeedback(item._id)}
                            style={[styles.iconBtn, { backgroundColor: "#FEF2F2" }]}
                        >
                            <Ionicons name="trash-outline" size={14} color={C.danger} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={C.primary} />

            {/* HERO HEADER */}
            <LinearGradient
                colors={[C.primaryDeep, C.primary, C.primaryLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.headerTopRow}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.heroBadge}>
                            <MaterialCommunityIcons name="star-shooting" size={12} color={C.gold} />
                            <Text style={styles.heroBadgeText}>FEEDBACK CENTER</Text>
                        </View>
                        <Text style={styles.title}>My Reviews</Text>
                        <Text style={styles.subtitle}>
                            Share your internship journey · Help peers decide
                        </Text>
                    </View>

                    {/* Write Review pill (inside header, top-right) */}
                    <TouchableOpacity
                        onPress={openSubmitModal}
                        activeOpacity={0.85}
                        style={styles.writeBtnWrap}
                    >
                        <LinearGradient
                            colors={[C.primary, C.primaryLight]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.writeBtnHeader}
                        >
                            <Ionicons name="create-outline" size={15} color="#FFFFFF" />
                            <Text style={styles.writeBtnText}>Write Review</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Hero stats inside header */}
                <View style={styles.heroStatsRow}>
                    <View style={styles.heroStat}>
                        <View style={styles.heroStatIconWrap}>
                            <MaterialCommunityIcons name="message-text" size={14} color="#fff" />
                        </View>
                        <Text style={styles.heroStatVal}>{stats.total}</Text>
                        <Text style={styles.heroStatLab}>Reviews</Text>
                    </View>
                    <View style={styles.heroStatDivider} />
                    <View style={styles.heroStat}>
                        <View style={[styles.heroStatIconWrap, { backgroundColor: "rgba(245,158,11,0.2)" }]}>
                            <MaterialCommunityIcons name="star" size={14} color={C.gold} />
                        </View>
                        <Text style={styles.heroStatVal}>{stats.avg}</Text>
                        <Text style={styles.heroStatLab}>Avg Rating</Text>
                    </View>
                    <View style={styles.heroStatDivider} />
                    <View style={styles.heroStat}>
                        <View style={styles.heroStatIconWrap}>
                            <MaterialCommunityIcons name="trophy-award" size={14} color="#fff" />
                        </View>
                        <Text style={styles.heroStatVal}>{stats.fiveCount}</Text>
                        <Text style={styles.heroStatLab}>5★ Given</Text>
                    </View>
                </View>
            </LinearGradient>

            {/* Filter tabs */}
            {data.length > 0 && (
                <View style={styles.filterRow}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 18, gap: 8 }}
                    >
                        <TouchableOpacity
                            style={[
                                styles.filterChip,
                                filter === null && styles.filterChipActive,
                            ]}
                            onPress={() => setFilter(null)}
                        >
                            <Text
                                style={[
                                    styles.filterChipText,
                                    filter === null && styles.filterChipTextActive,
                                ]}
                            >
                                All ({data.length})
                            </Text>
                        </TouchableOpacity>
                        {[5, 4, 3, 2, 1].map((s) => (
                            <TouchableOpacity
                                key={s}
                                style={[
                                    styles.filterChip,
                                    filter === s && styles.filterChipActive,
                                ]}
                                onPress={() => setFilter(s)}
                            >
                                <MaterialCommunityIcons
                                    name="star"
                                    size={11}
                                    color={filter === s ? "#fff" : C.gold}
                                />
                                <Text
                                    style={[
                                        styles.filterChipText,
                                        filter === s && styles.filterChipTextActive,
                                    ]}
                                >
                                    {s} ({ratingDistribution[s - 1]})
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* MAIN LIST */}
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={C.primary} />
                    <Text style={styles.loadingText}>Loading your reviews...</Text>
                </View>
            ) : filtered.length === 0 ? (
                <View style={styles.center}>
                    <View style={styles.emptyIconBox}>
                        <MaterialCommunityIcons
                            name="message-star-outline"
                            size={56}
                            color={C.primary}
                        />
                    </View>
                    <Text style={styles.emptyTitle}>
                        {data.length === 0 ? "No reviews yet" : "No matches"}
                    </Text>
                    <Text style={styles.emptyText}>
                        {data.length === 0
                            ? "Share your internship experience and help fellow students make better decisions."
                            : "Try a different rating filter."}
                    </Text>
                    {data.length === 0 && (
                        <TouchableOpacity style={styles.emptyBtn} onPress={openSubmitModal}>
                            <Ionicons name="create" size={16} color="#fff" />
                            <Text style={styles.emptyBtnText}>Write Your First Review</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(i) => i._id}
                    renderItem={({ item }) => <Card item={item} />}
                    contentContainerStyle={{
                        paddingHorizontal: 18,
                        paddingTop: 4,
                        paddingBottom: 100,
                    }}
                    showsVerticalScrollIndicator={false}
                    onRefresh={() => {
                        setRefreshing(true);
                        fetchData();
                    }}
                    refreshing={refreshing}
                />
            )}

            {/* WRITE/EDIT MODAL */}
            <Modal visible={modal} animationType="slide" transparent>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHandle} />
                        <View style={styles.modalHeader}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.modalTitle}>
                                    {editMode ? "Update Your Review" : "Share Your Experience"}
                                </Text>
                                <Text style={styles.modalSub}>
                                    Honest reviews help students choose the right place
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setModal(false)}
                                style={styles.closeIcon}
                            >
                                <Ionicons name="close" size={22} color={C.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        >
                            <Text style={styles.inputLabel}>
                                Company / Organization <Text style={styles.required}>*</Text>
                            </Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
                            >
                                {COMPANIES.map((c) => (
                                    <TouchableOpacity
                                        key={c}
                                        style={[
                                            styles.chip,
                                            form.companyName === c && styles.chipActive,
                                        ]}
                                        onPress={() => setForm({ ...form, companyName: c })}
                                    >
                                        <Text
                                            style={[
                                                styles.chipText,
                                                form.companyName === c && styles.chipTextActive,
                                            ]}
                                        >
                                            {c}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <Text style={styles.inputLabel}>
                                Category <Text style={styles.required}>*</Text>
                            </Text>
                            <View style={styles.catGrid}>
                                {CATEGORIES.map((cat) => {
                                    const active = form.category === cat.key;
                                    return (
                                        <TouchableOpacity
                                            key={cat.key}
                                            style={[
                                                styles.catItem,
                                                active && {
                                                    backgroundColor: cat.color + "15",
                                                    borderColor: cat.color,
                                                },
                                            ]}
                                            onPress={() => setForm({ ...form, category: cat.key })}
                                        >
                                            <MaterialCommunityIcons
                                                name={cat.icon as any}
                                                size={20}
                                                color={active ? cat.color : C.textSecondary}
                                            />
                                            <Text
                                                style={[
                                                    styles.catText,
                                                    active && { color: cat.color, fontWeight: "700" },
                                                ]}
                                            >
                                                {cat.key}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            <Text style={styles.inputLabel}>
                                Your Rating <Text style={styles.required}>*</Text>
                            </Text>
                            <View style={styles.ratingPicker}>
                                <StarRating
                                    rating={form.rating}
                                    onRate={(r: number) => setForm({ ...form, rating: r })}
                                    size={40}
                                />
                                {form.rating > 0 && (
                                    <View style={styles.ratingFeedback}>
                                        <Text style={styles.ratingEmoji}>
                                            {RATING_EMOJIS[form.rating]}
                                        </Text>
                                        <Text style={styles.ratingLabel}>
                                            {RATING_LABELS[form.rating]}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            <Text style={styles.inputLabel}>
                                Your Review <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.textArea}
                                multiline
                                numberOfLines={5}
                                value={form.comment}
                                onChangeText={(t) => setForm({ ...form, comment: t })}
                                placeholder="What was the best part? Any challenges? Would you recommend it?"
                                placeholderTextColor={C.textMuted}
                                textAlignVertical="top"
                                maxLength={500}
                            />
                            <View style={styles.charRow}>
                                <Text
                                    style={[
                                        styles.charCount,
                                        form.comment.length >= 15 && { color: C.success },
                                    ]}
                                >
                                    {form.comment.length >= 15 ? "✓ " : ""}
                                    {form.comment.length}/500
                                </Text>
                                <Text style={styles.charHint}>min 15 chars</Text>
                            </View>

                            {/* Anonymous toggle */}
                            <Pressable
                                style={styles.anonRow}
                                onPress={() =>
                                    setForm({ ...form, isAnonymous: !form.isAnonymous })
                                }
                            >
                                <View
                                    style={[
                                        styles.checkbox,
                                        form.isAnonymous && styles.checkboxActive,
                                    ]}
                                >
                                    {form.isAnonymous && (
                                        <Ionicons name="checkmark" size={14} color="#fff" />
                                    )}
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.anonRowTitle}>Post Anonymously</Text>
                                    <Text style={styles.anonRowSub}>
                                        Your name won&apos;t be shown publicly
                                    </Text>
                                </View>
                                <Ionicons name="eye-off-outline" size={18} color={C.textSecondary} />
                            </Pressable>

                            <TouchableOpacity
                                style={[styles.mainButton, submitting && { opacity: 0.7 }]}
                                onPress={submit}
                                disabled={submitting}
                                activeOpacity={0.9}
                            >
                                <LinearGradient
                                    colors={[C.primary, C.primaryLight]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.mainButtonInner}
                                >
                                    {submitting ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <>
                                            <Ionicons
                                                name={editMode ? "checkmark-circle" : "send"}
                                                size={18}
                                                color="#fff"
                                            />
                                            <Text style={styles.mainButtonText}>
                                                {editMode ? "Update Review" : "Submit Review"}
                                            </Text>
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            <Text style={styles.disclaimer}>
                                By posting, you agree to keep your review honest, respectful and
                                based on real experience.
                            </Text>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* DETAIL MODAL */}
            <Modal visible={detailModal} animationType="fade" transparent>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { maxHeight: "80%" }]}>
                        {selected && (
                            <>
                                <View style={styles.modalHandle} />
                                <View style={styles.modalHeader}>
                                    <Text style={[styles.modalTitle, { flex: 1 }]}>Review Details</Text>
                                    <TouchableOpacity
                                        onPress={() => setDetailModal(false)}
                                        style={styles.closeIcon}
                                    >
                                        <Ionicons name="close" size={22} color={C.textPrimary} />
                                    </TouchableOpacity>
                                </View>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View style={styles.detailHero}>
                                        <View style={styles.detailAvatarBg}>
                                            <CompanyLogoImage
                                                companyName={selected.companyName}
                                                style={styles.detailAvatarImg}
                                            />
                                        </View>
                                        <Text style={styles.detailCompany}>
                                            {selected.companyName}
                                        </Text>
                                        <View
                                            style={[
                                                styles.categoryBadge,
                                                {
                                                    backgroundColor:
                                                        getCategoryMeta(selected.category).color + "1A",
                                                    marginTop: 8,
                                                },
                                            ]}
                                        >
                                            <MaterialCommunityIcons
                                                name={getCategoryMeta(selected.category).icon as any}
                                                size={11}
                                                color={getCategoryMeta(selected.category).color}
                                            />
                                            <Text
                                                style={[
                                                    styles.categoryText,
                                                    {
                                                        color: getCategoryMeta(selected.category).color,
                                                    },
                                                ]}
                                            >
                                                {selected.category}
                                            </Text>
                                        </View>
                                        <View style={{ marginTop: 14, alignItems: "center" }}>
                                            <StarRating rating={selected.rating} size={28} />
                                            <Text style={styles.detailRatingLabel}>
                                                {RATING_EMOJIS[Math.round(selected.rating)]}{" "}
                                                {RATING_LABELS[Math.round(selected.rating)]}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.detailCommentBox}>
                                        <Ionicons
                                            name="chatbubble-ellipses-outline"
                                            size={16}
                                            color={C.primary}
                                        />
                                        <Text style={styles.detailCommentText}>
                                            {selected.comment}
                                        </Text>
                                    </View>

                                    <View style={styles.detailMeta}>
                                        <View style={styles.metaItem}>
                                            <Ionicons name="time-outline" size={14} color={C.textSecondary} />
                                            <Text style={styles.metaText}>
                                                {new Date(selected.createdAt).toLocaleDateString("en-PK", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </Text>
                                        </View>
                                        {selected.isAnonymous && (
                                            <View style={styles.metaItem}>
                                                <Ionicons name="eye-off" size={14} color={C.textSecondary} />
                                                <Text style={styles.metaText}>Posted anonymously</Text>
                                            </View>
                                        )}
                                    </View>

                                    <View style={styles.detailActions}>
                                        <TouchableOpacity
                                            style={[styles.detailActionBtn, { backgroundColor: "#F0F9FF" }]}
                                            onPress={() => editFeedback(selected)}
                                        >
                                            <Ionicons name="pencil" size={16} color={C.primary} />
                                            <Text style={[styles.detailActionText, { color: C.primary }]}>
                                                Edit
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.detailActionBtn, { backgroundColor: "#FEF2F2" }]}
                                            onPress={() => deleteFeedback(selected._id)}
                                        >
                                            <Ionicons name="trash-outline" size={16} color={C.danger} />
                                            <Text style={[styles.detailActionText, { color: C.danger }]}>
                                                Delete
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </ScrollView>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.background },
    center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
    loadingText: { marginTop: 12, color: C.textSecondary, fontSize: 13 },

    /* Header */
    header: {
        paddingTop: Platform.OS === "android" ? 28 : 56,
        paddingBottom: 26,
        paddingHorizontal: 22,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        overflow: "hidden",
        shadowColor: C.primary,
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 14,
        elevation: 10,
    },
    headerTopRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    writeBtnWrap: {
        borderRadius: 24,
        shadowColor: "#000",
        shadowOpacity: 0.35,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        elevation: 8,
    },
    writeBtnHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.25)",
    },
    writeBtnText: {
        color: "#FFFFFF",
        fontWeight: "800",
        fontSize: 12.5,
        letterSpacing: 0.3,
    },
    heroBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: "rgba(255,255,255,0.18)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        alignSelf: "flex-start",
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.25)",
    },
    heroBadgeText: {
        color: C.gold,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1,
    },
    title: { color: "#fff", fontSize: 26, fontWeight: "800", letterSpacing: -0.4 },
    subtitle: { color: "rgba(255,255,255,0.75)", fontSize: 12.5, marginTop: 4 },

    heroStatsRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.10)",
        borderRadius: 16,
        paddingVertical: 14,
        marginTop: 18,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",
    },
    heroStat: { flex: 1, alignItems: "center", gap: 4 },
    heroStatIconWrap: {
        width: 28,
        height: 28,
        borderRadius: 9,
        backgroundColor: "rgba(255,255,255,0.18)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 2,
    },
    heroStatVal: { color: "#fff", fontSize: 19, fontWeight: "800" },
    heroStatLab: {
        color: "rgba(255,255,255,0.75)",
        fontSize: 10.5,
        fontWeight: "600",
        marginTop: 1,
        letterSpacing: 0.3,
    },
    heroStatDivider: {
        width: 1,
        backgroundColor: "rgba(255,255,255,0.18)",
        height: 50,
    },


    /* Distribution */
    distroCard: {
        backgroundColor: "#fff",
        marginTop: 14,
        marginHorizontal: 18,
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: "#EEF2F6",
        shadowColor: C.primary,
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
        elevation: 2,
    },
    distroHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    distroTitle: { fontSize: 14, fontWeight: "800", color: C.textPrimary },
    distroSub: { fontSize: 11, color: C.textSecondary, marginTop: 2 },
    bigAvgBox: { alignItems: "center" },
    bigAvg: { fontSize: 26, fontWeight: "800", color: C.primary, lineHeight: 28 },

    distroBars: { gap: 6 },
    distroRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    distroStarLabel: {
        fontSize: 11,
        fontWeight: "700",
        color: C.textSecondary,
        width: 12,
    },
    distroBarBg: {
        flex: 1,
        height: 7,
        backgroundColor: "#F1F5F9",
        borderRadius: 4,
        overflow: "hidden",
    },
    distroBarFill: {
        height: "100%",
        backgroundColor: C.accent,
        borderRadius: 4,
    },
    distroCount: {
        fontSize: 11,
        fontWeight: "700",
        color: C.textPrimary,
        width: 22,
        textAlign: "right",
    },

    /* Filters */
    filterRow: {
        marginTop: 14,
        marginBottom: 8,
    },
    filterChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 18,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: C.border,
    },
    filterChipActive: { backgroundColor: C.primary, borderColor: C.primary },
    filterChipText: { fontSize: 12, fontWeight: "700", color: C.textSecondary },
    filterChipTextActive: { color: "#fff" },

    /* Card — premium */
    card: {
        backgroundColor: "#fff",
        marginTop: 16,
        padding: 18,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#EDF2F7",
        overflow: "hidden",
        shadowColor: C.primary,
        shadowOpacity: 0.10,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 14,
        elevation: 4,
    },
    cardWatermark: {
        position: "absolute",
        top: -10,
        right: -10,
        opacity: 0.6,
    },
    cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
    logoOuter: { position: "relative" },
    logoBg: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        padding: 6,
        borderWidth: 1,
        borderColor: C.border,
        shadowColor: C.primary,
        shadowOpacity: 0.18,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 4,
    },
    logoImage: {
        width: "100%",
        height: "100%",
    },
    logoBox: {
        width: 52,
        height: 52,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    logoIconBadge: {
        position: "absolute",
        top: -4,
        left: -4,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: C.primary,
        borderWidth: 2,
        borderColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    logoVerified: {
        position: "absolute",
        bottom: -3,
        right: -3,
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 1,
    },
    company: { fontSize: 15.5, fontWeight: "800", color: C.textPrimary },
    subRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
    categoryBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    categoryText: { fontSize: 10, fontWeight: "700" },
    anonBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
        backgroundColor: "#F1F5F9",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    anonText: { fontSize: 9, color: C.textSecondary, fontWeight: "600" },
    starRowCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
        backgroundColor: C.goldSoft,
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    starValue: {
        fontSize: 13,
        fontWeight: "800",
        color: "#92400E",
    },
    commentBox: {
        backgroundColor: "#F8FAFC",
        borderLeftWidth: 3,
        borderLeftColor: C.primary,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 12,
    },
    comment: {
        fontSize: 13.5,
        color: "#334155",
        lineHeight: 21,
        fontStyle: "italic",
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#F1F5F9",
    },
    footerLeft: { flexDirection: "row", alignItems: "center", gap: 4 },
    date: { fontSize: 11.5, color: C.textMuted, fontWeight: "600" },
    actions: { flexDirection: "row", gap: 8 },
    iconBtn: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },

    /* Empty */
    emptyIconBox: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: C.primarySoft,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18,
    },
    emptyTitle: { fontSize: 18, fontWeight: "800", color: C.primary, marginBottom: 8 },
    emptyText: {
        marginTop: 4,
        color: C.textSecondary,
        textAlign: "center",
        fontSize: 13.5,
        lineHeight: 20,
        paddingHorizontal: 16,
    },
    emptyBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: C.primary,
        paddingHorizontal: 22,
        paddingVertical: 13,
        borderRadius: 14,
        marginTop: 22,
    },
    emptyBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },

    /* Modal */
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(15,23,42,0.6)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 22,
        paddingTop: 8,
        paddingBottom: Platform.OS === "ios" ? 30 : 16,
        maxHeight: "92%",
    },
    modalHandle: {
        alignSelf: "center",
        width: 42,
        height: 4,
        borderRadius: 2,
        backgroundColor: C.border,
        marginBottom: 12,
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 18,
    },
    modalTitle: { fontSize: 19, fontWeight: "800", color: C.textPrimary },
    modalSub: { fontSize: 12.5, color: C.textSecondary, marginTop: 3 },
    closeIcon: {
        backgroundColor: "#F1F5F9",
        padding: 7,
        borderRadius: 12,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: "800",
        color: C.textPrimary,
        marginTop: 16,
        marginBottom: 10,
    },
    required: { color: C.danger },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 9,
        borderRadius: 12,
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: C.border,
    },
    chipActive: { backgroundColor: C.primary, borderColor: C.primary },
    chipText: { fontSize: 13, color: C.textSecondary, fontWeight: "600" },
    chipTextActive: { color: "#fff" },

    /* Category grid */
    catGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    catItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: C.border,
    },
    catText: { fontSize: 12.5, color: C.textSecondary, fontWeight: "600" },

    /* Rating picker */
    ratingPicker: {
        alignItems: "center",
        paddingVertical: 18,
        backgroundColor: "#F8FAFC",
        borderRadius: 16,
        gap: 8,
    },
    ratingFeedback: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 6,
    },
    ratingEmoji: { fontSize: 24 },
    ratingLabel: { fontSize: 14, fontWeight: "700", color: C.primary },

    /* Text area */
    textArea: {
        backgroundColor: "#F8FAFC",
        borderRadius: 14,
        padding: 14,
        fontSize: 14,
        color: C.textPrimary,
        borderWidth: 1,
        borderColor: C.border,
        minHeight: 110,
    },
    charRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 6,
        marginBottom: 14,
    },
    charCount: { fontSize: 11, color: C.textMuted, fontWeight: "600" },
    charHint: { fontSize: 11, color: C.textMuted },

    /* Anonymous */
    anonRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: "#F8FAFC",
        padding: 14,
        borderRadius: 14,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: C.border,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: C.border,
        justifyContent: "center",
        alignItems: "center",
    },
    checkboxActive: { backgroundColor: C.primary, borderColor: C.primary },
    anonRowTitle: { fontSize: 13.5, fontWeight: "700", color: C.textPrimary },
    anonRowSub: { fontSize: 11.5, color: C.textSecondary, marginTop: 2 },

    /* Main button */
    mainButton: {
        borderRadius: 16,
        shadowColor: C.primary,
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 10,
        elevation: 5,
    },
    mainButtonInner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 16,
        borderRadius: 16,
    },
    mainButtonText: { color: "#fff", fontWeight: "800", fontSize: 15, letterSpacing: 0.3 },
    disclaimer: {
        fontSize: 11,
        color: C.textMuted,
        textAlign: "center",
        marginTop: 12,
        lineHeight: 16,
    },

    /* Detail */
    detailHero: { alignItems: "center", paddingVertical: 12 },
    detailAvatar: {
        width: 72,
        height: 72,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    detailAvatarBg: {
        width: 80,
        height: 80,
        borderRadius: 22,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        borderWidth: 1,
        borderColor: C.border,
        marginBottom: 12,
        shadowColor: C.primary,
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        elevation: 5,
    },
    detailAvatarImg: { width: "100%", height: "100%" },
    detailAvatarText: { color: "#fff", fontWeight: "800", fontSize: 30 },
    detailCompany: { fontSize: 21, fontWeight: "800", color: C.primary, textAlign: "center" },
    detailRatingLabel: { fontSize: 14, fontWeight: "700", color: C.primary, marginTop: 6 },
    detailCommentBox: {
        backgroundColor: "#F8FAFC",
        padding: 18,
        borderRadius: 18,
        marginVertical: 16,
        borderLeftWidth: 4,
        borderLeftColor: C.primary,
        flexDirection: "row",
        gap: 10,
    },
    detailCommentText: {
        flex: 1,
        fontSize: 14.5,
        color: C.textPrimary,
        lineHeight: 23,
        fontStyle: "italic",
    },
    detailMeta: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 18,
        flexWrap: "wrap",
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: "#F8FAFC",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    metaText: { fontSize: 11.5, color: C.textSecondary, fontWeight: "600" },
    detailActions: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 8,
    },
    detailActionBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingVertical: 13,
        borderRadius: 13,
    },
    detailActionText: { fontSize: 14, fontWeight: "700" },
});
