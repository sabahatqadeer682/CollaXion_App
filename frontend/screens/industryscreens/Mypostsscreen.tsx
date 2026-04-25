// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { LinearGradient } from "expo-linear-gradient";
// import * as ImagePicker from "expo-image-picker";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//   ActivityIndicator, Alert, Animated, Image, KeyboardAvoidingView,
//   Modal, Platform, RefreshControl, ScrollView,
//   StyleSheet, Text, TextInput, TouchableOpacity, View,
// } from "react-native";
// import { C, useUser } from "./shared";

// const TYPE_CONFIG: Record<string, { bg: string; text: string; dot: string; grad: readonly [string, string] }> = {
//   Internship: { bg: "#E8F4FF", text: "#0066CC", dot: "#2196F3", grad: ["#0066CC", "#004999"] },
//   Project:    { bg: "#F3E5F5", text: "#6A1B9A", dot: "#9C27B0", grad: ["#6A1B9A", "#4A148C"] },
//   Workshop:   { bg: "#FFF3E0", text: "#E65100", dot: "#FF9800", grad: ["#E65100", "#BF360C"] },
// };

// const SKILL_SUGGESTIONS = [
//   "React Native", "Python", "UI/UX", "Machine Learning", "Data Science",
//   "JavaScript", "Node.js", "Flutter", "TensorFlow", "SQL", "Figma", "C++",
// ];

// // ── Time ago helper ──────────────────────────────────────────
// const timeAgo = (iso: string) => {
//   const diff = Date.now() - new Date(iso).getTime();
//   const mins  = Math.floor(diff / 60000);
//   const hours = Math.floor(diff / 3600000);
//   const days  = Math.floor(diff / 86400000);
//   if (mins < 1)   return "Just now";
//   if (mins < 60)  return `${mins}m ago`;
//   if (hours < 24) return `${hours}h ago`;
//   if (days < 7)   return `${days}d ago`;
//   return new Date(iso).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
// };

// // ── Edit Modal ───────────────────────────────────────────────
// function EditModal({ visible, post, onClose, onSave, loading }: any) {
//   const [title, setTitle]       = useState(post?.title || "");
//   const [desc, setDesc]         = useState(post?.description || "");
//   const [stipend, setStipend]   = useState(post?.stipend || "");
//   const [duration, setDuration] = useState(post?.duration || "");
//   const [seats, setSeats]       = useState(post?.seats || "");
//   const [deadline, setDeadline] = useState(post?.deadline || "");
//   const [location, setLocation] = useState(post?.location || "");
//   const [mode, setMode]         = useState<"Onsite"|"Remote"|"Hybrid">(post?.mode || "Onsite");
//   const [skills, setSkills]     = useState<string[]>(post?.skills || []);
//   const [skillInput, setSkillInput] = useState("");
//   const [poster, setPoster]     = useState<string | null>(post?.poster || null);

//   useEffect(() => {
//     if (post) {
//       setTitle(post.title || "");
//       setDesc(post.description || "");
//       setStipend(post.stipend || "");
//       setDuration(post.duration || "");
//       setSeats(post.seats || "");
//       setDeadline(post.deadline || "");
//       setLocation(post.location || "");
//       setMode(post.mode || "Onsite");
//       setSkills(post.skills || []);
//       setPoster(post.poster || null);
//     }
//   }, [post]);

//   const pickImage = async () => {
//     const res = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.85, aspect: [16, 9],
//     });
//     if (!res.canceled) setPoster(res.assets[0].uri);
//   };

//   const addSkill = (s: string) => {
//     const sk = s.trim();
//     if (sk && !skills.includes(sk)) setSkills([...skills, sk]);
//     setSkillInput("");
//   };

//   const save = () => {
//     if (!title.trim() || !desc.trim()) {
//       Alert.alert("Required", "Title aur description zaroori hain.");
//       return;
//     }
//     onSave({ title, description: desc, stipend, duration, seats, deadline, location, mode, skills, poster });
//   };

//   const tc = TYPE_CONFIG[post?.type] || TYPE_CONFIG.Internship;

//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <View style={eS.overlay}>
//         <View style={eS.sheet}>
//           {/* Header */}
//           <LinearGradient colors={["#0A1628", "#0D2137"]} style={eS.sheetHead}>
//             <View style={eS.sheetHandleWrap}>
//               <View style={eS.sheetHandle} />
//             </View>
//             <View style={eS.sheetHeadRow}>
//               <View>
//                 <Text style={eS.sheetTitle}>Edit Post</Text>
//                 <View style={[eS.typePill, { backgroundColor: tc.bg }]}>
//                   <View style={[eS.typeDot, { backgroundColor: tc.dot }]} />
//                   <Text style={[eS.typePillTxt, { color: tc.text }]}>{post?.type}</Text>
//                 </View>
//               </View>
//               <TouchableOpacity onPress={onClose} style={eS.closeBtn}>
//                 <Ionicons name="close" size={20} color="#fff" />
//               </TouchableOpacity>
//             </View>
//           </LinearGradient>

//           <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
//             <ScrollView contentContainerStyle={eS.body} showsVerticalScrollIndicator={false}>

//               {/* Banner */}
//               <TouchableOpacity onPress={pickImage} style={eS.bannerWrap} activeOpacity={0.85}>
//                 {poster ? (
//                   <View style={{ position: "relative" }}>
//                     <Image source={{ uri: poster }} style={eS.bannerImg} />
//                     <TouchableOpacity style={eS.removeBanner} onPress={() => setPoster(null)}>
//                       <Ionicons name="close-circle" size={22} color="#fff" />
//                     </TouchableOpacity>
//                   </View>
//                 ) : (
//                   <LinearGradient colors={tc.grad} style={eS.bannerPlaceholder}>
//                     <Ionicons name="image-outline" size={28} color="rgba(255,255,255,0.6)" />
//                     <Text style={eS.bannerPlaceholderTxt}>Tap to change banner</Text>
//                   </LinearGradient>
//                 )}
//               </TouchableOpacity>

//               {/* Fields */}
//               <Text style={eS.label}>Title *</Text>
//               <TextInput style={eS.input} value={title} onChangeText={setTitle} placeholder="Post title" placeholderTextColor="#94A3B8" />

//               <Text style={eS.label}>Description *</Text>
//               <TextInput style={[eS.input, eS.textarea]} value={desc} onChangeText={setDesc}
//                 placeholder="Describe the opportunity..." placeholderTextColor="#94A3B8"
//                 multiline numberOfLines={4} textAlignVertical="top" />

//               <View style={eS.row}>
//                 <View style={{ flex: 1 }}>
//                   <Text style={eS.label}>Stipend / Fee</Text>
//                   <TextInput style={eS.input} value={stipend} onChangeText={setStipend} placeholder="PKR 25,000/mo" placeholderTextColor="#94A3B8" />
//                 </View>
//                 <View style={{ width: 10 }} />
//                 <View style={{ flex: 1 }}>
//                   <Text style={eS.label}>Duration</Text>
//                   <TextInput style={eS.input} value={duration} onChangeText={setDuration} placeholder="3 Months" placeholderTextColor="#94A3B8" />
//                 </View>
//               </View>

//               <View style={eS.row}>
//                 <View style={{ flex: 1 }}>
//                   <Text style={eS.label}>Seats</Text>
//                   <TextInput style={eS.input} value={seats} onChangeText={setSeats} placeholder="5" placeholderTextColor="#94A3B8" keyboardType="numeric" />
//                 </View>
//                 <View style={{ width: 10 }} />
//                 <View style={{ flex: 1 }}>
//                   <Text style={eS.label}>Deadline</Text>
//                   <TextInput style={eS.input} value={deadline} onChangeText={setDeadline} placeholder="30 Jun 2025" placeholderTextColor="#94A3B8" />
//                 </View>
//               </View>

//               <Text style={eS.label}>Location</Text>
//               <TextInput style={eS.input} value={location} onChangeText={setLocation} placeholder="City or Remote" placeholderTextColor="#94A3B8" />

//               <Text style={eS.label}>Work Mode</Text>
//               <View style={eS.modeRow}>
//                 {(["Onsite", "Remote", "Hybrid"] as const).map((m) => (
//                   <TouchableOpacity key={m} style={[eS.modeChip, mode === m && eS.modeChipActive]} onPress={() => setMode(m)}>
//                     <Text style={[eS.modeChipTxt, mode === m && eS.modeChipTxtActive]}>{m}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>

