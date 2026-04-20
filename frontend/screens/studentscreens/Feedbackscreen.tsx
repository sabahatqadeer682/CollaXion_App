// import { CONSTANT } from "@/constants/constant";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useFocusEffect } from "@react-navigation/native";
// import axios from "axios";
// import React, { useCallback, useState } from "react";
// import {
//     ActivityIndicator,
//     Alert,
//     FlatList,
//     Modal,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";

// const CATEGORIES = ["Overall", "Internship Experience", "Company Culture", "Mentorship", "Work Environment"];
// const COMPANIES = ["TechNest Solutions", "DataSphere AI", "AppForge Pakistan", "SecureNet Corp", "PixelCraft Studio", "CloudBase Technologies", "Other"];

// const StarRating = ({ rating, onRate }: { rating: number; onRate?: (r: number) => void }) => (
//     <View style={{ flexDirection: "row", gap: 4 }}>
//         {[1, 2, 3, 4, 5].map((star) => (
//             <TouchableOpacity key={star} onPress={() => onRate?.(star)} disabled={!onRate}>
//                 <MaterialCommunityIcons
//                     name={star <= rating ? "star" : "star-outline"}
//                     size={28}
//                     color={star <= rating ? "#F59E0B" : "#D1D5DB"}
//                 />
//             </TouchableOpacity>
//         ))}
//     </View>
// );

// const FeedbackScreen = () => {
//     const [myFeedbacks, setMyFeedbacks] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [submitting, setSubmitting] = useState(false);
//     const [form, setForm] = useState({
//         companyName: "",
//         rating: 0,
//         category: "Overall",
//         comment: "",
//         isAnonymous: false,
//     });

//     useFocusEffect(
//         useCallback(() => {
//             fetchMyFeedbacks();
//         }, [])
//     );

//     const fetchMyFeedbacks = async () => {
//         try {
//             const email = await AsyncStorage.getItem("studentEmail");
//             if (!email) return;
//             const res = await axios.get(`${CONSTANT.API_BASE_URL}/api/feedback/student/${email}`);
//             setMyFeedbacks(res.data);
//         } catch (err) {
//             console.log("Feedback fetch error:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSubmit = async () => {
//         if (!form.companyName) { Alert.alert("Required", "Please select a company"); return; }
//         if (form.rating === 0) { Alert.alert("Required", "Please give a star rating"); return; }
//         if (!form.comment.trim() || form.comment.length < 20) {
//             Alert.alert("Required", "Please write at least 20 characters in your review");
//             return;
//         }

//         setSubmitting(true);
//         try {
//             const email = await AsyncStorage.getItem("studentEmail");
//             await axios.post(`${CONSTANT.API_BASE_URL}/api/feedback/submit`, {
//                 studentEmail: email,
//                 ...form,
//             });
//             setModalVisible(false);
//             setForm({ companyName: "", rating: 0, category: "Overall", comment: "", isAnonymous: false });
//             await fetchMyFeedbacks();
//             Alert.alert("✅ Submitted!", "Thank you for your feedback! It helps other students make better decisions.");
//         } catch (err: any) {
//             Alert.alert("Error", err.response?.data?.error || "Failed to submit feedback");
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const renderCard = ({ item }: { item: any }) => (
//         <View style={styles.feedbackCard}>
//             <View style={styles.cardTop}>
//                 <View style={styles.companyInitial}>
//                     <Text style={styles.initialText}>{item.companyName?.[0] || "?"}</Text>
//                 </View>
//                 <View style={{ flex: 1, marginLeft: 12 }}>
//                     <Text style={styles.companyName}>{item.isAnonymous ? "Anonymous Review" : item.companyName}</Text>
//                     <Text style={styles.categoryText}>{item.category}</Text>
//                 </View>
//                 <StarRating rating={item.rating} />
//             </View>
//             <Text style={styles.commentText}>"{item.comment}"</Text>
//             <Text style={styles.dateText}>{new Date(item.createdAt).toDateString()}</Text>
//         </View>
//     );

//     return (
//         <View style={styles.container}>
//             {/* Header */}
//             <View style={styles.header}>
//                 <View>
//                     <Text style={styles.headerTitle}>Feedback & Ratings</Text>
//                     <Text style={styles.headerSub}>Share your internship experience</Text>
//                 </View>
//                 <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
//                     <MaterialCommunityIcons name="plus" size={20} color="#fff" />
//                     <Text style={styles.addBtnText}>Write Review</Text>
//                 </TouchableOpacity>
//             </View>

//             {/* Stats */}
//             <View style={styles.statsRow}>
//                 <View style={styles.statBox}>
//                     <Text style={styles.statNum}>{myFeedbacks.length}</Text>
//                     <Text style={styles.statLabel}>Reviews Given</Text>
//                 </View>
//                 <View style={styles.statBox}>
//                     <Text style={styles.statNum}>
//                         {myFeedbacks.length > 0
//                             ? (myFeedbacks.reduce((s, f) => s + f.rating, 0) / myFeedbacks.length).toFixed(1)
//                             : "—"}
//                     </Text>
//                     <Text style={styles.statLabel}>Avg Rating</Text>
//                 </View>
//                 <View style={styles.statBox}>
//                     <MaterialCommunityIcons name="star" size={28} color="#F59E0B" />
//                     <Text style={styles.statLabel}>Your Impact</Text>
//                 </View>
//             </View>

//             {loading ? (
//                 <ActivityIndicator color="#193648" size="large" style={{ marginTop: 60 }} />
//             ) : (
//                 <FlatList
//                     data={myFeedbacks}
//                     keyExtractor={(item) => item._id}
//                     renderItem={renderCard}
//                     contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
//                     ListEmptyComponent={
//                         <View style={styles.emptyState}>
//                             <MaterialCommunityIcons name="star-off" size={64} color="#D1D5DB" />
//                             <Text style={styles.emptyTitle}>No Reviews Yet</Text>
//                             <Text style={styles.emptySub}>Share your internship experience to help other students!</Text>
//                             <TouchableOpacity style={styles.emptyBtn} onPress={() => setModalVisible(true)}>
//                                 <Text style={styles.emptyBtnText}>Write First Review</Text>
//                             </TouchableOpacity>
//                         </View>
//                     }
//                 />
//             )}

//             {/* Write Review Modal */}
//             <Modal visible={modalVisible} animationType="slide" transparent>
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.modal}>
//                         <View style={styles.modalHeader}>
//                             <Text style={styles.modalTitle}>Write a Review</Text>
//                             <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
//                                 <Ionicons name="close" size={20} color="#374151" />
//                             </TouchableOpacity>
//                         </View>

