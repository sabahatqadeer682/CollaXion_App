

import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
} from "@react-navigation/drawer";
import React, { useEffect, useRef, useState } from "react";
import { useUser } from "./UserContext";

import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    Image,
    Platform,
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

import { CONSTANT } from "@/constants/constant";
import AIRecommendationsScreen from "./AIRecommendationsScreen";
import EventsScreen from "./EventsScreen";
import FeedbackScreen from "./Feedbackscreen";
import InternshipDetailsScreen from "./InternshipDetailsScreen";
import InternshipsScreen from "./Internshipsscreen";
import MyApplicationsScreen from "./MyApplicationsScreen";
import NearbyIndustriesScreen from "./NearbyIndustriesScreen";
import NotificationScreen from "./NotificationScreen";
import ProfileScreen from "./ProfileScreen";
import SettingsScreen from "./SettingsScreen";
import StudentHomeScreen from "./StudentHomeScreen";
import StudentLogin from "./StudentLogin";
import ChatListScreen from "./ChatListScreen";
import ChatRoomScreen from "./ChatRoomScreen";

import UpdatePasswordScreen from "./Updatepasswordscreen";

const Drawer = createDrawerNavigator();

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const isSmallScreen = SCREEN_H < 680;
const AVATAR = isSmallScreen ? 64 : 76;
const STATUS_H = Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) : 44;

// ── Header Right Component ──
const HeaderRight = ({ navigation, profileImage, notificationCount }) => (
    <View style={{ flexDirection: "row", marginRight: 14, alignItems: "center", gap: 8 }}>
        <TouchableOpacity
            onPress={() => navigation.navigate("Notifications")}
            style={styles.headerBtn}
        >
            <MaterialCommunityIcons name="bell-outline" size={22} color="#fff" />
            {notificationCount > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {notificationCount > 99 ? "99+" : notificationCount}
                    </Text>
                </View>
            )}
        </TouchableOpacity>

        <TouchableOpacity
            onPress={() => navigation.navigate("Profile Settings")}
            style={styles.headerAvatarBtn}
        >
            <Image
                source={{ uri: profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
                style={styles.headerAvatar}
            />
        </TouchableOpacity>
    </View>
);

// ── Custom Drawer Content ──
const CustomDrawerContent = (props) => {
    const navigation = useNavigation<any>();
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { profileImage, setProfileImage } = useUser();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-12)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 90, friction: 11, useNativeDriver: true }),
        ]).start();
    }, []);

    const fetchStudentData = async () => {
        setLoading(true);
        try {
            const email = await AsyncStorage.getItem("studentEmail");
            const localImage = await AsyncStorage.getItem("studentProfileImage");
            if (localImage) setProfileImage(localImage);
            
            if (!email) { setStudent(null); return; }

            const res = await axios.get(`${CONSTANT.API_BASE_URL}/api/student/getStudent/${email}`);
            setStudent(res.data);

            if (res.data.profileImage) {
                setProfileImage(res.data.profileImage);
                await AsyncStorage.setItem("studentProfileImage", res.data.profileImage);
            }
        } catch (err) {
            console.log("Drawer fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentData();
        const unsub = navigation.addListener("focus", fetchStudentData);
        return unsub;
    }, [navigation]);

    // ✅ Function updated and fixed
    const changeProfileImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission Required", "Gallery access is needed to change photo.");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images, // Corrected MediaType
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
            });

            if (!result.canceled && result.assets && result.assets[0].uri) {
                const selectedUri = result.assets[0].uri;
                
                // UI update
                setProfileImage(selectedUri);
                
                // Local save
                await AsyncStorage.setItem("studentProfileImage", selectedUri);
                
                // API update
                const email = await AsyncStorage.getItem("studentEmail");
                if (email) {
                    await axios.put(`${CONSTANT.API_BASE_URL}/api/student/updateProfile`, {
                        email,
                        profileImage: selectedUri,
                    });
                }
                Alert.alert("Success", "Profile image updated!");
            }
        } catch (error) {
            console.log("Error selecting image:", error);
            Alert.alert("Error", "Failed to update image.");
        }
    };

    const logout = () => {
        Alert.alert("Sign Out", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Sign Out",
                style: "destructive",
                onPress: async () => {
                    await AsyncStorage.multiRemove(["studentEmail", "studentToken", "studentProfileImage"]);
                    navigation.replace("StudentLogin");
                },
            },
        ]);
    };

    return (
        <DrawerContentScrollView
            {...props}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
            <StatusBar backgroundColor="#111D26" barStyle="light-content" />

            <Animated.View
                style={[
                    styles.profileCard,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                ]}
            >
                {/* ✅ Avatar Click Area Fixed */}
                <TouchableOpacity 
                    onPress={changeProfileImage} 
                    activeOpacity={0.7} 
                    style={styles.avatarTouch}
                >
                    <View style={styles.avatarWrapper}>
                        {loading ? (
                            <View style={[styles.avatar, styles.avatarLoading]}>
                                <ActivityIndicator color="#60A5FA" size="small" />
                            </View>
                        ) : (
                            <Image
                                source={{
                                    uri: profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                                }}
                                style={styles.avatar}
                            />
                        )}
                        {/* Camera badge inside touchable */}
                        <View style={styles.cameraBadge}>
                            <MaterialCommunityIcons name="camera" size={12} color="#fff" />
                        </View>
                    </View>
                </TouchableOpacity>

                <Text style={styles.studentName} numberOfLines={1}>
                    {student?.fullName || "Student Name"}
                </Text>
                <Text style={styles.studentEmail} numberOfLines={1}>
                    {student?.email || "loading..."}
                </Text>

                <View style={styles.onlinePill}>
                    <View style={styles.onlineDot} />
                    <Text style={styles.onlineText}>Active</Text>
                </View>
            </Animated.View>

            <View style={styles.sep} />

            <Animated.View style={{ opacity: fadeAnim }}>
                <DrawerItemList {...props} />
            </Animated.View>

            <View style={styles.sep} />

            <Animated.View style={{ opacity: fadeAnim }}>
                <TouchableOpacity style={styles.logoutRow} onPress={logout} activeOpacity={0.8}>
                    <View style={styles.logoutIcon}>
                        <MaterialIcons name="logout" color="#F87171" size={17} />
                    </View>
                    <Text style={styles.logoutText}>Sign Out</Text>
                </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
                <Image
                    source={require("../../assets/images/logo.png")}
                    style={styles.footerLogo}
                    resizeMode="contain"
                />
                <Text style={styles.footerText}>CollaXion • Where Collaboration Meets Innovation</Text>
            </Animated.View>
        </DrawerContentScrollView>
    );
};

