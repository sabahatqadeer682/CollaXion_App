import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const splash1 = require("../assets/images/splash1.jpeg");
const splash2 = require("../assets/images/splash2.jpeg");
const splash3 = require("../assets/images/splash3.jpeg");

const splashData = [
    {
        id: 1,
        title: "Connect & Collaborate",
        description: "Bring visionaries, ideas and people together in one hub",
        image: splash1,
    },
    {
        id: 2,
        title: "Discover Opportunities",
        description: "Find mentors, guides and industry experts to help you grow",
        image: splash2,
    },
    {
        id: 3,
        title: "Together for Better Future",
        description: "Connecting with industry leaders and working jointly",
        image: splash3,
    },
];

/* ---------------- Animated Slide ---------------- */
const Slide = ({
    item,
    isActive,
}: {
    item: (typeof splashData)[0];
    isActive: boolean;
}) => {
    const v = useSharedValue(isActive ? 1 : 0);

    useEffect(() => {
        v.value = withTiming(isActive ? 1 : 0, {
            duration: 500,
            easing: Easing.out(Easing.cubic),
        });
    }, [isActive]);

    const imageStyle = useAnimatedStyle(() => ({
        opacity: v.value,
        transform: [{ scale: interpolate(v.value, [0, 1], [0.92, 1]) }],
    }));

    const titleStyle = useAnimatedStyle(() => ({
        opacity: v.value,
        transform: [{ translateY: interpolate(v.value, [0, 1], [15, 0]) }],
    }));

    const descStyle = useAnimatedStyle(() => ({
        opacity: v.value,
        transform: [{ translateY: interpolate(v.value, [0, 1], [20, 0]) }],
    }));

    return (
        <View style={[styles.slide, { width }]}>
            <Animated.View style={[styles.imageContainer, imageStyle]}>
                <Image source={item.image} style={styles.image} resizeMode="cover" />
            </Animated.View>
            <Animated.Text style={[styles.title, titleStyle]}>{item.title}</Animated.Text>
            <Animated.Text style={[styles.description, descStyle]}>
                {item.description}
            </Animated.Text>
        </View>
    );
};

/* ---------------- Animated Dot ---------------- */
const Dot = ({ isActive }: { isActive: boolean }) => {
    const v = useSharedValue(isActive ? 1 : 0);

    useEffect(() => {
        v.value = withTiming(isActive ? 1 : 0, {
            duration: 300,
            easing: Easing.out(Easing.cubic),
        });
    }, [isActive]);

    const style = useAnimatedStyle(() => ({
        width: interpolate(v.value, [0, 1], [8, 28]),
        backgroundColor: isActive ? "#193648" : "#cbd5e1",
    }));

    return <Animated.View style={[styles.dot, style]} />;
};

export default function SplashScreen2() {
    const navigation = useNavigation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);

    const handleScroll = (event: any) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / width);
        if (index !== currentIndex) setCurrentIndex(index);
    };

    const goToPrevious = () => {
        if (currentIndex > 0) {
            scrollViewRef.current?.scrollTo({
                x: width * (currentIndex - 1),
                animated: true,
            });
        }
    };

    const handleSkip = () => {
        navigation.navigate("RolesScreen" as never);
    };

    const handleGetStarted = () => {
        navigation.navigate("RolesScreen" as never);
    };

    return (
        <LinearGradient
            colors={["#ffffff", "#f2f6fb", "#dbe9f8"]}
            style={styles.container}
        >
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {splashData.map((item, index) => (
                    <Slide key={item.id} item={item} isActive={index === currentIndex} />
                ))}
            </ScrollView>

            {/* Bottom section */}
            {currentIndex < splashData.length - 1 ? (
                <View style={styles.bottomRow}>
                    {currentIndex > 0 ? (
                        <TouchableOpacity onPress={goToPrevious}>
                            <Text style={styles.navText}>Back</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={{ width: 45 }} />
                    )}

                    <View style={styles.dotsContainer}>
                        {splashData.map((_, index) => (
                            <Dot key={index} isActive={index === currentIndex} />
                        ))}
                    </View>

                    <TouchableOpacity onPress={handleSkip}>
                        <Text style={styles.navText}>Skip</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    style={styles.getStartedButton}
                    onPress={handleGetStarted}
                    activeOpacity={0.85}
                >
                    <Text style={styles.getStartedText}>Get Started</Text>
                </TouchableOpacity>
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    slide: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
    },
    imageContainer: {
        width: 280,
        height: 280,
        borderRadius: 24,
        overflow: "hidden",
        marginBottom: 30,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    image: { width: "100%", height: "100%" },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#193648",
        textAlign: "center",
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: "#193648",
        textAlign: "center",
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 40,
        marginBottom: 40,
    },
    dotsContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    navText: {
        color: "#193648",
        fontWeight: "600",
        fontSize: 15,
    },
    getStartedButton: {
        backgroundColor: "#193648",
        marginHorizontal: 60,
        marginBottom: 45,
        borderRadius: 12,
        paddingVertical: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    getStartedText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 18,
    },
});
