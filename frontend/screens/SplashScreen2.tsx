import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

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

export default function SplashScreen2() {
    const navigation = useNavigation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);

    const handleScroll = (event: any) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / width);
        setCurrentIndex(index);
    };

    const goToNext = () => {
        if (currentIndex < splashData.length - 1) {
            scrollViewRef.current?.scrollTo({
                x: width * (currentIndex + 1),
                animated: true,
            });
        }
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
                {splashData.map((item) => (
                    <View key={item.id} style={[styles.slide, { width }]}>
                        <View style={styles.imageContainer}>
                            <Image source={item.image} style={styles.image} resizeMode="cover" />
                        </View>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                    </View>
                ))}
            </ScrollView>

            {/* Bottom section */}
            {currentIndex < splashData.length - 1 ? (
                <View style={styles.bottomRow}>
                    {/* Back */}
                    {currentIndex > 0 ? (
                        <TouchableOpacity onPress={goToPrevious}>
                            <Text style={styles.navText}>Back</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={{ width: 45 }} />
                    )}

                    {/* Dots in the center */}
                    <View style={styles.dotsContainer}>
                        {splashData.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    index === currentIndex ? styles.activeDot : styles.inactiveDot,
                                ]}
                            />
                        ))}
                    </View>

                    {/* Skip on the right */}
                    <TouchableOpacity onPress={handleSkip}>
                        <Text style={styles.navText}>Skip</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
                    <Text style={styles.getStartedText}>Get Started</Text>
                </TouchableOpacity>
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
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
    image: {
        width: "100%",
        height: "100%",
    },
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
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    activeDot: {
        width: 28,
        backgroundColor: "#193648",
    },
    inactiveDot: {
        width: 8,
        backgroundColor: "#cbd5e1",
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
