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
import React, { useState } from "react";
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

const IndustryLogin = () => {
    const navigation = useNavigation<any>();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Live validation for username
    const validateUsername = (value: string) => {
        setUsername(value);
        if (!value.trim()) {
            setUsernameError("Username cannot be empty");
        } else if (value.length < 5) {
            setUsernameError("Username must be at least 5 characters");
        } else {
            setUsernameError("");
        }
    };

    // Live validation for password
    const validatePassword = (value: string) => {
        setPassword(value);
        if (!value.trim()) {
            setPasswordError("Password cannot be empty");
        } else if (value.length < 6) {
            setPasswordError("Password must be at least 6 characters");
        } else {
            setPasswordError("");
        }
    };

    const handleLogin = () => {
        if (usernameError || passwordError || !username || !password) {
            Alert.alert("Error", "Please fix the errors before logging in.");
            return;
        }

        // Hardcoded credentials
        if (username === "UICollaboration" && password === "industry") {
            navigation.navigate("IndustryDashboard");
        } else {
            Alert.alert("Login Failed", "Invalid credentials. Try again.");
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

                {/* Username Input */}
                <TextInput
                    placeholder="Username"
                    value={username}
                    onChangeText={validateUsername}
                    style={[styles.input, usernameError ? { borderColor: "red" } : {}]}
                    autoCapitalize="none"
                    placeholderTextColor="#888"
                />
                {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

                {/* Password Input */}
                <View style={[styles.passwordContainer, passwordError ? { borderColor: "red" } : {}]}>
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={validatePassword}
                        secureTextEntry={!showPassword}
                        style={{ flex: 1, color: "#000" }}
                        placeholderTextColor="#888"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <MaterialIcons name={showPassword ? "visibility-off" : "visibility"} size={22} color="#555" />
                    </TouchableOpacity>
                </View>
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                {/* Login Button */}
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
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
    passwordContainer: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 14,
        borderRadius: 10,
        width: "90%",
        alignItems: "center",
        marginBottom: 10,
        backgroundColor: "#f9f9f9",
    },
    errorText: {
        width: "90%",
        color: "red",
        marginBottom: 10,
        fontSize: 13,
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

