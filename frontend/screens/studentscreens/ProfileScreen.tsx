import { CONSTANT } from "@/constants/constant";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// Image validation function
const validateImage = (uri: string) => {
    return new Promise((resolve, reject) => {
        Image.getSize(
            uri,
            (width, height) => {
                if (width < 100 || height < 100) {
                    reject("Image is too small. Minimum size is 100x100 pixels.");
                } else if (width > 2000 || height > 2000) {
                    reject("Image is too large. Maximum size is 2000x2000 pixels.");
                } else {
                    resolve(true);
                }
            },
            (error) => {
                reject("Failed to load image. Please try another image.");
            }
        );
    });
};

const ProfileScreen = ({ navigation, setGlobalProfileImage }) => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [cvLoading, setCvLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [profileImageLocal, setProfileImageLocal] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);




    useFocusEffect(
        useCallback(() => {
            fetchStudentData();
        }, [])
    );

    const fetchStudentData = async () => {
        setLoading(true);
        try {
            const email = await AsyncStorage.getItem("studentEmail");
            if (!email) return setStudent(null);

            const res = await axios.get(`${CONSTANT.API_BASE_URL}/api/student/getStudent/${email}`);
            const studentData = res.data;

            setStudent(studentData);

            if (studentData.profileImage) {
                setProfileImageLocal(studentData.profileImage);
                await AsyncStorage.setItem("studentProfileImage", studentData.profileImage);
                if (setGlobalProfileImage) {
                    setGlobalProfileImage(studentData.profileImage);
                }
            } else {
                const savedImage = await AsyncStorage.getItem("studentProfileImage");
                if (savedImage) {
                    setProfileImageLocal(savedImage);
                }
            }
        } catch (err) {
            console.log("Fetch Error:", err);
            Alert.alert("Error", "Failed to fetch student data.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!student) return;
        setSaving(true);
        try {
            const res = await axios.put(`${CONSTANT.API_BASE_URL}/api/student/updateProfile`, {
                email: student.email,
                fullName: student.fullName,
                phone: student.phone,
                city: student.city,
                address: student.address,
                profileImage: profileImageLocal,
            });

            setStudent(res.data.student || res.data);
            Alert.alert("Success", "Profile updated successfully!");

            setEditing(false);
            await fetchStudentData();

            if (setGlobalProfileImage && profileImageLocal) {
                setGlobalProfileImage(profileImageLocal);
            }
        } catch (err) {
            console.log("Update Error:", err.response?.data || err.message);
            Alert.alert("Error", "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission required", "Gallery access needed.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;

            try {
                setImageUploading(true);
                await validateImage(uri);

                const response = await fetch(uri);
                const blob = await response.blob();
                const sizeInMB = blob.size / (1024 * 1024);

                if (sizeInMB > 5) {
                    throw new Error("Image size must be less than 5MB.");
                }

                setProfileImageLocal(uri);
                await AsyncStorage.setItem("studentProfileImage", uri);

                if (student?.email) {
                    await axios.put(`${CONSTANT.API_BASE_URL}/api/student/updateProfile`, {
                        email: student.email,
                        profileImage: uri,
                    });
                }

                if (setGlobalProfileImage) {
                    setGlobalProfileImage(uri);
                }

                Alert.alert("Success", "Profile picture updated!");
                await fetchStudentData();
            } catch (error: any) {
                Alert.alert("Invalid Image", error.message || "Please select a valid image.");
            } finally {
                setImageUploading(false);
            }
        }
    };



    const uploadCV = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "application/pdf",
                copyToCacheDirectory: true,
            });

            if (result.canceled || !result.assets || result.assets.length === 0) {
                Alert.alert("Cancelled", "File selection cancelled by user.");
                return;
            }

            const file = result.assets[0];
            setCvLoading(true);


            const formData = new FormData();
            formData.append("cv", {
                uri: file.uri,
                name: file.name,
                type: file.mimeType || "application/pdf",
            } as any);

            const response = await fetch(
                `http://192.168.0.204:5000/api/student/upload-cv/${student.email}`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Accept: "application/json",

                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            const data = await response.json();
            console.log("CV uploaded:", data);
            Alert.alert("Success", "CV uploaded successfully!");
            await fetchStudentData();
        } catch (err: any) {
            console.error("CV Upload Error:", err);
            Alert.alert("Error", err.message || "Network request failed.");
        } finally {
            setCvLoading(false);
        }
    };


    const deleteCV = async () => {
        Alert.alert(
            "Delete CV",
            "Are you sure you want to delete your CV? This will also remove AI recommendations based on your CV.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {

                            await axios.delete(`${CONSTANT.API_BASE_URL}/api/student/delete-cv/${student.email}`);


                            setStudent({
                                ...student,
                                cvUrl: null,
                                cvFeedback: null,
                                extractedSkills: [],
                            });

                            Alert.alert("Success", "CV deleted successfully");
                            await fetchStudentData();
                        } catch (err) {
                            console.log("Delete CV Error:", err);
                            Alert.alert("Error", "Failed to delete CV");
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#193648" />
            </View>
        );
    }

    if (!student) {
        return (
            <View style={styles.loaderContainer}>
                <Text>No student data found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={pickImage} disabled={imageUploading}>
                    {imageUploading ? (
                        <View style={styles.profileImage}>
                            <ActivityIndicator size="large" color="#193648" />
                        </View>
                    ) : (
                        <Image
                            source={
                                profileImageLocal
                                    ? { uri: profileImageLocal }
                                    : require("../../assets/images/defaultProfile.png")
                            }
                            style={styles.profileImage}
                        />
                    )}
                    <Ionicons name="camera" size={22} color="white" style={styles.cameraIcon} />
                </TouchableOpacity>
                <Text style={styles.name}>{student.fullName}</Text>
                <Text style={styles.email}>{student.email}</Text>
                <Text style={styles.imageHint}>Tap to change - 100x100 min - Max 5MB</Text>
            </View>

            <View style={styles.form}>
                {["fullName", "phone", "city", "address"].map((field) => (
                    <View key={field} style={styles.inputContainer}>
                        <Text style={styles.label}>
                            {field.toUpperCase().replace(/([A-Z])/g, " $1").trim()}
                        </Text>
                        <TextInput
                            style={styles.input}
                            value={student[field] || ""}
                            editable={editing}
                            onChangeText={(text) => setStudent({ ...student, [field]: text })}
                        />
                    </View>
                ))}

                <View style={styles.buttonContainer}>
                    {editing ? (
                        <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                            {saving ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.saveText}>Save Changes</Text>
                            )}
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
                            <Ionicons name="create-outline" size={20} color="#fff" />
                            <Text style={styles.editText}>Edit Profile</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.cvSection}>
                <Text style={styles.cvTitle}>My CV & Skills</Text>

                {student.extractedSkills && student.extractedSkills.length > 0 && (
                    <View style={styles.skillsContainer}>
                        <Text style={styles.skillsTitle}>Extracted Skills:</Text>
                        <View style={styles.skillsWrapper}>
                            {student.extractedSkills.map((skill: string, index: number) => (
                                <View key={index} style={styles.skillBadge}>
                                    <Text style={styles.skillText}>{skill}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {!student.cvUrl ? (
                    <>
                        <Text style={styles.cvHint}>Upload your CV to get AI-powered recommendations</Text>
                        <TouchableOpacity
                            style={styles.uploadButton}
                            onPress={uploadCV}
                            disabled={cvLoading}
                        >
                            {cvLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
                                    <Text style={styles.uploadText}>Upload CV (PDF)</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <View style={styles.cvUploadedContainer}>
                            <View style={styles.cvUploadedInfo}>
                                <Ionicons name="document-text" size={24} color="#27AE60" />
                                <Text style={styles.cvUploadedText}>CV Uploaded Successfully</Text>
                            </View>
                            <View style={styles.cvActions}>
                                <TouchableOpacity
                                    onPress={() => Linking.openURL(`${CONSTANT.API_BASE_URL}${student.cvUrl}`)}
                                    style={styles.viewCvButton}
                                >
                                    <Ionicons name="eye-outline" size={18} color="#193648" />
                                    <Text style={styles.viewCvText}>View CV</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={uploadCV} style={styles.replaceCvButton}>
                                    <Ionicons name="refresh-outline" size={18} color="#F39C12" />
                                    <Text style={styles.replaceCvText}>Replace</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={deleteCV} style={styles.deleteCvButton}>
                                    <Ionicons name="trash-outline" size={18} color="#E74C3C" />
                                    <Text style={styles.deleteCvText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                )}

                {student.cvFeedback && (
                    <View style={styles.feedbackContainer}>
                        <Text style={styles.feedbackTitle}>🤖 AI Feedback:</Text>
                        <Text style={styles.feedback}>{student.cvFeedback}</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f9f9f9" },
    loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    header: {
        alignItems: "center",
        paddingVertical: 30,
        backgroundColor: "#193648",
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },
    cameraIcon: {
        position: "absolute",
        bottom: 5,
        right: 5,
        backgroundColor: "#193648",
        borderRadius: 50,
        padding: 6,
        borderWidth: 2,
        borderColor: "white",
    },
    name: { color: "white", fontSize: 22, fontWeight: "bold", marginTop: 15 },
    email: { color: "white", fontSize: 14, marginTop: 5, opacity: 0.9 },
    imageHint: { color: "white", fontSize: 11, marginTop: 8, opacity: 0.7 },
    form: { padding: 20 },
    inputContainer: { marginBottom: 15 },
    label: { fontSize: 12, color: "#555", marginBottom: 6, fontWeight: "600" },
    input: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        fontSize: 15,
    },
    buttonContainer: { alignItems: "center", marginVertical: 15 },
    editButton: {
        backgroundColor: "#193648",
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    saveButton: {
        backgroundColor: "#27ae60",
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 8,
    },
    editText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
    saveText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
    cvSection: {
        padding: 20,
        borderTopWidth: 1,
        borderColor: "#ddd",
        backgroundColor: "#fff",
        borderRadius: 15,
        margin: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cvTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#193648" },
    cvHint: { fontSize: 13, color: "#666", marginBottom: 15, textAlign: "center" },
    uploadButton: {
        backgroundColor: "#193648",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },
    uploadText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
    cvUploadedContainer: {
        backgroundColor: "#E8F6F3",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    cvUploadedInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        gap: 10,
    },
    cvUploadedText: { fontSize: 15, fontWeight: "600", color: "#27AE60" },
    cvActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
    },
    viewCvButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 8,
        gap: 5,
    },
    viewCvText: { fontSize: 13, fontWeight: "600", color: "#193648" },
    replaceCvButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 8,
        gap: 5,
    },
    replaceCvText: { fontSize: 13, fontWeight: "600", color: "#F39C12" },
    deleteCvButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 8,
        gap: 5,
    },
    deleteCvText: { fontSize: 13, fontWeight: "600", color: "#E74C3C" },
    skillsContainer: {
        backgroundColor: "#F0F8FF",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    skillsTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#193648",
        marginBottom: 10,
    },
    skillsWrapper: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    skillBadge: {
        backgroundColor: "#193648",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    skillText: { fontSize: 12, color: "#fff", fontWeight: "500" },
    feedbackContainer: {
        marginTop: 15,
        padding: 15,
        backgroundColor: "#f8f9fa",
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: "#193648",
    },
    feedbackTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#193648",
        marginBottom: 8,
    },
    feedback: { fontSize: 13, color: "#555", lineHeight: 20 },
});