//                         <ScrollView showsVerticalScrollIndicator={false}>
//                             {/* Company Selection */}
//                             <Text style={styles.fieldLabel}>Select Company *</Text>
//                             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
//                                 <View style={{ flexDirection: "row", gap: 8 }}>
//                                     {COMPANIES.map((c) => (
//                                         <TouchableOpacity
//                                             key={c}
//                                             style={[styles.companyChip, form.companyName === c && styles.companyChipActive]}
//                                             onPress={() => setForm({ ...form, companyName: c })}
//                                         >
//                                             <Text style={[styles.companyChipText, form.companyName === c && styles.companyChipTextActive]}>{c}</Text>
//                                         </TouchableOpacity>
//                                     ))}
//                                 </View>
//                             </ScrollView>

//                             {/* Rating */}
//                             <Text style={styles.fieldLabel}>Overall Rating *</Text>
//                             <View style={styles.ratingRow}>
//                                 <StarRating rating={form.rating} onRate={(r) => setForm({ ...form, rating: r })} />
//                                 <Text style={styles.ratingLabel}>
//                                     {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][form.rating] || "Tap to rate"}
//                                 </Text>
//                             </View>

//                             {/* Category */}
//                             <Text style={styles.fieldLabel}>Category</Text>
//                             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
//                                 <View style={{ flexDirection: "row", gap: 8 }}>
//                                     {CATEGORIES.map((c) => (
//                                         <TouchableOpacity
//                                             key={c}
//                                             style={[styles.categoryChip, form.category === c && styles.categoryChipActive]}
//                                             onPress={() => setForm({ ...form, category: c })}
//                                         >
//                                             <Text style={[styles.categoryChipText, form.category === c && styles.categoryChipTextActive]}>{c}</Text>
//                                         </TouchableOpacity>
//                                     ))}
//                                 </View>
//                             </ScrollView>

//                             {/* Comment */}
//                             <Text style={styles.fieldLabel}>Your Review *</Text>
//                             <TextInput
//                                 value={form.comment}
//                                 onChangeText={(t) => setForm({ ...form, comment: t })}
//                                 placeholder="Describe your internship experience honestly. What did you learn? How was the work culture? Would you recommend it?"
//                                 multiline
//                                 numberOfLines={5}
//                                 style={styles.commentInput}
//                                 placeholderTextColor="#9CA3AF"
//                                 textAlignVertical="top"
//                             />
//                             <Text style={styles.charCount}>{form.comment.length} chars (min 20)</Text>

//                             {/* Anonymous Toggle */}
//                             <TouchableOpacity
//                                 style={styles.anonymousRow}
//                                 onPress={() => setForm({ ...form, isAnonymous: !form.isAnonymous })}
//                             >
//                                 <View style={[styles.checkbox, form.isAnonymous && styles.checkboxActive]}>
//                                     {form.isAnonymous && <MaterialCommunityIcons name="check" size={14} color="#fff" />}
//                                 </View>
//                                 <View style={{ marginLeft: 10 }}>
//                                     <Text style={styles.anonymousLabel}>Post Anonymously</Text>
//                                     <Text style={styles.anonymousSub}>Your name won't be shown publicly</Text>
//                                 </View>
//                             </TouchableOpacity>

