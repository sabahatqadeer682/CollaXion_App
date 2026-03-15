import { CONSTANT } from "@/constants/constant";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const EnterCode = () => {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { email } = route.params as { email: string };

    const [code, setCode] = useState("");

    const verifyCode = async () => {
        try {
            const res = await axios.post(`${CONSTANT.API_BASE_URL}/api/student/verify`, { email, code });
            console.log("Verify Response:", res.data);

            if (res.data.success) {
                Alert.alert("Verified!", "Your account has been created successfully.");
                navigation.navigate("StudentLogin");
            } else {
                Alert.alert("Invalid Code", res.data.message || "Please enter the correct code");
            }
        } catch (err: any) {
            console.log("Axios Verify Error:", err.response?.data || err.message);
            Alert.alert("Error", "Server not responding.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter Verification Code</Text>
            <Text style={{ marginBottom: 10 }}>Code sent to: {email}</Text>
            <TextInput
                placeholder="Enter 6-digit code"
                value={code}
                onChangeText={setCode}
                style={styles.input}
                keyboardType="number-pad"
            />
            <TouchableOpacity style={styles.button} onPress={verifyCode}>
                <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    title: { fontSize: 24, marginBottom: 20 },
    input: { width: "80%", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 15 },
    button: { backgroundColor: "#193648", padding: 15, borderRadius: 8, width: "80%" },
    buttonText: { color: "#fff", textAlign: "center", fontSize: 18 },
});

export default EnterCode;
