import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList,
} from "@react-navigation/drawer";
import React, { useEffect, useState } from "react";
import { useUser } from "./UserContext";

import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

// Screens
import { CONSTANT } from "@/constants/constant";
import AIRecommendationsScreen from "./AIRecommendationsScreen";
import InternshipDetailsScreen from "./InternshipDetailsScreen";
import MyApplicationsScreen from "./MyApplicationsScreen";
import NotificationScreen from "./NotificationScreen";
import ProfileScreen from "./ProfileScreen";
import SettingsScreen from "./SettingsScreen";
import StudentHomeScreen from "./StudentHomeScreen";
import StudentLogin from "./StudentLogin";

const Drawer = createDrawerNavigator();




// --------------------- HeaderRight Component ---------------------
const HeaderRight = ({ navigation, profileImage, notificationCount }) => (
    <View style={{ flexDirection: "row", marginRight: 15 }}>
        {/* Notifications */}
        <TouchableOpacity
            onPress={() => navigation.navigate("Notifications")}
            style={{ position: "relative", marginRight: 15 }}
        >
            <MaterialCommunityIcons name="bell-outline" size={28} color="#fff" />
            {notificationCount > 0 && (
                <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>{notificationCount}</Text>
                </View>
            )}
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
            onPress={() => navigation.navigate("Profile Settings")}
            style={{ position: "relative" }}
        >
            <Image
                source={{
                    uri: profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                }}
                style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: "#fff",
                }}
            />
        </TouchableOpacity>
    </View>
);

// --------------------- Custom Drawer Content ---------------------
const CustomDrawerContent = (props) => {
    const navigation = useNavigation();
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { profileImage, setProfileImage } = useUser();
    const [notificationCount, setNotificationCount] = useState(3);

    const fetchStudentData = async () => {
        setLoading(true);
        try {
            const email = await AsyncStorage.getItem("studentEmail");
            const localImage = await AsyncStorage.getItem("studentProfileImage");

            if (!email) {
                setStudent(null);
                setProfileImage(localImage || null);
                return;
            }

            // const res = await axios.get(`${CONSTANT.API_BASE_URL}/api/student/getStudent/${email}`);
            const res = await axios.get(`${CONSTANT.API_BASE_URL}/api/student/getStudent/${email}`);

            setStudent(res.data);
            setProfileImage(localImage || null);
        } catch (err) {
            console.log("Drawer Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentData();
        const unsubscribe = navigation.addListener("focus", fetchStudentData);
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        const reloadImageOnReturn = async () => {
            const savedImage = await AsyncStorage.getItem("studentProfileImage");
            if (savedImage) setProfileImage(savedImage);
        };
        const unsubscribe = navigation.addListener("focus", reloadImageOnReturn);
        return unsubscribe;
    }, [navigation]);

    const handleProfileImageChange = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Permission Required", "Enable gallery access to upload a profile picture.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType.Images,
            allowsEditing: true,
            quality: 0.7,
            aspect: [1, 1],
        });

        if (!result.canceled) {
            const newImageUri = result.assets[0].uri;
            setProfileImage(newImageUri);
            await AsyncStorage.setItem("studentProfileImage", newImageUri);
            Alert.alert("Success", "Profile picture updated!");

        }
    };

    const handleLogout = () => {
        Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout",
                onPress: async () => {
                    await AsyncStorage.multiRemove(["studentEmail", "studentToken"]);
                    navigation.navigate("StudentLogin");

                },
            },
        ]);
    };





    return (
        <DrawerContentScrollView
            {...props}
            contentContainerStyle={{ flex: 1, backgroundColor: "#193648" }}
        >
            <StatusBar backgroundColor="#193648" barStyle="light-content" />
            <ScrollView>
                <View style={styles.drawerHeader}>
                    <Image
                        source={{ uri: "https://i.ibb.co/xmD7dXh/collaxion-logo.png" }}
                        style={styles.logoImage}
                    />
                    {loading ? (
                        <ActivityIndicator color="#fff" size="large" style={{ marginTop: 20 }} />
                    ) : (
                        <>
                            <TouchableOpacity onPress={handleProfileImageChange}>
                                <Image
                                    source={{
                                        uri: profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                                    }}
                                    style={styles.profileImage}
                                />
                            </TouchableOpacity>
                            <Text style={styles.userName}>
                                {student?.fullName ? `Hello, ${student.fullName}!` : "Hello Student!"}
                            </Text>
                            <Text style={styles.tagline}>Discover internships and grow your career</Text>
                        </>
                    )}
                </View>

                <View style={styles.drawerBody}>
                    <DrawerItemList {...props} />
                    <DrawerItem
                        label="Logout"
                        labelStyle={{ color: "#fff" }}
                        icon={({ size }) => <MaterialIcons name="logout" color="#fff" size={size} />}
                        onPress={handleLogout}
                    />
                </View>
            </ScrollView>
        </DrawerContentScrollView>
    );
};