//                             <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
//                                 {submitting ? (
//                                     <ActivityIndicator color="#fff" />
//                                 ) : (
//                                     <Text style={styles.submitBtnText}>Submit Review</Text>
//                                 )}
//                             </TouchableOpacity>
//                         </ScrollView>
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#F0F4F8" },
//     header: {
//         backgroundColor: "#193648",
//         padding: 20,
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//     },
//     headerTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
//     headerSub: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 },
//     addBtn: {
//         flexDirection: "row",
//         backgroundColor: "#F59E0B",
//         borderRadius: 12,
//         paddingHorizontal: 14,
//         paddingVertical: 10,
//         alignItems: "center",
//         gap: 6,
//     },
//     addBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
//     statsRow: {
//         flexDirection: "row",
//         backgroundColor: "#fff",
//         padding: 16,
//         borderBottomWidth: 1,
//         borderBottomColor: "#F3F4F6",
//     },
//     statBox: { flex: 1, alignItems: "center", paddingVertical: 8 },
//     statNum: { fontSize: 26, fontWeight: "800", color: "#193648" },
//     statLabel: { fontSize: 11, color: "#6B7280", marginTop: 4 },
//     feedbackCard: {
//         backgroundColor: "#fff",
//         borderRadius: 18,
//         padding: 18,
//         marginBottom: 12,
//         elevation: 2,
//     },
//     cardTop: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
//     companyInitial: {
//         width: 50,
//         height: 50,
//         borderRadius: 14,
//         backgroundColor: "#EEF2FF",
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     initialText: { fontSize: 20, fontWeight: "800", color: "#3730A3" },
//     companyName: { fontSize: 15, fontWeight: "700", color: "#111827" },
//     categoryText: { fontSize: 12, color: "#6B7280", marginTop: 2 },
//     commentText: { fontSize: 14, color: "#4B5563", lineHeight: 22, fontStyle: "italic", marginBottom: 10, borderLeftWidth: 3, borderLeftColor: "#E5E7EB", paddingLeft: 12 },
//     dateText: { fontSize: 11, color: "#9CA3AF" },
//     emptyState: { alignItems: "center", paddingTop: 60 },
//     emptyTitle: { fontSize: 18, fontWeight: "700", color: "#374151", marginTop: 16 },
//     emptySub: { fontSize: 14, color: "#9CA3AF", marginTop: 8, textAlign: "center", paddingHorizontal: 32 },
//     emptyBtn: { backgroundColor: "#193648", borderRadius: 14, paddingHorizontal: 24, paddingVertical: 12, marginTop: 20 },
//     emptyBtnText: { color: "#fff", fontWeight: "700" },
//     modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
//     modal: {
//         backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28,
//         padding: 24, maxHeight: "92%",
//     },
//     modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
//     modalTitle: { fontSize: 20, fontWeight: "800", color: "#111827" },
//     closeBtn: { backgroundColor: "#F3F4F6", borderRadius: 20, padding: 8 },
//     fieldLabel: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 10 },
//     companyChip: {
//         paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
//         backgroundColor: "#F3F4F6", borderWidth: 1, borderColor: "#E5E7EB",
//     },
//     companyChipActive: { backgroundColor: "#193648", borderColor: "#193648" },
//     companyChipText: { fontSize: 13, color: "#374151", fontWeight: "500" },
//     companyChipTextActive: { color: "#fff" },
//     ratingRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
//     ratingLabel: { fontSize: 14, color: "#374151", fontWeight: "600" },
//     categoryChip: {
//         paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
//         backgroundColor: "#F3F4F6", borderWidth: 1, borderColor: "#E5E7EB",
//     },
//     categoryChipActive: { backgroundColor: "#7C3AED", borderColor: "#7C3AED" },
//     categoryChipText: { fontSize: 12, color: "#374151" },
//     categoryChipTextActive: { color: "#fff" },
//     commentInput: {
//         borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 14,
//         padding: 14, fontSize: 14, color: "#111827",
//         backgroundColor: "#F9FAFB", minHeight: 130, marginBottom: 4,
//     },
//     charCount: { fontSize: 11, color: "#9CA3AF", marginBottom: 16, textAlign: "right" },
//     anonymousRow: { flexDirection: "row", alignItems: "center", marginBottom: 24, backgroundColor: "#F9FAFB", padding: 14, borderRadius: 14 },
//     checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: "#D1D5DB", justifyContent: "center", alignItems: "center" },
//     checkboxActive: { backgroundColor: "#193648", borderColor: "#193648" },
//     anonymousLabel: { fontSize: 14, fontWeight: "600", color: "#111827" },
//     anonymousSub: { fontSize: 12, color: "#6B7280", marginTop: 2 },
//     submitBtn: { backgroundColor: "#193648", borderRadius: 16, padding: 18, alignItems: "center", marginBottom: 20 },
//     submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
// });

// export default FeedbackScreen;



// import { CONSTANT } from "@/constants/constant";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useFocusEffect } from "@react-navigation/native";
// import axios from "axios";
// import React, { useCallback, useState } from "react";
// import {
//     ActivityIndicator,
//     Alert,
//     FlatList,
//     Modal,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
//     SafeAreaView,
//     useWindowDimensions,
//     StatusBar,
//     Platform,
// } from "react-native";

// const CATEGORIES = ["Overall", "Internship", "Culture", "Mentorship", "Work Environment"];
// const COMPANIES = ["TechNest Solutions", "DataSphere AI", "AppForge Pakistan", "SecureNet Corp", "PixelCraft Studio", "Other"];

// const COLORS = {
//     primary: "#193648",
//     accent: "#193648",
//     warning: "#FBBF24",
//     danger: "#EF4444",
//     background: "#F1F5F9",
//     white: "#FFFFFF",
//     textPrimary: "#1E293B",
//     textSecondary: "#64748B",
//     border: "#E2E8F0",
// };

// const StarRating = ({ rating, onRate, size = 22 }: any) => (
//     <View style={styles.starRow}>
//         {[1, 2, 3, 4, 5].map((star) => (
//             <TouchableOpacity 
//                 key={star} 
//                 onPress={() => onRate?.(star)}
//                 activeOpacity={0.7}
//             >
//                 <MaterialCommunityIcons
//                     name={star <= rating ? "star" : "star-outline"}
//                     size={size}
//                     color={star <= rating ? COLORS.warning : "#CBD5E1"}
//                 />
//             </TouchableOpacity>
//         ))}
//     </View>
// );

// export default function FeedbackScreen() {
//     const { width } = useWindowDimensions();
//     const [data, setData] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [modal, setModal] = useState(false);
//     const [detailModal, setDetailModal] = useState(false);
//     const [selected, setSelected] = useState<any>(null);
//     const [editMode, setEditMode] = useState(false);
//     const [submitting, setSubmitting] = useState(false);

//     const [form, setForm] = useState({
//         companyName: "",
//         rating: 0,
//         category: "Overall",
//         comment: "",
//         isAnonymous: false,
//     });

//     useFocusEffect(
//         useCallback(() => {
//             fetchData();
//         }, [])
//     );

