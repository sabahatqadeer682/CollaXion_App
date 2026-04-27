import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    Image,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height: SCREEN_H } = Dimensions.get("window");
// Three-tier responsive scale based on the device's pixel height.
//   < 680  → small phones (compact paddings)
//   680–820 → medium phones (default)
//   > 820  → large phones / tablets (more breathing room)
const isSmall = SCREEN_H < 680;
const isLarge = SCREEN_H > 820;
const r = (sm: number, md: number, lg: number) =>
    isSmall ? sm : isLarge ? lg : md;
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSpring,
    withTiming,
} from "react-native-reanimated";

/* ---------------- Premium CX Logo Mark ---------------- */
const CXLogo = () => {
    const scale = useSharedValue(0);
    const ringScale = useSharedValue(1);
    const ringOpacity = useSharedValue(0.55);
    const ringScale2 = useSharedValue(1);
    const ringOpacity2 = useSharedValue(0.55);
    const flashScale = useSharedValue(0);
    const flashOpacity = useSharedValue(0);

    useEffect(() => {
        scale.value = withSpring(1, { damping: 10, stiffness: 90 });

        // Flash burst right before letters reveal — looks like logo ignites & emits brand name
        flashScale.value = withDelay(
            900,
            withTiming(2.2, { duration: 600, easing: Easing.out(Easing.ease) })
        );
        flashOpacity.value = withDelay(
            900,
            withTiming(0, { duration: 600, easing: Easing.out(Easing.ease) })
        );

        ringScale.value = withRepeat(
            withTiming(1.5, { duration: 2400, easing: Easing.out(Easing.ease) }),
            -1,
            false
        );
        ringOpacity.value = withRepeat(
            withTiming(0, { duration: 2400, easing: Easing.out(Easing.ease) }),
            -1,
            false
        );

        ringScale2.value = withDelay(
            1200,
            withRepeat(
                withTiming(1.5, { duration: 2400, easing: Easing.out(Easing.ease) }),
                -1,
                false
            )
        );
        ringOpacity2.value = withDelay(
            1200,
            withRepeat(
                withTiming(0, { duration: 2400, easing: Easing.out(Easing.ease) }),
                -1,
                false
            )
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const ringStyle = useAnimatedStyle(() => ({
        transform: [{ scale: ringScale.value }],
        opacity: ringOpacity.value,
    }));
    const ringStyle2 = useAnimatedStyle(() => ({
        transform: [{ scale: ringScale2.value }],
        opacity: ringOpacity2.value,
    }));
    const logoStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));
    const flashStyle = useAnimatedStyle(() => ({
        transform: [{ scale: flashScale.value }],
        opacity: flashOpacity.value,
    }));

    return (
        <View style={styles.logoContainer}>
            <Animated.View style={[styles.flashBurst, flashStyle]} />
            <Animated.View style={[styles.glowRing, ringStyle]} />
            <Animated.View style={[styles.glowRing, ringStyle2]} />
            <Animated.View style={[styles.logoCircle, logoStyle]}>
                <Image
                    source={require("../../assets/images/logo.png")}
                    style={styles.logoImage}
                    resizeMode="contain"
                />
            </Animated.View>
        </View>
    );
};

/* ---------------- Animated Letter (emerges from logo + continuous wave) ---------------- */
const AnimatedLetter = ({
    char,
    delay,
    waveDelay,
}: {
    char: string;
    delay: number;
    waveDelay: number;
}) => {
    const v = useSharedValue(0);
    const glow = useSharedValue(0);
    const wave = useSharedValue(0);

    useEffect(() => {
        v.value = withDelay(delay, withSpring(1, { damping: 14, stiffness: 110 }));

        glow.value = withDelay(
            delay + 900,
            withRepeat(
                withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
                -1,
                true
            )
        );

        // Gentle continuous wave — soft bob with phase offset
        wave.value = withDelay(
            delay + 800 + waveDelay,
            withRepeat(
                withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
                -1,
                true
            )
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const style = useAnimatedStyle(() => {
        const entranceY = interpolate(v.value, [0, 1], [-20, 0]);
        const entranceScale = interpolate(v.value, [0, 1], [0.5, 1]);

        const waveY = interpolate(wave.value, [0, 1], [0, -3]);

        return {
            opacity: v.value,
            transform: [
                { translateY: entranceY + waveY * v.value },
                { scale: entranceScale },
            ],
            textShadowRadius: interpolate(glow.value, [0, 1], [6, 12]),
        };
    });

    return <Animated.Text style={[styles.brandFull, style]}>{char}</Animated.Text>;
};

/* ---------------- Animated Brand Name (letter-by-letter reveal + wave) ---------------- */
const BrandName = () => {
    const letters = "CollaXion".split("");
    const baseDelay = 1100;
    const stagger = 85;
    const waveStagger = 140;

    return (
        <View style={styles.brandRow}>
            {letters.map((char, i) => (
                <AnimatedLetter
                    key={i}
                    char={char}
                    delay={baseDelay + i * stagger}
                    waveDelay={i * waveStagger}
                />
            ))}
        </View>
    );
};

/* ---------------- Animated Role Card ---------------- */
const RoleCard = ({
    direction,
    delay,
    accentColors,
    icon,
    title,
    subtitle,
    description,
    features,
    buttonLabel,
    onPress,
}: {
    direction: "left" | "right";
    delay: number;
    accentColors: [string, string];
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    buttonLabel: string;
    onPress: () => void;
}) => {
    const enter = useSharedValue(0);
    const press = useSharedValue(1);
    const float = useSharedValue(0);
    const iconPulse = useSharedValue(1);
    const arrow = useSharedValue(0);

    useEffect(() => {
        enter.value = withDelay(delay, withSpring(1, { damping: 18, stiffness: 90 }));
        float.value = withDelay(
            delay + 800,
            withRepeat(
                withTiming(1, { duration: 3600, easing: Easing.inOut(Easing.ease) }),
                -1,
                true
            )
        );
        iconPulse.value = withDelay(
            delay + 600,
            withRepeat(
                withTiming(1.05, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
                -1,
                true
            )
        );
        arrow.value = withDelay(
            delay + 1000,
            withRepeat(
                withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
                -1,
                true
            )
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cardStyle = useAnimatedStyle(() => {
        const tx = interpolate(enter.value, [0, 1], [direction === "left" ? -40 : 40, 0]);
        const ty = interpolate(float.value, [0, 1], [0, -3]);
        return {
            opacity: enter.value,
            transform: [{ translateX: tx }, { translateY: ty }, { scale: press.value }],
        };
    });

    const iconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: iconPulse.value }],
    }));

    const arrowStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: interpolate(arrow.value, [0, 1], [0, 2]) }],
    }));

    const handlePressIn = () => {
        press.value = withSpring(0.97, { damping: 15, stiffness: 200 });
    };
    const handlePressOut = () => {
        press.value = withSpring(1, { damping: 15, stiffness: 200 });
    };
    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
    };

    return (
        <Animated.View style={cardStyle}>
            <Pressable
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <LinearGradient
                    colors={["#FFFFFF", "#F0F6FA"]}
                    style={styles.roleCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    {/* Top accent gradient bar */}
                    <LinearGradient
                        colors={accentColors}
                        style={styles.cardAccentBar}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    />

                    {/* Tag badge in corner */}
                    <View style={[styles.cardTagBadge, { backgroundColor: accentColors[0] + "1A" }]}>
                        <View style={[styles.cardTagDot, { backgroundColor: accentColors[0] }]} />
                        <Text style={[styles.cardTagText, { color: accentColors[1] }]}>
                            {subtitle.split("·")[0].trim()}
                        </Text>
                    </View>

                    <View style={styles.cardHeaderRow}>
                        <Animated.View style={iconStyle}>
                            {/* Outer ring around icon */}
                            <View style={[styles.iconRing, { borderColor: accentColors[0] + "30" }]} />
                            <LinearGradient
                                colors={accentColors}
                                style={styles.iconBadge}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                {icon}
                            </LinearGradient>
                        </Animated.View>
                        <View style={styles.cardHeaderText}>
                            <Text style={styles.cardTitle}>{title}</Text>
                            <Text style={[styles.cardSubtitle, { color: accentColors[0] }]}>
                                {subtitle}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.cardDivider} />

                    <Text style={styles.cardDescription}>{description}</Text>

                    <View style={styles.featuresList}>
                        {features.map((f, i) => (
                            <View style={styles.featureItem} key={i}>
                                <LinearGradient
                                    colors={accentColors}
                                    style={styles.featureCheck}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Ionicons name="checkmark" size={11} color="#fff" />
                                </LinearGradient>
                                <Text style={styles.featureText}>{f}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.cardButtonWrap}>
                        <LinearGradient
                            colors={accentColors}
                            style={styles.cardButton}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            {/* Top highlight strip */}
                            <View style={styles.buttonShine} />

                            <Text style={styles.buttonText}>{buttonLabel}</Text>
                            <Animated.View style={arrowStyle}>
                                <View style={styles.arrowCircle}>
                                    <MaterialIcons name="arrow-forward" size={14} color={accentColors[1]} />
                                </View>
                            </Animated.View>
                        </LinearGradient>
                    </View>
                </LinearGradient>
            </Pressable>
        </Animated.View>
    );
};

/* ---------------- Fade Up Text ---------------- */
const FadeUpText = ({
    children,
    style,
    delay = 0,
}: {
    children: React.ReactNode;
    style?: any;
    delay?: number;
}) => {
    const v = useSharedValue(0);
    useEffect(() => {
        v.value = withDelay(delay, withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const animStyle = useAnimatedStyle(() => ({
        opacity: v.value,
        transform: [{ translateY: interpolate(v.value, [0, 1], [14, 0]) }],
    }));
    return <Animated.Text style={[style, animStyle]}>{children}</Animated.Text>;
};

/* Slide-up + fade animated wrapper used for the role tiles. */
const FadeUpView = ({
    children,
    style,
    delay = 0,
    distance = 18,
}: {
    children: React.ReactNode;
    style?: any;
    delay?: number;
    distance?: number;
}) => {
    const v = useSharedValue(0);
    useEffect(() => {
        v.value = withDelay(delay, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const animStyle = useAnimatedStyle(() => ({
        opacity: v.value,
        transform: [{ translateY: interpolate(v.value, [0, 1], [distance, 0]) }],
    }));
    return <Animated.View style={[style, animStyle]}>{children}</Animated.View>;
};

/* ---------------- Main Screen ---------------- */
const RolesScreen = () => {
    const navigation = useNavigation<any>();
    const [selected, setSelected] = useState<"student" | "industry" | null>(null);

    // Card fade + slide-up animation on mount.
    const cardAnim = useSharedValue(0);
    useEffect(() => {
        cardAnim.value = withDelay(150, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }));
    }, []);
    const cardStyle = useAnimatedStyle(() => ({
        opacity: cardAnim.value,
        transform: [{ translateY: interpolate(cardAnim.value, [0, 1], [22, 0]) }],
    }));

    const handleContinue = () => {
        if (!selected) return;
        navigation.navigate(selected === "student" ? "StudentLogin" : "IndustryLogin");
    };

    return (
        <View style={styles.root}>
            <StatusBar backgroundColor="#193648" barStyle="light-content" />

            {/* ── Brand header (solid CollaXion navy — matches status bar) ── */}
            <LinearGradient
                colors={["#193648", "#193648", "#1F4357"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.brandHeader}
            >
                <SafeAreaView edges={["top"]} style={styles.headerInner}>
                    <View style={styles.heroLogoCircle}>
                        <Image
                            source={require("../../assets/images/logo.png")}
                            style={styles.heroLogo}
                            resizeMode="contain"
                        />
                    </View>
                    <FadeUpText style={styles.brandWord} delay={250}>
                        CollaXion
                    </FadeUpText>
                    <View style={styles.taglinePill}>
                        <MaterialCommunityIcons name="lightning-bolt" size={11} color="#FFFFFF" />
                        <Text style={styles.taglinePillTxt}>WHERE COLLABORATION MEETS INNOVATION</Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={[styles.cardSheet, cardStyle]}>
                    <FadeUpText style={styles.title} delay={300}>
                        Welcome
                    </FadeUpText>
                    <FadeUpText style={styles.helper} delay={400}>
                        Choose how you&apos;d like to use CollaXion.
                    </FadeUpText>

                    {/* ── Role tiles (horizontal cards) ── */}
                    <View style={styles.tileColumn}>
                      <FadeUpView delay={500}>
                        <TouchableOpacity
                            activeOpacity={0.88}
                            style={[styles.tile, selected === "student" && styles.tileActive]}
                            onPress={() => setSelected("student")}
                        >
                            <View style={styles.tilePhotoWrap}>
                                <Image
                                    source={{
                                        uri: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=80&auto=format&fit=crop",
                                    }}
                                    style={styles.tilePhoto}
                                    resizeMode="cover"
                                />
                            </View>

                            <View style={styles.tileTextBlock}>
                                <View style={styles.tileTitleRow}>
                                    <Text style={styles.tileLabel}>Student</Text>
                                    <View style={styles.tileBadge}>
                                        <Text style={styles.tileBadgeTxt}>Riphah</Text>
                                    </View>
                                </View>
                                <Text style={styles.tileCaption}>
                                    Find internships, get CXbot CV feedback, chat with mentors.
                                </Text>
                                <View style={styles.tileBulletRow}>
                                    <View style={styles.tileBullet}>
                                        <Ionicons name="sparkles" size={11} color="#193648" />
                                        <Text style={styles.tileBulletTxt}>AI matches</Text>
                                    </View>
                                    <View style={styles.tileBullet}>
                                        <Ionicons name="document-text-outline" size={11} color="#193648" />
                                        <Text style={styles.tileBulletTxt}>CV feedback</Text>
                                    </View>
                                </View>
                            </View>

                            <View
                                style={[
                                    styles.tileRadio,
                                    selected === "student" && styles.tileRadioActive,
                                ]}
                            >
                                {selected === "student" && (
                                    <Ionicons name="checkmark" size={14} color="#fff" />
                                )}
                            </View>
                        </TouchableOpacity>
                      </FadeUpView>

                      <FadeUpView delay={650}>
                        <TouchableOpacity
                            activeOpacity={0.88}
                            style={[styles.tile, selected === "industry" && styles.tileActive]}
                            onPress={() => setSelected("industry")}
                        >
                            <View style={styles.tilePhotoWrap}>
                                <Image
                                    source={{
                                        uri: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&q=80&auto=format&fit=crop",
                                    }}
                                    style={styles.tilePhoto}
                                    resizeMode="cover"
                                />
                            </View>

                            <View style={styles.tileTextBlock}>
                                <View style={styles.tileTitleRow}>
                                    <Text style={styles.tileLabel}>Industry Partner</Text>
                                    <View style={styles.tileBadge}>
                                        <Text style={styles.tileBadgeTxt}>Verified</Text>
                                    </View>
                                </View>
                                <Text style={styles.tileCaption}>
                                    Post opportunities, sign MOUs, and hire top university talent.
                                </Text>
                                <View style={styles.tileBulletRow}>
                                    <View style={styles.tileBullet}>
                                        <Ionicons name="briefcase-outline" size={11} color="#193648" />
                                        <Text style={styles.tileBulletTxt}>Post jobs</Text>
                                    </View>
                                    <View style={styles.tileBullet}>
                                        <Ionicons name="document-attach-outline" size={11} color="#193648" />
                                        <Text style={styles.tileBulletTxt}>MOU signing</Text>
                                    </View>
                                </View>
                            </View>

                            <View
                                style={[
                                    styles.tileRadio,
                                    selected === "industry" && styles.tileRadioActive,
                                ]}
                            >
                                {selected === "industry" && (
                                    <Ionicons name="checkmark" size={14} color="#fff" />
                                )}
                            </View>
                        </TouchableOpacity>
                      </FadeUpView>
                    </View>

                    {/* ── Trust strip ── */}
                    <View style={styles.trustRow}>
                        <View style={styles.trustChip}>
                            <MaterialCommunityIcons name="robot-happy-outline" size={12} color="#193648" />
                            <Text style={styles.trustTxt}>AI by CXbot</Text>
                        </View>
                        <View style={styles.trustDot} />
                        <View style={styles.trustChip}>
                            <Ionicons name="shield-checkmark" size={12} color="#193648" />
                            <Text style={styles.trustTxt}>Riphah Verified</Text>
                        </View>
                        <View style={styles.trustDot} />
                        <View style={styles.trustChip}>
                            <Ionicons name="flash" size={12} color="#193648" />
                            <Text style={styles.trustTxt}>Realtime</Text>
                        </View>
                    </View>

                    {/* ── CTA ── */}
                    <TouchableOpacity
                        style={[styles.ctaBtn, !selected && styles.ctaBtnDisabled]}
                        onPress={handleContinue}
                        disabled={!selected}
                        activeOpacity={0.88}
                    >
                        <Text style={styles.ctaText}>
                            {selected
                                ? `Continue as ${selected === "student" ? "Student" : "Industry"}`
                                : "Get Started"}
                        </Text>
                        <Ionicons name="arrow-forward" size={16} color="#fff" />
                    </TouchableOpacity>

                </Animated.View>
            </ScrollView>

            {/* ── Bottom-anchored brand footer ── */}
            <SafeAreaView edges={["bottom"]} style={styles.footerWrap}>
                <Text style={styles.footerNote}>© 2026 CollaXion · The CollaXion Support</Text>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    root:      { flex: 1, backgroundColor: "#F4F7FB" },
    container: { flex: 1, backgroundColor: "#F4F7FB" },
    scrollView: { flex: 1 },
    headerInner: { alignItems: "center" },
    footerWrap: {
        paddingVertical: r(8, 12, 14),
        backgroundColor: "#F4F7FB",
        alignItems: "center",
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: r(14, 18, 22),
        paddingTop: r(20, 28, 34),
        paddingBottom: r(20, 28, 36),
    },

    /* ── Brand gradient header ── */
    brandHeader: {
        alignItems: "center",
        paddingTop: Platform.OS === "ios" ? r(36, 44, 50) : r(44, 54, 64),
        paddingBottom: r(22, 28, 34),
        paddingHorizontal: 24,
        borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
        shadowColor: "#0F2236", shadowOpacity: 0.22, shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 }, elevation: 8,
    },
    heroLogoCircle: {
        width: r(56, 64, 72), height: r(56, 64, 72), borderRadius: r(28, 32, 36),
        backgroundColor: "#FFFFFF",
        alignItems: "center", justifyContent: "center",
        marginBottom: r(12, 16, 20),
        shadowColor: "#000", shadowOpacity: 0.18, shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 }, elevation: 5,
    },
    heroLogo: { width: r(36, 42, 46), height: r(36, 42, 46) },
    brandWord: {
        fontSize: r(20, 23, 26),
        fontWeight: "800",
        color: "#FFFFFF",
        letterSpacing: 0.8,
        textAlign: "center",
        marginBottom: r(10, 12, 14),
        lineHeight: r(26, 30, 34),
    },
    taglinePill: {
        flexDirection: "row", alignItems: "center", gap: 6,
        backgroundColor: "rgba(255,255,255,0.14)", borderRadius: 999,
        paddingHorizontal: 12, paddingVertical: 5,
        marginTop: 0,
        borderWidth: 1, borderColor: "rgba(255,255,255,0.22)",
    },
    taglinePillTxt: {
        fontSize: r(8.5, 9, 9.5), fontWeight: "800", color: "#FFFFFF", letterSpacing: 1.4,
    },
    divider: { height: 1, backgroundColor: "#EEF2F7", marginVertical: 12 },

    /* ── White content sheet ── */
    cardSheet: {
        backgroundColor: "#FFFFFF",
        borderRadius: r(18, 22, 24),
        paddingVertical: r(16, 20, 24),
        paddingHorizontal: r(14, 18, 20),
        shadowColor: "#0F2236",
        shadowOpacity: 0.07,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 5,
        borderWidth: 1, borderColor: "#EEF2F7",
    },

    title: {
        fontSize: r(19, 21, 23), fontWeight: "800", color: "#0F2236",
        textAlign: "center", letterSpacing: 0.3, marginTop: 2,
    },
    helper: {
        fontSize: r(12, 13, 13.5), color: "#64748B",
        textAlign: "center", lineHeight: r(17, 18, 20),
        marginTop: 4, marginBottom: r(12, 16, 20),
    },
    helperBold: { color: "#193648", fontWeight: "800" },

    tileColumn: { gap: r(8, 12, 14), marginBottom: r(12, 16, 20) },
    tile: {
        flexDirection: "row",
        alignItems: "center",
        gap: r(10, 12, 14),
        backgroundColor: "#FFFFFF",
        borderRadius: r(14, 16, 18),
        paddingVertical: r(10, 13, 16), paddingHorizontal: r(12, 14, 16),
        shadowColor: "#0F2236",
        shadowOpacity: 0.06, shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 }, elevation: 2,
    },
    tileActive: {
        backgroundColor: "#FAFCFF",
        shadowColor: "#193648",
        shadowOpacity: 0.22, shadowRadius: 16,
        shadowOffset: { width: 0, height: 10 }, elevation: 7,
    },
    tilePhotoWrap: {
        width: r(48, 54, 60), height: r(48, 54, 60), borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#EEF2F7",
    },
    tilePhoto: { width: r(48, 54, 60), height: r(48, 54, 60) },

    tileTextBlock: { flex: 1, justifyContent: "center" },
    tileTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    tileLabel: {
        fontSize: 15, fontWeight: "800", color: "#0F2236", letterSpacing: 0.2,
    },
    tileCaption: {
        fontSize: 12, color: "#64748B", fontWeight: "500",
        marginTop: 3, lineHeight: 17,
    },
    tileBadge: {
        backgroundColor: "#EEF4FA",
        borderWidth: 1, borderColor: "#DBE7F3",
        paddingHorizontal: 7, paddingVertical: 2,
        borderRadius: 6,
    },
    tileBadgeTxt: { fontSize: 9, fontWeight: "800", color: "#193648", letterSpacing: 0.5 },
    tileBulletRow: {
        flexDirection: "row", flexWrap: "wrap",
        gap: 8, marginTop: 7,
    },
    tileBullet: {
        flexDirection: "row", alignItems: "center", gap: 4,
        backgroundColor: "#F4F7FB",
        borderWidth: 1, borderColor: "#E2EAF0",
        paddingHorizontal: 7, paddingVertical: 3,
        borderRadius: 6,
    },
    tileBulletTxt: { fontSize: 10.5, fontWeight: "700", color: "#193648" },

    tileRadio: {
        width: 22, height: 22, borderRadius: 11,
        borderWidth: 2, borderColor: "#CBD5E1",
        backgroundColor: "#FFFFFF",
        alignItems: "center", justifyContent: "center",
    },
    tileRadioActive: {
        borderColor: "#193648",
        backgroundColor: "#193648",
    },
    tileCheck: {
        position: "absolute", top: 10, right: 10,
        width: 22, height: 22, borderRadius: 11,
        backgroundColor: "#193648",
        alignItems: "center", justifyContent: "center",
        borderWidth: 2, borderColor: "#fff",
    },

    /* ── Trust strip ── */
    trustRow: {
        flexDirection: "row", alignItems: "center", justifyContent: "center",
        gap: 8, marginBottom: 12, flexWrap: "wrap",
    },
    trustChip: {
        flexDirection: "row", alignItems: "center", gap: 4,
    },
    trustTxt: { fontSize: 11, fontWeight: "700", color: "#193648" },
    trustDot: {
        width: 4, height: 4, borderRadius: 2,
        backgroundColor: "#CBD5E1",
    },

    ctaBtn: {
        flexDirection: "row", gap: 8,
        backgroundColor: "#193648",
        paddingVertical: r(12, 14, 16), borderRadius: 12,
        alignItems: "center", justifyContent: "center",
        shadowColor: "#193648",
        shadowOpacity: 0.28, shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 }, elevation: 5,
        marginTop: r(28, 36, 44),
    },
    ctaBtnDisabled: { opacity: 0.45, shadowOpacity: 0 },
    ctaText: { color: "#FFFFFF", fontSize: 14.5, fontWeight: "800", letterSpacing: 0.4 },

    fineprint: {
        marginTop: r(16, 20, 24),
        textAlign: "center",
        fontSize: 10.5, color: "#94A3B8", lineHeight: 15,
        paddingHorizontal: 8,
    },
    footerNote: {
        textAlign: "center",
        fontSize: 10.5, color: "#94A3B8",
        fontWeight: "600", letterSpacing: 0.5,
    },

    /* Header */
    header: {
        paddingTop: 56,
        paddingBottom: 36,
        paddingHorizontal: 25,
        alignItems: "center",
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
        overflow: "hidden",
        shadowColor: "#193648",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 12,
    },
    /* Logo */
    logoContainer: {
        width: 130,
        height: 130,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
    },
    glowRing: {
        position: "absolute",
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 2,
        borderColor: "rgba(197,217,226,0.7)",
    },
    flashBurst: {
        position: "absolute",
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "rgba(255,255,255,0.55)",
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 10,
    },
    logoImage: { width: 70, height: 70 },
    xBadge: {
        position: "absolute",
        bottom: 2,
        right: 2,
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "#193648",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 3,
        borderColor: "#fff",
        shadowColor: "#193648",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 6,
    },
    xBadgeText: {
        color: "#fff",
        fontSize: 19,
        fontWeight: "900",
        letterSpacing: -0.5,
    },

    /* Brand */
    brandRow: {
        flexDirection: "row",
        alignItems: "baseline",
        marginBottom: 10,
    },
    brandText: {
        fontSize: 32,
        fontWeight: "800",
        color: "#FFFFFF",
        letterSpacing: 0.5,
    },
    brandX: {
        fontSize: 46,
        fontWeight: "900",
        color: "#FFFFFF",
        textShadowColor: "rgba(255,255,255,0.9)",
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 14,
        marginHorizontal: 1,
    },
    brandFull: {
        fontSize: 38,
        fontWeight: "600",
        color: "#FFFFFF",
        letterSpacing: 1.2,
        textShadowColor: "rgba(255,255,255,0.5)",
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    headerTagline: {
        fontSize: 13,
        color: "#C5D9E2",
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 1.4,
        textTransform: "uppercase",
        marginTop: 4,
        marginBottom: 0,
    },
    headerSubtitle: {
        fontSize: 13,
        color: "rgba(255,255,255,0.78)",
        fontWeight: "400",
        textAlign: "center",
        lineHeight: 19,
        paddingHorizontal: 6,
    },

    mainContent: {
        flex: 1,
        paddingTop: 28,
        paddingHorizontal: 20,
    },

    /* Welcome */
    welcomeSection: { marginTop: 6, marginBottom: 18, alignItems: "center" },
    welcomeBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "rgba(27,58,87,0.08)",
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "rgba(27,58,87,0.12)",
    },
    welcomeBadgeText: {
        fontSize: 11,
        fontWeight: "800",
        color: "#193648",
        letterSpacing: 1,
    },
    welcomeTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#193648",
        marginBottom: 4,
        letterSpacing: 0.3,
    },
    welcomeText: {
        fontSize: 13,
        color: "#64748B",
        textAlign: "center",
        lineHeight: 20,
    },

    /* Cards */
    cardsWrapper: { gap: 20, marginBottom: 30 },
    roleCard: {
        borderRadius: 24,
        padding: 22,
        paddingTop: 26,
        shadowColor: "#193648",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.14,
        shadowRadius: 18,
        elevation: 8,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(27,58,87,0.08)",
    },
    cardAccentBar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 5,
    },
    cardTagBadge: {
        position: "absolute",
        top: 16,
        right: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: 10,
    },
    cardTagDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
    },
    cardTagText: {
        fontSize: 9.5,
        fontWeight: "800",
        letterSpacing: 0.8,
    },
    cardHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        marginBottom: 14,
        marginTop: 6,
    },
    cardHeaderText: { flex: 1 },
    iconRing: {
        position: "absolute",
        top: -6,
        left: -6,
        width: 70,
        height: 70,
        borderRadius: 22,
        borderWidth: 2,
    },
    iconBadge: {
        width: 58,
        height: 58,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#193648",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 6,
    },
    cardTitle: {
        fontSize: 21,
        fontWeight: "800",
        color: "#193648",
        marginBottom: 3,
        letterSpacing: 0.2,
    },
    cardSubtitle: {
        fontSize: 10.5,
        fontWeight: "800",
        letterSpacing: 1.2,
    },
    cardDivider: {
        height: 1,
        backgroundColor: "rgba(27,58,87,0.08)",
        marginBottom: 14,
    },
    cardDescription: {
        fontSize: 13,
        color: "#475569",
        lineHeight: 20,
        marginBottom: 16,
    },
    featuresList: { gap: 10, marginBottom: 20 },
    featureItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    featureCheck: {
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#193648",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    featureText: {
        fontSize: 13,
        color: "#334155",
        fontWeight: "500",
        flex: 1,
    },

    cardButtonWrap: {
        borderRadius: 16,
        shadowColor: "#193648",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 7,
    },
    cardButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 15,
        paddingHorizontal: 18,
        borderRadius: 16,
        gap: 10,
        overflow: "hidden",
    },
    buttonShimmer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        width: 110,
    },
    buttonShine: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "50%",
        backgroundColor: "rgba(255,255,255,0.10)",
    },
    buttonText: {
        color: "#fff",
        fontSize: 14.5,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    arrowCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 2,
    },

    /* Why Section */
    whySection: {
        marginBottom: 24,
    },
    whyHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 8,
    },
    sectionLine: {
        flex: 1,
        height: 1,
        backgroundColor: "rgba(27,58,87,0.15)",
    },
    whyHeaderText: {
        fontSize: 11,
        fontWeight: "800",
        color: "#2A5A72",
        letterSpacing: 1.5,
    },
    whyTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#193648",
        textAlign: "center",
    },
    titleRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginBottom: 18,
    },
    showcaseList: {
        gap: 16,
    },
    showcaseCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 22,
        overflow: "hidden",
        shadowColor: "#193648",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
        elevation: 8,
        borderWidth: 1,
        borderColor: "rgba(25,54,72,0.06)",
    },
    showcaseHero: {
        height: 130,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
    },
    showcaseShimmer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        width: 140,
    },
    showcaseBody: {
        padding: 18,
        paddingTop: 16,
    },
    showcaseTitle: {
        fontSize: 17,
        fontWeight: "800",
        color: "#193648",
        marginBottom: 6,
        letterSpacing: 0.3,
    },
    showcaseText: {
        fontSize: 13,
        color: "#64748B",
        lineHeight: 19,
    },

    /* Footer */
    footer: { alignItems: "center", paddingTop: 8 },
    footerDivider: {
        width: 40,
        height: 3,
        borderRadius: 2,
        backgroundColor: "rgba(27,58,87,0.2)",
        marginBottom: 12,
    },
    footerText: {
        fontSize: 12.5,
        color: "#64748B",
        textAlign: "center",
        fontWeight: "600",
        marginBottom: 4,
    },
    footerSubtext: {
        fontSize: 10.5,
        color: "#94A3B8",
        fontWeight: "400",
        letterSpacing: 0.3,
    },
});

export default RolesScreen;