//               <Text style={eS.label}>Skills</Text>
//               <View style={eS.skillInputRow}>
//                 <TextInput style={[eS.input, { flex: 1, marginBottom: 0 }]} value={skillInput}
//                   onChangeText={setSkillInput} placeholder="Add a skill" placeholderTextColor="#94A3B8"
//                   onSubmitEditing={() => addSkill(skillInput)} />
//                 <TouchableOpacity style={eS.addSkillBtn} onPress={() => addSkill(skillInput)}>
//                   <Ionicons name="add" size={20} color="#fff" />
//                 </TouchableOpacity>
//               </View>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
//                 {SKILL_SUGGESTIONS.filter(s => !skills.includes(s)).map(s => (
//                   <TouchableOpacity key={s} onPress={() => addSkill(s)} style={eS.suggestionChip}>
//                     <Text style={eS.suggestionTxt}>+ {s}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//               {skills.length > 0 && (
//                 <View style={eS.selectedSkills}>
//                   {skills.map(s => (
//                     <View key={s} style={eS.selectedChip}>
//                       <Text style={eS.selectedChipTxt}>{s}</Text>
//                       <TouchableOpacity onPress={() => setSkills(skills.filter(x => x !== s))}>
//                         <Ionicons name="close-circle" size={16} color="#1D4ED8" />
//                       </TouchableOpacity>
//                     </View>
//                   ))}
//                 </View>
//               )}

//               <View style={{ height: 20 }} />
//             </ScrollView>
//           </KeyboardAvoidingView>

//           {/* Footer */}
//           <View style={eS.footer}>
//             <TouchableOpacity style={eS.cancelBtn} onPress={onClose}>
//               <Text style={eS.cancelTxt}>Cancel</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={eS.saveBtn} onPress={save} disabled={loading}>
//               {loading
//                 ? <ActivityIndicator color="#fff" size="small" />
//                 : <><Ionicons name="checkmark" size={18} color="#fff" /><Text style={eS.saveTxt}>Save Changes</Text></>
//               }
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// // ── Main Screen ──────────────────────────────────────────────
// export function MyPostsScreen() {
//   const nav = useNavigation<any>();
//   const { user, ax } = useUser();

//   const [posts, setPosts]         = useState<any[]>([]);
//   const [loading, setLoading]     = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [filter, setFilter]       = useState<"All"|"Internship"|"Project"|"Workshop">("All");
//   const [editPost, setEditPost]   = useState<any>(null);
//   const [editLoading, setEditLoading] = useState(false);
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   const fetchPosts = useCallback(async (showRefresh = false) => {
//     if (showRefresh) setRefreshing(true);
//     else setLoading(true);
//     try {
//       const headers = { "x-industry-id": user?._id, "x-company-name": user?.name };
//       const res = await ax().get("/api/industry/posts/mine", { headers });
//       setPosts(res.data || []);
//       Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
//     } catch (e) {
//       console.error("MyPosts fetch error:", e);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [user]);

//   useEffect(() => { fetchPosts(); }, [fetchPosts]);

//   const handleDelete = (post: any) => {
//     Alert.alert(
//       "Delete Post",
//       `"${post.title}" delete karna chahte hain?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete", style: "destructive",
//           onPress: async () => {
//             try {
//               const headers = { "x-industry-id": user?._id, "x-company-name": user?.name };
//               await ax().delete(`/api/industry/posts/${post._id}`, { headers });
//               setPosts(prev => prev.filter(p => p._id !== post._id));
//             } catch (e) {
//               Alert.alert("Error", "Delete nahi ho saka.");
//             }
//           }
//         }
//       ]
//     );
//   };

//   const handleEdit = async (data: any) => {
//     if (!editPost) return;
//     setEditLoading(true);
//     try {
//       const headers = { "x-industry-id": user?._id, "x-company-name": user?.name };
//       const res = await ax().put(`/api/industry/posts/${editPost._id}`, data, { headers });
//       setPosts(prev => prev.map(p => p._id === editPost._id ? res.data : p));
//       setEditPost(null);
//     } catch (e) {
//       Alert.alert("Error", "Update nahi ho saka.");
//     } finally {
//       setEditLoading(false);
//     }
//   };

//   const handleToggle = async (post: any) => {
//     try {
//       const headers = { "x-industry-id": user?._id, "x-company-name": user?.name };
//       const res = await ax().patch(`/api/industry/posts/${post._id}/toggle`, {}, { headers });
//       setPosts(prev => prev.map(p => p._id === post._id ? { ...p, isActive: res.data.isActive } : p));
//     } catch (e) {
//       Alert.alert("Error", "Toggle nahi ho saka.");
//     }
//   };

//   const filtered = filter === "All" ? posts : posts.filter(p => p.type === filter);

//   if (loading) {
//     return (
//       <View style={s.center}>
//         <ActivityIndicator size="large" color="#0066CC" />
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1, backgroundColor: "#F0F4F8" }}>
//       {/* Header */}
//       <LinearGradient colors={["#0A1628", "#0D2137"]} style={s.header}>
//         <TouchableOpacity onPress={() => nav.goBack()} style={s.backBtn}>
//           <Ionicons name="arrow-back" size={22} color="#fff" />
//         </TouchableOpacity>
//         <View style={{ flex: 1, marginLeft: 14 }}>
//           <Text style={s.headerTitle}>My Posts</Text>
//           <Text style={s.headerSub}>{posts.length} total · {filtered.length} showing</Text>
//         </View>
//         <TouchableOpacity style={s.newBtn} onPress={() => nav.navigate("PostOpportunity")}>
//           <Ionicons name="add" size={20} color="#fff" />
//           <Text style={s.newBtnTxt}>New</Text>
//         </TouchableOpacity>
//       </LinearGradient>

//       {/* Filter Tabs */}
//       <View style={s.filterBar}>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//           {(["All", "Internship", "Project", "Workshop"] as const).map(f => (
//             <TouchableOpacity key={f}
//               style={[s.filterChip, filter === f && s.filterChipActive]}
//               onPress={() => setFilter(f)}>
//               <Text style={[s.filterChipTxt, filter === f && s.filterChipTxtActive]}>{f}</Text>
//               {filter === f && (
//                 <View style={s.filterBadge}>
//                   <Text style={s.filterBadgeTxt}>
//                     {f === "All" ? posts.length : posts.filter(p => p.type === f).length}
//                   </Text>
//                 </View>
//               )}
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       <Animated.ScrollView
//         style={{ opacity: fadeAnim }}
//         contentContainerStyle={{ padding: 16, paddingBottom: 50 }}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={() => fetchPosts(true)} colors={["#0066CC"]} />
//         }
//         showsVerticalScrollIndicator={false}
//       >
//         {filtered.length === 0 ? (
//           <View style={s.empty}>
//             <LinearGradient colors={["#0066CC", "#004999"]} style={s.emptyIcon}>
//               <Ionicons name="newspaper-outline" size={32} color="#fff" />
//             </LinearGradient>
//             <Text style={s.emptyTitle}>Koi post nahi</Text>
//             <Text style={s.emptySub}>
//               {filter === "All" ? "Abhi tak koi post nahi ki" : `Koi ${filter} post nahi`}
//             </Text>
//             <TouchableOpacity style={s.emptyBtn} onPress={() => nav.navigate("PostOpportunity")}>
//               <Text style={s.emptyBtnTxt}>+ Post Karo</Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           filtered.map((post) => {
//             const tc = TYPE_CONFIG[post.type] || TYPE_CONFIG.Internship;
//             return (
//               <View key={post._id} style={[s.card, !post.isActive && s.cardInactive]}>

//                 {/* Inactive Banner */}
//                 {!post.isActive && (
//                   <View style={s.inactiveBanner}>
//                     <Ionicons name="eye-off-outline" size={13} color="#64748B" />
//                     <Text style={s.inactiveTxt}>Hidden from students</Text>
//                   </View>
//                 )}

//                 {/* Card Header */}
//                 <View style={s.cardHead}>
//                   <View style={s.avatar}>
//                     {user?.logo
//                       ? <Image source={{ uri: user.logo }} style={s.avatarImg} />
//                       : <Text style={s.avatarTxt}>
//                           {user?.name?.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase() || "CX"}
//                         </Text>
//                     }
//                   </View>
//                   <View style={{ flex: 1, marginLeft: 10 }}>
//                     <Text style={s.orgName}>{user?.name || "Your Company"}</Text>
//                     {/* Posted time */}
//                     <View style={s.timeRow}>
//                       <Ionicons name="time-outline" size={11} color="#94A3B8" />
//                       <Text style={s.timeText}>
//                         Posted {timeAgo(post.createdAt)}
//                       </Text>
//                       {/* Edited time */}
//                       {/* {post.updatedAt && post.updatedAt !== post.createdAt && ( */}
//                       {post.updatedAt && new Date(post.updatedAt).getTime() - new Date(post.createdAt).getTime() > 5000 && (
//                         <>
//                           <Text style={s.timeDot}>·</Text>
//                           <Ionicons name="pencil-outline" size={11} color="#94A3B8" />
//                           <Text style={s.timeText}>Edited {timeAgo(post.updatedAt)}</Text>
//                         </>
//                       )}
//                     </View>
//                   </View>
//                   <View style={[s.typeBadge, { backgroundColor: tc.bg }]}>
//                     <View style={[s.typeDot, { backgroundColor: tc.dot }]} />
//                     <Text style={[s.typeBadgeTxt, { color: tc.text }]}>{post.type}</Text>
//                   </View>
//                 </View>