//     const fetchData = async () => {
//         try {
//             const email = await AsyncStorage.getItem("studentEmail");
//             if (!email) return;
//             const res = await axios.get(`${CONSTANT.API_BASE_URL}/api/feedback/student/${email}`);
//             setData(res.data);
//         } catch (e) {
//             console.log(e);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const resetForm = () => {
//         setForm({ companyName: "", rating: 0, category: "Overall", comment: "", isAnonymous: false });
//         setEditMode(false);
//         setSelected(null);
//     };

//     const openSubmitModal = () => {
//         resetForm();
//         setModal(true);
//     };

//     const editFeedback = (item: any) => {
//         setForm({
//             companyName: item.companyName,
//             rating: item.rating,
//             category: item.category,
//             comment: item.comment,
//             isAnonymous: item.isAnonymous,
//         });
//         setSelected(item);
//         setEditMode(true);
//         setModal(true);
//     };

//     const deleteFeedback = async (id: string) => {
//         Alert.alert("Delete Review", "Are you sure you want to remove this feedback permanently?", [
//             { text: "Cancel", style: "cancel" },
//             {
//                 text: "Delete",
//                 style: "destructive",
//                 onPress: async () => {
//                     try {
//                         await axios.delete(`${CONSTANT.API_BASE_URL}/api/feedback/${id}`);
//                         fetchData();
//                     } catch (e) {
//                         Alert.alert("Error deleting review");
//                     }
//                 },
//             },
//         ]);
//     };

//     const submit = async () => {
//         if (!form.companyName) return Alert.alert("Required", "Please select a company");
//         if (!form.rating) return Alert.alert("Required", "Please provide a rating");
//         if (form.comment.length < 10) return Alert.alert("Short Comment", "Tell us a bit more (min 10 chars)");

//         setSubmitting(true);
//         try {
//             const email = await AsyncStorage.getItem("studentEmail");
//             if (editMode && selected?._id) {
//                 await axios.put(`${CONSTANT.API_BASE_URL}/api/feedback/${selected._id}`, { ...form, studentEmail: email });
//             } else {
//                 await axios.post(`${CONSTANT.API_BASE_URL}/api/feedback/submit`, { studentEmail: email, ...form });
//             }
//             setModal(false);
//             fetchData();
//         } catch (e) {
//             Alert.alert("Error", "Could not submit your review");
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const Card = ({ item }: any) => (
//         <TouchableOpacity
//             activeOpacity={0.8}
//             onPress={() => { setSelected(item); setDetailModal(true); }}
//             style={styles.card}
//         >
//             <View style={styles.cardHeader}>
//                 <View style={styles.avatar}>
//                     <Text style={styles.avatarText}>{item.companyName?.charAt(0)}</Text>
//                 </View>
//                 <View style={{ flex: 1, marginLeft: 12 }}>
//                     <Text style={styles.company} numberOfLines={1}>
//                         {item.isAnonymous ? "Anonymous User" : item.companyName}
//                     </Text>
//                     <Text style={styles.categoryBadge}>{item.category}</Text>
//                 </View>
//                 <StarRating rating={item.rating} size={16} />
//             </View>

//             <Text style={styles.comment} numberOfLines={2}>"{item.comment}"</Text>

//             <View style={styles.cardFooter}>
//                 <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
//                 <View style={styles.actions}>
//                     <TouchableOpacity onPress={() => editFeedback(item)} style={styles.iconBtn}>
//                         <Ionicons name="pencil" size={18} color={COLORS.accent} />
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => deleteFeedback(item._id)} style={styles.iconBtn}>
//                         <Ionicons name="trash" size={18} color={COLORS.danger} />
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </TouchableOpacity>
//     );

//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar barStyle="light-content" />
            
//             {/* HEADER */}
//             <View style={styles.header}>
//                 <View>
//                     <Text style={styles.title}>Reviews Hub</Text>
//                     <Text style={styles.subtitle}>Insights from your peers</Text>
//                 </View>
//                 <TouchableOpacity style={styles.writeButton} onPress={openSubmitModal}>
//                     <Ionicons name="add-circle" size={20} color="#fff" />
//                     <Text style={styles.writeButtonText}>Review</Text>
//                 </TouchableOpacity>
//             </View>

//             {/* STATS BAR */}
//             <View style={styles.statsContainer}>
//                 <View style={styles.statBox}>
//                     <Text style={styles.statVal}>{data.length}</Text>
//                     <Text style={styles.statLab}>Total</Text>
//                 </View>
//                 <View style={[styles.statBox, styles.statDivider]}>
//                     <Text style={styles.statVal}>
//                         {data.length ? (data.reduce((a, b) => a + b.rating, 0) / data.length).toFixed(1) : "0"}
//                     </Text>
//                     <Text style={styles.statLab}>Avg Rating</Text>
//                 </View>
//                 <View style={styles.statBox}>
//                     <MaterialCommunityIcons name="shield-check" size={20} color={COLORS.accent} />
//                     <Text style={styles.statLab}>Verified</Text>
//                 </View>
//             </View>

//             {/* MAIN LIST */}
//             {loading ? (
//                 <View style={styles.center}>
//                     <ActivityIndicator size="large" color={COLORS.primary} />
//                 </View>
//             ) : data.length === 0 ? (
//                 <View style={styles.center}>
//                     <Ionicons name="chatbox-ellipses-outline" size={60} color="#CBD5E1" />
//                     <Text style={styles.emptyText}>No feedback yet. Be the first to write one!</Text>
//                 </View>
//             ) : (
//                 <FlatList
//                     data={data}
//                     keyExtractor={(i) => i._id}
//                     renderItem={({ item }) => <Card item={item} />}
//                     contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
//                     showsVerticalScrollIndicator={false}
//                 />
//             )}

