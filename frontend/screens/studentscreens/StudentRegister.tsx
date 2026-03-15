import { CONSTANT } from "@/constants/constant";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Easing,
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



const StudentRegister = () => {
    const navigation = useNavigation<any>();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [department, setDepartment] = useState("");
    const [semester, setSemester] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const logoAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.spring(logoAnim, {
                toValue: 1,
                friction: 6,
                tension: 50,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleRegister = async () => {
        console.log("Register button clicked");

        const emailPattern = /^[\w-\.]+@students\.riphah\.edu\.pk$/;
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

        if (!fullName.trim()) return Alert.alert("Missing Field", "Please enter your full name");
        if (!emailPattern.test(email))
            return Alert.alert("Invalid Email", "Email must end with @students.riphah.edu.pk");
        if (!passwordPattern.test(password))
            return Alert.alert(
                "Weak Password",
                "Password must contain letters and numbers (min 6 chars)"
            );
        if (!phone.trim()) return Alert.alert("Missing Field", "Please enter your phone number");
        if (!department.trim()) return Alert.alert("Missing Field", "Please enter your department");
        if (!semester.trim()) return Alert.alert("Missing Field", "Please enter your current semester");
        if (!city.trim()) return Alert.alert("Missing Field", "Please enter your city");
        if (!address.trim()) return Alert.alert("Missing Field", "Please enter your address");

        try {
            const res = await axios.post(`${CONSTANT.API_BASE_URL}/api/student/register`, {
                fullName,
                email,
                password,
                phone,
                department,
                semester,
                city,
                address,
            });

            console.log("Server Response:", res.data);

            if (res.data.success) {

                Alert.alert("Success", "Verification code sent to your email!", [
                    {
                        text: "OK",
                        onPress: () => {

                            navigation.getParent()?.navigate
                                ? navigation.getParent()?.navigate("EnterCode", { email })
                                : navigation.navigate("EnterCode", { email });
                        },
                    },
                ]);
            } else {
                Alert.alert("Error", res.data.message || "Something went wrong.");
            }
        } catch (err: any) {
            console.log("Axios Error:", err.response?.data || err.message);
            Alert.alert(
                "Error",
                "Server not responding. Make sure backend is running and device/emulator is on the same network."
            );
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar backgroundColor="#193648" barStyle="light-content" />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Animated.Image
                        source={require("../../assets/images/logo.png")}
                        style={[
                            styles.logo,
                            {
                                transform: [
                                    { scale: logoAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) },
                                ],
                            },
                        ]}
                        resizeMode="contain"
                    />

                    <Animated.Text style={[styles.heading, { opacity: fadeAnim }]}>
                        Create Your Account
                    </Animated.Text>
                    <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
                        Where learning meets opportunity.
                    </Animated.Text>

                    {[
                        { placeholder: "Full Name", value: fullName, set: setFullName },
                        { placeholder: "University Email", value: email, set: setEmail, keyboardType: "email-address" },
                        { placeholder: "Password", value: password, set: setPassword, secureTextEntry: true },
                        { placeholder: "Phone Number", value: phone, set: setPhone, keyboardType: "phone-pad" },
                        { placeholder: "Department / Program", value: department, set: setDepartment },
                        { placeholder: "Current Semester", value: semester, set: setSemester },
                        { placeholder: "City", value: city, set: setCity },
                        { placeholder: "Address", value: address, set: setAddress },
                    ].map((field, index) => (
                        <TextInput
                            key={index}
                            placeholder={field.placeholder}
                            value={field.value}
                            onChangeText={field.set}
                            style={styles.input}
                            keyboardType={field.keyboardType as any}
                            secureTextEntry={field.secureTextEntry}
                            placeholderTextColor="#888"
                        />
                    ))}

                    <TouchableOpacity style={styles.button} onPress={handleRegister}>
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("StudentLogin")}>
                        <Text style={styles.switchText}>
                            Already have an account? <Text style={styles.linkText}>Login</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 25 },
    logo: { width: 130, height: 130, marginBottom: 20 },
    heading: { fontSize: 20, fontWeight: "700", color: "#193648", marginBottom: 6, textAlign: "center" },
    tagline: { fontSize: 15, color: "#64748b", marginBottom: 25, textAlign: "center" },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 14,
        marginBottom: 15,
        backgroundColor: "#f8f9fb",
        fontSize: 15,
        color: "#000",
    },
    button: { backgroundColor: "#193648", paddingVertical: 15, borderRadius: 10, alignItems: "center", width: "100%" },
    buttonText: { color: "#fff", fontSize: 17, fontWeight: "600" },
    switchText: { color: "#444", fontSize: 15 },
    linkText: { color: "#193648", fontWeight: "bold" },
});

export default StudentRegister;