// ── Main Navigator Component ──
const StudentDashboardNavigator = () => {
    const { profileImage } = useUser();
    const [notificationCount, setNotificationCount] = useState(0);

    const fetchNotifCount = async () => {
        try {
            const email = await AsyncStorage.getItem("studentEmail");
            if (!email) return;
            const res = await axios.get(`${CONSTANT.API_BASE_URL}/api/notifications/unread/${email}`);
            setNotificationCount(res.data.count || 0);
        } catch {}
    };

    useEffect(() => {
        fetchNotifCount();
        const interval = setInterval(fetchNotifCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const sharedHeader = ({ navigation }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: "#193648", elevation: 0, shadowOpacity: 0 },
        headerTintColor: "#fff",
        // headerTitle: () => (
        //     <Image
        //         source={require("../../assets/images/logo.png")}
        //         style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#f0f3f5",}}
        //         resizeMode="contain"
        //     />
        // ),
        headerTitle: () => (
    <Text style={{
        color: "#fff",
        fontSize: 18,
        fontWeight: "800",
        letterSpacing: 1,
        marginLeft: -10,

    }}>
        CollaXion
    </Text>
),
        headerTitleAlign: "center" as const,
        // headerLeft: () => (
        //     <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 14 }}>
        //         <MaterialCommunityIcons name="menu" size={26} color="#fff" />
        //     </TouchableOpacity>
        // ),
       
       headerLeft: () => (
    <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 10 }}>
        
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginRight: 10 }}>
            <MaterialCommunityIcons name="menu" size={26} color="#fff" />
        </TouchableOpacity>

        <Image
            source={require("../../assets/images/logo.png")}
            style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: "#fff" }}
            resizeMode="contain"
        />
    </View>
),
       
       
       
        headerRight: () => (
            <HeaderRight navigation={navigation} profileImage={profileImage} notificationCount={notificationCount} />
        ),
    });

    const ac = (color: string) => ({
        drawerActiveTintColor: color,
        drawerActiveBackgroundColor: color + "18",
        drawerInactiveTintColor: "rgba(255,255,255,0.55)",
    });

    return (
        <Drawer.Navigator
            initialRouteName="Dashboard"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                drawerStyle: {
                    backgroundColor: "#111D26",
                    width: Math.min(Math.round(SCREEN_W * 0.78), 295),
                },
                drawerLabelStyle: { fontSize: 14, fontWeight: "600", marginLeft: -4 },
                drawerItemStyle: { borderRadius: 10, marginHorizontal: 10, marginVertical: 1 },
            }}
        >
            <Drawer.Screen name="Dashboard" component={StudentHomeScreen}
                options={(p) => ({ ...sharedHeader(p), ...ac("#ffffff"), drawerLabel: "Dashboard", drawerIcon: ({ color, size }) => <MaterialIcons name="dashboard" color={color} size={size} /> })} />
            
            <Drawer.Screen name="Internships" component={InternshipsScreen}
                options={(p) => ({ ...sharedHeader(p), ...ac("#ffffff"), drawerLabel: "Browse Internships", drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="briefcase-search" color={color} size={size} /> })} />

            <Drawer.Screen name="My Applications" component={MyApplicationsScreen}
                options={(p) => ({ ...sharedHeader(p), ...ac("#ffffff"), drawerLabel: "My Applications", drawerIcon: ({ color, size }) => <MaterialIcons name="work-history" color={color} size={size} /> })} />

            <Drawer.Screen name="AI Recommendations" component={AIRecommendationsScreen}
                options={(p) => ({ ...sharedHeader(p), ...ac("#ffffff"), drawerLabel: "AI Recommendations", drawerIcon: ({ color, size }) => <MaterialIcons name="psychology" color={color} size={size} /> })} />

            <Drawer.Screen name="Nearby Industries" component={NearbyIndustriesScreen}
                options={(p) => ({ ...sharedHeader(p), ...ac("#ffffff"), drawerLabel: "Nearby Industries", drawerIcon: ({ color, size }) => <MaterialIcons name="location-on" color={color} size={size} /> })} />

            <Drawer.Screen name="Events" component={EventsScreen}
                options={(p) => ({ ...sharedHeader(p), ...ac("#ffffff"), drawerLabel: "Events", drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="calendar-star" color={color} size={size} /> })} />

            <Drawer.Screen name="Feedback" component={FeedbackScreen}
                options={(p) => ({ ...sharedHeader(p), ...ac("#ffffff"), drawerLabel: "Feedback & Ratings", drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="star-half-full" color={color} size={size} /> })} />

            <Drawer.Screen name="Profile Settings" component={ProfileScreen}
                options={(p) => ({ ...sharedHeader(p), ...ac("#ffffff"), drawerLabel: "My Profile", drawerIcon: ({ color, size }) => <MaterialIcons name="person" color={color} size={size} /> })} />

            <Drawer.Screen name="App Settings" component={SettingsScreen}
                options={(p) => ({ ...sharedHeader(p), ...ac("#ffffff"), drawerLabel: "Settings & Privacy", drawerIcon: ({ color, size }) => <MaterialIcons name="settings" color={color} size={size} /> })} />