//             {/* WRITE/EDIT MODAL */}
//             <Modal visible={modal} animationType="slide" transparent>
//                 <View style={styles.modalOverlay}>
//                     <View style={[styles.modalContent, { height: '80%' }]}>
//                         <View style={styles.modalHeader}>
//                             <Text style={styles.modalTitle}>{editMode ? "Update Review" : "Share Experience"}</Text>
//                             <TouchableOpacity onPress={() => setModal(false)}>
//                                 <Ionicons name="close" size={24} color={COLORS.textPrimary} />
//                             </TouchableOpacity>
//                         </View>

//                         <ScrollView showsVerticalScrollIndicator={false}>
//                             <Text style={styles.inputLabel}>Select Company</Text>
//                             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipGroup}>
//                                 {COMPANIES.map((c) => (
//                                     <TouchableOpacity
//                                         key={c}
//                                         style={[styles.chip, form.companyName === c && styles.chipActive]}
//                                         onPress={() => setForm({ ...form, companyName: c })}
//                                     >
//                                         <Text style={[styles.chipText, form.companyName === c && styles.chipTextActive]}>{c}</Text>
//                                     </TouchableOpacity>
//                                 ))}
//                             </ScrollView>

//                             <Text style={styles.inputLabel}>Rate your experience</Text>
//                             <View style={styles.ratingPicker}>
//                                 <StarRating
//                                     rating={form.rating}
//                                     onRate={(r: number) => setForm({ ...form, rating: r })}
//                                     size={35}
//                                 />
//                             </View>

//                             <Text style={styles.inputLabel}>Write your comment</Text>
//                             <TextInput
//                                 style={styles.textArea}
//                                 multiline
//                                 numberOfLines={5}
//                                 value={form.comment}
//                                 onChangeText={(t) => setForm({ ...form, comment: t })}
//                                 placeholder="What was good? What could be improved?"
//                                 textAlignVertical="top"
//                             />

//                             <TouchableOpacity 
//                                 style={[styles.mainButton, submitting && { opacity: 0.7 }]} 
//                                 onPress={submit}
//                                 disabled={submitting}
//                             >
//                                 {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.mainButtonText}>{editMode ? "Save Changes" : "Post Review"}</Text>}
//                             </TouchableOpacity>
//                         </ScrollView>
//                     </View>
//                 </View>
//             </Modal>

//             {/* DETAIL MODAL */}
//             <Modal visible={detailModal} animationType="fade" transparent>
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.modalContent}>
//                         {selected && (
//                             <>
//                                 <View style={styles.modalHeader}>
//                                     <Text style={styles.modalTitle}>Review Detail</Text>
//                                     <TouchableOpacity onPress={() => setDetailModal(false)}>
//                                         <Ionicons name="close" size={24} color={COLORS.textPrimary} />
//                                     </TouchableOpacity>
//                                 </View>
//                                 <Text style={styles.detailCompany}>{selected.companyName}</Text>
//                                 <View style={{ marginVertical: 10 }}>
//                                     <StarRating rating={selected.rating} />
//                                 </View>
//                                 <View style={styles.detailCommentBox}>
//                                     <Text style={styles.detailCommentText}>{selected.comment}</Text>
//                                 </View>
//                                 <Text style={styles.detailDate}>Posted on {new Date(selected.createdAt).toDateString()}</Text>
//                                 <TouchableOpacity style={styles.closeBtn} onPress={() => setDetailModal(false)}>
//                                     <Text style={styles.closeBtnText}>Done</Text>
//                                 </TouchableOpacity>
//                             </>
//                         )}
//                     </View>
//                 </View>
//             </Modal>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: COLORS.background },
//     center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
    
//     header: {
//         backgroundColor: COLORS.primary,
//         paddingHorizontal: 20,
//         paddingBottom: 25,
//         paddingTop: Platform.OS === 'android' ? 40 : 10,
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         borderBottomLeftRadius: 30,
//         borderBottomRightRadius: 30,
//     },
//     title: { color: "#fff", fontSize: 24, fontWeight: "800" },
//     subtitle: { color: "#CBD5E1", fontSize: 13, marginTop: 2 },
    
//     writeButton: {
//         flexDirection: "row",
//         backgroundColor: COLORS.accent,
//         paddingHorizontal: 16,
//         paddingVertical: 10,
//         borderRadius: 20,
//         alignItems: "center",
//         gap: 6,
//         elevation: 5,
//         shadowColor: COLORS.accent,
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.3,
//         shadowRadius: 5,
//     },
//     writeButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },

//     statsContainer: {
//         flexDirection: "row",
//         backgroundColor: COLORS.white,
//         marginHorizontal: 20,
//         marginTop: -20,
//         borderRadius: 20,
//         paddingVertical: 15,
//         elevation: 4,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 10,
//     },
//     statBox: { flex: 1, alignItems: "center" },
//     statDivider: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: COLORS.border },
//     statVal: { fontSize: 18, fontWeight: "800", color: COLORS.textPrimary },
//     statLab: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2, fontWeight: "600" },

