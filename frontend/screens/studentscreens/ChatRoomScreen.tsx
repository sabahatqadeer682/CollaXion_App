import { CONSTANT } from "@/constants/constant";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import {
    createAudioPlayer,
    RecordingPresets,
    requestRecordingPermissionsAsync,
    setAudioModeAsync,
    useAudioRecorder,
    useAudioRecorderState,
} from "expo-audio";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Linking,
    Modal,
    Platform,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import socket from "./utils/Socket";

const formatBytes = (bytes: number) => {
    if (!bytes) return "";
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;
    let n = bytes;
    while (n >= 1024 && i < units.length - 1) {
        n /= 1024;
        i++;
    }
    return `${n.toFixed(n >= 10 ? 0 : 1)} ${units[i]}`;
};

const docIconFor = (mime?: string | null, name?: string | null) => {
    const ext = (name || "").toLowerCase().split(".").pop() || "";
    if (mime?.includes("pdf") || ext === "pdf") return { icon: "file-pdf-box", color: "#DC2626" };
    if (["doc", "docx"].includes(ext)) return { icon: "file-word-box", color: "#2563EB" };
    if (["xls", "xlsx", "csv"].includes(ext)) return { icon: "file-excel-box", color: "#16A34A" };
    if (["ppt", "pptx"].includes(ext)) return { icon: "file-powerpoint-box", color: "#EA580C" };
    if (["zip", "rar"].includes(ext)) return { icon: "folder-zip", color: "#7C3AED" };
    return { icon: "file-document-outline", color: "#64748B" };
};

interface Msg {
    _id?: string;
    senderEmail: string;
    receiverEmail: string;
    senderName?: string;
    text?: string;
    imageUrl?: string;
    videoUrl?: string;
    audioUrl?: string;
    audioDuration?: number;
    documentUrl?: string;
    documentName?: string;
    documentSize?: number;
    documentMime?: string;
    callType?: "audio" | "video" | null;
    callStatus?: "missed" | "answered" | "declined" | "cancelled" | "ended" | null;
    callDuration?: number;
    createdAt?: string;
    isOptimistic?: boolean;
    deletedForEveryone?: boolean;
    isRead?: boolean;
    isForwarded?: boolean;
    /* Upload tracking (client-side only, like WhatsApp) */
    isUploading?: boolean;
    uploadType?: "image" | "video" | "document" | "audio";
    localUri?: string;
    tempId?: string;
}

const getInitial = (name?: string) =>
    !name?.trim() ? "S" : name.trim().charAt(0).toUpperCase();

const resolveAvatarUri = (raw?: string | null): string | null => {
    if (!raw) return null;
    if (raw.startsWith("data:") || raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    if (raw.startsWith("file://")) return null;
    return `${CONSTANT.API_BASE_URL}${raw.startsWith("/") ? "" : "/"}${raw}`;
};

const formatLastSeen = (dateStr: string | null) => {
    if (!dateStr) return "Offline";
    const d = new Date(dateStr);
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diff < 60) return "Active just now";
    if (diff < 3600) return `Active ${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `Active ${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `Active ${Math.floor(diff / 86400)}d ago`;
    return `Last seen ${d.toLocaleDateString("en-PK", { day: "numeric", month: "short" })}`;
};

const formatDay = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const sameDay =
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear();
    if (sameDay) return "Today";
    const yest = new Date();
    yest.setDate(now.getDate() - 1);
    if (
        d.getDate() === yest.getDate() &&
        d.getMonth() === yest.getMonth() &&
        d.getFullYear() === yest.getFullYear()
    )
        return "Yesterday";
    return d.toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
};

