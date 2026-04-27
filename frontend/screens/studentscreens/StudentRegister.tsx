import { CONSTANT } from "@/constants/constant";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Easing,
    FlatList,
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

const DEPARTMENTS = ["BSSE", "BSCS", "CA"];

const SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"];

// Pretty gender options with leading icons (rendered in the picker sheet).
const GENDER_OPTIONS = [
    { label: "Male",   icon: "male"          as const, color: "#2563EB" },
    { label: "Female", icon: "female"        as const, color: "#DB2777" },
    { label: "Other",  icon: "person"        as const, color: "#7C3AED" },
];
const GENDERS = GENDER_OPTIONS.map((g) => g.label);

type Errors = Partial<Record<
    "sapId" | "fullName" | "gender" | "email" | "password" | "phone" | "department" | "semester" | "city" | "address",
    string
>>;

const StudentRegister = () => {
    const navigation = useNavigation<any>();

    const [sapId, setSapId] = useState("");
    const [fullName, setFullName] = useState("");
    const [gender, setGender] = useState("");
    const [email, setEmail] = useState("");
    const [emailEditedManually, setEmailEditedManually] = useState(false);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [phone, setPhone] = useState("");
    const [department, setDepartment] = useState("");
    const [semester, setSemester] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Errors>({});

    const [pickerOpen, setPickerOpen] = useState<null | "gender" | "department" | "semester">(null);

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

    // Auto-fill email from SAP ID once it's a valid format and user hasn't manually edited the email
    useEffect(() => {
        if (!emailEditedManually && /^\d{5,7}$/.test(sapId.trim())) {
            setEmail(`${sapId.trim()}@students.riphah.edu.pk`);
        }
    }, [sapId, emailEditedManually]);

    const validate = (): Errors => {
        const e: Errors = {};
        const sapPattern = /^\d{5,7}$/;
        const emailPattern = /^[\w.\-]+@students\.riphah\.edu\.pk$/i;
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
        const phonePattern = /^(\+92|0)?3\d{9}$/;
        const namePattern = /^[A-Za-z][A-Za-z\s.'-]{2,}$/;

        if (!sapId.trim()) e.sapId = "SAP ID is required";
        else if (!sapPattern.test(sapId.trim())) e.sapId = "SAP ID must be 5–7 digits";

        if (!fullName.trim()) e.fullName = "Full name is required";
        else if (!namePattern.test(fullName.trim())) e.fullName = "Use letters only (min 3 chars)";

        if (!gender) e.gender = "Select your gender";

        if (!email.trim()) e.email = "Email is required";
        else if (!emailPattern.test(email.trim())) e.email = "Use your @students.riphah.edu.pk email";

        if (!password) e.password = "Password is required";
        else if (!passwordPattern.test(password)) e.password = "Min 6 chars, with letters and numbers";

        // Phone — must be a Pakistan mobile number: 03XXXXXXXXX (11 digits)
        // or +923XXXXXXXXX (13 chars). Strip spaces / dashes before checking.
        const cleanedPhone = phone.replace(/[\s\-]/g, "");
        if (!cleanedPhone) e.phone = "Phone number is required";
        else if (!/^(\+923\d{9}|03\d{9})$/.test(cleanedPhone))
            e.phone = "Enter a valid Pakistan mobile (e.g. 03XXXXXXXXX)";

        if (!department) e.department = "Select your department";
        if (!semester) e.semester = "Select your semester";

        if (!city.trim()) e.city = "City is required";
        else if (city.trim().length < 2) e.city = "Enter your city";

        if (!address.trim()) e.address = "Address is required";
        else if (address.trim().length < 5) e.address = "Address looks too short";

        return e;
    };

    const liveErrors = useMemo(validate, [
        sapId,
        fullName,
        gender,
        email,
        password,
        phone,
        department,
        semester,
        city,
        address,
    ]);

    const setFieldAndClear = (field: keyof Errors, setter: (v: string) => void) => (v: string) => {
        setter(v);
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleRegister = async () => {
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length > 0) return;

        setSubmitting(true);
        try {
            const res = await axios.post(`${CONSTANT.API_BASE_URL}/api/student/register`, {
                fullName: fullName.trim(),
                sapId: sapId.trim(),
                gender,
                email: email.trim().toLowerCase(),
                password,
                phone: phone.replace(/\s/g, ""),
                department,
                semester,
                city,
                address: address.trim(),
            });

            if (res.data.success) {
                Alert.alert("Success", "Verification code sent to your email!", [
                    {
                        text: "OK",
                        onPress: () => {
                            navigation.getParent()?.navigate
                                ? navigation.getParent()?.navigate("EnterCode", { email: email.trim().toLowerCase() })
                                : navigation.navigate("EnterCode", { email: email.trim().toLowerCase() });
                        },
                    },
                ]);
            } else {
                Alert.alert("Error", res.data.message || "Something went wrong.");
            }
        } catch (err: any) {
            const serverMsg = err.response?.data?.message;
            Alert.alert(
                "Registration Failed",
                serverMsg || "Server not responding. Make sure backend is running and device is on the same network."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const renderInput = (
        field: keyof Errors,
        placeholder: string,
        value: string,
        setter: (v: string) => void,
        opts: {
            keyboardType?: any;
            secureTextEntry?: boolean;
            autoCapitalize?: "none" | "words" | "sentences" | "characters";
            maxLength?: number;
            rightIcon?: React.ReactNode;
            onBlurExtra?: () => void;
        } = {}
    ) => {
        const hasError = !!errors[field];
        return (
            <View style={styles.fieldWrap}>
                <View style={[styles.inputBox, hasError && styles.inputBoxError]}>
                    <TextInput
                        placeholder={placeholder}
                        value={value}
                        onChangeText={setFieldAndClear(field, setter)}
                        onBlur={() => {
                            setErrors((prev) => ({ ...prev, [field]: liveErrors[field] }));
                            opts.onBlurExtra?.();
                        }}
                        style={styles.input}
                        keyboardType={opts.keyboardType}
                        secureTextEntry={opts.secureTextEntry}
                        autoCapitalize={opts.autoCapitalize ?? "sentences"}
                        maxLength={opts.maxLength}
                        placeholderTextColor="#888"
                    />
                    {opts.rightIcon}
                </View>
                {hasError ? <Text style={styles.errorText}>{errors[field]}</Text> : null}
            </View>
        );
    };

    const renderSelector = (
        field: "gender" | "department" | "semester",
        placeholder: string,
        value: string
    ) => {
        const hasError = !!errors[field];
        return (
            <View style={styles.fieldWrap}>
                <TouchableOpacity
                    style={[styles.inputBox, hasError && styles.inputBoxError]}
                    onPress={() => setPickerOpen(field)}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.input, { color: value ? "#000" : "#888" }]}>
                        {value || placeholder}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color="#193648" style={{ marginRight: 12 }} />
                </TouchableOpacity>
                {hasError ? <Text style={styles.errorText}>{errors[field]}</Text> : null}
            </View>
        );
    };

    const optionsFor = (key: typeof pickerOpen): string[] => {
        if (key === "gender") return GENDERS;
        if (key === "department") return DEPARTMENTS;
        if (key === "semester") return SEMESTERS;
        return [];
    };

    const onPickOption = (val: string) => {
        if (pickerOpen === "gender") {
            setGender(val);
            setErrors((p) => ({ ...p, gender: undefined }));
        } else if (pickerOpen === "department") {
            setDepartment(val);
            setErrors((p) => ({ ...p, department: undefined }));
        } else if (pickerOpen === "semester") {
            setSemester(val);
            setErrors((p) => ({ ...p, semester: undefined }));
        }
        setPickerOpen(null);
    };

    const pickerTitle =
        pickerOpen === "gender"
            ? "Select Gender"
            : pickerOpen === "department"
                ? "Select Department"
                : pickerOpen === "semester"
                    ? "Select Semester"
                    : "";

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar backgroundColor="#193648" barStyle="light-content" />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
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

                    {renderInput("sapId", "SAP ID", sapId, setSapId, {
                        keyboardType: "number-pad",
                        autoCapitalize: "none",
                        maxLength: 7,
                    })}

                    {renderInput("fullName", "Full Name", fullName, setFullName, {
                        autoCapitalize: "words",
                    })}

                    {renderSelector("gender", "Gender", gender)}

                    <View style={styles.fieldWrap}>
                        <View style={[styles.inputBox, errors.email && styles.inputBoxError]}>
                            <TextInput
                                placeholder="University Email"
                                value={email}
                                onChangeText={(v) => {
                                    // Type just "<sap>@" and the rest of the
                                    // university email auto-completes —
                                    // matching the student-login UX.
                                    let next = v;
                                    if (
                                        v.endsWith("@") &&
                                        !v.includes("@students.riphah.edu.pk")
                                    ) {
                                        next = v + "students.riphah.edu.pk";
                                    }
                                    setEmail(next);
                                    setEmailEditedManually(true);
                                    if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                                }}
                                onBlur={() =>
                                    setErrors((prev) => ({ ...prev, email: liveErrors.email }))
                                }
                                style={styles.input}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor="#888"
                            />
                        </View>
                        <Text style={styles.hintText}>
                            Auto-filled from SAP ID. Edit if your university email differs.
                        </Text>
                        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                    </View>

                    {renderInput("password", "Password", password, setPassword, {
                        secureTextEntry: !showPassword,
                        autoCapitalize: "none",
                        rightIcon: (
                            <TouchableOpacity
                                onPress={() => setShowPassword((s) => !s)}
                                style={{ paddingHorizontal: 12 }}
                            >
                                <Ionicons
                                    name={showPassword ? "eye-off" : "eye"}
                                    size={20}
                                    color="#193648"
                                />
                            </TouchableOpacity>
                        ),
                    })}

                    {renderInput("phone", "Phone Number", phone, setPhone, {
                        keyboardType: "phone-pad",
                        autoCapitalize: "none",
                        maxLength: 14,
                    })}

                    {renderSelector("department", "Department / Program", department)}
                    {renderSelector("semester", "Current Semester", semester)}
                    {renderInput("city", "City", city, setCity, {
                        autoCapitalize: "words",
                    })}

                    {renderInput("address", "Address", address, setAddress, {
                        autoCapitalize: "sentences",
                    })}

                    <TouchableOpacity
                        style={[styles.button, submitting && { opacity: 0.7 }]}
                        onPress={handleRegister}
                        disabled={submitting}
                    >
                        <Text style={styles.buttonText}>
                            {submitting ? "Registering..." : "Register"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("StudentLogin")}>
                        <Text style={styles.switchText}>
                            Already have an account? <Text style={styles.linkText}>Login</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>

            <Modal
                visible={pickerOpen !== null}
                transparent
                animationType="fade"
                onRequestClose={() => setPickerOpen(null)}
            >
                <Pressable style={styles.modalBackdrop} onPress={() => setPickerOpen(null)}>
                    <Pressable style={styles.modalSheet} onPress={() => { }}>
                        <View style={styles.modalGrabber} />
                        <Text style={styles.modalTitle}>{pickerTitle}</Text>
                        <FlatList
                            data={optionsFor(pickerOpen)}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => {
                                const genderCfg = pickerOpen === "gender"
                                    ? GENDER_OPTIONS.find((g) => g.label === item)
                                    : null;
                                const selected =
                                    (pickerOpen === "gender"     && gender     === item) ||
                                    (pickerOpen === "department" && department === item) ||
                                    (pickerOpen === "semester"   && semester   === item);
                                return (
                                    <TouchableOpacity
                                        style={[styles.optionRow, selected && styles.optionRowActive]}
                                        onPress={() => onPickOption(item)}
                                        activeOpacity={0.85}
                                    >
                                        {genderCfg ? (
                                            <View
                                                style={[
                                                    styles.optionIconWrap,
                                                    { backgroundColor: genderCfg.color + "1A" },
                                                ]}
                                            >
                                                <Ionicons
                                                    name={genderCfg.icon}
                                                    size={18}
                                                    color={genderCfg.color}
                                                />
                                            </View>
                                        ) : null}
                                        <Text
                                            style={[
                                                styles.optionText,
                                                selected && styles.optionTextActive,
                                            ]}
                                        >
                                            {item}
                                        </Text>
                                        {selected ? (
                                            <Ionicons
                                                name="checkmark-circle"
                                                size={20}
                                                color="#193648"
                                                style={{ marginLeft: "auto" }}
                                            />
                                        ) : null}
                                    </TouchableOpacity>
                                );
                            }}
                            ItemSeparatorComponent={() => <View style={styles.optionSep} />}
                        />
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 25 },
    logo: { width: 130, height: 130, marginBottom: 20 },
    heading: { fontSize: 20, fontWeight: "700", color: "#193648", marginBottom: 6, textAlign: "center" },
    tagline: { fontSize: 15, color: "#64748b", marginBottom: 25, textAlign: "center" },
    fieldWrap: { width: "100%", marginBottom: 12 },
    inputBox: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        backgroundColor: "#f8f9fb",
    },
    inputBoxError: { borderColor: "#dc2626" },
    input: {
        flex: 1,
        padding: 14,
        fontSize: 15,
        color: "#000",
    },
    errorText: { color: "#dc2626", fontSize: 12, marginTop: 4, marginLeft: 4 },
    hintText: { color: "#64748b", fontSize: 12, marginTop: 4, marginLeft: 4 },
    button: {
        backgroundColor: "#193648",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        width: "100%",
        marginTop: 8,
    },
    buttonText: { color: "#fff", fontSize: 17, fontWeight: "600" },
    switchText: { color: "#444", fontSize: 15, marginTop: 18 },
    linkText: { color: "#193648", fontWeight: "bold" },
    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "flex-end",
    },
    modalSheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 20,
        maxHeight: "70%",
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#193648",
        marginBottom: 12,
    },
    modalGrabber: {
        alignSelf: "center",
        width: 38, height: 4, borderRadius: 2,
        backgroundColor: "#CBD5E1",
        marginBottom: 10,
    },
    optionRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 6,
        borderRadius: 12,
        gap: 12,
    },
    optionRowActive: { backgroundColor: "#F1F5F9" },
    optionIconWrap: {
        width: 32, height: 32, borderRadius: 16,
        alignItems: "center", justifyContent: "center",
    },
    optionText: { fontSize: 15, color: "#1f2937", fontWeight: "600" },
    optionTextActive: { color: "#193648", fontWeight: "800" },
    optionSep: { height: 1, backgroundColor: "#eef2f7" },
});

export default StudentRegister;