//     card: {
//         backgroundColor: COLORS.white,
//         marginBottom: 16,
//         padding: 16,
//         borderRadius: 24,
//         elevation: 3,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.05,
//         shadowRadius: 8,
//     },
//     cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
//     avatar: {
//         width: 45,
//         height: 45,
//         borderRadius: 15,
//         backgroundColor: "#E0F2FE",
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     avatarText: { fontWeight: "bold", color: COLORS.accent, fontSize: 18 },
//     company: { fontSize: 16, fontWeight: "700", color: COLORS.textPrimary },
//     categoryBadge: {
//         fontSize: 10,
//         color: COLORS.accent,
//         backgroundColor: "#EFF6FF",
//         alignSelf: 'flex-start',
//         paddingHorizontal: 8,
//         paddingVertical: 2,
//         borderRadius: 6,
//         marginTop: 2,
//         fontWeight: '600'
//     },
//     comment: { fontSize: 14, color: "#475569", lineHeight: 20, fontStyle: 'italic' },
//     cardFooter: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginTop: 15,
//         paddingTop: 12,
//         borderTopWidth: 1,
//         borderTopColor: "#F1F5F9",
//     },
//     date: { fontSize: 12, color: COLORS.textSecondary },
//     actions: { flexDirection: "row", gap: 10 },
//     iconBtn: { padding: 6, backgroundColor: "#F8FAFC", borderRadius: 10 },

//     modalOverlay: {
//         flex: 1,
//         backgroundColor: "rgba(15, 23, 42, 0.6)",
//         justifyContent: "flex-end",
//     },
//     modalContent: {
//         backgroundColor: COLORS.white,
//         borderTopLeftRadius: 35,
//         borderTopRightRadius: 35,
//         padding: 24,
//         maxHeight: "90%",
//     },
//     modalHeader: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: 20,
//     },
//     modalTitle: { fontSize: 20, fontWeight: "800", color: COLORS.textPrimary },
//     inputLabel: { fontSize: 14, fontWeight: "700", color: COLORS.textPrimary, marginTop: 20, marginBottom: 10 },
//     chipGroup: { flexDirection: "row", marginBottom: 5 },
//     chip: {
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//         borderRadius: 12,
//         backgroundColor: "#F1F5F9",
//         marginRight: 10,
//         borderWidth: 1,
//         borderColor: "#E2E8F0",
//     },
//     chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
//     chipText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: "600" },
//     chipTextActive: { color: "#fff" },
//     ratingPicker: { alignItems: "center", paddingVertical: 10 },
//     textArea: {
//         backgroundColor: "#F8FAFC",
//         borderRadius: 16,
//         padding: 15,
//         fontSize: 15,
//         color: COLORS.textPrimary,
//         borderWidth: 1,
//         borderColor: COLORS.border,
//         minHeight: 120,
//     },
//     mainButton: {
//         backgroundColor: COLORS.primary,
//         paddingVertical: 16,
//         borderRadius: 16,
//         alignItems: "center",
//         marginTop: 30,
//         marginBottom: 20,
//     },
//     mainButtonText: { color: "#fff", fontWeight: "800", fontSize: 16 },
    
//     // Detail styles
//     detailCompany: { fontSize: 22, fontWeight: "800", color: COLORS.primary },
//     detailCommentBox: {
//         backgroundColor: "#F8FAFC",
//         padding: 20,
//         borderRadius: 20,
//         marginVertical: 15,
//         borderLeftWidth: 4,
//         borderLeftColor: COLORS.accent
//     },
//     detailCommentText: { fontSize: 16, color: COLORS.textPrimary, lineHeight: 24 },
//     detailDate: { fontSize: 13, color: COLORS.textSecondary, textAlign: "center" },
//     closeBtn: {
//         backgroundColor: "#F1F5F9",
//         padding: 15,
//         borderRadius: 15,
//         alignItems: "center",
//         marginTop: 20
//     },
//     closeBtnText: { fontWeight: "700", color: COLORS.textPrimary },
//     emptyText: { marginTop: 15, color: COLORS.textSecondary, textAlign: 'center', fontSize: 15 },
//     starRow: { flexDirection: "row", gap: 2 },
// });










import { CONSTANT } from "@/constants/constant";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    SafeAreaView,
    useWindowDimensions,
    StatusBar,
    Platform,
    KeyboardAvoidingView,
} from "react-native";

const CATEGORIES = ["Overall", "Internship", "Culture", "Mentorship", "Work Environment"];
const COMPANIES = ["TechNest Solutions", "DataSphere AI", "AppForge Pakistan", "SecureNet Corp", "PixelCraft Studio", "Other"];

const COLORS = {
    primary: "#193648", // Aapka Deep Blue
    accent: "#2D5A73", // Primary ka light version
    warning: "#FBBF24",
    danger: "#EF4444",
    background: "#F8FAFC",
    white: "#FFFFFF",
    textPrimary: "#0F172A",
    textSecondary: "#64748B",
    border: "#E2E8F0",
};

const StarRating = ({ rating, onRate, size = 22 }: any) => (
    <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity 
                key={star} 
                onPress={() => onRate?.(star)}
                activeOpacity={0.7}
            >
                <MaterialCommunityIcons
                    name={star <= rating ? "star" : "star-outline"}
                    size={size}
                    color={star <= rating ? COLORS.warning : "#CBD5E1"}
                />
            </TouchableOpacity>
        ))}
    </View>
);

