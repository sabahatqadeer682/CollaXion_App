// import { useNavigation } from "@react-navigation/native";
// import React, { useState } from "react";
// import {
//     Alert,
//     Image,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
//     StatusBar,
//     ScrollView,
// } from "react-native";





// const IndustryLogin = () => {
//     const navigation = useNavigation<any>();


//     return (
//         <ScrollView
//             contentContainerStyle={{ flexGrow: 1 }}
//             keyboardShouldPersistTaps="handled"
//         >
//             <View style={styles.container}>
//                 <StatusBar backgroundColor="#193648" barStyle="light-content" />

//                 <Image
//                     source={require("../../assets/images/logo.png")}
//                     style={styles.logo}
//                     resizeMode="contain"
//                 />

//                 <Text style={styles.headerText}>Welcome Back to CollaXion</Text>
//                 <Text style={styles.tagline}>Where learning meets opportunity.</Text>

//                 <TextInput
//                     placeholder="Email"

//                     style={styles.input}
//                     keyboardType="email-address"
//                     autoCapitalize="none"
//                     placeholderTextColor="#888"
//                 />

//                 <TextInput
//                     placeholder="Password"

//                     style={styles.input}
//                     secureTextEntry
//                     placeholderTextColor="#888"
//                 />

//                 <TouchableOpacity
//   style={styles.button}
//   activeOpacity={0.8}
//   onPress={() => navigation.navigate("IndustryDashboard")}
// >
//   <Text style={styles.buttonText}>Login</Text>
// </TouchableOpacity>

//             </View>
//         </ScrollView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#fff",
//         justifyContent: "center",
//         alignItems: "center",
//         paddingHorizontal: 25,
//         paddingVertical: 40,
//     },
//     logo: { width: 150, height: 150, marginBottom: 15, borderRadius: 10 },
//     headerText: {
//         fontSize: 20,
//         color: "#193648",
//         textAlign: "center",
//         marginBottom: 6,
//         fontWeight: "700",
//         letterSpacing: 0.5,
//     },
//     tagline: { fontSize: 15, color: "#64748b", marginBottom: 30, textAlign: "center" },
//     input: {
//         width: "90%",
//         borderWidth: 1,
//         borderColor: "#ccc",
//         borderRadius: 10,
//         padding: 14,
//         marginBottom: 18,
//         color: "#000",
//         backgroundColor: "#f9f9f9",
//         fontSize: 15,
//     },
//     button: {
//         backgroundColor: "#193648",
//         paddingVertical: 14,
//         width: "90%",
//         alignItems: "center",
//         borderRadius: 10,
//         marginTop: 10,
//         marginBottom: 20,
//         elevation: 2,
//     },
//     buttonText: { color: "#fff", fontSize: 17, fontWeight: "600", letterSpacing: 0.5 },
//     switchText: { color: "#333", fontSize: 15 },
//     linkText: { color: "#193648", fontWeight: "bold" },
// });

// export default IndustryLogin;


import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import {
    ActivityIndicator,
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

const IndustryLogin = () => {
    const navigation = useNavigation<any>();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Subtle horizontal shake when the credentials are wrong — the kind of
    // micro-interaction users expect from a polished login form.
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

    // Typing only clears the field-level error — no nagging "must be at least"
    // hints while the user is mid-typing. Real validation runs on submit.
    const validateUsername = (value: string) => {
        setUsername(value);
        if (usernameError) setUsernameError("");
    };

    const validatePassword = (value: string) => {
        setPassword(value);
        if (passwordError) setPasswordError("");
    };

    const handleLogin = () => {
        if (loading) return;

        // Required-field check, shown inline beneath each field.
        if (!username || !password) {
            if (!username.trim()) setUsernameError("Username cannot be empty");
            if (!password)        setPasswordError("Password cannot be empty");
            triggerShake();
            return;
        }

        const VALID_USERNAME = "UICollaboration";
        const VALID_PASSWORD = "industry";

        // Brief loading state so the button feels real, then validate.
        setLoading(true);
        setTimeout(() => {
            if (username !== VALID_USERNAME) {
                setUsernameError("Incorrect username");
                setLoading(false);
                triggerShake();
                return;
            }
            if (password !== VALID_PASSWORD) {
                setPasswordError("Incorrect password");
                setLoading(false);
                triggerShake();
                return;
            }
            setUsernameError("");
            setPasswordError("");
            setLoading(false);
            navigation.navigate("IndustryDashboard");
        }, 450);
    };

    const canSubmit = !!username.trim() && !!password && !loading;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#fff" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
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

                    {/* Username Input */}
                    <Animated.View style={{ width: "90%", transform: [{ translateX: shakeAnim }] }}>
                        <View style={[styles.inputBox, usernameError && styles.inputBoxError]}>
                            <MaterialIcons name="person-outline" size={20} color="#193648" style={{ marginRight: 8 }} />
                            <TextInput
                                placeholder="Username"
                                value={username}
                                onChangeText={validateUsername}
                                style={styles.flexInput}
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="username"
                                textContentType="username"
                                placeholderTextColor="#94a3b8"
                                returnKeyType="next"
                            />
                            {usernameError ? (
                                <MaterialIcons name="error-outline" size={18} color="#dc2626" />
                            ) : null}
                        </View>
                        {usernameError ? (
                            <View style={styles.errorRow}>
                                <MaterialIcons name="info-outline" size={13} color="#dc2626" />
                                <Text style={styles.errorText}>{usernameError}</Text>
                            </View>
                        ) : null}
                    </Animated.View>

                    {/* Password Input — eye toggle reveals the typed text */}
                    <Animated.View style={{ width: "90%", transform: [{ translateX: shakeAnim }] }}>
                        <View style={[styles.inputBox, passwordError && styles.inputBoxError]}>
                            <MaterialIcons name="lock-outline" size={20} color="#193648" style={{ marginRight: 8 }} />
                            <TextInput
                                placeholder="Password"
                                value={password}
                                onChangeText={validatePassword}
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
    input: {
        width: "90%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 14,
        marginBottom: 10,
        color: "#000",
        backgroundColor: "#f9f9f9",
        fontSize: 15,
    },
    passwordContainer: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: 14,
        paddingVertical: 4,
        borderRadius: 10,
        width: "90%",
        alignItems: "center",
        marginBottom: 10,
        backgroundColor: "#f9f9f9",
    },
    passwordInput: {
        flex: 1,
        color: "#000",
        fontSize: 15,
        paddingVertical: 12,
        paddingRight: 8,
    },
    eyeBtn: {
        padding: 6,
        marginLeft: 4,
    },
    errorText: {
        color: "#dc2626",
        marginLeft: 4,
        fontSize: 12.5,
        fontWeight: "600",
    },
    errorRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: -4,
        marginBottom: 10,
        paddingLeft: 4,
    },
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
    buttonDisabled: {
        opacity: 0.55,
    },
    button: {
        backgroundColor: "#193648",
        paddingVertical: 14,
        width: "90%",
        alignItems: "center",
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 20,
        elevation: 2,
    },
    buttonText: { color: "#fff", fontSize: 17, fontWeight: "600", letterSpacing: 0.5 },
});

export default IndustryLogin;