const formatTime = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString("en-PK", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const ChatRoomScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { otherEmail, otherName, otherAvatar: otherAvatarParam } = route.params || {};

    const [myEmail, setMyEmail] = useState("");
    const [myName, setMyName] = useState("");
    const [messages, setMessages] = useState<Msg[]>([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [actionMsg, setActionMsg] = useState<Msg | null>(null);
    const [otherAvatar, setOtherAvatar] = useState<string | null>(otherAvatarParam || null);
    const [avatarFailed, setAvatarFailed] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(false);

    /* Presence + typing */
    const [isOnline, setIsOnline] = useState(false);
    const [lastActive, setLastActive] = useState<string | null>(null);
    const [otherTyping, setOtherTyping] = useState(false);

    /* Header menu + block */
    const [menuVisible, setMenuVisible] = useState(false);
    const [iBlocked, setIBlocked] = useState(false);
    const [blockedMe, setBlockedMe] = useState(false);
    const [showAttach, setShowAttach] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [forwardSource, setForwardSource] = useState<Msg | null>(null);
    const [forwardContacts, setForwardContacts] = useState<any[]>([]);
    const [forwardSearch, setForwardSearch] = useState("");
    const [forwardLoading, setForwardLoading] = useState(false);

    const flatRef = useRef<FlatList>(null);
    const typingTimeout = useRef<any>(null);
    const otherTypingTimer = useRef<any>(null);

    /* ─── Voice recording — mono override on HIGH_QUALITY preset ─── */
    const VOICE_NOTE_CONFIG: any = {
        ...RecordingPresets.HIGH_QUALITY,
        sampleRate: 44100,
        numberOfChannels: 1,
        bitRate: 128000,
        android: {
            ...(RecordingPresets.HIGH_QUALITY as any).android,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
        },
        ios: {
            ...(RecordingPresets.HIGH_QUALITY as any).ios,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
        },
    };

    const audioRecorder = useAudioRecorder(VOICE_NOTE_CONFIG);
    // Subscribed for future status display, not directly read
    useAudioRecorderState(audioRecorder, 200);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingSecs, setRecordingSecs] = useState(0);
    const recordTickRef = useRef<any>(null);
    const recordCancelledRef = useRef(false);

    /* ─── Voice playback ─── */
    const playerRef = useRef<any>(null);
    const [playingId, setPlayingId] = useState<string | null>(null);

    const playVoice = (msgId: string, url: string) => {
        try {
            // Stop any current player
            if (playerRef.current) {
                try { playerRef.current.pause(); } catch {}
                try { playerRef.current.remove(); } catch {}
                playerRef.current = null;
            }
            if (playingId === msgId) {
                setPlayingId(null);
                return;
            }
            const fullUrl = url.startsWith("http") ? url : `${CONSTANT.API_BASE_URL}${url}`;
            const player = createAudioPlayer({ uri: fullUrl });
            playerRef.current = player;
            player.play();
            setPlayingId(msgId);
            // Clear when finished
            const checker = setInterval(() => {
                try {
                    if (!player.playing && player.currentTime >= (player.duration || 0)) {
                        clearInterval(checker);
                        setPlayingId(null);
                        try { player.remove(); } catch {}
                        playerRef.current = null;
                    }
                } catch {
                    clearInterval(checker);
                }
            }, 500);
        } catch (err) {
            console.log("Voice playback error:", err);
            Alert.alert("Error", "Could not play voice note.");
        }
    };

    useEffect(() => {
        return () => {
            try { playerRef.current?.pause(); } catch {}
            try { playerRef.current?.remove(); } catch {}
        };
    }, []);

    /* ─── Load me ─── */
    useEffect(() => {
        (async () => {
            const email = await AsyncStorage.getItem("studentEmail");
            const name = await AsyncStorage.getItem("studentFullName");
            setMyEmail(email || "");
            setMyName(name || "");
        })();
    }, []);

    /* ─── Load other's profile (avatar + lastActive + block info) ─── */
    useEffect(() => {
        if (!otherEmail || !myEmail) return;
        (async () => {
            try {
                const r = await axios.get(
                    `${CONSTANT.API_BASE_URL}/api/student/getStudent/${otherEmail}`
                );
                if (r.data?.profileImage) {
                    setOtherAvatar(r.data.profileImage);
                    setAvatarFailed(false);
                }
                if (r.data?.lastActive) setLastActive(r.data.lastActive);
            } catch {
                /* ignore */
            }

            // Get block info from chat list endpoint
            try {
                const list = await axios.get(
                    `${CONSTANT.API_BASE_URL}/api/chat/students/${myEmail}`
                );
                const found = (list.data?.students || []).find(
                    (s: any) => s.email === otherEmail
                );
                if (found) {
                    setIBlocked(!!found.iBlocked);
                    setBlockedMe(!!found.blockedMe);
                    setIsOnline(!!found.online);
                    if (found.lastActive) setLastActive(found.lastActive);
                }
            } catch {
                /* ignore */
            }
        })();
    }, [otherEmail, myEmail]);

    /* ─── Socket ─── */
    useEffect(() => {
        if (!myEmail) return;
        socket.connect(CONSTANT.API_BASE_URL, myEmail);

        const handleNewMessage = (msg: Msg) => {
            const isRelevant =
                (msg.senderEmail === otherEmail && msg.receiverEmail === myEmail) ||
                (msg.senderEmail === myEmail && msg.receiverEmail === otherEmail);
            if (!isRelevant) return;

            setMessages((prev) => {
                if (msg.senderEmail === myEmail) {
                    const cleaned = prev.filter((m) => !m.isOptimistic);
                    if (cleaned.some((m) => m._id === msg._id)) return cleaned;
                    return [...cleaned, msg];
                }
                if (prev.some((m) => m._id === msg._id)) return prev;
                return [...prev, msg];
            });
            setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 80);
        };

        const handleMessageDeleted = (data: any) => {
            if (!data?._id) return;
            setMessages((prev) =>
                prev.map((m) =>
                    m._id === data._id
                        ? { ...m, deletedForEveryone: true, text: "", imageUrl: undefined }
                        : m
                )
            );
        };

        const handlePresence = (data: any) => {
            if (data?.email === otherEmail) {
                setIsOnline(!!data.online);
                if (data.lastActive) setLastActive(data.lastActive);
            }
        };

        const handlePresenceSnapshot = (data: any) => {
            const set = new Set(data?.onlineEmails || []);
            setIsOnline(set.has(otherEmail));
        };

        const handleTypingStatus = (data: any) => {
            if (data?.senderEmail !== otherEmail) return;
            setOtherTyping(!!data.isTyping);
            if (otherTypingTimer.current) clearTimeout(otherTypingTimer.current);
            if (data.isTyping) {
                otherTypingTimer.current = setTimeout(() => setOtherTyping(false), 4000);
            }
        };

        // ── Read receipts (blue tick) — receiver opened chat ──
        const handleMessagesRead = (data: any) => {
            if (data?.readerEmail !== otherEmail) return;
            const idSet = new Set<string>(data.ids || []);
            setMessages((prev) =>
                prev.map((m) =>
                    m._id && (idSet.has(m._id.toString()) || data.roomId === undefined)
                        ? { ...m, isRead: true }
                        : m
                )
            );
        };

        socket.on("newMessage", handleNewMessage);
        socket.on("messageDeleted", handleMessageDeleted);
        socket.on("presence", handlePresence);
        socket.on("presenceSnapshot", handlePresenceSnapshot);
        socket.on("typingStatus", handleTypingStatus);
        socket.on("messagesRead", handleMessagesRead);

        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.off("messageDeleted", handleMessageDeleted);
            socket.off("presence", handlePresence);
            socket.off("presenceSnapshot", handlePresenceSnapshot);
            socket.off("typingStatus", handleTypingStatus);
            socket.off("messagesRead", handleMessagesRead);
        };
    }, [myEmail, otherEmail]);

    /* ─── Fetch messages ─── */
    useEffect(() => {
        if (!myEmail || !otherEmail) return;
        (async () => {
            try {
                const res = await axios.get(
                    `${CONSTANT.API_BASE_URL}/api/chat/messages/${myEmail}/${otherEmail}`
                );
                setMessages(res.data.messages || []);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        })();
    }, [myEmail, otherEmail]);

    /* ─── Send text ─── */
    const sendMessage = () => {
        const text = inputText.trim();
        if (!text) return;
        if (iBlocked || blockedMe) {
            Alert.alert(
                iBlocked ? "User blocked" : "You are blocked",
                iBlocked
                    ? "Unblock this user to send messages."
                    : "You can no longer send messages to this user."
            );
            return;
        }
        setInputText("");
        socket.emit("sendMessage", {
            senderEmail: myEmail,
            senderName: myName,
            receiverEmail: otherEmail,
            text,
        });
        // stop typing
        socket.emit("typing", { senderEmail: myEmail, receiverEmail: otherEmail, isTyping: false });
    };

    /* ─── Send image ─── */
    const sendImage = async () => {
        setShowAttach(false);
        if (iBlocked || blockedMe) {
            Alert.alert("Action blocked", "You can't send media to this user.");
            return;
        }
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Permission needed", "Allow gallery access to send images.");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.7,
        });
        if (result.canceled) return;

        const asset = result.assets[0];
        const tempId = `tmp_${Date.now()}`;

        // Add optimistic uploading bubble immediately (WhatsApp style)
        setMessages((prev) => [
            ...prev,
            {
                tempId,
                senderEmail: myEmail,
                receiverEmail: otherEmail,
                senderName: myName,
                imageUrl: asset.uri,
                localUri: asset.uri,
                isUploading: true,
                uploadType: "image",
                createdAt: new Date().toISOString(),
            } as Msg,
        ]);
        setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 80);

        const formData = new FormData();
        formData.append("image", { uri: asset.uri, name: "photo.jpg", type: "image/jpeg" } as any);
        formData.append("senderEmail", myEmail);
        formData.append("senderName", myName);
        formData.append("receiverEmail", otherEmail);

        try {
            setSending(true);
            const res = await axios.post(
                `${CONSTANT.API_BASE_URL}/api/chat/send-image`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            if (res.data.success) {
                setMessages((prev) => {
                    const withoutTemp = prev.filter((m) => m.tempId !== tempId);
                    if (withoutTemp.some((m) => m._id && m._id === res.data.message._id)) return withoutTemp;
                    return [...withoutTemp, res.data.message];
                });
                setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 80);
            }
        } catch {
            // Remove the optimistic message on error
            setMessages((prev) => prev.filter((m) => m.tempId !== tempId));
            Alert.alert("Error", "Could not send image.");
        } finally {
            setSending(false);
        }
    };

    /* ─── Send video ─── */
    const sendVideo = async () => {
        setShowAttach(false);
        if (iBlocked || blockedMe) {
            Alert.alert("Action blocked", "You can't send media to this user.");
            return;
        }
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Permission needed", "Allow gallery access to send videos.");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["videos"],
            quality: 0.7,
        });
        if (result.canceled) return;

        const asset: any = result.assets[0];
        const fileName = asset.fileName || `video_${Date.now()}.mp4`;
        const tempId = `tmp_${Date.now()}`;

        setMessages((prev) => [
            ...prev,
            {
                tempId,
                senderEmail: myEmail,
                receiverEmail: otherEmail,
                senderName: myName,
                videoUrl: asset.uri,
                localUri: asset.uri,
                isUploading: true,
                uploadType: "video",
                createdAt: new Date().toISOString(),
            } as Msg,
        ]);
        setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 80);

        const formData = new FormData();
        formData.append("video", {
            uri: asset.uri,
            name: fileName,
            type: asset.mimeType || "video/mp4",
        } as any);
        formData.append("senderEmail", myEmail);
        formData.append("senderName", myName);
        formData.append("receiverEmail", otherEmail);

        try {
            setSending(true);
            const res = await axios.post(
                `${CONSTANT.API_BASE_URL}/api/chat/send-video`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            if (res.data.success) {
                setMessages((prev) => {
                    const withoutTemp = prev.filter((m) => m.tempId !== tempId);
                    if (withoutTemp.some((m) => m._id && m._id === res.data.message._id)) return withoutTemp;
                    return [...withoutTemp, res.data.message];
                });
                setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 80);
            }
        } catch (err: any) {
            console.log("Video send error:", err?.response?.data || err?.message);
            setMessages((prev) => prev.filter((m) => m.tempId !== tempId));
            Alert.alert("Error", "Could not send video. Please try again.");
        } finally {
            setSending(false);
        }
    };

    /* ─── Send document ─── */
    const sendDocument = async () => {
        setShowAttach(false);
        if (iBlocked || blockedMe) {
            Alert.alert("Action blocked", "You can't send media to this user.");
            return;
        }
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: [
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "application/vnd.ms-excel",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "application/vnd.ms-powerpoint",
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                    "text/plain",
                    "text/csv",
                    "application/zip",
                    "application/x-rar-compressed",
                ],
                copyToCacheDirectory: true,
                multiple: false,
            });
            if (result.canceled) return;

            const asset = result.assets[0];
            const tempId = `tmp_${Date.now()}`;

            setMessages((prev) => [
                ...prev,
                {
                    tempId,
                    senderEmail: myEmail,
                    receiverEmail: otherEmail,
                    senderName: myName,
                    documentUrl: asset.uri,
                    documentName: asset.name,
                    documentSize: asset.size || 0,
                    documentMime: asset.mimeType || "application/octet-stream",
                    localUri: asset.uri,
                    isUploading: true,
                    uploadType: "document",
                    createdAt: new Date().toISOString(),
                } as Msg,
            ]);
            setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 80);

            const formData = new FormData();
            formData.append("document", {
                uri: asset.uri,
                name: asset.name,
                type: asset.mimeType || "application/octet-stream",
            } as any);
            formData.append("senderEmail", myEmail);
            formData.append("senderName", myName);
            formData.append("receiverEmail", otherEmail);

            setSending(true);
            const res = await axios.post(
                `${CONSTANT.API_BASE_URL}/api/chat/send-document`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            if (res.data.success) {
                setMessages((prev) => {
                    const withoutTemp = prev.filter((m) => m.tempId !== tempId);
                    if (withoutTemp.some((m) => m._id && m._id === res.data.message._id)) return withoutTemp;
                    return [...withoutTemp, res.data.message];
                });
                setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 80);
            }
        } catch (err: any) {
            console.log("Document send error:", err?.response?.data || err?.message);
            setMessages((prev) => prev.filter((m) => !m.isUploading || m.uploadType !== "document"));
            Alert.alert("Error", "Could not send document. Please try again.");
        } finally {
            setSending(false);
        }
    };

    /* ─── Voice notes (record + upload) ─── */
    const startRecording = async () => {
        if (iBlocked || blockedMe) {
            Alert.alert("Action blocked", "You can't send voice notes to this user.");
            return;
        }
        try {
            const perm = await requestRecordingPermissionsAsync();
            if (!perm.granted) {
                Alert.alert("Microphone permission", "Allow microphone access to record voice notes.");
                return;
            }
            // Configure audio mode for clear voice recording (mic-optimized)
            await setAudioModeAsync({
                allowsRecording: true,
                playsInSilentMode: true,
                shouldRouteThroughEarpiece: false,
                interruptionMode: "doNotMix",
                interruptionModeAndroid: "doNotMix",
            } as any);
            await audioRecorder.prepareToRecordAsync();
            audioRecorder.record();
            recordCancelledRef.current = false;
            setIsRecording(true);
            setRecordingSecs(0);
            recordTickRef.current = setInterval(() => {
                setRecordingSecs((s) => s + 1);
            }, 1000);
        } catch (err: any) {
            console.log("Record start error:", err?.message);
            Alert.alert("Error", "Could not start recording.");
        }
    };

    const cancelRecording = async () => {
        recordCancelledRef.current = true;
        try {
            await audioRecorder.stop();
        } catch {}
        if (recordTickRef.current) clearInterval(recordTickRef.current);
        setIsRecording(false);
        setRecordingSecs(0);
    };

    const stopAndSendRecording = async () => {
        if (recordTickRef.current) clearInterval(recordTickRef.current);
        const duration = recordingSecs;
        try {
            await audioRecorder.stop();
        } catch {}
        const uri = audioRecorder.uri;
        setIsRecording(false);
        setRecordingSecs(0);

        if (recordCancelledRef.current) return;
        if (!uri || duration < 1) {
            Alert.alert("Voice note too short", "Hold to record at least 1 second.");
            return;
        }

        const tempId = `tmp_${Date.now()}`;
        setMessages((prev) => [
            ...prev,
            {
                tempId,
                senderEmail: myEmail,
                receiverEmail: otherEmail,
                senderName: myName,
                audioUrl: uri,
                audioDuration: duration,
                localUri: uri,
                isUploading: true,
                uploadType: "audio",
                createdAt: new Date().toISOString(),
            } as Msg,
        ]);
        setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 80);

        const formData = new FormData();
        formData.append("audio", {
            uri,
            name: `voice_${Date.now()}.m4a`,
            type: "audio/m4a",
        } as any);
        formData.append("senderEmail", myEmail);
        formData.append("senderName", myName);
        formData.append("receiverEmail", otherEmail);
        formData.append("duration", String(duration));

        try {
            setSending(true);
            const res = await axios.post(
                `${CONSTANT.API_BASE_URL}/api/chat/send-audio`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            if (res.data.success) {
                setMessages((prev) => {
                    const withoutTemp = prev.filter((m) => m.tempId !== tempId);
                    if (withoutTemp.some((m) => m._id && m._id === res.data.message._id)) return withoutTemp;
                    return [...withoutTemp, res.data.message];
                });
                setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 80);
            }
        } catch (err: any) {
            console.log("Voice send error:", err?.response?.data || err?.message);
            setMessages((prev) => prev.filter((m) => m.tempId !== tempId));
            Alert.alert("Error", "Could not send voice note.");
        } finally {
            setSending(false);
        }
    };

    const sendVoiceNote = async () => {
        setShowAttach(false);
        Alert.alert(
            "Tip",
            "Hold the 🎤 mic button (next to the send button) to record a voice note. Release to send."
        );
    };


    /* ─── Forward message ─── */
    const openForwardSheet = async (msg: Msg) => {
        if (!msg?._id) return;
        setActionMsg(null);
        setForwardSource(msg);
        setForwardSearch("");
        try {
            const res = await axios.get(`${CONSTANT.API_BASE_URL}/api/chat/students/${myEmail}`);
            setForwardContacts((res.data?.students || []).filter((s: any) => s.email !== otherEmail));
        } catch {
            setForwardContacts([]);
        }
    };

    const forwardToUser = async (target: any) => {
        if (!forwardSource?._id) return;
        try {
            setForwardLoading(true);
            await axios.post(`${CONSTANT.API_BASE_URL}/api/chat/forward`, {
                senderEmail: myEmail,
                senderName: myName,
                receiverEmail: target.email,
                sourceMessageId: forwardSource._id,
            });
            setForwardSource(null);
            setForwardSearch("");
            Alert.alert("Forwarded", `Message sent to ${target.fullName}`);
        } catch (err: any) {
            Alert.alert("Error", err?.response?.data?.message || "Could not forward.");
        } finally {
            setForwardLoading(false);
        }
    };

    /* ─── Open document / video ─── */
    const isVideoUrl = (u: string) =>
        /\.(mp4|mov|m4v|webm|3gp|mkv|avi|flv|wmv)(\?.*)?$/i.test(u);

    const openExternal = async (url?: string | null) => {
        if (!url) return;
        let full = url.startsWith("http") ? url : `${CONSTANT.API_BASE_URL}${url}`;

        // Videos → use byte-range streaming endpoint for smooth playback
        if (isVideoUrl(full)) {
            // Convert /uploads/chat/x.mp4 → /stream/chat/x.mp4 (range-supported)
            full = full.replace("/uploads/chat/", "/stream/chat/");
            try {
                await Linking.openURL(full);
            } catch {
                Alert.alert("Error", "Could not open video. Install a video player app.");
            }
            return;
        }

        // Documents → in-app browser overlay (WhatsApp-style)
        try {
            await WebBrowser.openBrowserAsync(full, {
                presentationStyle: WebBrowser.WebBrowserPresentationStyle.OVER_FULL_SCREEN,
                controlsColor: "#193648",
                toolbarColor: "#193648",
                enableBarCollapsing: true,
                showTitle: true,
                dismissButtonStyle: "close",
            });
        } catch {
            try {
                await Linking.openURL(full);
            } catch {
                Alert.alert("Error", "Could not open file.");
            }
        }
    };

    /* ─── Typing emit ─── */
    const onChangeInput = (text: string) => {
        setInputText(text);
        if (iBlocked || blockedMe) return;
        socket.emit("typing", { senderEmail: myEmail, receiverEmail: otherEmail, isTyping: true });
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => {
            socket.emit("typing", {
                senderEmail: myEmail,
                receiverEmail: otherEmail,
                isTyping: false,
            });
        }, 1500);
    };

    /* ─── Block / Unblock ─── */
    const toggleBlock = async () => {
        setMenuVisible(false);
        try {
            const action = iBlocked ? "unblock" : "block";
            await axios.post(`${CONSTANT.API_BASE_URL}/api/chat/${action}`, {
                myEmail,
                otherEmail,
            });
            setIBlocked(!iBlocked);
            Alert.alert(
                iBlocked ? "Unblocked" : "Blocked",
                iBlocked
                    ? `${otherName} can now message you again.`
                    : `${otherName} won't be able to message you.`
            );
        } catch {
            Alert.alert("Error", "Could not update block status.");
        }
    };

    /* ─── Clear chat ─── */
    const clearChat = () => {
        setMenuVisible(false);
        Alert.alert("Clear chat?", `Delete your conversation with ${otherName}?`, [
            { text: "Cancel", style: "cancel" },
            {
                text: "Clear",
                style: "destructive",
                onPress: async () => {
                    try {
                        await axios.delete(
                            `${CONSTANT.API_BASE_URL}/api/chat/conversation/${myEmail}/${otherEmail}`
                        );
                        setMessages([]);
                    } catch {
                        Alert.alert("Error", "Could not clear chat.");
                    }
                },
            },
        ]);
    };

    /* ─── Delete handlers ─── */
    const deleteForMe = async (msg: Msg) => {
        setActionMsg(null);
        if (!msg._id) {
            setMessages((prev) => prev.filter((m) => m !== msg));
            return;
        }
        try {
            await axios.post(
                `${CONSTANT.API_BASE_URL}/api/chat/message/${msg._id}/hide`,
                { email: myEmail }
            );
            setMessages((prev) => prev.filter((m) => m._id !== msg._id));
        } catch {
            Alert.alert("Error", "Could not delete message.");
        }
    };

    const deleteForEveryone = async (msg: Msg) => {
        setActionMsg(null);
        if (!msg._id) return;
        try {
            await axios.post(
                `${CONSTANT.API_BASE_URL}/api/chat/message/${msg._id}/unsend`,
                { email: myEmail }
            );
            setMessages((prev) =>
                prev.map((m) =>
                    m._id === msg._id
                        ? { ...m, deletedForEveryone: true, text: "", imageUrl: undefined }
                        : m
                )
            );
        } catch (err: any) {
            Alert.alert("Error", err?.response?.data?.message || "Could not unsend message.");
        }
    };

    /* ─── Bubble body renderer (handles all message types) ─── */
    const renderBubbleBody = (item: Msg, isMe: boolean, isDeleted: boolean) => {
        // Call-log message (special centered card)
        if (item.callType) {
            const isMissed = item.callStatus === "missed" || item.callStatus === "declined" || item.callStatus === "cancelled";
            const iconName = item.callType === "video" ? "videocam" : "call";
            const iconColor = isMissed ? "#EF4444" : isMe ? "#fff" : "#10B981";
            const label =
                item.callStatus === "missed"
                    ? `Missed ${item.callType} call`
                    : item.callStatus === "declined"
                    ? `Declined ${item.callType} call`
                    : item.callStatus === "cancelled"
                    ? `Cancelled ${item.callType} call`
                    : `${item.callType === "video" ? "Video" : "Voice"} call · ${Math.floor((item.callDuration || 0) / 60)}:${String((item.callDuration || 0) % 60).padStart(2, "0")}`;
            return (
                <View
                    style={[
                        styles.callBubble,
                        isMe ? styles.meBubble : styles.otherBubble,
                    ]}
                >
                    <Ionicons name={iconName as any} size={16} color={isMe ? "#fff" : iconColor} />
                    <Text style={isMe ? styles.meText : styles.otherText}>{label}</Text>
                </View>
            );
        }

        // Common wrapper for media/text bubbles
        const Wrapper: any = isMe && !isDeleted ? LinearGradient : View;
        const wrapperProps: any = isMe && !isDeleted
            ? {
                  colors: ["#193648", "#2A5A72"],
                  start: { x: 0, y: 0 },
                  end: { x: 1, y: 1 },
              }
            : {};

        return (
            <Wrapper
                {...wrapperProps}
                style={[
                    styles.bubble,
                    isMe ? styles.meBubble : styles.otherBubble,
                    isDeleted && styles.deletedBubble,
                    (item.documentUrl || item.videoUrl) && { padding: 0 },
                ]}
            >
                {item.isForwarded && !isDeleted && (
                    <View
                        style={[
                            styles.forwardedTag,
                            (item.documentUrl || item.videoUrl) && {
                                paddingTop: 8,
                                paddingHorizontal: 12,
                            },
                        ]}
                    >
                        <Ionicons
                            name="arrow-redo-outline"
                            size={11}
                            color={isMe ? "rgba(255,255,255,0.75)" : "#94A3B8"}
                        />
                        <Text
                            style={[
                                styles.forwardedText,
                                { color: isMe ? "rgba(255,255,255,0.75)" : "#94A3B8" },
                            ]}
                        >
                            Forwarded
                        </Text>
                    </View>
                )}
                {isDeleted ? (
                    <View style={[styles.deletedRow, { padding: 8 }]}>
                        <Ionicons
                            name="ban-outline"
                            size={13}
                            color={isMe ? "rgba(255,255,255,0.7)" : "#9CA3AF"}
                        />
                        <Text
                            style={[
                                styles.deletedText,
                                { color: isMe ? "rgba(255,255,255,0.75)" : "#9CA3AF" },
                            ]}
                        >
                            {isMe ? "You deleted this message" : "This message was deleted"}
                        </Text>
                    </View>
                ) : item.imageUrl ? (
                    <View>
                        <Image
                            source={{
                                uri: item.isUploading
                                    ? item.localUri || item.imageUrl
                                    : `${CONSTANT.API_BASE_URL}${item.imageUrl}`,
                            }}
                            style={styles.msgImage}
                        />
                        {item.isUploading && (
                            <View style={styles.uploadOverlay}>
                                <ActivityIndicator size="large" color="#fff" />
                                <Text style={styles.uploadOverlayText}>Uploading…</Text>
                            </View>
                        )}
                        <View style={[styles.bubbleMetaRow, { paddingHorizontal: 4, paddingTop: 4 }]}>
                            <Text style={isMe ? styles.meTime : styles.otherTime}>
                                {formatTime(item.createdAt)}
                            </Text>
                            {isMe && (
                                <Ionicons
                                    name={item.isRead || isOnline ? "checkmark-done" : "checkmark"}
                                    size={13}
                                    color={
                                        item.isRead
                                            ? "#38BDF8"
                                            : isOnline
                                            ? "#34D399"
                                            : "rgba(255,255,255,0.7)"
                                    }
                                />
                            )}
                        </View>
                    </View>
                ) : item.videoUrl ? (
                    <Pressable onPress={() => !item.isUploading && openExternal(item.videoUrl)}>
                        <View style={styles.videoCard}>
                            {item.isUploading ? (
                                <>
                                    <ActivityIndicator size="large" color="#fff" />
                                    <View style={styles.videoFooter}>
                                        <Ionicons name="cloud-upload" size={14} color="#fff" />
                                        <Text style={styles.videoLabel}>Uploading video…</Text>
                                    </View>
                                </>
                            ) : (
                                <>
                                    <View style={styles.videoPlayBadge}>
                                        <Ionicons name="play" size={26} color="#fff" />
                                    </View>
                                    <View style={styles.videoFooter}>
                                        <Ionicons name="videocam" size={14} color="#fff" />
                                        <Text style={styles.videoLabel}>Video · Tap to play</Text>
                                    </View>
                                </>
                            )}
                        </View>
                        <View
                            style={[
                                styles.bubbleMetaRow,
                                { paddingHorizontal: 8, paddingTop: 4, paddingBottom: 6 },
                            ]}
                        >
                            <Text style={isMe ? styles.meTime : styles.otherTime}>
                                {formatTime(item.createdAt)}
                            </Text>
                            {isMe && (
                                <Ionicons
                                    name={item.isRead || isOnline ? "checkmark-done" : "checkmark"}
                                    size={13}
                                    color={
                                        item.isRead
                                            ? "#38BDF8"
                                            : isOnline
                                            ? "#34D399"
                                            : "rgba(255,255,255,0.7)"
                                    }
                                />
                            )}
                        </View>
                    </Pressable>
                ) : item.audioUrl ? (
                    <View style={styles.audioRow}>
                        <Pressable
                            style={[
                                styles.audioPlayBtn,
                                { backgroundColor: isMe ? "rgba(255,255,255,0.2)" : "#193648" },
                            ]}
                            onPress={() => item._id && playVoice(item._id, item.audioUrl!)}
                        >
                            <Ionicons
                                name={item._id && playingId === item._id ? "pause" : "play"}
                                size={16}
                                color="#fff"
                            />
                        </Pressable>
                        <View style={styles.audioWaveform}>
                            {[7, 12, 9, 14, 6, 11, 8, 13, 10, 7, 12, 9].map((h, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.audioBar,
                                        {
                                            height: h,
                                            backgroundColor: isMe ? "rgba(255,255,255,0.6)" : "#94A3B8",
                                        },
                                    ]}
                                />
                            ))}
                        </View>
                        <Text
                            style={{
                                color: isMe ? "rgba(255,255,255,0.85)" : "#64748B",
                                fontSize: 11,
                                fontWeight: "600",
                                marginLeft: 6,
                            }}
                        >
                            {Math.floor((item.audioDuration || 0) / 60)}:
                            {String((item.audioDuration || 0) % 60).padStart(2, "0")}
                        </Text>
                    </View>
                ) : item.documentUrl ? (
                    <Pressable
                        onPress={() => !item.isUploading && openExternal(item.documentUrl)}
                        style={styles.docRow}
                    >
                        {(() => {
                            const meta = docIconFor(item.documentMime, item.documentName);
                            return (
                                <View style={styles.docIconBox}>
                                    {item.isUploading ? (
                                        <ActivityIndicator size="small" color={meta.color} />
                                    ) : (
                                        <MaterialCommunityIcons
                                            name={meta.icon as any}
                                            size={32}
                                            color={meta.color}
                                        />
                                    )}
                                </View>
                            );
                        })()}
                        <View style={{ flex: 1 }}>
                            <Text
                                style={[
                                    styles.docName,
                                    { color: isMe ? "#fff" : "#193648" },
                                ]}
                                numberOfLines={2}
                            >
                                {item.documentName || "Document"}
                            </Text>
                            <Text
                                style={[
                                    styles.docMeta,
                                    { color: isMe ? "rgba(255,255,255,0.75)" : "#64748B" },
                                ]}
                            >
                                {item.isUploading
                                    ? "Uploading…"
                                    : `${formatBytes(item.documentSize || 0)} · Tap to open`}
                            </Text>
                        </View>
                        {item.isUploading ? (
                            <Ionicons name="cloud-upload-outline" size={20} color={isMe ? "#fff" : "#193648"} />
                        ) : (
                            <Ionicons name="download-outline" size={20} color={isMe ? "#fff" : "#193648"} />
                        )}
                    </Pressable>
                ) : (
                    <Text style={isMe ? styles.meText : styles.otherText}>{item.text}</Text>
                )}

                {!isDeleted && !item.imageUrl && !item.videoUrl && !item.documentUrl && !item.audioUrl && (
                    <View style={styles.bubbleMetaRow}>
                        <Text style={isMe ? styles.meTime : styles.otherTime}>
                            {formatTime(item.createdAt)}
                        </Text>
                        {isMe && (
                            <Ionicons
                                name={item.isRead || isOnline ? "checkmark-done" : "checkmark"}
                                size={13}
                                color={
                                    item.isRead
                                        ? "#38BDF8"
                                        : isOnline
                                        ? "#34D399"
                                        : "rgba(255,255,255,0.7)"
                                }
                            />
                        )}
                    </View>
                )}

                {item.audioUrl && (
                    <View style={[styles.bubbleMetaRow, { paddingHorizontal: 4, paddingBottom: 2 }]}>
                        <Text style={isMe ? styles.meTime : styles.otherTime}>
                            {formatTime(item.createdAt)}
                        </Text>
                        {isMe && (
                            <Ionicons
                                name={item.isRead || isOnline ? "checkmark-done" : "checkmark"}
                                size={13}
                                color={
                                    item.isRead
                                        ? "#38BDF8"
                                        : isOnline
                                        ? "#34D399"
                                        : "rgba(255,255,255,0.7)"
                                }
                            />
                        )}
                    </View>
                )}
            </Wrapper>
        );
    };

    /* ─── Render with date dividers ─── */
    const renderMessage = ({ item, index }: { item: Msg; index: number }) => {
        const isMe = item.senderEmail === myEmail;
        const isDeleted = item.deletedForEveryone;
        const prev = messages[index - 1];
        const showDay =
            !prev ||
            new Date(prev.createdAt || 0).toDateString() !==
                new Date(item.createdAt || 0).toDateString();

        return (
            <View>
                {showDay && (
                    <View style={styles.dayPillWrap}>
                        <View style={styles.dayPill}>
                            <Text style={styles.dayPillText}>{formatDay(item.createdAt)}</Text>
                        </View>
                    </View>
                )}

                <View style={[styles.msgRow, isMe ? styles.meRow : styles.otherRow]}>
                    {!isMe &&
                        (() => {
                            const uri = !avatarFailed ? resolveAvatarUri(otherAvatar) : null;
                            return uri ? (
                                <Image
                                    source={{ uri }}
                                    style={styles.smallAvatarImg}
                                    onError={() => setAvatarFailed(true)}
                                />
                            ) : (
                                <View style={styles.smallAvatar}>
                                    <Text style={styles.smallAvatarText}>
                                        {getInitial(otherName)}
                                    </Text>
                                </View>
                            );
                        })()}

                    <Pressable
                        onLongPress={() => !isDeleted && setActionMsg(item)}
                        delayLongPress={250}
                        style={({ pressed }) => [pressed && !isDeleted && { opacity: 0.85 }]}
                    >
                        {renderBubbleBody(item, isMe, !!isDeleted)}
                    </Pressable>
                </View>
            </View>
        );
    };

    /* Subtitle in header */
    let headerSubtitle: string;
    let subtitleColor = "rgba(255,255,255,0.75)";
    if (otherTyping) {
        headerSubtitle = "typing…";
        subtitleColor = "#34D399";
    } else if (isOnline) {
        headerSubtitle = "Active now";
        subtitleColor = "#34D399";
    } else {
        headerSubtitle = formatLastSeen(lastActive);
    }

    const inputDisabled = iBlocked || blockedMe;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#F4F7FB" }}
            behavior="padding"
            keyboardVerticalOffset={0}
        >
            <StatusBar barStyle="light-content" backgroundColor="#193648" translucent={false} />
            {/* HEADER — WhatsApp style */}
            <View style={styles.header}>
                {/* Back arrow + Avatar group (tap to open profile/preview) */}
                <TouchableOpacity
                    onPress={() => navigation.navigate("ChatList")}
                    style={styles.headerBackBtn}
                    hitSlop={8}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>

                <Pressable
                    style={styles.headerProfileGroup}
                    onPress={() => {
                        const uri = !avatarFailed ? resolveAvatarUri(otherAvatar) : null;
                        if (uri) setAvatarPreview(true);
                    }}
                >
                    {(() => {
                        const uri = !avatarFailed ? resolveAvatarUri(otherAvatar) : null;
                        return (
                            <View style={styles.headerAvatarWrap}>
                                {uri ? (
                                    <Image
                                        source={{ uri }}
                                        style={styles.headerAvatar}
                                        onError={() => setAvatarFailed(true)}
                                    />
                                ) : (
                                    <View style={[styles.headerAvatar, styles.headerAvatarFallback]}>
                                        <Text style={styles.headerAvatarText}>
                                            {getInitial(otherName)}
                                        </Text>
                                    </View>
                                )}
                                {isOnline && <View style={styles.headerOnlineDot} />}
                            </View>
                        );
                    })()}

                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.headerName} numberOfLines={1}>
                            {otherName}
                        </Text>
                        <Text
                            style={[
                                styles.headerSub,
                                { color: subtitleColor },
                                otherTyping && { fontStyle: "italic", fontWeight: "700" },
                            ]}
                            numberOfLines={1}
                        >
                            {headerSubtitle}
                        </Text>
                    </View>
                </Pressable>

                {/* Right action — only 3-dot menu */}
                <TouchableOpacity
                    style={styles.headerActionBtn}
                    hitSlop={8}
                    onPress={() => setMenuVisible(true)}
                >
                    <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Block banners */}
            {blockedMe && (
                <View style={[styles.banner, { backgroundColor: "#FEF2F2", borderColor: "#FCA5A5" }]}>
                    <Ionicons name="alert-circle" size={16} color="#DC2626" />
                    <Text style={[styles.bannerText, { color: "#991B1B" }]}>
                        You can&apos;t reply to this conversation
                    </Text>
                </View>
            )}
            {iBlocked && !blockedMe && (
                <View style={[styles.banner, { backgroundColor: "#FFF7ED", borderColor: "#FDBA74" }]}>
                    <Ionicons name="ban" size={16} color="#C2410C" />
                    <Text style={[styles.bannerText, { color: "#9A3412" }]}>
                        You blocked {otherName}. Unblock to chat again.
                    </Text>
                </View>
            )}

            {/* Messages */}
            {loading ? (
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <ActivityIndicator color="#193648" size="large" />
                </View>
            ) : messages.length === 0 ? (
                <View style={styles.emptyChat}>
                    <View style={styles.emptyIconCircle}>
                        <MaterialCommunityIcons
                            name="message-text-outline"
                            size={36}
                            color="#193648"
                        />
                    </View>
                    <Text style={styles.emptyTitle}>Start the conversation</Text>
                    <Text style={styles.emptySub}>
                        Say hello to {otherName?.split(" ")[0]} 👋
                    </Text>
                </View>
            ) : (
                <FlatList
                    ref={flatRef}
                    data={messages}
                    keyExtractor={(item, i) => `${item._id || "opt"}-${i}`}
                    renderItem={renderMessage}
                    contentContainerStyle={{ padding: 12, paddingBottom: 20 }}
                    onContentSizeChange={() =>
                        flatRef.current?.scrollToEnd({ animated: false })
                    }
                />
            )}

            {/* Typing bubble (other side) */}
            {otherTyping && messages.length > 0 && (
                <View style={styles.typingBubbleWrap}>
                    <View style={styles.typingBubble}>
                        <View style={styles.typingDot} />
                        <View style={[styles.typingDot, { opacity: 0.6 }]} />
                        <View style={[styles.typingDot, { opacity: 0.4 }]} />
                    </View>
                </View>
            )}

            {/* INPUT or RECORDING UI */}
            {isRecording ? (
                <View style={styles.recordingBar}>
                    <Pressable style={styles.recordCancelBtn} onPress={cancelRecording}>
                        <Ionicons name="trash" size={20} color="#EF4444" />
                    </Pressable>
                    <View style={styles.recordingMid}>
                        <View style={styles.recordingDot} />
                        <Text style={styles.recordingText}>
                            Recording · {Math.floor(recordingSecs / 60)}:
                            {String(recordingSecs % 60).padStart(2, "0")}
                        </Text>
                        <Text style={styles.recordingHint}>Release to send</Text>
                    </View>
                    <Pressable style={styles.recordSendBtn} onPress={stopAndSendRecording}>
                        <Ionicons name="send" size={18} color="#fff" />
                    </Pressable>
                </View>
            ) : (
                <View style={styles.inputBar}>
                    {/* WhatsApp-style pill input with icons inside */}
                    <View style={styles.inputWrap}>
                        <TouchableOpacity
                            onPress={() => !inputDisabled && setShowEmojiPicker((v) => !v)}
                            disabled={inputDisabled}
                            style={styles.inlineIconBtn}
                            hitSlop={6}
                        >
                            <Ionicons
                                name={showEmojiPicker ? "close" : "happy-outline"}
                                size={22}
                                color={inputDisabled ? "#CBD5E1" : showEmojiPicker ? "#193648" : "#64748B"}
                            />
                        </TouchableOpacity>

                        <TextInput
                            value={inputText}
                            onChangeText={onChangeInput}
                            placeholder={
                                inputDisabled ? "Messaging unavailable" : "Message"
                            }
                            placeholderTextColor="#9CA3AF"
                            style={styles.input}
                            editable={!inputDisabled}
                        />

                        <TouchableOpacity
                            onPress={() => !inputDisabled && setShowAttach(true)}
                            disabled={inputDisabled}
                            style={styles.inlineIconBtn}
                            hitSlop={6}
                        >
                            <Ionicons
                                name="attach"
                                size={22}
                                color={inputDisabled ? "#CBD5E1" : "#64748B"}
                                style={{ transform: [{ rotate: "-30deg" }] }}
                            />
                        </TouchableOpacity>
                    </View>

                    {inputText.trim() ? (
                        <TouchableOpacity
                            onPress={sendMessage}
                            disabled={inputDisabled || sending}
                            style={[styles.sendBtn, (inputDisabled || sending) && { opacity: 0.5 }]}
                        >
                            <LinearGradient
                                colors={["#193648", "#193648"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.sendBtnInner}
                            >
                                <Ionicons name="send" size={18} color="#fff" />
                            </LinearGradient>
                        </TouchableOpacity>
                    ) : (
                        <Pressable
                            onLongPress={startRecording}
                            delayLongPress={150}
                            disabled={inputDisabled}
                            style={[styles.sendBtn, inputDisabled && { opacity: 0.5 }]}
                        >
                            <LinearGradient
                                colors={["#193648", "#193648"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.sendBtnInner}
                            >
                                <Ionicons name="mic" size={20} color="#fff" />
                            </LinearGradient>
                        </Pressable>
                    )}
                </View>
            )}

            {/* Inline Emoji Panel — sits below input, input stays visible */}
            {showEmojiPicker && (
                <View style={styles.emojiPanel}>
                    {(() => {
                        const EMOJI_GROUPS: { title: string; emojis: string[] }[] = [
                            {
                                title: "Smileys",
                                emojis: ["😀","😃","😄","😁","😆","🥹","😂","🤣","😊","😇","🙂","🙃","😉","😌","😍","🥰","😘","😗","😙","😚","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥","😔","😪","🤤","😴"],
                            },
                            {
                                title: "Hearts",
                                emojis: ["❤️","🧡","💛","💚","💙","💜","🤎","🖤","🤍","💖","💗","💓","💞","💕","💟","❣️","💔","💌","💋","💝"],
                            },
                            {
                                title: "Hands",
                                emojis: ["👍","👎","👌","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","👇","☝️","👋","🤚","🖐️","✋","🖖","👏","🙌","🤝","🙏","💪","👀"],
                            },
                            {
                                title: "Celebrate",
                                emojis: ["🎉","🎊","🎈","🎁","🎂","🍰","🥳","🤩","🔥","✨","⭐","🌟","💫","💯","🏆","🥇","🎯","🚀"],
                            },
                            {
                                title: "Common",
                                emojis: ["✅","❌","⚠️","💡","📌","🔔","🔕","💤","💬","💭","🤖","📚","💻","📱","☕","🍕","🍔","🌮"],
                            },
                        ];
                        return (
                            <FlatList
                                data={EMOJI_GROUPS}
                                keyExtractor={(g) => g.title}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 8 }}
                                renderItem={({ item: group }) => (
                                    <View style={{ marginBottom: 8 }}>
                                        <Text style={styles.emojiGroupTitle}>{group.title}</Text>
                                        <View style={styles.emojiGrid}>
                                            {group.emojis.map((e, i) => (
                                                <TouchableOpacity
                                                    key={`${group.title}-${i}`}
                                                    style={styles.emojiCell}
                                                    onPress={() => setInputText((prev) => prev + e)}
                                                >
                                                    <Text style={styles.emojiChar}>{e}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                )}
                            />
                        );
                    })()}
                </View>
            )}

            {/* Attachment sheet */}
            <Modal
                transparent
                visible={showAttach}
                animationType="slide"
                onRequestClose={() => setShowAttach(false)}
            >
                <Pressable style={styles.sheetBackdrop} onPress={() => setShowAttach(false)}>
                    <Pressable style={styles.sheet}>
                        <View style={styles.sheetHandle} />
                        <Text style={styles.sheetTitle}>Share with {otherName?.split(" ")[0]}</Text>
                        <Text style={styles.sheetSubtitle}>Pick what you&apos;d like to send</Text>
                        <View style={styles.attachGrid}>
                            <Pressable style={styles.attachItem} onPress={sendImage}>
                                <View style={[styles.attachIcon, { backgroundColor: "#E0F2FE" }]}>
                                    <Ionicons name="image" size={22} color="#0284C7" />
                                </View>
                                <Text style={styles.attachLabel}>Photo</Text>
                            </Pressable>
                            <Pressable style={styles.attachItem} onPress={sendVideo}>
                                <View style={[styles.attachIcon, { backgroundColor: "#FCE7F3" }]}>
                                    <Ionicons name="videocam" size={22} color="#DB2777" />
                                </View>
                                <Text style={styles.attachLabel}>Video</Text>
                            </Pressable>
                            <Pressable style={styles.attachItem} onPress={sendVoiceNote}>
                                <View style={[styles.attachIcon, { backgroundColor: "#DCFCE7" }]}>
                                    <Ionicons name="mic" size={22} color="#16A34A" />
                                </View>
                                <Text style={styles.attachLabel}>Voice</Text>
                            </Pressable>
                            <Pressable style={styles.attachItem} onPress={sendDocument}>
                                <View style={[styles.attachIcon, { backgroundColor: "#FEF3C7" }]}>
                                    <Ionicons name="document" size={22} color="#D97706" />
                                </View>
                                <Text style={styles.attachLabel}>Document</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>

            {/* Header 3-dot menu */}
            <Modal
                transparent
                visible={menuVisible}
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <Pressable style={styles.menuBackdrop} onPress={() => setMenuVisible(false)}>
                    <Pressable style={styles.menuBox}>
                        <TouchableOpacity style={styles.menuItem} onPress={toggleBlock}>
                            <Ionicons
                                name={iBlocked ? "checkmark-circle-outline" : "ban-outline"}
                                size={18}
                                color={iBlocked ? "#10B981" : "#F59E0B"}
                            />
                            <Text style={styles.menuItemText}>
                                {iBlocked ? "Unblock user" : "Block user"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={clearChat}>
                            <Ionicons name="trash-outline" size={18} color="#EF4444" />
                            <Text style={[styles.menuItemText, { color: "#EF4444" }]}>
                                Clear chat
                            </Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>

            {/* Avatar preview */}
            <Modal
                transparent
                visible={avatarPreview}
                animationType="fade"
                onRequestClose={() => setAvatarPreview(false)}
            >
                <Pressable style={styles.previewBackdrop} onPress={() => setAvatarPreview(false)}>
                    <View style={styles.previewHeader}>
                        <Text style={styles.previewName} numberOfLines={1}>
                            {otherName}
                        </Text>
                        <TouchableOpacity onPress={() => setAvatarPreview(false)} hitSlop={10}>
                            <Ionicons name="close" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    {(() => {
                        const uri = resolveAvatarUri(otherAvatar);
                        if (!uri) return null;
                        return (
                            <Image source={{ uri }} style={styles.previewImage} resizeMode="contain" />
                        );
                    })()}
                </Pressable>
            </Modal>

            {/* Message action sheet */}
            <Modal
                transparent
                visible={!!actionMsg}
                animationType="fade"
                onRequestClose={() => setActionMsg(null)}
            >
                <Pressable style={styles.sheetBackdrop} onPress={() => setActionMsg(null)}>
                    <Pressable style={styles.sheet}>
                        <View style={styles.sheetHandle} />
                        <Text style={styles.sheetTitle}>Message options</Text>

                        <TouchableOpacity
                            style={styles.sheetItem}
                            onPress={() => actionMsg && openForwardSheet(actionMsg)}
                            disabled={!actionMsg?._id}
                        >
                            <Ionicons name="arrow-redo" size={20} color="#193648" />
                            <Text style={styles.sheetItemText}>Forward</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.sheetItem}
                            onPress={() => actionMsg && deleteForMe(actionMsg)}
                        >
                            <Ionicons name="trash-outline" size={20} color="#193648" />
                            <Text style={styles.sheetItemText}>Delete for me</Text>
                        </TouchableOpacity>

                        {actionMsg?.senderEmail === myEmail && (
                            <TouchableOpacity
                                style={styles.sheetItem}
                                onPress={() => actionMsg && deleteForEveryone(actionMsg)}
                            >
                                <Ionicons name="trash" size={20} color="#EF4444" />
                                <Text style={[styles.sheetItemText, { color: "#EF4444" }]}>
                                    Delete for everyone
                                </Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[styles.sheetItem, { borderTopWidth: 0 }]}
                            onPress={() => setActionMsg(null)}
                        >
                            <Ionicons name="close" size={20} color="#6B7280" />
                            <Text style={[styles.sheetItemText, { color: "#6B7280" }]}>Cancel</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>

            {/* ── Forward modal — full screen contacts list ── */}
            <Modal
                visible={!!forwardSource}
                animationType="slide"
                onRequestClose={() => setForwardSource(null)}
            >
                <View style={{ flex: 1, backgroundColor: "#F5F7FA" }}>
                    <LinearGradient
                        colors={["#193648", "#193648"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.forwardHeader}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                setForwardSource(null);
                                setForwardSearch("");
                            }}
                            style={styles.forwardBackBtn}
                        >
                            <Ionicons name="arrow-back" size={22} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={styles.forwardTitle}>Forward to…</Text>
                            <Text style={styles.forwardSub}>Select a Riphah member</Text>
                        </View>
                    </LinearGradient>

                    <View style={styles.forwardSearchBar}>
                        <Ionicons name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
                        <TextInput
                            value={forwardSearch}
                            onChangeText={setForwardSearch}
                            placeholder="Search by name or department"
                            placeholderTextColor="#9CA3AF"
                            style={{ flex: 1, fontSize: 14, color: "#111827", padding: 0 }}
                            autoFocus
                        />
                        {forwardSearch.length > 0 && (
                            <TouchableOpacity onPress={() => setForwardSearch("")}>
                                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <FlatList
                        data={forwardContacts.filter((c) => {
                            if (!forwardSearch.trim()) return true;
                            const q = forwardSearch.toLowerCase();
                            return (
                                c.fullName?.toLowerCase().includes(q) ||
                                c.email?.toLowerCase().includes(q) ||
                                c.department?.toLowerCase().includes(q)
                            );
                        })}
                        keyExtractor={(item) => "fwd-" + item.email}
                        contentContainerStyle={{ paddingBottom: 30 }}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => (
                            <Pressable
                                style={({ pressed }) => [
                                    styles.forwardRow,
                                    pressed && { backgroundColor: "#F8FAFC" },
                                    forwardLoading && { opacity: 0.5 },
                                ]}
                                disabled={forwardLoading}
                                onPress={() => forwardToUser(item)}
                            >
                                {item.profileImage ? (
                                    <Image
                                        source={{ uri: resolveAvatarUri(item.profileImage) || "" }}
                                        style={{ width: 44, height: 44, borderRadius: 22 }}
                                    />
                                ) : (
                                    <View style={[styles.headerAvatar, { width: 44, height: 44, borderRadius: 22 }]}>
                                        <Text style={styles.headerAvatarText}>
                                            {getInitial(item.fullName)}
                                        </Text>
                                    </View>
                                )}
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <Text style={styles.forwardName} numberOfLines={1}>
                                        {item.fullName}
                                    </Text>
                                    <Text style={styles.forwardMeta} numberOfLines={1}>
                                        {item.department || item.email}
                                    </Text>
                                </View>
                                <View style={styles.forwardBtn}>
                                    <Ionicons name="arrow-redo" size={14} color="#fff" />
                                    <Text style={styles.forwardBtnText}>Send</Text>
                                </View>
                            </Pressable>
                        )}
                        ItemSeparatorComponent={() => (
                            <View style={{ height: 1, backgroundColor: "#F1F5F9", marginLeft: 70 }} />
                        )}
                        ListEmptyComponent={
                            <View style={{ alignItems: "center", padding: 40 }}>
                                <MaterialCommunityIcons
                                    name="account-search-outline"
                                    size={48}
                                    color="#CBD5E1"
                                />
                                <Text style={{ color: "#193648", fontWeight: "800", fontSize: 15, marginTop: 12 }}>
                                    No matches
                                </Text>
                            </View>
                        }
                    />
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};

export default ChatRoomScreen;

/* ─── STYLES ─── */
const styles = StyleSheet.create({
    /* Header — WhatsApp-style compact navy bar */
    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#193648",
        paddingTop: Platform.OS === "ios" ? 70 : 50,
        paddingBottom: 12,
        paddingHorizontal: 6,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    headerBackBtn: {
        width: 38,
        height: 38,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 2,
    },
    headerProfileGroup: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
        paddingRight: 6,
    },
    headerActionBtn: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.14)",
        justifyContent: "center",
        alignItems: "center",
    },
    headerAvatarWrap: { position: "relative" },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    headerAvatarFallback: {
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    headerAvatarText: { color: "#fff", fontSize: 16, fontWeight: "800" },
    headerOnlineDot: {
        position: "absolute",
        bottom: -1,
        right: -1,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#22C55E",
        borderWidth: 2,
        borderColor: "#193648",
    },
    headerName: { color: "#fff", fontSize: 16, fontWeight: "700", letterSpacing: 0.1 },
    subtitleRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 },
    tinyGreenDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#34D399",
    },
    headerSub: { fontSize: 12, fontWeight: "500", marginTop: 1, opacity: 0.9 },

    /* Banner */
    banner: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
    },
    bannerText: { fontSize: 12.5, fontWeight: "600" },

    /* Day pill */
    dayPillWrap: { alignItems: "center", marginVertical: 10 },
    dayPill: {
        backgroundColor: "rgba(25,54,72,0.08)",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    dayPillText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#193648",
        letterSpacing: 0.3,
    },

    /* Message rows */
    msgRow: { flexDirection: "row", marginVertical: 4, alignItems: "flex-end", paddingHorizontal: 4 },
    meRow: { justifyContent: "flex-end" },
    otherRow: { justifyContent: "flex-start" },

    smallAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#193648",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 6,
    },
    smallAvatarImg: { width: 28, height: 28, borderRadius: 14, marginRight: 6 },
    smallAvatarText: { color: "#fff", fontSize: 11, fontWeight: "700" },

    bubble: {
        maxWidth: 280,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 18,
    },
    meBubble: { borderBottomRightRadius: 4 },
    otherBubble: {
        backgroundColor: "#fff",
        borderBottomLeftRadius: 4,
        shadowColor: "#193648",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 1,
    },
    deletedBubble: { backgroundColor: "#E5E7EB" },
    deletedRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    deletedText: { fontStyle: "italic", fontSize: 13 },

    meText: { color: "#fff", fontSize: 14, lineHeight: 20 },
    otherText: { color: "#1F2937", fontSize: 14, lineHeight: 20 },
    bubbleMetaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        alignSelf: "flex-end",
        marginTop: 4,
    },
    meTime: { fontSize: 10, color: "rgba(255,255,255,0.85)", fontWeight: "500" },
    otherTime: {
        fontSize: 10,
        color: "#9CA3AF",
        marginTop: 4,
        alignSelf: "flex-end",
        fontWeight: "500",
    },

    msgImage: { width: 200, height: 200, borderRadius: 12 },

    /* Forwarded label (WhatsApp style) */
    forwardedTag: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginBottom: 4,
    },
    forwardedText: {
        fontSize: 11,
        fontStyle: "italic",
        fontWeight: "500",
    },

    /* Upload state overlay */
    uploadOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.55)",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    uploadOverlayText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 0.5,
    },

    /* Video card */
    videoCard: {
        width: 220,
        height: 150,
        backgroundColor: "#0F172A",
        borderRadius: 14,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
    },
    videoPlayBadge: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: "rgba(255,255,255,0.18)",
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    videoFooter: {
        position: "absolute",
        bottom: 8,
        left: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: "rgba(0,0,0,0.5)",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    videoLabel: { color: "#fff", fontSize: 11, fontWeight: "600" },

    /* Audio (voice note) */
    audioRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
        minWidth: 200,
    },
    audioPlayBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    audioWaveform: {
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
        flex: 1,
    },
    audioBar: {
        width: 2,
        borderRadius: 1,
    },

    /* Document */
    docRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 12,
        minWidth: 240,
    },
    docIconBox: {
        width: 44,
        height: 44,
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.5)",
        alignItems: "center",
        justifyContent: "center",
    },
    docName: { fontSize: 13.5, fontWeight: "700" },
    docMeta: { fontSize: 11, marginTop: 2, fontWeight: "500" },

    /* Call bubble */
    callBubble: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 18,
        maxWidth: 250,
    },

    /* Empty */
    emptyChat: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(25,54,72,0.08)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
    },
    emptyTitle: { fontSize: 17, fontWeight: "800", color: "#193648", marginBottom: 6 },
    emptySub: { fontSize: 13, color: "#64748B", textAlign: "center" },

    /* Typing bubble */
    typingBubbleWrap: { paddingHorizontal: 16, paddingBottom: 6 },
    typingBubble: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        alignSelf: "flex-start",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 18,
        gap: 4,
        shadowColor: "#193648",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 1,
    },
    typingDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#193648",
    },

    /* WhatsApp-style input bar */
    inputBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingTop: 6,
        paddingBottom: 6,
        backgroundColor: "#F0F2F5",
        gap: 6,
    },
    attachBtn: { padding: 4 },
    inputWrap: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 24,
        paddingLeft: 4,
        paddingRight: 4,
        height: 46,
    },
    inlineIconBtn: {
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: "#111827",
        paddingHorizontal: 4,
        paddingVertical: 0,
        height: 46,
    },
    sendBtn: { borderRadius: 24 },
    sendBtnInner: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#193648",
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },

    /* Recording bar */
    recordingBar: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: "#fff",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#E5E7EB",
    },
    recordCancelBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#FEF2F2",
        justifyContent: "center",
        alignItems: "center",
    },
    recordingMid: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
        gap: 8,
        justifyContent: "center",
    },
    recordingDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#EF4444",
    },
    recordingText: { color: "#193648", fontWeight: "700", fontSize: 14 },
    recordingHint: { color: "#94A3B8", fontSize: 11, marginLeft: 4 },
    recordSendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#193648",
        justifyContent: "center",
        alignItems: "center",
    },

    /* Sheet (attach + actions) */
    sheetBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        paddingBottom: Platform.OS === "ios" ? 28 : 14,
        paddingTop: 8,
    },
    sheetHandle: {
        alignSelf: "center",
        width: 42,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#E5E7EB",
        marginBottom: 12,
    },
    sheetTitle: {
        fontSize: 15,
        color: "#0F172A",
        fontWeight: "800",
        paddingHorizontal: 22,
        paddingTop: 4,
        paddingBottom: 4,
        letterSpacing: 0.2,
    },
    sheetSubtitle: {
        fontSize: 12,
        color: "#64748B",
        paddingHorizontal: 22,
        paddingBottom: 16,
        fontWeight: "500",
    },
    sheetItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#F3F4F6",
    },
    sheetItemText: { fontSize: 15, fontWeight: "600", color: "#193648" },

    /* Forward modal */
    forwardHeader: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: Platform.OS === "ios" ? 60 : 40,
        paddingBottom: 16,
        paddingHorizontal: 14,
        borderBottomLeftRadius: 22,
        borderBottomRightRadius: 22,
        elevation: 6,
        shadowColor: "#193648",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
    },
    forwardBackBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "rgba(255,255,255,0.14)",
        alignItems: "center",
        justifyContent: "center",
    },
    forwardTitle: { color: "#fff", fontSize: 18, fontWeight: "800", letterSpacing: 0.2 },
    forwardSub: { color: "rgba(255,255,255,0.72)", fontSize: 11.5, fontWeight: "500", marginTop: 2 },
    forwardSearchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        marginHorizontal: 14,
        marginTop: 14,
        marginBottom: 8,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: Platform.OS === "ios" ? 12 : 8,
        borderWidth: 1,
        borderColor: "#EEF2F6",
    },
    forwardRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 11,
        backgroundColor: "#fff",
    },
    forwardName: { fontSize: 14.5, fontWeight: "700", color: "#0F172A" },
    forwardMeta: { fontSize: 12, color: "#64748B", marginTop: 2 },
    forwardBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "#193648",
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 12,
    },
    forwardBtnText: { fontSize: 12, fontWeight: "800", color: "#fff" },

    /* Emoji picker — inline panel */
    emojiPanel: {
        backgroundColor: "#fff",
        height: 280,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#E5E7EB",
        paddingTop: 4,
    },
    emojiSheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 8,
        paddingBottom: Platform.OS === "ios" ? 28 : 16,
        maxHeight: "60%",
    },
    emojiHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingBottom: 6,
    },
    emojiCloseBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#F1F5F9",
        alignItems: "center",
        justifyContent: "center",
    },
    emojiGroupTitle: {
        fontSize: 11,
        fontWeight: "800",
        color: "#64748B",
        letterSpacing: 1,
        textTransform: "uppercase",
        paddingHorizontal: 18,
        paddingTop: 8,
        paddingBottom: 6,
    },
    emojiGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 12,
    },
    emojiCell: {
        width: "12.5%",
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },
    emojiChar: {
        fontSize: 26,
    },

    /* Attach grid */
    attachGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 22,
        paddingBottom: 24,
        rowGap: 18,
    },
    attachItem: {
        width: "23%",
        alignItems: "center",
        gap: 8,
        paddingVertical: 6,
    },
    attachIcon: {
        width: 56,
        height: 56,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#193648",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 2,
    },
    attachLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: "#193648",
        letterSpacing: 0.2,
    },

    /* Header 3-dot menu */
    menuBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.25)",
    },
    menuBox: {
        position: "absolute",
        top: Platform.OS === "ios" ? 92 : 64,
        right: 12,
        backgroundColor: "#fff",
        borderRadius: 14,
        paddingVertical: 6,
        minWidth: 180,
        elevation: 8,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 4 },
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 12,
        paddingHorizontal: 14,
    },
    menuItemText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#193648",
    },

    /* Preview */
    previewBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.92)",
        justifyContent: "center",
        alignItems: "center",
    },
    previewHeader: {
        position: "absolute",
        top: Platform.OS === "ios" ? 50 : 24,
        left: 18,
        right: 18,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    previewName: { color: "#fff", fontSize: 17, fontWeight: "700", flex: 1, marginRight: 12 },
    previewImage: { width: "92%", height: "70%" },
});