export default function FeedbackScreen() {
    const { width } = useWindowDimensions();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    const [selected, setSelected] = useState<any>(null);
    const [editMode, setEditMode] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        companyName: "",
        rating: 0,
        category: "Overall",
        comment: "",
        isAnonymous: false,
    });

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const fetchData = async () => {
        try {
            const email = await AsyncStorage.getItem("studentEmail");
            if (!email) return;
            const res = await axios.get(`${CONSTANT.API_BASE_URL}/api/feedback/student/${email}`);
            setData(res.data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm({ companyName: "", rating: 0, category: "Overall", comment: "", isAnonymous: false });
        setEditMode(false);
        setSelected(null);
    };

    const openSubmitModal = () => {
        resetForm();
        setModal(true);
    };

    const editFeedback = (item: any) => {
        setForm({
            companyName: item.companyName,
            rating: item.rating,
            category: item.category,
            comment: item.comment,
            isAnonymous: item.isAnonymous,
        });
        setSelected(item);
        setEditMode(true);
        setModal(true);
    };

    const deleteFeedback = async (id: string) => {
        Alert.alert("Delete Review", "Are you sure you want to remove this feedback permanently?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        await axios.delete(`${CONSTANT.API_BASE_URL}/api/feedback/${id}`);
                        fetchData();
                    } catch (e) {
                        Alert.alert("Error deleting review");
                    }
                },
            },
        ]);
    };

    const submit = async () => {
        if (!form.companyName) return Alert.alert("Required", "Please select a company");
        if (!form.rating) return Alert.alert("Required", "Please provide a rating");
        if (form.comment.length < 10) return Alert.alert("Short Comment", "Tell us a bit more (min 10 chars)");

        setSubmitting(true);
        try {
            const email = await AsyncStorage.getItem("studentEmail");
            if (editMode && selected?._id) {
                await axios.put(`${CONSTANT.API_BASE_URL}/api/feedback/${selected._id}`, { ...form, studentEmail: email });
            } else {
                await axios.post(`${CONSTANT.API_BASE_URL}/api/feedback/submit`, { studentEmail: email, ...form });
            }
            setModal(false);
            fetchData();
        } catch (e) {
            Alert.alert("Error", "Could not submit your review");
        } finally {
            setSubmitting(false);
        }
    };

    const Card = ({ item }: any) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => { setSelected(item); setDetailModal(true); }}
            style={styles.card}
        >
            <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.companyName?.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.company} numberOfLines={1}>
                        {item.companyName}
                    </Text>
                    <Text style={styles.categoryBadge}>{item.category}</Text>
                </View>
                <StarRating rating={item.rating} size={14} />
            </View>

            <Text style={styles.comment} numberOfLines={3}>"{item.comment}"</Text>

            <View style={styles.cardFooter}>
                <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => editFeedback(item)} style={[styles.iconBtn, { backgroundColor: '#F0F9FF' }]}>
                        <Ionicons name="pencil" size={16} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteFeedback(item._id)} style={[styles.iconBtn, { backgroundColor: '#FEF2F2' }]}>
                        <Ionicons name="trash" size={16} color={COLORS.danger} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
            
            {/* ENHANCED HEADER */}
            <View style={styles.header}>
                <SafeAreaView>
                    <View style={styles.headerContent}>
                        <View>
                            <Text style={styles.title}>My Feedbacks</Text>
                            <Text style={styles.subtitle}>Help others with your reviews</Text>
                        </View>
                        <TouchableOpacity style={styles.writeButton} onPress={openSubmitModal}>
                            <Ionicons name="create-outline" size={20} color={COLORS.primary} />
                            <Text style={styles.writeButtonText}>Write</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>

            {/* STATS BAR (Wider and Cleaner) */}
            <View style={[styles.statsContainer, { width: width - 40 }]}>
                <View style={styles.statBox}>
                    <Text style={styles.statVal}>{data.length}</Text>
                    <Text style={styles.statLab}>Reviews</Text>
                </View>
                <View style={[styles.statBox, styles.statDivider]}>
                    <Text style={styles.statVal}>
                        {data.length ? (data.reduce((a, b) => a + b.rating, 0) / data.length).toFixed(1) : "0"}
                    </Text>
                    <Text style={styles.statLab}>Avg Rating</Text>
                </View>
                <View style={styles.statBox}>
                    <MaterialCommunityIcons name="shield-check" size={20} color={COLORS.primary} />
                    <Text style={styles.statLab}>Verified</Text>
                </View>
            </View>

            {/* MAIN LIST */}
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : data.length === 0 ? (
                <View style={styles.center}>
                    <Ionicons name="chatbox-ellipses-outline" size={80} color="#CBD5E1" />
                    <Text style={styles.emptyText}>No reviews submitted yet.</Text>
                    <TouchableOpacity style={styles.emptyBtn} onPress={openSubmitModal}>
                        <Text style={{ color: COLORS.white, fontWeight: '700' }}>Post Your First Review</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(i) => i._id}
                    renderItem={({ item }) => <Card item={item} />}
                    contentContainerStyle={{ padding: 20, paddingTop: 40, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* MODAL SECTION (Same logic, improved styling) */}
            <Modal visible={modal} animationType="slide" transparent>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{editMode ? "Update Review" : "Share Experience"}</Text>
                            <TouchableOpacity onPress={() => setModal(false)} style={styles.closeIcon}>
                                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.inputLabel}>Choose Company</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipGroup}>
                                {COMPANIES.map((c) => (
                                    <TouchableOpacity
                                        key={c}
                                        style={[styles.chip, form.companyName === c && styles.chipActive]}
                                        onPress={() => setForm({ ...form, companyName: c })}
                                    >
                                        <Text style={[styles.chipText, form.companyName === c && styles.chipTextActive]}>{c}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <Text style={styles.inputLabel}>Rating</Text>
                            <View style={styles.ratingPicker}>
                                <StarRating
                                    rating={form.rating}
                                    onRate={(r: number) => setForm({ ...form, rating: r })}
                                    size={40}
                                />
                            </View>

                            <Text style={styles.inputLabel}>Detailed Comment</Text>
                            <TextInput
                                style={styles.textArea}
                                multiline
                                numberOfLines={5}
                                value={form.comment}
                                onChangeText={(t) => setForm({ ...form, comment: t })}
                                placeholder="Share your experience (at least 10 characters)..."
                                placeholderTextColor="#94A3B8"
                                textAlignVertical="top"
                            />

                            <TouchableOpacity 
                                style={[styles.mainButton, submitting && { opacity: 0.7 }]} 
                                onPress={submit}
                                disabled={submitting}
                            >
                                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.mainButtonText}>{editMode ? "Update Review" : "Publish Review"}</Text>}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* DETAIL MODAL (Improved) */}
            <Modal visible={detailModal} animationType="fade" transparent>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { maxHeight: '60%' }]}>
                        {selected && (
                            <>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Feedback Detail</Text>
                                    <TouchableOpacity onPress={() => setDetailModal(false)}>
                                        <Ionicons name="close-circle" size={28} color={COLORS.textSecondary} />
                                    </TouchableOpacity>
                                </View>
                                <ScrollView>
                                    <View style={styles.detailHeader}>
                                        <Text style={styles.detailCompany}>{selected.companyName}</Text>
                                        <StarRating rating={selected.rating} />
                                    </View>
                                    <View style={styles.detailCommentBox}>
                                        <Text style={styles.detailCommentText}>{selected.comment}</Text>
                                    </View>
                                    <Text style={styles.detailDate}>Posted on {new Date(selected.createdAt).toDateString()}</Text>
                                    <TouchableOpacity style={styles.mainButton} onPress={() => setDetailModal(false)}>
                                        <Text style={styles.mainButtonText}>Back to List</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
    
    // Header Style Updated
    header: {
        backgroundColor: COLORS.primary,
        paddingBottom: 50,
        paddingTop: Platform.OS === 'android' ? 20 : 10,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        zIndex: 1,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
        marginTop: 10,
    },
    title: { color: "#fff", fontSize: 26, fontWeight: "800", letterSpacing: -0.5 },
    subtitle: { color: "#94A3B8", fontSize: 14, marginTop: 4 },
    
    writeButton: {
        flexDirection: "row",
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 14,
        alignItems: "center",
        gap: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    writeButtonText: { color: COLORS.primary, fontWeight: "700", fontSize: 15 },

    // Stats Bar Updated
    statsContainer: {
        flexDirection: "row",
        backgroundColor: COLORS.white,
        alignSelf: 'center',
        marginTop: -25,
        borderRadius: 24,
        paddingVertical: 18,
        elevation: 8,
        shadowColor: "#193648",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        zIndex: 10,
    },
    statBox: { flex: 1, alignItems: "center", justifyContent: 'center' },
    statDivider: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: COLORS.border },
    statVal: { fontSize: 20, fontWeight: "800", color: COLORS.primary },
    statLab: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2, fontWeight: "600" },

    // Card Style Updated
    card: {
        backgroundColor: COLORS.white,
        marginBottom: 20,
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
    },
    cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: "#F1F5F9",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: '#E2E8F0'
    },
    avatarText: { fontWeight: "800", color: COLORS.primary, fontSize: 20 },
    company: { fontSize: 17, fontWeight: "700", color: COLORS.textPrimary },
    categoryBadge: {
        fontSize: 11,
        color: COLORS.primary,
        backgroundColor: "#F0F9FF",
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 8,
        marginTop: 4,
        fontWeight: '600',
        overflow: 'hidden'
    },
    comment: { fontSize: 15, color: "#475569", lineHeight: 22, fontStyle: 'italic', marginBottom: 5 },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: "#F8FAFC",
    },
    date: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500' },
    actions: { flexDirection: "row", gap: 12 },
    iconBtn: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },

    // Modal Styling Updated
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(15, 23, 42, 0.7)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        padding: 24,
        width: '100%',
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 25,
    },
    modalTitle: { fontSize: 22, fontWeight: "800", color: COLORS.textPrimary },
    closeIcon: { backgroundColor: '#F1F5F9', padding: 4, borderRadius: 10 },
    inputLabel: { fontSize: 15, fontWeight: "700", color: COLORS.textPrimary, marginTop: 15, marginBottom: 12 },
    chipGroup: { flexDirection: "row", marginBottom: 10 },
    chip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: "#F8FAFC",
        marginRight: 10,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    chipText: { fontSize: 14, color: COLORS.textSecondary, fontWeight: "600" },
    chipTextActive: { color: "#fff" },
    ratingPicker: { alignItems: "center", paddingVertical: 15, backgroundColor: '#F8FAFC', borderRadius: 20 },
    textArea: {
        backgroundColor: "#F8FAFC",
        borderRadius: 18,
        padding: 18,
        fontSize: 16,
        color: COLORS.textPrimary,
        borderWidth: 1,
        borderColor: COLORS.border,
        minHeight: 130,
        marginBottom: 20,
    },
    mainButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 18,
        borderRadius: 18,
        alignItems: "center",
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 5,
        marginTop: 10
    },
    mainButtonText: { color: "#fff", fontWeight: "800", fontSize: 16 },
    
    // Detail Styling
    detailHeader: { alignItems: 'center', marginBottom: 20 },
    detailCompany: { fontSize: 24, fontWeight: "800", color: COLORS.primary, marginBottom: 8 },
    detailCommentBox: {
        backgroundColor: "#F8FAFC",
        padding: 25,
        borderRadius: 24,
        marginVertical: 10,
        borderLeftWidth: 6,
        borderLeftColor: COLORS.primary
    },
    detailCommentText: { fontSize: 17, color: COLORS.textPrimary, lineHeight: 28, fontStyle: 'italic' },
    detailDate: { fontSize: 13, color: COLORS.textSecondary, textAlign: "center", marginVertical: 15 },
    
    emptyText: { marginTop: 15, color: COLORS.textSecondary, textAlign: 'center', fontSize: 16 },
    emptyBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, marginTop: 20 },
    starRow: { flexDirection: "row", gap: 4 },
});