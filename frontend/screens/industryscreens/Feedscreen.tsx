/**
 * FeedScreen.tsx
 * Feed screen — shows all posts (Internship, Project, Workshop) from backend.
 * Pull-to-refresh + type filter tabs included.
 */

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator, RefreshControl, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import { C, useUser } from "./shared";

type FilterType = "All" | "Internship" | "Project" | "Workshop";

const FILTERS: FilterType[] = ["All", "Internship", "Project", "Workshop"];

const TYPE_COLOR: Record<string, { bg: string; text: string; dot: string }> = {
  Internship: { bg: "#E8F4FF", text: "#0066CC", dot: "#2196F3" },
  Project:    { bg: "#F3E5F5", text: "#6A1B9A", dot: "#9C27B0" },
  Workshop:   { bg: "#FFF3E0", text: "#E65100", dot: "#FF9800" },
};

export function FeedScreen() {
  const nav = useNavigation<any>();
  const { ax } = useUser();

  const [posts, setPosts]       = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter]     = useState<FilterType>("All");

  const fetchPosts = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const params = filter !== "All" ? `?type=${filter}` : "";
    //   const res = await ax().get(`/api/posts${params}`);

    const res = await ax().get(`/api/industry/posts${params}`);
      setPosts(res.data.posts || []);
    } catch (e) {
      console.error("Feed fetch error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={C.teal} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>

      {/* Header */}
      <LinearGradient colors={["#0A1628", "#0D2137"]} style={styles.header}>
        <Text style={styles.headerTitle}>Opportunities Feed</Text>
        <Text style={styles.headerSub}>{posts.length} opportunities available</Text>
      </LinearGradient>

      {/* Filter tabs */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}>
              <Text style={[styles.filterChipTxt, filter === f && styles.filterChipTxtActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchPosts(true)} colors={[C.teal]} />}
      >
        {posts.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="newspaper-outline" size={56} color={C.textLight} />
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptySub}>Be the first to post an opportunity!</Text>
          </View>
        )}

        {posts.map((post) => {
          const colors = TYPE_COLOR[post.type] || TYPE_COLOR.Internship;
          return (
            <TouchableOpacity
              key={post._id}
              style={styles.card}
              activeOpacity={0.88}
              onPress={() => nav.navigate("PostDetail", { post })}
            >
              {/* Card header: company info + type badge */}
              <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarTxt}>
                    {post.company?.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase() || "??"}
                  </Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.company}>{post.company}</Text>
                  <Text style={styles.date}>{formatDate(post.createdAt)}</Text>
                </View>
                <View style={[styles.typeBadge, { backgroundColor: colors.bg }]}>
                  <View style={[styles.typeDot, { backgroundColor: colors.dot }]} />
                  <Text style={[styles.typeBadgeTxt, { color: colors.text }]}>{post.type}</Text>
                </View>
              </View>

              {/* Title & description */}
              <Text style={styles.cardTitle}>{post.title}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>{post.description}</Text>

              {/* Meta chips */}
              <View style={styles.metaRow}>
                {post.mode ? (
                  <View style={styles.metaChip}>
                    <Ionicons name="location-outline" size={11} color="#0066CC" />
                    <Text style={styles.metaChipTxt}>{post.mode}</Text>
                  </View>
                ) : null}
                {post.duration ? (
                  <View style={styles.metaChip}>
                    <Ionicons name="time-outline" size={11} color="#0066CC" />
                    <Text style={styles.metaChipTxt}>{post.duration}</Text>
                  </View>
                ) : null}
                {post.stipend ? (
                  <View style={styles.metaChip}>
                    <Ionicons name="cash-outline" size={11} color="#0066CC" />
                    <Text style={styles.metaChipTxt}>{post.stipend}</Text>
                  </View>
                ) : null}
                {post.seats ? (
                  <View style={styles.metaChip}>
                    <Ionicons name="people-outline" size={11} color="#0066CC" />
                    <Text style={styles.metaChipTxt}>{post.seats} seats</Text>
                  </View>
                ) : null}
              </View>

              {/* Skills */}
              {post.skills?.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
                  {post.skills.slice(0, 5).map((sk: string) => (
                    <View key={sk} style={styles.skillChip}>
                      <Text style={styles.skillChipTxt}>{sk}</Text>
                    </View>
                  ))}
                  {post.skills.length > 5 && (
                    <View style={styles.skillChip}>
                      <Text style={styles.skillChipTxt}>+{post.skills.length - 5}</Text>
                    </View>
                  )}
                </ScrollView>
              )}

              {/* Footer: applicants + apply button */}
              <View style={styles.cardFooter}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                  <Ionicons name="people-outline" size={14} color="#64748B" />
                  <Text style={styles.footerTxt}>{post.applications || 0} applicants</Text>
                </View>
                {post.deadline ? (
                  <Text style={styles.deadlineTxt}>Due: {post.deadline}</Text>
                ) : null}
                <TouchableOpacity style={styles.applyBtn}
                  onPress={() => nav.navigate("PostDetail", { post })}>
                  <Text style={styles.applyBtnTxt}>View</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: C.bg },
  header: { paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: "900", color: "#fff" },
  headerSub:   { fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 },
  filterBar: { backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderColor: "#F1F5F9" },
  filterChip: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, borderColor: "#E2E8F0", marginRight: 8 },
  filterChipActive: { backgroundColor: "#0A1628", borderColor: "#0A1628" },
  filterChipTxt: { fontSize: 13, fontWeight: "600", color: "#64748B" },
  filterChipTxtActive: { color: "#fff" },
  empty: { alignItems: "center", paddingTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: C.navy, marginTop: 16 },
  emptySub: { fontSize: 13, color: C.textLight, marginTop: 6 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8 },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#0E7490", justifyContent: "center", alignItems: "center" },
  avatarTxt: { fontSize: 14, fontWeight: "900", color: "#fff" },
  company: { fontSize: 13, fontWeight: "700", color: "#0A1628" },
  date: { fontSize: 11, color: "#94A3B8", marginTop: 2 },
  typeBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  typeDot: { width: 6, height: 6, borderRadius: 3 },
  typeBadgeTxt: { fontSize: 11, fontWeight: "700" },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "#0A1628", marginBottom: 6 },
  cardDesc: { fontSize: 13, color: "#475569", lineHeight: 19, marginBottom: 10 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  metaChip: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#EFF6FF", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  metaChipTxt: { fontSize: 11, fontWeight: "600", color: "#0066CC" },
  skillChip: { backgroundColor: "#EFF6FF", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginRight: 6, borderWidth: 1, borderColor: "#BFDBFE" },
  skillChipTxt: { fontSize: 11, fontWeight: "700", color: "#1D4ED8" },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderColor: "#F1F5F9" },
  footerTxt: { fontSize: 12, color: "#64748B", fontWeight: "600" },
  deadlineTxt: { fontSize: 11, color: "#DC2626", fontWeight: "600" },
  applyBtn: { backgroundColor: "#0066CC", paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20 },
  applyBtnTxt: { fontSize: 12, color: "#fff", fontWeight: "700" },
});