<Drawer.Screen
  name="ChatRoom"
  component={ChatRoomScreen}
  options={(p) => ({
    ...sharedHeader(p),
    ...ac("#ffffff"),
    drawerLabel: "Chat Room",
    drawerIcon: ({ color, size }) => (
      <MaterialIcons name="chat-bubble" color={color} size={size} />
    ),
  })}
/>

<Drawer.Screen
  name="ChatList"
  component={ChatListScreen}
  options={(p) => ({
    ...sharedHeader(p),
    ...ac("#ffffff"),
    drawerLabel: "Chats",
    drawerIcon: ({ color, size }) => (
      <MaterialIcons name="chat" color={color} size={size} />
    ),
  })}
/>


            {/* Hidden screens */}
            <Drawer.Screen name="InternshipDetails" component={InternshipDetailsScreen} options={{ drawerItemStyle: { height: 0 } }} />
            <Drawer.Screen name="StudentLogin" component={StudentLogin} options={{ drawerItemStyle: { height: 0 } }} />
            <Drawer.Screen name="Notifications" component={NotificationScreen} options={{ drawerItemStyle: { height: 0 } }} />
        <Drawer.Screen name="UpdatePassword" component={UpdatePasswordScreen} options={{ drawerItemStyle: { height: 0 } }} />
{/* <Drawer.Screen
    name="ChatList"
    component={ChatListScreen}
    options={{ drawerItemStyle: { height: 0 } }} 
/>
<Drawer.Screen
    name="ChatRoom"
    component={ChatRoomScreen}
   options={{ drawerItemStyle: { height: 0 } }} 
/> */}
        
        </Drawer.Navigator>
    );
};

