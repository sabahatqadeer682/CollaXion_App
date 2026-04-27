import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";

import { CONSTANT } from "@/constants/constant";
import axios from "axios";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Easing,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const StudentLogin = () => {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const EMAIL_PATTERN = /^[\w-.]+@students\.riphah\.edu\.pk$/;

    // Subtle horizontal shake when input is wrong — same micro-interaction as
    // industry login, gives a clear physical signal of failed validation.
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const triggerShake = () => {
        shakeAnim.setValue(0);
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 8,  duration: 60, easing: Easing.linear, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -8, duration: 60, easing: Easing.linear, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 6,  duration: 50, easing: Easing.linear, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -4, duration: 50, easing: Easing.linear, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0,  duration: 50, easing: Easing.linear, useNativeDriver: true }),
        ]).start();
    };

    const validateEmail = (value: string): string => {
        const trimmed = value.trim();
        if (trimmed === "") return "Email is required";
        if (trimmed.length > 254) return "Email is too long";
        if (!EMAIL_PATTERN.test(trimmed)) return "Email must end with @students.riphah.edu.pk";
        return "";
    };

    const validatePassword = (value: string): string => {
        if (value === "") return "Password is required";
        return "";
    };

    // Typing only clears any previous error — full validation runs on submit.
    const handleEmailChange = (text: string) => {
        let updatedEmail = text;
        if (text.endsWith("@")) {
            updatedEmail = text + "students.riphah.edu.pk";
        }
        setEmail(updatedEmail);
        if (emailError) setEmailError("");
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        if (passwordError) setPasswordError("");
    };

    const mapServerError = (message: string) => {
        const msg = (message || "").toLowerCase();
        if (msg.includes("password")) {
            setPasswordError("Incorrect password");
            setEmailError("");
        } else if (
            msg.includes("not found") ||
            msg.includes("no user") ||
            msg.includes("does not exist") ||
            msg.includes("invalid email") ||
            msg.includes("email")
        ) {
            setEmailError("No account found with this email");
            setPasswordError("");
        } else if (msg.includes("invalid credentials")) {
            setPasswordError("Incorrect email or password");
            setEmailError("Incorrect email or password");
        } else {
            setPasswordError(message || "Login failed. Please try again.");
        }
    };

    const handleLogin = async () => {
        if (loading) return;

        const trimmedEmail = email.trim();
        const emailErr = validateEmail(trimmedEmail);
        const passwordErr = validatePassword(password);

        setEmailError(emailErr);
        setPasswordError(passwordErr);

        if (emailErr || passwordErr) {
            triggerShake();
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${CONSTANT.API_BASE_URL}/api/student/login`, { email: trimmedEmail, password });
            console.log("Server Response:", res.data);

            if (res.data.success) {
                await AsyncStorage.removeItem("studentProfileImage");
                await AsyncStorage.setItem("studentEmail", res.data.student.email);
                await AsyncStorage.setItem("studentFullName", res.data.student.fullName);
                navigation.replace("StudentDashboardNavigator");
            } else {
                mapServerError(res.data.message);
                triggerShake();
            }
        } catch (err: any) {
            console.log("Axios Error:", err.response?.data || err.message);
            const status = err.response?.status;
            const serverMsg = err.response?.data?.message;

            if (status === 401 || status === 400) {
                mapServerError(serverMsg || "Incorrect password");
                triggerShake();
            } else if (status === 404) {
                setEmailError("No account found with this email");
                setPasswordError("");
                triggerShake();
            } else if (serverMsg) {
                mapServerError(serverMsg);
                triggerShake();
            } else {
                Alert.alert(
                    "Error",
                    "Server not responding. Make sure backend is running and emulator/device is on the same network."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const canSubmit = !!email.trim() && !!password && !loading;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#fff" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                automaticallyAdjustKeyboardInsets
            >
                <View style={styles.container}>
                    <StatusBar backgroundColor="#193648" barStyle="light-content" />

                    <Image
                        source={require("../../assets/images/logo.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Text style={styles.headerText}>Welcome Back to CollaXion</Text>
                    <Text style={styles.tagline}>Where learning meets opportunity.</Text>

                    {/* Email Field */}
                    <Animated.View style={{ width: "90%", transform: [{ translateX: shakeAnim }] }}>
                        <View style={[styles.inputBox, emailError && styles.inputBoxError]}>
                            <MaterialIcons name="mail-outline" size={20} color="#193648" style={{ marginRight: 8 }} />
                            <TextInput
                                placeholder="Email"
                                value={email}
                                onChangeText={handleEmailChange}
                                style={styles.flexInput}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="email"
                                textContentType="emailAddress"
                                placeholderTextColor="#94a3b8"
                                returnKeyType="next"
                            />
                            {emailError ? (
                                <MaterialIcons name="error-outline" size={18} color="#dc2626" />
                            ) : null}
                        </View>
                        {emailError ? (
                            <View style={styles.errorRow}>
                                <MaterialIcons name="info-outline" size={13} color="#dc2626" />
                                <Text style={styles.errorText}>{emailError}</Text>
                            </View>
                        ) : null}
                    </Animated.View>

                    {/* Password Field — eye toggle reveals the typed text */}
                    <Animated.View style={{ width: "90%", transform: [{ translateX: shakeAnim }] }}>
                        <View style={[styles.inputBox, passwordError && styles.inputBoxError]}>
                            <MaterialIcons name="lock-outline" size={20} color="#193648" style={{ marginRight: 8 }} />
                            <TextInput
                                placeholder="Password"
                                value={password}
                                onChangeText={handlePasswordChange}
                                secureTextEntry={!showPassword}
                                keyboardType={showPassword ? "visible-password" : "default"}
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="password"
                                textContentType="password"
                                style={styles.flexInput}
                                placeholderTextColor="#94a3b8"
                                returnKeyType="done"
                                onSubmitEditing={handleLogin}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword((v) => !v)}
                                style={styles.eyeBtn}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                                <MaterialIcons
                                    name={showPassword ? "visibility-off" : "visibility"}
                                    size={22}
                                    color="#555"
                                />
                            </TouchableOpacity>
                        </View>
                        {passwordError ? (
                            <View style={styles.errorRow}>
                                <MaterialIcons name="info-outline" size={13} color="#dc2626" />
                                <Text style={styles.errorText}>{passwordError}</Text>
                            </View>
                        ) : null}
                    </Animated.View>

                    {/* Login Button — disabled until both fields filled, with loading state */}
                    <TouchableOpacity
                        style={[styles.button, !canSubmit && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={!canSubmit}
                        activeOpacity={0.85}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("StudentRegister")}>
                        <Text style={styles.switchText}>
                            Don&apos;t have an account?{" "}
                            <Text style={styles.linkText}>Register</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 25,
        paddingVertical: 40,
    },
    logo: { width: 150, height: 150, marginBottom: 15, borderRadius: 10 },
    headerText: {
        fontSize: 20,
        color: "#193648",
        textAlign: "center",
        marginBottom: 6,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    tagline: { fontSize: 15, color: "#64748b", marginBottom: 30, textAlign: "center" },
    inputBox: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: "#E2E8F0",
        backgroundColor: "#F8FAFC",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 4,
        marginBottom: 10,
    },
    inputBoxError: {
        borderColor: "#dc2626",
        backgroundColor: "#fef2f2",
    },
    flexInput: {
        flex: 1,
        color: "#0F2236",
        fontSize: 15,
        paddingVertical: 12,
    },
    eyeBtn: {
        padding: 6,
        marginLeft: 4,
    },
    errorRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: -4,
        marginBottom: 10,
        paddingLeft: 4,
    },
    errorText: {
        color: "#dc2626",
        marginLeft: 4,
        fontSize: 12.5,
        fontWeight: "600",
    },
    button: {
        backgroundColor: "#193648",
        paddingVertical: 14,
        width: "90%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginTop: 15,
        marginBottom: 20,
        elevation: 2,
    },
    buttonDisabled: {
        opacity: 0.55,
    },
    buttonText: { color: "#fff", fontSize: 17, fontWeight: "600", letterSpacing: 0.5 },
    switchText: { color: "#333", fontSize: 15 },
    linkText: { color: "#193648", fontWeight: "bold" },
});

export default StudentLogin;