//                 {/* Banner Image or Gradient */}
//                 {post.poster ? (
//                   <Image source={{ uri: post.poster }} style={s.banner} resizeMode="cover" />
//                 ) : (
//                   <LinearGradient colors={tc.grad} style={s.bannerGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
//                     <View style={s.bannerDecor} />
//                     <Ionicons
//                       name={post.type === "Internship" ? "briefcase" : post.type === "Workshop" ? "school" : "flask"}
//                       size={36} color="rgba(255,255,255,0.2)" style={{ marginBottom: 8 }}
//                     />
//                     <Text style={s.bannerTitle}>{post.title}</Text>
//                     <View style={s.bannerMeta}>
//                       {post.duration ? (
//                         <View style={s.bannerMetaItem}>
//                           <Ionicons name="time-outline" size={11} color="rgba(255,255,255,0.7)" />
//                           <Text style={s.bannerMetaTxt}>{post.duration}</Text>
//                         </View>
//                       ) : null}
//                       {post.stipend ? (
//                         <View style={s.bannerMetaItem}>
//                           <Ionicons name="cash-outline" size={11} color="rgba(255,255,255,0.7)" />
//                           <Text style={s.bannerMetaTxt}>{post.stipend}</Text>
//                         </View>
//                       ) : null}
//                     </View>
//                   </LinearGradient>
//                 )}

//                 {/* Body */}
//                 <View style={s.cardBody}>
//                   <Text style={s.cardTitle}>{post.title}</Text>
//                   <Text style={s.cardDesc} numberOfLines={2}>{post.description}</Text>

//                   {/* Meta chips */}
//                   <View style={s.metaRow}>
//                     {post.mode ? (
//                       <View style={s.metaChip}>
//                         <Ionicons name="location-outline" size={11} color="#0066CC" />
//                         <Text style={s.metaChipTxt}>{post.mode}</Text>
//                       </View>
//                     ) : null}
//                     {post.seats ? (
//                       <View style={s.metaChip}>
//                         <Ionicons name="people-outline" size={11} color="#0066CC" />
//                         <Text style={s.metaChipTxt}>{post.seats} seats</Text>
//                       </View>
//                     ) : null}
//                     {post.deadline ? (
//                       <View style={s.metaChip}>
//                         <Ionicons name="calendar-outline" size={11} color="#0066CC" />
//                         <Text style={s.metaChipTxt}>Due {post.deadline}</Text>
//                       </View>
//                     ) : null}
//                   </View>

//                   {/* Skills */}
//                   {post.skills?.length > 0 && (
//                     <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
//                       {post.skills.map((sk: string) => (
//                         <View key={sk} style={s.skillChip}>
//                           <Text style={s.skillChipTxt}>{sk}</Text>
//                         </View>
//                       ))}
//                     </ScrollView>
//                   )}

//                   {/* Applicants */}
//                   <View style={s.statsRow}>
//                     <View style={s.statItem}>
//                       <Ionicons name="people-outline" size={14} color="#64748B" />
//                       <Text style={s.statTxt}>{post.applications || 0} applicants</Text>
//                     </View>
//                     <View style={[s.statusDot, { backgroundColor: post.isActive ? "#22C55E" : "#94A3B8" }]} />
//                     <Text style={[s.statusTxt, { color: post.isActive ? "#16A34A" : "#94A3B8" }]}>
//                       {post.isActive ? "Active" : "Hidden"}
//                     </Text>
//                   </View>
//                 </View>

//                 {/* Action Bar — Facebook style */}
//                 <View style={s.actionBar}>
//                   <TouchableOpacity style={s.actionBtn} onPress={() => setEditPost(post)}>
//                     <Ionicons name="pencil-outline" size={16} color="#0066CC" />
//                     <Text style={[s.actionTxt, { color: "#0066CC" }]}>Edit</Text>
//                   </TouchableOpacity>

//                   <View style={s.actionDivider} />

//                   <TouchableOpacity style={s.actionBtn} onPress={() => handleToggle(post)}>
//                     <Ionicons name={post.isActive ? "eye-off-outline" : "eye-outline"} size={16} color="#64748B" />
//                     <Text style={s.actionTxt}>{post.isActive ? "Hide" : "Show"}</Text>
//                   </TouchableOpacity>

//                   <View style={s.actionDivider} />

//                   <TouchableOpacity style={s.actionBtn} onPress={() => handleDelete(post)}>
//                     <Ionicons name="trash-outline" size={16} color="#DC2626" />
//                     <Text style={[s.actionTxt, { color: "#DC2626" }]}>Delete</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             );
//           })
//         )}
//       </Animated.ScrollView>

//       {/* Edit Modal */}
//       {editPost && (
//         <EditModal
//           visible={!!editPost}
//           post={editPost}
//           onClose={() => setEditPost(null)}
//           onSave={handleEdit}
//           loading={editLoading}
//         />
//       )}
//     </View>
//   );
// }

// // ── Edit Modal Styles ────────────────────────────────────────
// const eS = StyleSheet.create({
//   overlay:    { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
//   sheet:      { backgroundColor: "#F0F4F8", borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: "95%", overflow: "hidden" },
//   sheetHandleWrap: { alignItems: "center", paddingTop: 10 },
//   sheetHandle:{ width: 36, height: 4, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 2 },
//   sheetHead:  { paddingHorizontal: 20, paddingBottom: 16 },
//   sheetHeadRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
//   sheetTitle: { fontSize: 18, fontWeight: "900", color: "#fff" },
//   typePill:   { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: "flex-start", marginTop: 6 },
//   typeDot:    { width: 6, height: 6, borderRadius: 3 },
//   typePillTxt:{ fontSize: 11, fontWeight: "700" },
//   closeBtn:   { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.15)", justifyContent: "center", alignItems: "center" },
//   body:       { padding: 16, paddingBottom: 10 },
//   bannerWrap: { marginBottom: 16, borderRadius: 14, overflow: "hidden" },
//   bannerImg:  { width: "100%", height: 160, borderRadius: 14 },
//   removeBanner: { position: "absolute", top: 8, right: 8, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 12 },
//   bannerPlaceholder: { height: 120, justifyContent: "center", alignItems: "center", borderRadius: 14 },
//   bannerPlaceholderTxt: { fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: "600", marginTop: 6 },
//   label:      { fontSize: 12, fontWeight: "700", color: "#334155", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
//   input:      { backgroundColor: "#fff", borderRadius: 12, padding: 13, fontSize: 14, color: "#0A1628", borderWidth: 1.5, borderColor: "#E2E8F0", marginBottom: 12 },
//   textarea:   { height: 100, textAlignVertical: "top" },
//   row:        { flexDirection: "row" },
//   modeRow:    { flexDirection: "row", gap: 8, marginBottom: 12 },
//   modeChip:   { flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, borderColor: "#E2E8F0", backgroundColor: "#fff", alignItems: "center" },
//   modeChipActive:   { borderColor: "#0066CC", backgroundColor: "#EFF6FF" },
//   modeChipTxt:      { fontSize: 12, fontWeight: "600", color: "#64748B" },
//   modeChipTxtActive:{ color: "#0066CC", fontWeight: "700" },
//   skillInputRow: { flexDirection: "row", gap: 8, alignItems: "center", marginBottom: 4 },
//   addSkillBtn:   { width: 44, height: 44, borderRadius: 12, backgroundColor: "#0066CC", justifyContent: "center", alignItems: "center" },
//   suggestionChip:{ backgroundColor: "#F1F5F9", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, borderWidth: 1, borderColor: "#E2E8F0" },
//   suggestionTxt: { fontSize: 11, fontWeight: "600", color: "#475569" },
//   selectedSkills:{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
//   selectedChip:  { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#EFF6FF", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: "#BFDBFE" },
//   selectedChipTxt: { fontSize: 12, fontWeight: "700", color: "#1D4ED8" },
//   footer:     { flexDirection: "row", gap: 12, padding: 16, borderTopWidth: 1, borderColor: "#E2E8F0", backgroundColor: "#fff" },
//   cancelBtn:  { flex: 1, paddingVertical: 14, borderRadius: 14, borderWidth: 1.5, borderColor: "#E2E8F0", alignItems: "center", justifyContent: "center" },
//   cancelTxt:  { fontSize: 14, fontWeight: "700", color: "#64748B" },
//   saveBtn:    { flex: 2, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#059669", borderRadius: 14, paddingVertical: 14 },
//   saveTxt:    { fontSize: 14, fontWeight: "800", color: "#fff" },
// });