const styles = StyleSheet.create({
    scrollContent: { flexGrow: 1, backgroundColor: "#111D26", paddingBottom: 12 },
    profileCard: {
        alignItems: "center",
        paddingTop: STATUS_H + (isSmallScreen ? 12 : 20),
        paddingBottom: isSmallScreen ? 14 : 20,
        paddingHorizontal: 16,
    },
    avatarTouch: { 
        marginBottom: isSmallScreen ? 8 : 12,
        zIndex: 10, // Ensure it's clickable
    },
    avatarWrapper: {
        position: "relative",
        width: AVATAR,
        height: AVATAR,
    },
    avatar: {
        width: AVATAR,
        height: AVATAR,
        borderRadius: AVATAR / 2,
        borderWidth: 2.5,
        borderColor: "#f0f2f5",
        backgroundColor: "#1E3A4A",
    },
    avatarLoading: { justifyContent: "center", alignItems: "center" },
    cameraBadge: {
        position: "absolute",
        bottom: 2,
        right: 2,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#60A5FA",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#111D26",
    },
    studentName: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 3 },
    studentEmail: { color: "rgba(255,255,255,0.42)", fontSize: 12, marginBottom: 12 },
    onlinePill: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(52,211,153,0.1)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#72da6f", marginRight: 5 },
    onlineText: { color: "#eef0f0", fontSize: 11, fontWeight: "600" },
    sep: { height: 1, backgroundColor: "rgba(255,255,255,0.07)", marginHorizontal: 14, marginVertical: 8 },
    logoutRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginHorizontal: 10,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 10,
        backgroundColor: "rgba(248,113,113,0.07)",
    },
    logoutIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: "rgba(248,113,113,0.12)", justifyContent: "center", alignItems: "center" },
    logoutText: { color: "#F87171", fontWeight: "700", fontSize: 14 },
    footer: { alignItems: "center", gap: 5, paddingVertical: 18 },
    footerLogo: { width: 24, height: 24, borderRadius: 6 },
    footerText: { color: "rgba(255,255,255,0.18)", fontSize: 10 },
    headerBtn: { padding: 7, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.1)" },
    badge: { position: "absolute", top: -3, right: -3, backgroundColor: "#EF4444", borderRadius: 8, minWidth: 15, height: 15, justifyContent: "center", alignItems: "center", borderWidth: 1.5, borderColor: "#193648" },
    badgeText: { color: "#fff", fontSize: 8, fontWeight: "800" },
    headerAvatarBtn: { borderRadius: 15, borderWidth: 2, borderColor: "rgba(255,255,255,0.3)", overflow: "hidden" },
    headerAvatar: { width: 28, height: 28, borderRadius: 14 },
});

export default StudentDashboardNavigator;