import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";

import { CONSTANT } from "@/constants/constant";
import axios from "axios";
import {
    Alert,
    Image,
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

    // 📌 validation
    const handleEmailChange = (text: string) => {
        let updatedEmail = text;

        if (text.endsWith("@")) {
            updatedEmail = text + "students.riphah.edu.pk";
        }

        setEmail(updatedEmail);

        const emailPattern = /^[\w-\.]+@students\.riphah\.edu\.pk$/;
        if (updatedEmail.trim() === "") {
            setEmailError("Email is required");
        } else if (!emailPattern.test(updatedEmail)) {
            setEmailError("Email must end with @students.riphah.edu.pk");
        } else {
            setEmailError("");
        }
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        if (text.trim().length < 6) {
            setPasswordError("Password must be at least 6 characters");
        } else {
            setPasswordError("");
        }
    };

    const handleLogin = async () => {
        if (emailError || passwordError || !email || !password) {
            Alert.alert("Error", "Please fix all validation errors before login.");
            return;
        }

        try {
            const res = await axios.post(`${CONSTANT.API_BASE_URL}/api/student/login`, { email, password });
            console.log("Server Response:", res.data);


            if (res.data.success) {
                // Save student email & fullName locally
                await AsyncStorage.setItem("studentEmail", res.data.student.email);
                await AsyncStorage.setItem("studentFullName", res.data.student.fullName);

                // Navigate to Dashboard
                navigation.replace("StudentDashboardNavigator");
            }

            else {
                Alert.alert("Login Failed", res.data.message);
            }
        } catch (err: any) {
            console.log("Axios Error:", err.response?.data || err.message);
            Alert.alert(
                "Error",
                "Server not responding. Make sure backend is running and emulator/device is on the same network."
            );
        }
    };

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
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
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={handleEmailChange}
                    style={[styles.input, emailError ? styles.errorBorder : null]}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#888"
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                {/* Password Field */}
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={handlePasswordChange}
                    style={[styles.input, passwordError ? styles.errorBorder : null]}
                    secureTextEntry
                    placeholderTextColor="#888"
                />
                {passwordError ? (
                    <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("StudentRegister")}>
                    <Text style={styles.switchText}>
                        Don’t have an account?{" "}
                        <Text style={styles.linkText}>Register</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
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
    button: {
        backgroundColor: "#193648",
        paddingVertical: 14,
        width: "90%",
        alignItems: "center",
        borderRadius: 10,
        marginTop: 15,
        marginBottom: 20,
        elevation: 2,
    },
    buttonText: { color: "#fff", fontSize: 17, fontWeight: "600", letterSpacing: 0.5 },
    switchText: { color: "#333", fontSize: 15 },
    linkText: { color: "#193648", fontWeight: "bold" },
    errorText: {
        color: "red",
        fontSize: 13,
        marginBottom: 8,
        alignSelf: "flex-start",
        marginLeft: "5%",
    },
    errorBorder: {
        borderColor: "red",
    },
});

export default StudentLogin;