// // ── Main Styles ──────────────────────────────────────────────
// const s = StyleSheet.create({
//   center:     { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F0F4F8" },
//   header:     { paddingTop: Platform.OS === "ios" ? 58 : 46, paddingHorizontal: 16, paddingBottom: 18, flexDirection: "row", alignItems: "center" },
//   backBtn:    { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.1)", justifyContent: "center", alignItems: "center" },
//   headerTitle:{ fontSize: 18, fontWeight: "900", color: "#fff" },
//   headerSub:  { fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 },
//   newBtn:     { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#0066CC", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
//   newBtnTxt:  { fontSize: 13, fontWeight: "700", color: "#fff" },
//   filterBar:  { backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderColor: "#F1F5F9" },
//   filterChip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, borderColor: "#E2E8F0", marginRight: 8 },
//   filterChipActive:  { backgroundColor: "#0A1628", borderColor: "#0A1628" },
//   filterChipTxt:     { fontSize: 13, fontWeight: "600", color: "#64748B" },
//   filterChipTxtActive: { color: "#fff" },
//   filterBadge: { backgroundColor: "#0066CC", borderRadius: 10, paddingHorizontal: 6, paddingVertical: 1 },
//   filterBadgeTxt: { fontSize: 10, fontWeight: "900", color: "#fff" },
//   empty:      { alignItems: "center", paddingTop: 80 },
//   emptyIcon:  { width: 72, height: 72, borderRadius: 36, justifyContent: "center", alignItems: "center", marginBottom: 16 },
//   emptyTitle: { fontSize: 18, fontWeight: "700", color: "#334155" },
//   emptySub:   { fontSize: 13, color: "#94A3B8", marginTop: 6 },
//   emptyBtn:   { marginTop: 20, backgroundColor: "#0066CC", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
//   emptyBtnTxt:{ fontSize: 14, fontWeight: "700", color: "#fff" },
//   card:       { backgroundColor: "#fff", borderRadius: 20, marginBottom: 16, overflow: "hidden", elevation: 3, shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 10 },
//   cardInactive: { opacity: 0.7 },
//   inactiveBanner: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#F1F5F9", paddingHorizontal: 14, paddingVertical: 8 },
//   inactiveTxt:    { fontSize: 12, color: "#64748B", fontWeight: "600" },
//   cardHead:   { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 12 },
//   avatar:     { width: 42, height: 42, borderRadius: 21, backgroundColor: "#0E7490", justifyContent: "center", alignItems: "center", overflow: "hidden" },
//   avatarImg:  { width: 42, height: 42, borderRadius: 21 },
//   avatarTxt:  { fontSize: 15, fontWeight: "900", color: "#fff" },
//   orgName:    { fontSize: 13, fontWeight: "700", color: "#0A1628" },
//   timeRow:    { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3, flexWrap: "wrap" },
//   timeText:   { fontSize: 11, color: "#94A3B8" },
//   timeDot:    { fontSize: 11, color: "#94A3B8" },
//   typeBadge:  { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
//   typeDot:    { width: 6, height: 6, borderRadius: 3 },
//   typeBadgeTxt: { fontSize: 11, fontWeight: "700" },
//   banner:     { width: "100%", height: 170 },
//   bannerGrad: { height: 170, justifyContent: "flex-end", paddingHorizontal: 16, paddingBottom: 16, overflow: "hidden" },
//   bannerDecor:{ position: "absolute", width: 150, height: 150, borderRadius: 75, backgroundColor: "rgba(255,255,255,0.05)", top: -40, right: -40 },
//   bannerTitle:{ fontSize: 18, fontWeight: "900", color: "#fff", marginBottom: 6 },
//   bannerMeta: { flexDirection: "row", gap: 16 },
//   bannerMetaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
//   bannerMetaTxt:  { fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: "600" },
//   cardBody:   { padding: 14 },
//   cardTitle:  { fontSize: 16, fontWeight: "800", color: "#0A1628" },
//   cardDesc:   { fontSize: 13, color: "#475569", marginTop: 5, lineHeight: 19 },
//   metaRow:    { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 },
//   metaChip:   { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#EFF6FF", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
//   metaChipTxt:{ fontSize: 11, fontWeight: "600", color: "#0066CC" },
//   skillChip:  { backgroundColor: "#EFF6FF", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginRight: 6, borderWidth: 1, borderColor: "#BFDBFE" },
//   skillChipTxt: { fontSize: 11, fontWeight: "700", color: "#1D4ED8" },
//   statsRow:   { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderColor: "#F1F5F9" },
//   statItem:   { flexDirection: "row", alignItems: "center", gap: 5, flex: 1 },
//   statTxt:    { fontSize: 12, color: "#64748B", fontWeight: "600" },
//   statusDot:  { width: 7, height: 7, borderRadius: 4 },
//   statusTxt:  { fontSize: 12, fontWeight: "700" },
//   actionBar:  { flexDirection: "row", borderTopWidth: 1, borderColor: "#F1F5F9" },
//   actionBtn:  { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 12 },
//   actionTxt:  { fontSize: 13, fontWeight: "700", color: "#64748B" },
//   actionDivider: { width: 1, backgroundColor: "#F1F5F9", marginVertical: 8 },
// });


import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator, Alert, Animated, Image, KeyboardAvoidingView,
  Platform, RefreshControl, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { useUser } from "./shared";

const TYPE_CONFIG: Record<string, { bg: string; text: string; dot: string; grad: readonly [string, string] }> = {
  Internship: { bg: "#EEF3F7", text: "#193648", dot: "#193648", grad: ["#193648", "#1A3045"] },
  Project:    { bg: "#E8EEF3", text: "#2A5068", dot: "#2A5068", grad: ["#2A5068", "#1A3045"] },
  Workshop:   { bg: "#FDF3E7", text: "#C26B12", dot: "#E67E22", grad: ["#E67E22", "#C26B12"] },
  Events:     { bg: "#F0E8F8", text: "#5B3A8E", dot: "#7C3AED", grad: ["#7C3AED", "#5B21B6"] },
};

const SKILL_SUGGESTIONS = [
  "React Native", "Python", "UI/UX", "Machine Learning", "Data Science",
  "JavaScript", "Node.js", "Flutter", "TensorFlow", "SQL", "Figma", "C++", "Java",
];

const timeAgo = (iso: string) => {
  if (!iso) return "";
  const diff  = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return "Just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  < 7)  return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-PK", { day:"numeric", month:"short", year:"numeric" });
};

const wasEdited = (post: any) =>
  post.updatedAt &&
  new Date(post.updatedAt).getTime() - new Date(post.createdAt).getTime() > 5000;

