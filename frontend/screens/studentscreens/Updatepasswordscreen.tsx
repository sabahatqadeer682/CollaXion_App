import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    StatusBar,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { CONSTANT } from "@/constants/constant";




// ─── Types ────────────────────────────────────────────────────────────────────
type RootStackParamList = {
    UpdatePassword: undefined;
    [key: string]: undefined;
};

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, "UpdatePassword">;
};

type Errors = {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
};

type StrengthResult = {
    level: number;
    label: string;
    color: string;
};

type PasswordFieldProps = {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    show: boolean;
    onToggle: () => void;
    error?: string;
    placeholder: string;
};

// ─── Config ───────────────────────────────────────────────────────────────────
const BASE_URL = "http://192.168.0.245:5000"; // ← apna PC ka IP daalo (ipconfig se dekho)

// ─── Password Field Component ─────────────────────────────────────────────────
const PasswordField: React.FC<PasswordFieldProps> = ({
    label,
    value,
    onChangeText,
    show,
    onToggle,
    error,
    placeholder,
}) => (
    <View style={styles.fieldWrap}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.inputRow, error ? styles.inputError : null]}>
            <Ionicons
                name="lock-closed-outline"
                size={18}
                color={error ? "#E74C3C" : "#95A5A6"}
                style={styles.inputIcon}
            />
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#BDC3C7"
                secureTextEntry={!show}
                autoCapitalize="none"
            />
            <TouchableOpacity onPress={onToggle} activeOpacity={0.7} style={styles.eyeBtn}>
                <Ionicons
                    name={show ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#95A5A6"
                />
            </TouchableOpacity>
        </View>
        {error && (
            <View style={styles.errorRow}>
                <Ionicons name="alert-circle-outline" size={13} color="#E74C3C" />
                <Text style={styles.errorText}> {error}</Text>
            </View>
        )}
    </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const UpdatePasswordScreen: React.FC<Props> = ({ navigation }) => {
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const [showCurrent, setShowCurrent] = useState<boolean>(false);
    const [showNew, setShowNew] = useState<boolean>(false);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<Errors>({});
    const [userEmail, setUserEmail] = useState<string>("");

    // ── Email AsyncStorage se lo ───────────────────────────────────
    useEffect(() => {
        const fetchEmail = async (): Promise<void> => {
            // const email = await AsyncStorage.getItem("userEmail");

            const email = await AsyncStorage.getItem("studentEmail");

            if (email) setUserEmail(email);
        };
        fetchEmail();
    }, []);

    // ── Password Strength ──────────────────────────────────────────
    const getStrength = (pwd: string): StrengthResult => {
        if (!pwd) return { level: 0, label: "", color: "#DDD" };
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;

        if (score <= 1) return { level: 1, label: "Weak", color: "#E74C3C" };
        if (score === 2) return { level: 2, label: "Fair", color: "#F39C12" };
        if (score === 3) return { level: 3, label: "Good", color: "#27AE60" };
        return { level: 4, label: "Strong", color: "#16A085" };
    };

    const strength: StrengthResult = getStrength(newPassword);

    // ── Validation ─────────────────────────────────────────────────
    const validate = (): boolean => {
        const e: Errors = {};
        if (!currentPassword) e.currentPassword = "Current password is required.";
        if (!newPassword) e.newPassword = "New password is required.";
        else if (newPassword.length < 8) e.newPassword = "Must be at least 8 characters.";
        if (!confirmPassword) e.confirmPassword = "Please confirm your new password.";
        else if (newPassword !== confirmPassword) e.confirmPassword = "Passwords do not match.";
        if (currentPassword && newPassword && currentPassword === newPassword)
            e.newPassword = "New password must be different from current.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // ── Submit — API Call ──────────────────────────────────────────
    const handleUpdate = async (): Promise<void> => {
        if (!validate()) return;
        setLoading(true);

        try {
            const response = await fetch(`${CONSTANT.API_BASE_URL}/api/student/update-password`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: userEmail,
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await response.json();

            if (data.success) {
                Alert.alert(
                    "Password Updated ✓",
                    data.message,
                    [{ text: "OK", onPress: () => navigation.goBack() }]
                );
            } else {
                if (data.message.includes("Current password") || data.message.includes("galat")) {
                    setErrors({ currentPassword: data.message });
                } else if (data.message.includes("alag")) {
                    setErrors({ newPassword: data.message });
                } else {
                    Alert.alert("Error", data.message);
                }
            }
        } catch (error) {
            Alert.alert("Network Error", "Server se connect nahi ho saka. IP check karo.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor="#F0F2F8" />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ── Header ── */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="chevron-back" size={22} color="#2C3E50" />
                        </TouchableOpacity>
                        <View style={styles.headerTextWrap}>
                            <Text style={styles.headerTitle}>Update Password</Text>
                            <Text style={styles.headerSub}>Keep your account secure</Text>
                        </View>
                    </View>

                    {/* ── Banner ── */}
                    <View style={styles.banner}>
                        <View style={styles.bannerIcon}>
                            <Ionicons name="shield-checkmark" size={36} color="#5B6FE6" />
                        </View>
                        <Text style={styles.bannerTitle}>Password Security</Text>
                        <Text style={styles.bannerSub}>
                            Use a strong, unique password that you don't use on other sites.
                        </Text>
                    </View>

                    {/* ── Form Card ── */}
                    <View style={styles.card}>
                        <PasswordField
                            label="Current Password"
                            value={currentPassword}
                            onChangeText={(t) => {
                                setCurrentPassword(t);
                                setErrors((prev) => ({ ...prev, currentPassword: undefined }));
                            }}
                            show={showCurrent}
                            onToggle={() => setShowCurrent(!showCurrent)}
                            placeholder="Enter current password"
                            error={errors.currentPassword}
                        />

                        <PasswordField
                            label="New Password"
                            value={newPassword}
                            onChangeText={(t) => {
                                setNewPassword(t);
                                setErrors((prev) => ({ ...prev, newPassword: undefined }));
                            }}
                            show={showNew}
                            onToggle={() => setShowNew(!showNew)}
                            placeholder="Enter new password"
                            error={errors.newPassword}
                        />

                        {/* Strength Meter */}
                        {newPassword.length > 0 && (
                            <View style={styles.strengthWrap}>
                                <View style={styles.strengthBars}>
                                    {[1, 2, 3, 4].map((i) => (
                                        <View
                                            key={i}
                                            style={[
                                                styles.strengthBar,
                                                {
                                                    backgroundColor:
                                                        i <= strength.level ? strength.color : "#EEE",
                                                },
                                            ]}
                                        />
                                    ))}
                                </View>
                                <Text style={[styles.strengthLabel, { color: strength.color }]}>
                                    {strength.label}
                                </Text>
                            </View>
                        )}

                        <PasswordField
                            label="Confirm New Password"
                            value={confirmPassword}
                            onChangeText={(t) => {
                                setConfirmPassword(t);
                                setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                            }}
                            show={showConfirm}
                            onToggle={() => setShowConfirm(!showConfirm)}
                            placeholder="Re-enter new password"
                            error={errors.confirmPassword}
                        />

                        {/* Tips */}
                        <View style={styles.tips}>
                            <Text style={styles.tipsTitle}>Password Tips</Text>
                            {[
                                "At least 8 characters long",
                                "Include uppercase & lowercase letters",
                                "Add numbers and special characters",
                                "Avoid using your name or birthday",
                            ].map((tip, i) => (
                                <View key={i} style={styles.tipRow}>
                                    <Ionicons
                                        name="checkmark-circle-outline"
                                        size={14}
                                        color="#5B6FE6"
                                    />
                                    <Text style={styles.tipText}>{tip}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* ── Update Button ── */}
                    <TouchableOpacity
                        style={[styles.updateBtn, loading && styles.updateBtnDisabled]}
                        onPress={handleUpdate}
                        activeOpacity={0.85}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Ionicons name="checkmark-done-outline" size={20} color="#fff" />
                                <Text style={styles.updateBtnText}>Update Password</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* ── Forgot Password ── */}
                    <TouchableOpacity
                        style={styles.forgotBtn}
                        onPress={() =>
                            Alert.alert(
                                "Forgot Password?",
                                "A reset link will be sent to your registered email address.",
                                [
                                    { text: "Cancel", style: "cancel" },
                                    {
                                        text: "Send Reset Link",
                                        onPress: () =>
                                            Alert.alert("Email Sent", "Check your inbox for the reset link."),
                                    },
                                ]
                            )
                        }
                        activeOpacity={0.7}
                    >
                        <Text style={styles.forgotText}>Forgot current password?</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default UpdatePasswordScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#F0F2F8" },
    scroll: { paddingBottom: 40 },

    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 18,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        gap: 12,
        marginBottom: 8,
    },
    backBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: "#F0F2F8",
        justifyContent: "center",
        alignItems: "center",
    },
    headerTextWrap: { flex: 1 },
    headerTitle: { fontSize: 18, fontWeight: "800", color: "#2C3E50" },
    headerSub: { fontSize: 12, color: "#95A5A6", marginTop: 2 },

    banner: { alignItems: "center", paddingVertical: 24, paddingHorizontal: 24 },
    bannerIcon: {
        width: 72,
        height: 72,
        borderRadius: 22,
        backgroundColor: "#EEF0FD",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    bannerTitle: { fontSize: 17, fontWeight: "800", color: "#2C3E50", marginBottom: 6 },
    bannerSub: { fontSize: 13, color: "#7F8C8D", textAlign: "center", lineHeight: 20 },

    card: {
        backgroundColor: "#fff",
        marginHorizontal: 14,
        borderRadius: 20,
        padding: 20,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
    },

    fieldWrap: { marginBottom: 18 },
    label: { fontSize: 13, fontWeight: "700", color: "#2C3E50", marginBottom: 8 },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: "#E8ECF0",
        borderRadius: 12,
        backgroundColor: "#F8FAFC",
        paddingHorizontal: 12,
    },
    inputError: { borderColor: "#E74C3C", backgroundColor: "#FEF9F9" },
    inputIcon: { marginRight: 8 },
    input: { flex: 1, paddingVertical: 13, fontSize: 14, color: "#2C3E50" },
    eyeBtn: { padding: 4 },

    errorRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },
    errorText: { fontSize: 12, color: "#E74C3C" },

    strengthWrap: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: -8,
        marginBottom: 18,
        gap: 8,
    },
    strengthBars: { flexDirection: "row", gap: 4, flex: 1 },
    strengthBar: { flex: 1, height: 4, borderRadius: 2 },
    strengthLabel: { fontSize: 12, fontWeight: "700", minWidth: 48, textAlign: "right" },

    tips: { backgroundColor: "#F0F2F8", borderRadius: 12, padding: 14, marginTop: 4 },
    tipsTitle: { fontSize: 12, fontWeight: "700", color: "#7F8C8D", marginBottom: 8 },
    tipRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 5 },
    tipText: { fontSize: 12, color: "#7F8C8D" },

    updateBtn: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#5B6FE6",
        marginHorizontal: 14,
        marginTop: 20,
        paddingVertical: 15,
        borderRadius: 16,
        elevation: 3,
        shadowColor: "#5B6FE6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    updateBtnDisabled: { opacity: 0.7 },
    updateBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },

    forgotBtn: { alignItems: "center", marginTop: 16 },
    forgotText: { fontSize: 13, color: "#5B6FE6", fontWeight: "600" },
});