// --------------------- Dashboard Navigator ---------------------
const StudentDashboardNavigator = () => {
    const { profileImage } = useUser();
    const [notificationCount] = useState(3);

    return (
        <Drawer.Navigator
            initialRouteName="Dashboard"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                drawerActiveTintColor: "#EAF3FA",
                drawerInactiveTintColor: "#fff",
                drawerLabelStyle: { fontSize: 15 },
                drawerStyle: { backgroundColor: "#193648" },
            }}
        >
            <Drawer.Screen
                name="Dashboard"
                component={StudentHomeScreen}
                options={({ navigation }) => ({
                    headerShown: true,
                    headerTitle: "",
                    headerStyle: {
                        backgroundColor: "#193648",
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 0,
                    },
                    headerTintColor: "#fff",
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.openDrawer()}
                            style={{ marginLeft: 15 }}
                        >
                            <MaterialCommunityIcons name="menu" size={28} color="#fff" />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <HeaderRight
                            navigation={navigation}
                            profileImage={profileImage}
                            notificationCount={notificationCount}
                        />
                    ),
                    drawerLabel: "Dashboard",
                    drawerIcon: ({ color, size }) => <MaterialIcons name="dashboard" color={color} size={size} />,
                })}
            />

            <Drawer.Screen
                name="AI Recommendations"
                component={AIRecommendationsScreen}
                options={{
                    drawerLabel: "AI Recommendations",
                    drawerIcon: ({ color, size }) => <MaterialIcons name="psychology" color={color} size={size} />,
                }}
            />

            <Drawer.Screen
                name="My Applications"
                component={MyApplicationsScreen}
                options={{
                    drawerLabel: "My Applications",
                    drawerIcon: ({ color, size }) => <MaterialIcons name="work-history" color={color} size={size} />,
                }}
            />

            <Drawer.Screen
                name="Profile Settings"
                component={ProfileScreen}
                options={{
                    drawerLabel: "My Profile",
                    drawerIcon: ({ color, size }) => <MaterialIcons name="person" color={color} size={size} />,
                }}
            />

            <Drawer.Screen
                name="App Settings"
                component={SettingsScreen}
                options={{
                    drawerLabel: "Settings & Privacy",
                    drawerIcon: ({ color, size }) => <MaterialIcons name="settings" color={color} size={size} />,
                }}
            />

            {/* Hidden Screens */}
            <Drawer.Screen name="InternshipDetails" component={InternshipDetailsScreen} options={{ drawerItemStyle: { height: 0 } }} />
            <Drawer.Screen name="StudentLogin" component={StudentLogin} options={{ drawerItemStyle: { height: 0 } }} />
            <Drawer.Screen name="Notifications" component={NotificationScreen} options={{ drawerItemStyle: { height: 0 } }} />
        </Drawer.Navigator>
    );
};

// --------------------- Styles ---------------------
const styles = StyleSheet.create({
    drawerHeader: {
        backgroundColor: "#193648",
        alignItems: "center",
        paddingVertical: 30,
        borderBottomWidth: 1,
        borderBottomColor: "#193648",
    },
    logoImage: { width: 70, height: 70, marginBottom: 10 },
    profileImage: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 3,
        borderColor: "#C6D1D6",
        marginBottom: 10,
    },
    userName: { color: "#fff", fontSize: 18, fontWeight: "bold" },
    tagline: { color: "#bfcde0", fontSize: 13, marginTop: 4, textAlign: "center", marginHorizontal: 10 },
    drawerBody: { backgroundColor: "#193648", flex: 1 },
    notificationBadge: {
        position: "absolute",
        top: -5,
        right: -10,
        backgroundColor: "#FF3B30",
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 4,
    },
    notificationBadgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
});

export default StudentDashboardNavigator;