// EDIT POST FULL SCREEN
export function EditPostScreen({ route }: { route: any }) {
  const nav          = useNavigation<any>();
  const { user, ax } = useUser();
  const post         = route.params?.post;

  const [title,    setTitle]    = useState(post?.title       || "");
  const [desc,     setDesc]     = useState(post?.description || "");
  const [stipend,  setStipend]  = useState(post?.stipend     || "");
  const [duration, setDuration] = useState(post?.duration    || "");
  const [seats,    setSeats]    = useState(post?.seats       || "");
  const [deadline, setDeadline] = useState(post?.deadline    || "");
  const [location, setLocation] = useState(post?.location    || "");
  const [mode,     setMode]     = useState<"Onsite"|"Remote"|"Hybrid">(post?.mode || "Onsite");
  const [skills,   setSkills]   = useState<string[]>(post?.skills || []);
  const [skillInput, setSkillInput] = useState("");
  const [poster,   setPoster]   = useState<string|null>(post?.poster || null);
  const [loading,  setLoading]  = useState(false);

  const tc = TYPE_CONFIG[post?.type] || TYPE_CONFIG.Internship;

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5, aspect: [16, 9],
      base64: true,                       // native base64 — reliable on RN
    });
    if (!res.canceled) {
      const a = res.assets[0];
      setPoster(a.base64 ? `data:image/jpeg;base64,${a.base64}` : a.uri);
    }
  };

  const addSkill = (s: string) => {
    const sk = s.trim();
    if (sk && !skills.includes(sk)) setSkills(prev => [...prev, sk]);
    setSkillInput("");
  };

  const handleSave = async () => {
    if (!title.trim() || !desc.trim()) {
      Alert.alert("Required", "Title aur description zaroori hain.");
      return;
    }
    setLoading(true);
    try {
      const headers = { "x-industry-id": user?._id, "x-company-name": user?.name };
      await ax().put(`/api/industry/posts/${post._id}`, {
        title, description: desc, stipend, duration,
        seats, deadline, location, mode, skills,
        poster,                          // already a data URI from the picker
      }, { headers });
      Alert.alert("Saved! ✅", "Post update ho gayi.", [
        { text: "OK", onPress: () => nav.goBack() }
      ]);
    } catch {
      Alert.alert("Error", "Update nahi ho saka.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex:1, backgroundColor:"#F0F4F8" }}>
      <LinearGradient colors={["#0A1628","#0D2137"]} style={es.header}>
        <TouchableOpacity onPress={() => nav.goBack()} style={es.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex:1, marginLeft:14 }}>
          <Text style={es.headerTitle}>Edit Post</Text>
          <View style={[es.typePill, { backgroundColor: tc.bg }]}>
            <View style={[es.typeDot, { backgroundColor: tc.dot }]} />
            <Text style={[es.typePillTxt, { color: tc.text }]}>{post?.type}</Text>
          </View>
        </View>
        <TouchableOpacity style={[es.saveBtn, loading && { opacity:0.6 }]} onPress={handleSave} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" size="small" />
            : <><Ionicons name="checkmark" size={18} color="#fff" /><Text style={es.saveTxt}>Save</Text></>
          }
        </TouchableOpacity>
      </LinearGradient>

      <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS==="ios"?"padding":undefined}>
        <ScrollView contentContainerStyle={es.body} showsVerticalScrollIndicator={false}>

          <View style={es.section}>
            <Text style={es.sectionLabel}>Banner Image</Text>
            <TouchableOpacity onPress={pickImage} activeOpacity={0.85}>
              {poster ? (
                <View style={es.posterWrap}>
                  <Image source={{ uri: poster }} style={es.posterImg} resizeMode="cover" />
                  <TouchableOpacity style={es.removeBtn} onPress={() => setPoster(null)}>
                    <Ionicons name="close-circle" size={26} color="#fff" />
                  </TouchableOpacity>
                  <View style={es.changeBannerOverlay}>
                    <Ionicons name="camera-outline" size={18} color="#fff" />
                    <Text style={es.changeBannerTxt}>Tap to change</Text>
                  </View>
                </View>
              ) : (
                <LinearGradient colors={tc.grad} style={es.posterPlaceholder}>
                  <Ionicons name="image-outline" size={32} color="rgba(255,255,255,0.6)" />
                  <Text style={es.posterPlaceholderTxt}>Tap to upload banner</Text>
                  <Text style={es.posterPlaceholderSub}>16:9 recommended</Text>
                </LinearGradient>
              )}
            </TouchableOpacity>
          </View>

          <View style={es.section}>
            <Text style={es.sectionLabel}>Title *</Text>
            <View style={es.inputBox}>
              <TextInput style={es.input} value={title} onChangeText={setTitle}
                placeholder="Post title" placeholderTextColor="#94A3B8" maxLength={80} />
            </View>
            <Text style={es.charCount}>{title.length}/80</Text>
          </View>

          <View style={es.section}>
            <Text style={es.sectionLabel}>Description *</Text>
            <View style={es.inputBox}>
              <TextInput style={[es.input, es.textarea]} value={desc} onChangeText={setDesc}
                placeholder="Describe the opportunity..." placeholderTextColor="#94A3B8"
                multiline numberOfLines={5} textAlignVertical="top" />
            </View>
          </View>

          <View style={[es.section, { flexDirection:"row", gap:12 }]}>
            <View style={{ flex:1 }}>
              <Text style={es.sectionLabel}>Stipend / Fee</Text>
              <View style={es.inputBox}>
                <TextInput style={es.input} value={stipend} onChangeText={setStipend} placeholder="PKR 25,000/mo" placeholderTextColor="#94A3B8" />
              </View>
            </View>
            <View style={{ flex:1 }}>
              <Text style={es.sectionLabel}>Duration</Text>
              <View style={es.inputBox}>
                <TextInput style={es.input} value={duration} onChangeText={setDuration} placeholder="3 Months" placeholderTextColor="#94A3B8" />
              </View>
            </View>
          </View>

          <View style={[es.section, { flexDirection:"row", gap:12 }]}>
            <View style={{ flex:1 }}>
              <Text style={es.sectionLabel}>Open Seats</Text>
              <View style={es.inputBox}>
                <TextInput style={es.input} value={seats} onChangeText={setSeats} placeholder="5" placeholderTextColor="#94A3B8" keyboardType="numeric" />
              </View>
            </View>
            <View style={{ flex:1 }}>
              <Text style={es.sectionLabel}>Deadline</Text>
              <View style={es.inputBox}>
                <TextInput style={es.input} value={deadline} onChangeText={setDeadline} placeholder="30 Jun 2025" placeholderTextColor="#94A3B8" />
              </View>
            </View>
          </View>

          <View style={es.section}>
            <Text style={es.sectionLabel}>Location</Text>
            <View style={[es.inputBox, { flexDirection:"row", alignItems:"center", gap:8 }]}>
              <Ionicons name="location-outline" size={18} color="#94A3B8" />
              <TextInput style={[es.input, { flex:1 }]} value={location} onChangeText={setLocation} placeholder="City or Remote" placeholderTextColor="#94A3B8" />
            </View>
          </View>

          <View style={es.section}>
            <Text style={es.sectionLabel}>Work Mode</Text>
            <View style={es.modeRow}>
              {(["Onsite","Remote","Hybrid"] as const).map(m => (
                <TouchableOpacity key={m} style={[es.modeChip, mode===m && es.modeChipActive]} onPress={() => setMode(m)}>
                  <Text style={[es.modeChipTxt, mode===m && es.modeChipTxtActive]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={es.section}>
            <Text style={es.sectionLabel}>Required Skills</Text>
            <View style={[es.inputBox, { flexDirection:"row", alignItems:"center", gap:8 }]}>
              <TextInput style={[es.input, { flex:1 }]} value={skillInput} onChangeText={setSkillInput}
                placeholder="Type skill and press +" placeholderTextColor="#94A3B8"
                onSubmitEditing={() => addSkill(skillInput)} />
              <TouchableOpacity onPress={() => addSkill(skillInput)} style={es.addSkillBtn}>
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop:10 }}>
              {SKILL_SUGGESTIONS.filter(s => !skills.includes(s)).map(s => (
                <TouchableOpacity key={s} onPress={() => addSkill(s)} style={es.suggestionChip}>
                  <Text style={es.suggestionTxt}>+ {s}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {skills.length > 0 && (
              <View style={es.selectedSkills}>
                {skills.map(s => (
                  <View key={s} style={es.selectedChip}>
                    <Text style={es.selectedChipTxt}>{s}</Text>
                    <TouchableOpacity onPress={() => setSkills(skills.filter(x => x !== s))}>
                      <Ionicons name="close-circle" size={16} color="#1D4ED8" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity style={[es.bigSaveBtn, loading && { opacity:0.6 }]} onPress={handleSave} disabled={loading} activeOpacity={0.88}>
            <LinearGradient colors={["#059669","#047857"]} style={es.bigSaveBtnGrad}>
              {loading
                ? <ActivityIndicator color="#fff" size="small" />
                : <><Ionicons name="checkmark-circle" size={20} color="#fff" /><Text style={es.bigSaveTxt}>Save Changes</Text></>
              }
            </LinearGradient>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// MY POSTS SCREEN — sections: Internship / Project / Workshop / Events ─
export function MyPostsScreen() {
  const nav          = useNavigation<any>();
  const { user, ax } = useUser();
  const [posts,      setPosts]      = useState<any[]>([]);
  const [events,     setEvents]     = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter,     setFilter]     = useState<"All"|"Internship"|"Project"|"Workshop"|"Events">("All");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchPosts = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true); else setLoading(true);
    try {
      const headers = { "x-industry-id": user?._id, "x-company-name": user?.name };
      const [postsRes, eventsRes] = await Promise.all([
        ax().get("/api/industry/posts/mine",  { headers }).catch(() => ({ data: [] })),
        ax().get("/api/industry/events/mine", { headers }).catch(() => ({ data: { events: [] } })),
      ]);
      setPosts(postsRes.data || []);
      const evs = Array.isArray(eventsRes.data) ? eventsRes.data : (eventsRes.data?.events || []);
      setEvents(evs);
      Animated.timing(fadeAnim, { toValue:1, duration:500, useNativeDriver:true }).start();
    } catch (e) { console.error("MyPosts:", e); }
    finally { setLoading(false); setRefreshing(false); }
  }, [user]);

  useEffect(() => {
    const unsubscribe = (nav as any).addListener?.("focus", () => fetchPosts());
    return unsubscribe;
  }, [nav, fetchPosts]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleDelete = (post: any) => {
    Alert.alert("Delete Post", `"${post.title}" delete karna chahte hain?`, [
      { text: "Cancel", style:"cancel" },
      { text:"Delete", style:"destructive", onPress: async () => {
        try {
          const headers = { "x-industry-id": user?._id, "x-company-name": user?.name };
          await ax().delete(`/api/industry/posts/${post._id}`, { headers });
          setPosts(prev => prev.filter(p => p._id !== post._id));
        } catch { Alert.alert("Error", "Delete nahi ho saka."); }
      }}
    ]);
  };

  const handleToggle = async (post: any) => {
    try {
      const headers = { "x-industry-id": user?._id, "x-company-name": user?.name };
      const res = await ax().patch(`/api/industry/posts/${post._id}/toggle`, {}, { headers });
      setPosts(prev => prev.map(p => p._id===post._id ? { ...p, isActive:res.data.isActive } : p));
    } catch { Alert.alert("Error", "Toggle nahi ho saka."); }
  };

  // ── group posts by type — events become their own section ──
  const sections: { type:"Internship"|"Project"|"Workshop"|"Events"; icon:any; data:any[] }[] = [
    { type:"Internship", icon:"briefcase-outline",       data: posts.filter(p => p.type==="Internship") },
    { type:"Project",    icon:"flask-outline",           data: posts.filter(p => p.type==="Project")    },
    { type:"Workshop",   icon:"school-outline",          data: posts.filter(p => p.type==="Workshop")   },
    { type:"Events",     icon:"calendar-outline",        data: events                                    },
  ];

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color="#193648" /></View>;

  // Renders an Event card (Seminar / Job Fair / Workshop / Tech Talk / Hackathon / Networking)
  const renderEventCard = (ev: any) => {
    const tc = TYPE_CONFIG.Events;
    const validBanner =
      typeof ev.banner === "string" &&
      (ev.banner.startsWith("data:") || /^https?:\/\//i.test(ev.banner));
    return (
      <View key={ev._id} style={s.card}>
        {/* Banner */}
        {validBanner ? (
          <Image key={ev.banner.slice(0,32)} source={{ uri: ev.banner }} style={s.banner} resizeMode="cover" />
        ) : (
          <LinearGradient colors={tc.grad} style={s.bannerGrad} start={{x:0,y:0}} end={{x:1,y:1}}>
            <View style={s.bannerDecor} />
            <Ionicons name="calendar-outline" size={36} color="rgba(255,255,255,0.25)" style={{ marginBottom:8 }} />
            <Text style={s.bannerTitle}>{ev.title}</Text>
            <View style={s.bannerMetaRow}>
              {ev.date && (
                <View style={s.bannerMetaItem}>
                  <Ionicons name="calendar" size={11} color="rgba(255,255,255,0.7)" />
                  <Text style={s.bannerMetaTxt}>{ev.date}</Text>
                </View>
              )}
              {ev.time && (
                <View style={s.bannerMetaItem}>
                  <Ionicons name="time-outline" size={11} color="rgba(255,255,255,0.7)" />
                  <Text style={s.bannerMetaTxt}>{ev.time}</Text>
                </View>
              )}
            </View>
          </LinearGradient>
        )}

        <View style={s.cardBody}>
          <View style={{ flexDirection:"row", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
            <View style={[s.typeBadge, { backgroundColor: tc.bg }]}>
              <View style={[s.typeDot, { backgroundColor: tc.dot }]} />
              <Text style={[s.typeBadgeTxt, { color: tc.text }]}>{ev.eventType || "Event"}</Text>
            </View>
            <Text style={s.timeTxt}>{timeAgo(ev.createdAt)}</Text>
          </View>
          <Text style={s.cardTitle}>{ev.title}</Text>
          {ev.description ? (
            <Text style={s.cardDesc} numberOfLines={2}>{ev.description}</Text>
          ) : null}
          <View style={s.metaRow}>
            {ev.date && <View style={s.metaChip}><Ionicons name="calendar-outline" size={11} color="#193648" /><Text style={s.metaChipTxt}>{ev.date}</Text></View>}
            {ev.time && <View style={s.metaChip}><Ionicons name="time-outline" size={11} color="#193648" /><Text style={s.metaChipTxt}>{ev.time}</Text></View>}
            {ev.location && <View style={s.metaChip}><Ionicons name="location-outline" size={11} color="#193648" /><Text style={s.metaChipTxt}>{ev.location}</Text></View>}
            {ev.mode && <View style={s.metaChip}><Ionicons name="globe-outline" size={11} color="#193648" /><Text style={s.metaChipTxt}>{ev.mode}</Text></View>}
            {!!ev.capacity && <View style={s.metaChip}><Ionicons name="people-outline" size={11} color="#193648" /><Text style={s.metaChipTxt}>{ev.capacity} seats</Text></View>}
          </View>
        </View>

        <View style={s.actionBar}>
          <TouchableOpacity
            style={s.actionBtn}
            onPress={() => nav.navigate("EventCreation", { editMode: true, eventData: ev })}>
            <Ionicons name="pencil-outline" size={16} color="#193648" />
            <Text style={[s.actionTxt, { color:"#193648" }]}>Edit</Text>
          </TouchableOpacity>
          <View style={s.actionDivider} />
          <TouchableOpacity
            style={s.actionBtn}
            onPress={() => nav.navigate("EventsManage")}>
            <Ionicons name="settings-outline" size={16} color="#5B7080" />
            <Text style={s.actionTxt}>Manage</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Renders one post card — used by every section
  const renderCard = (post: any) => {
    const tc = TYPE_CONFIG[post.type] || TYPE_CONFIG.Internship;
    return (
      <View key={post._id} style={[s.card, !post.isActive && s.cardInactive]}>
        {!post.isActive && (
          <View style={s.inactiveBanner}>
            <Ionicons name="eye-off-outline" size={13} color="#5B7080" />
            <Text style={s.inactiveTxt}>Students ko nahi dikh rahi</Text>
          </View>
        )}
        <View style={s.cardHead}>
          <View style={s.avatar}>
            {user?.logo
              ? <Image key={user.logo.slice(0,32)} source={{ uri:user.logo }} style={s.avatarImg} />
              : <Text style={s.avatarTxt}>{user?.name?.split(" ").map((w:string)=>w[0]).slice(0,2).join("").toUpperCase()||"CX"}</Text>
            }
          </View>
          <View style={{ flex:1, marginLeft:10 }}>
            <Text style={s.orgName}>{user?.name||"Your Company"}</Text>
            <View style={s.timeRow}>
              <Ionicons name="time-outline" size={11} color="#9BB0BC" />
              <Text style={s.timeTxt}>Posted {timeAgo(post.createdAt)}</Text>
              {wasEdited(post) && (
                <><Text style={s.timeDot}>·</Text>
                  <Ionicons name="pencil-outline" size={11} color="#9BB0BC" />
                  <Text style={s.timeTxt}>Edited {timeAgo(post.updatedAt)}</Text>
                </>
              )}
            </View>
          </View>
          <View style={[s.typeBadge, { backgroundColor:tc.bg }]}>
            <View style={[s.typeDot, { backgroundColor:tc.dot }]} />
            <Text style={[s.typeBadgeTxt, { color:tc.text }]}>{post.type}</Text>
          </View>
        </View>

        {post.poster
          ? <Image source={{ uri:post.poster }} style={s.banner} resizeMode="cover" />
          : <LinearGradient colors={tc.grad} style={s.bannerGrad} start={{x:0,y:0}} end={{x:1,y:1}}>
              <View style={s.bannerDecor} />
              <Ionicons name={post.type==="Internship"?"briefcase":post.type==="Workshop"?"school":"flask"} size={36} color="rgba(255,255,255,0.2)" style={{ marginBottom:8 }} />
              <Text style={s.bannerTitle}>{post.title}</Text>
              <View style={s.bannerMetaRow}>
                {post.duration && <View style={s.bannerMetaItem}><Ionicons name="time-outline" size={11} color="rgba(255,255,255,0.7)" /><Text style={s.bannerMetaTxt}>{post.duration}</Text></View>}
                {post.stipend && <View style={s.bannerMetaItem}><Ionicons name="cash-outline" size={11} color="rgba(255,255,255,0.7)" /><Text style={s.bannerMetaTxt}>{post.stipend}</Text></View>}
              </View>
            </LinearGradient>
        }

        <View style={s.cardBody}>
          <Text style={s.cardTitle}>{post.title}</Text>
          <Text style={s.cardDesc} numberOfLines={2}>{post.description}</Text>
          <View style={s.metaRow}>
            {post.mode && <View style={s.metaChip}><Ionicons name="location-outline" size={11} color="#193648" /><Text style={s.metaChipTxt}>{post.mode}</Text></View>}
            {post.seats && <View style={s.metaChip}><Ionicons name="people-outline" size={11} color="#193648" /><Text style={s.metaChipTxt}>{post.seats} seats</Text></View>}
            {post.deadline && <View style={s.metaChip}><Ionicons name="calendar-outline" size={11} color="#193648" /><Text style={s.metaChipTxt}>Due {post.deadline}</Text></View>}
          </View>
          {post.skills?.length>0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop:8 }}>
              {post.skills.map((sk:string) => <View key={sk} style={s.skillChip}><Text style={s.skillChipTxt}>{sk}</Text></View>)}
            </ScrollView>
          )}
          <View style={s.statsRow}>
            <View style={s.statItem}>
              <Ionicons name="people-outline" size={14} color="#5B7080" />
              <Text style={s.statTxt}>{post.applications||0} applicants</Text>
            </View>
            <View style={[s.statusDot, { backgroundColor:post.isActive?"#22C55E":"#9BB0BC" }]} />
            <Text style={[s.statusTxt, { color:post.isActive?"#16A34A":"#9BB0BC" }]}>{post.isActive?"Active":"Hidden"}</Text>
          </View>
        </View>

        <View style={s.actionBar}>
          <TouchableOpacity style={s.actionBtn} onPress={() => nav.navigate("EditPost", { post })}>
            <Ionicons name="pencil-outline" size={16} color="#193648" />
            <Text style={[s.actionTxt, { color:"#193648" }]}>Edit</Text>
          </TouchableOpacity>
          <View style={s.actionDivider} />
          <TouchableOpacity style={s.actionBtn} onPress={() => handleToggle(post)}>
            <Ionicons name={post.isActive?"eye-off-outline":"eye-outline"} size={16} color="#5B7080" />
            <Text style={s.actionTxt}>{post.isActive?"Hide":"Show"}</Text>
          </TouchableOpacity>
          <View style={s.actionDivider} />
          <TouchableOpacity style={s.actionBtn} onPress={() => handleDelete(post)}>
            <Ionicons name="trash-outline" size={16} color="#DC2626" />
            <Text style={[s.actionTxt, { color:"#DC2626" }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex:1, backgroundColor:"#F0F4F8" }}>
      {/* ── Header — solid navy matching dashboard ── */}
      <View style={s.header}>
        <View style={s.headerTopRow}>
          <TouchableOpacity onPress={() => nav.goBack()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex:1, marginLeft:14 }}>
            <Text style={s.headerTitle}>My Posts</Text>
            <Text style={s.headerSub}>{posts.length} total</Text>
          </View>
          <TouchableOpacity style={s.newBtn} onPress={() => nav.navigate("PostOpportunity")}>
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={s.newBtnTxt}>New</Text>
          </TouchableOpacity>
        </View>

        {/* Filter chips — All / Internship / Project / Workshop */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingTop:14, gap:8 }}
          keyboardShouldPersistTaps="handled">
          {(["All","Internship","Project","Workshop","Events"] as const).map((f) => {
            const active = filter === f;
            let count = 0;
            if (f === "All")          count = posts.length + events.length;
            else if (f === "Events")  count = events.length;
            else                       count = posts.filter(p => p.type === f).length;
            return (
              <TouchableOpacity key={f}
                style={[s.filterChip, active && s.filterChipActive]}
                onPress={() => setFilter(f)} activeOpacity={0.85}>
                <Text style={[s.filterChipTxt, active && s.filterChipTxtActive]}>{f}</Text>
                <View style={[s.filterBadge, active && s.filterBadgeActive]}>
                  <Text style={[s.filterBadgeTxt, active && s.filterBadgeTxtActive]}>{count}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <Animated.ScrollView style={{ opacity:fadeAnim }} contentContainerStyle={{ padding:16, paddingBottom:50 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchPosts(true)} colors={["#193648"]} />}
        showsVerticalScrollIndicator={false}>

        {posts.length===0 && events.length===0 ? (
          <View style={s.empty}>
            <View style={s.emptyIcon}>
              <Ionicons name="newspaper-outline" size={32} color="#193648" />
            </View>
            <Text style={s.emptyTitle}>Koi post nahi</Text>
            <Text style={s.emptySub}>Abhi tak koi post / event nahi banaya</Text>
            <TouchableOpacity style={s.emptyBtn} onPress={() => nav.navigate("PostOpportunity")}>
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={s.emptyBtnTxt}>Post Karo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          sections
            .filter((sec) => filter === "All" || filter === sec.type)
            .map((sec) => {
            const tc       = TYPE_CONFIG[sec.type];
            const isEvents = sec.type === "Events";
            const ctaScreen = isEvents ? "EventCreation" : "PostOpportunity";
            return (
              <View key={sec.type} style={{ marginBottom:24 }}>
                {/* Section header */}
                <View style={s.secHead}>
                  <View style={[s.secIcon, { backgroundColor: tc.bg }]}>
                    <Ionicons name={sec.icon} size={18} color={tc.text} />
                  </View>
                  <Text style={s.secTitle}>
                    {isEvents ? "Events" : `${sec.type}s`}
                  </Text>
                  <View style={s.secCountPill}>
                    <Text style={s.secCountTxt}>{sec.data.length}</Text>
                  </View>
                  <View style={s.secAccent} />
                </View>

                {/* Section body */}
                {sec.data.length===0 ? (
                  <TouchableOpacity style={s.secEmpty} onPress={() => nav.navigate(ctaScreen)}>
                    <View style={[s.secEmptyIcon, { backgroundColor: tc.bg }]}>
                      <Ionicons name={sec.icon} size={22} color={tc.text} />
                    </View>
                    <View style={{ flex:1 }}>
                      <Text style={s.secEmptyTxt}>
                        {isEvents ? "No event created yet" : `No ${sec.type.toLowerCase()} posted yet`}
                      </Text>
                      <Text style={s.secEmptySub}>
                        {isEvents ? "Tap to create a new event" : `Tap to create a new ${sec.type.toLowerCase()}`}
                      </Text>
                    </View>
                    <Ionicons name="add-circle" size={26} color="#193648" />
                  </TouchableOpacity>
                ) : isEvents ? (
                  sec.data.map(renderEventCard)
                ) : (
                  sec.data.map(renderCard)
                )}
              </View>
            );
          })
        )}
      </Animated.ScrollView>
    </View>
  );
}

const es = StyleSheet.create({
  header:{ paddingTop:Platform.OS==="ios"?58:46, paddingHorizontal:16, paddingBottom:16, flexDirection:"row", alignItems:"center" },
  backBtn:{ width:40, height:40, borderRadius:12, backgroundColor:"rgba(255,255,255,0.1)", justifyContent:"center", alignItems:"center" },
  headerTitle:{ fontSize:18, fontWeight:"900", color:"#fff" },
  typePill:{ flexDirection:"row", alignItems:"center", gap:5, paddingHorizontal:10, paddingVertical:4, borderRadius:20, alignSelf:"flex-start", marginTop:5 },
  typeDot:{ width:6, height:6, borderRadius:3 },
  typePillTxt:{ fontSize:11, fontWeight:"700" },
  saveBtn:{ flexDirection:"row", alignItems:"center", gap:5, backgroundColor:"#059669", paddingHorizontal:14, paddingVertical:9, borderRadius:20 },
  saveTxt:{ fontSize:13, fontWeight:"800", color:"#fff" },
  body:{ padding:16, paddingBottom:40 },
  section:{ marginBottom:16 },
  sectionLabel:{ fontSize:12, fontWeight:"700", color:"#334155", marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 },
  inputBox:{ backgroundColor:"#fff", borderRadius:14, paddingHorizontal:14, paddingVertical:12, borderWidth:1.5, borderColor:"#E2E8F0", elevation:1 },
  input:{ fontSize:14, color:"#0A1628", fontWeight:"500" },
  textarea:{ height:110, paddingTop:4, textAlignVertical:"top" },
  charCount:{ fontSize:11, color:"#94A3B8", textAlign:"right", marginTop:4 },
  posterWrap:{ borderRadius:16, overflow:"hidden" },
  posterImg:{ width:"100%", height:190, borderRadius:16 },
  removeBtn:{ position:"absolute", top:8, right:8, backgroundColor:"rgba(0,0,0,0.5)", borderRadius:14 },
  changeBannerOverlay:{ position:"absolute", bottom:0, left:0, right:0, backgroundColor:"rgba(0,0,0,0.35)", paddingVertical:8, flexDirection:"row", alignItems:"center", justifyContent:"center", gap:6 },
  changeBannerTxt:{ fontSize:12, color:"#fff", fontWeight:"700" },
  posterPlaceholder:{ height:160, borderRadius:16, justifyContent:"center", alignItems:"center" },
  posterPlaceholderTxt:{ fontSize:14, fontWeight:"700", color:"rgba(255,255,255,0.85)", marginTop:8 },
  posterPlaceholderSub:{ fontSize:11, color:"rgba(255,255,255,0.55)", marginTop:3 },
  modeRow:{ flexDirection:"row", gap:10 },
  modeChip:{ flex:1, paddingVertical:10, borderRadius:14, borderWidth:1.5, borderColor:"#E2E8F0", backgroundColor:"#fff", alignItems:"center" },
  modeChipActive:{ borderColor:"#0066CC", backgroundColor:"#EFF6FF" },
  modeChipTxt:{ fontSize:13, fontWeight:"600", color:"#64748B" },
  modeChipTxtActive:{ color:"#0066CC", fontWeight:"700" },
  addSkillBtn:{ width:44, height:44, borderRadius:12, backgroundColor:"#0066CC", justifyContent:"center", alignItems:"center" },
  suggestionChip:{ backgroundColor:"#F1F5F9", borderRadius:20, paddingHorizontal:12, paddingVertical:6, marginRight:8, borderWidth:1, borderColor:"#E2E8F0" },
  suggestionTxt:{ fontSize:11, fontWeight:"600", color:"#475569" },
  selectedSkills:{ flexDirection:"row", flexWrap:"wrap", gap:8, marginTop:10 },
  selectedChip:{ flexDirection:"row", alignItems:"center", gap:6, backgroundColor:"#EFF6FF", borderRadius:20, paddingHorizontal:12, paddingVertical:6, borderWidth:1, borderColor:"#BFDBFE" },
  selectedChipTxt:{ fontSize:12, fontWeight:"700", color:"#1D4ED8" },
  bigSaveBtn:{ marginTop:8, borderRadius:16, overflow:"hidden" },
  bigSaveBtnGrad:{ flexDirection:"row", alignItems:"center", justifyContent:"center", gap:10, paddingVertical:17 },
  bigSaveTxt:{ fontSize:16, fontWeight:"800", color:"#fff" },
});

const s = StyleSheet.create({
  center:{ flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"#F0F4F8" },

  // ── Header — matches industry dashboard ──
  header:{
    paddingTop:Platform.OS==="ios"?56:42,
    paddingHorizontal:18, paddingBottom:18,
    backgroundColor:"#193648",
    borderBottomLeftRadius:22, borderBottomRightRadius:22,
  },
  headerTopRow:{ flexDirection:"row", alignItems:"center" },
  backBtn:{ width:38, height:38, borderRadius:12, backgroundColor:"rgba(255,255,255,0.12)", justifyContent:"center", alignItems:"center" },
  headerTitle:{ fontSize:18, fontWeight:"800", color:"#fff" },
  headerSub:{ fontSize:12, color:"rgba(255,255,255,0.55)", marginTop:2 },
  newBtn:{ flexDirection:"row", alignItems:"center", gap:5, backgroundColor:"rgba(255,255,255,0.18)", paddingHorizontal:14, paddingVertical:8, borderRadius:20 },
  newBtnTxt:{ fontSize:13, fontWeight:"700", color:"#fff" },

  // ── Filter chips ──
  filterChip:{
    flexDirection:"row", alignItems:"center", gap:6,
    paddingHorizontal:14, paddingVertical:7, borderRadius:20,
    borderWidth:1.5, borderColor:"rgba(255,255,255,0.2)",
    backgroundColor:"rgba(255,255,255,0.08)",
  },
  filterChipActive:{ backgroundColor:"#fff", borderColor:"#fff" },
  filterChipTxt:{ fontSize:13, fontWeight:"700", color:"rgba(255,255,255,0.85)" },
  filterChipTxtActive:{ color:"#193648" },
  filterBadge:{ backgroundColor:"rgba(255,255,255,0.15)", borderRadius:10, paddingHorizontal:7, paddingVertical:1, minWidth:20, alignItems:"center" },
  filterBadgeActive:{ backgroundColor:"#193648" },
  filterBadgeTxt:{ fontSize:10, fontWeight:"900", color:"#fff" },
  filterBadgeTxtActive:{ color:"#fff" },

  // ── Section header ──
  secHead:{ flexDirection:"row", alignItems:"center", marginBottom:12, marginTop:4, gap:10 },
  secIcon:{ width:34, height:34, borderRadius:10, justifyContent:"center", alignItems:"center" },
  secTitle:{ fontSize:16, fontWeight:"800", color:"#0D1B2A" },
  secCountPill:{ backgroundColor:"#EEF3F7", paddingHorizontal:9, paddingVertical:2, borderRadius:10 },
  secCountTxt:{ fontSize:11, fontWeight:"800", color:"#193648" },
  secAccent:{ flex:1, height:1, backgroundColor:"#E3ECF0", marginLeft:6 },

  // ── Section empty state ──
  secEmpty:{
    flexDirection:"row", alignItems:"center", gap:12,
    backgroundColor:"#FFFFFF",
    borderRadius:16, padding:14,
    borderWidth:1.5, borderColor:"#E3ECF0", borderStyle:"dashed",
  },
  secEmptyIcon:{ width:42, height:42, borderRadius:12, justifyContent:"center", alignItems:"center" },
  secEmptyTxt:{ fontSize:13, fontWeight:"800", color:"#0D1B2A" },
  secEmptySub:{ fontSize:11, color:"#5B7080", marginTop:2 },

  // ── Global empty state ──
  empty:{ alignItems:"center", paddingTop:80 },
  emptyIcon:{ width:72, height:72, borderRadius:36, backgroundColor:"#EEF3F7", justifyContent:"center", alignItems:"center", marginBottom:16 },
  emptyTitle:{ fontSize:18, fontWeight:"800", color:"#0D1B2A" },
  emptySub:{ fontSize:13, color:"#9BB0BC", marginTop:6 },
  emptyBtn:{ marginTop:20, flexDirection:"row", alignItems:"center", gap:6, backgroundColor:"#193648", paddingHorizontal:20, paddingVertical:12, borderRadius:20 },
  emptyBtnTxt:{ fontSize:14, fontWeight:"700", color:"#fff" },

  // ── Card ──
  card:{ backgroundColor:"#fff", borderRadius:20, marginBottom:14, overflow:"hidden", elevation:3, shadowColor:"#000", shadowOpacity:0.06, shadowRadius:10, borderWidth:1, borderColor:"#E3ECF0" },
  cardInactive:{ opacity:0.65 },
  inactiveBanner:{ flexDirection:"row", alignItems:"center", gap:6, backgroundColor:"#F0F4F8", paddingHorizontal:14, paddingVertical:8 },
  inactiveTxt:{ fontSize:12, color:"#5B7080", fontWeight:"600" },

  cardHead:{ flexDirection:"row", alignItems:"center", paddingHorizontal:14, paddingVertical:12 },
  avatar:{ width:42, height:42, borderRadius:21, backgroundColor:"#193648", justifyContent:"center", alignItems:"center", overflow:"hidden" },
  avatarImg:{ width:42, height:42, borderRadius:21 },
  avatarTxt:{ fontSize:15, fontWeight:"900", color:"#fff" },
  orgName:{ fontSize:13, fontWeight:"700", color:"#0D1B2A" },
  timeRow:{ flexDirection:"row", alignItems:"center", gap:4, marginTop:3, flexWrap:"wrap" },
  timeTxt:{ fontSize:11, color:"#9BB0BC" },
  timeDot:{ fontSize:11, color:"#9BB0BC" },
  typeBadge:{ flexDirection:"row", alignItems:"center", gap:5, paddingHorizontal:10, paddingVertical:5, borderRadius:20 },
  typeDot:{ width:6, height:6, borderRadius:3 },
  typeBadgeTxt:{ fontSize:11, fontWeight:"700" },

  banner:{ width:"100%", height:170 },
  bannerGrad:{ height:170, justifyContent:"flex-end", paddingHorizontal:16, paddingBottom:16, overflow:"hidden" },
  bannerDecor:{ position:"absolute", width:150, height:150, borderRadius:75, backgroundColor:"rgba(255,255,255,0.05)", top:-40, right:-40 },
  bannerTitle:{ fontSize:18, fontWeight:"900", color:"#fff", marginBottom:6 },
  bannerMetaRow:{ flexDirection:"row", gap:16 },
  bannerMetaItem:{ flexDirection:"row", alignItems:"center", gap:4 },
  bannerMetaTxt:{ fontSize:11, color:"rgba(255,255,255,0.75)", fontWeight:"600" },

  cardBody:{ padding:14 },
  cardTitle:{ fontSize:16, fontWeight:"800", color:"#0D1B2A" },
  cardDesc:{ fontSize:13, color:"#5B7080", marginTop:5, lineHeight:19 },
  metaRow:{ flexDirection:"row", flexWrap:"wrap", gap:6, marginTop:10 },
  metaChip:{ flexDirection:"row", alignItems:"center", gap:4, backgroundColor:"#EEF3F7", paddingHorizontal:10, paddingVertical:4, borderRadius:20 },
  metaChipTxt:{ fontSize:11, fontWeight:"700", color:"#193648" },
  skillChip:{ backgroundColor:"#EEF3F7", borderRadius:20, paddingHorizontal:10, paddingVertical:4, marginRight:6, borderWidth:1, borderColor:"#DCE4EC" },
  skillChipTxt:{ fontSize:11, fontWeight:"700", color:"#193648" },
  statsRow:{ flexDirection:"row", alignItems:"center", gap:6, marginTop:12, paddingTop:12, borderTopWidth:1, borderColor:"#F0F4F8" },
  statItem:{ flexDirection:"row", alignItems:"center", gap:5, flex:1 },
  statTxt:{ fontSize:12, color:"#5B7080", fontWeight:"600" },
  statusDot:{ width:7, height:7, borderRadius:4 },
  statusTxt:{ fontSize:12, fontWeight:"700" },

  actionBar:{ flexDirection:"row", borderTopWidth:1, borderColor:"#F0F4F8" },
  actionBtn:{ flex:1, flexDirection:"row", alignItems:"center", justifyContent:"center", gap:6, paddingVertical:13 },
  actionTxt:{ fontSize:13, fontWeight:"700", color:"#5B7080" },
  actionDivider:{ width:1, backgroundColor:"#F0F4F8", marginVertical:8 },
});