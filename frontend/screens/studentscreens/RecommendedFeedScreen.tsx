import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, StatusBar } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation


const recommendations = [
    {
        id: "1",
        title: "Machine Learning Project: Sentiment Analysis",
        type: "Project",
        description: "Develop a sentiment analysis model using Python and TensorFlow. This project will cover data preprocessing, model training, and evaluation.",
        details: "This advanced project aims to equip you with practical skills in natural language processing (NLP) and machine learning. You'll work with real-world datasets, implement deep learning models, and deploy your solution. Ideal for those with intermediate Python skills.",
        icon: "code-branch",
        categoryColor: "#7BC0E3",
        action: "View Project Details",
        image: "https://images.unsplash.com/photo-1596541223130-5d31a735b12f?auto=format&fit=crop&w=800&q=80", // 
        company: "AI Innovations Inc.",
        domain: "Artificial Intelligence",
        difficulty: "Advanced",
        responsibilities: [
            "Develop and integrate NLP models for text extraction and analysis.",
            "Design and implement a robust backend for data processing and storage.",
            "Create a user-friendly API for seamless integration with other platforms.",
            "Conduct extensive testing and optimize model performance.",
            "Collaborate with a team of AI engineers and data scientists.",
        ],
        requiredSkills: [
            "Python",
            "TensorFlow/PyTorch",
            "NLP (NLTK, SpaCy)",
            "RESTful APIs",
            "AWS/Azure (deployment)",
            "Git",
            "Data Structures & Algorithms",
        ],
        teamSize: "3-5 members",
        duration: "4 months",
        startDate: "October 1, 2024",
        projectLink: "https://github.com/example/ai-sentiment-analyzer",
    },
    {
        id: "2",
        title: "Frontend Development Internship: React Native",
        type: "Internship",
        description: "Gain hands-on experience building user interfaces with React Native for mobile applications.",
        details: "Join our dynamic team for a 3-month paid internship. You will contribute to live mobile projects, learn best practices in UI/UX, and work directly with senior developers. A great opportunity to kickstart your career in mobile development.",
        icon: "laptop-code",
        categoryColor: "#FFD700",
        action: "Apply Now",
        image: "https://images.unsplash.com/photo-1627398242470-f40578f73157?auto=format&fit=crop&w=800&q=80",
        company: "Mobile Solutions Ltd.",
        domain: "Mobile Development",
        difficulty: "Intermediate",
        responsibilities: [
            "Develop UI components using React Native.",
            "Integrate APIs and manage state.",
            "Participate in code reviews and agile meetings.",
            "Test and debug applications.",
            "Collaborate with backend developers and UI/UX designers.",
        ],
        requiredSkills: [
            "React Native",
            "JavaScript/TypeScript",
            "Redux/Context API",
            "Git",
            "UI/UX Principles",
        ],
        teamSize: "5-7 members",
        duration: "3 months",
        startDate: "September 15, 2024",
        projectLink: null,
    },
    {
        id: "3",
        title: "AI Workshop: Generative Models",
        type: "Workshop",
        description: "Explore the latest advancements in AI and create your own generative art using cutting-edge models.",
        details: "This intensive 2-day workshop covers GANs, VAEs, and transformers. Participants will engage in coding sessions, theoretical discussions, and hands-on exercises to understand and implement generative AI models.",
        icon: "brain",
        categoryColor: "#8E44AD",
        action: "Register for Workshop",
        image: "https://images.unsplash.com/photo-1610563166150-b08307d0d0f1?auto=format&fit=crop&w=800&q=80",
        company: "Innovate AI Center",
        domain: "Artificial Intelligence",
        difficulty: "Intermediate",
        responsibilities: [
            "Active participation in lectures and discussions.",
            "Completion of hands-on coding exercises.",
            "Presentation of a small generative AI project.",
        ],
        requiredSkills: [
            "Python basics",
            "Basic understanding of Machine Learning",
            "Enthusiasm for AI!",
        ],
        teamSize: "Workshop (Individual/Paired)",
        duration: "2 days",
        startDate: "November 10, 2024",
        projectLink: "https://www.innovate-ai.com/generative-workshop",
    },
    {
        id: "4",
        title: "Data Science Bootcamp: From Zero to Hero",
        type: "Course",
        description: "Master data manipulation, analysis, and visualization techniques over 12 intensive weeks.",
        details: "A comprehensive bootcamp designed for beginners and intermediates. Covers Python, R, SQL, machine learning algorithms, data visualization with Tableau/PowerBI, and real-world case studies. Career support included.",
        icon: "database",
        categoryColor: "#2ECC71",
        action: "Enroll in Course",
        image: "https://images.unsplash.com/photo-1606189917812-d7b38d3b8f10?auto=format&fit=crop&w=800&q=80",
        company: "DataMasters Academy",
        domain: "Data Science",
        difficulty: "Beginner to Advanced",
        responsibilities: [
            "Attend live online sessions.",
            "Complete weekly assignments and projects.",
            "Participate in group discussions.",
            "Prepare for career transition with provided resources.",
        ],
        requiredSkills: [
            "No prior experience required (for beginners track)",
            "Strong analytical thinking",
        ],
        teamSize: "N/A (Individual Learning)",
        duration: "12 weeks",
        startDate: "October 20, 2024",
        projectLink: "https://www.datamasters.com/bootcamp",
    },
    {
        id: "5",
        title: "Mobile App Development: Expo & Firebase",
        type: "Project",
        description: "Build a cross-platform mobile application from scratch with Expo and integrate Firebase services.",
        details: "This guided project will walk you through the entire process of developing a functional mobile app, including user authentication, real-time database, and cloud functions. Perfect for portfolio building.",
        icon: "mobile-alt",
        categoryColor: "#7BC0E3",
        action: "View Project Details",
        image: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&w=800&q=80",
        company: "CodeCraft Studios",
        domain: "Mobile Development",
        difficulty: "Intermediate",
        responsibilities: [
            "Design app wireframes and UI.",
            "Implement front-end with Expo/React Native.",
            "Set up and integrate Firebase services (Auth, Firestore).",
            "Deploy the app to Expo Go and potentially app stores.",
        ],
        requiredSkills: [
            "React Native (basic)",
            "Firebase (basic understanding)",
            "JavaScript",
            "Node.js (for backend functions)",
        ],
        teamSize: "1-2 members",
        duration: "6 weeks",
        startDate: "November 1, 2024",
        projectLink: "https://github.com/CodeCraft/expo-firebase-project",
    },
];

const RecommendedFeedScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    const onRefresh = () => {
        setRefreshing(true);
        console.log("Fetching latest recommendations...");
        setTimeout(() => {
            console.log("Recommendations updated.");
            setRefreshing(false);
        }, 1500);
    };

    const handleCardPress = (item) => {

        navigation.navigate('ProjectDetails');
    };


    const getIconForType = (type) => {
        switch (type) {
            case "Project": return "code-branch";
            case "Internship": return "briefcase";
            case "Workshop": return "chalkboard-teacher";
            case "Course": return "book-open";
            case "Seminar": return "users";
            default: return "lightbulb";
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#193648" barStyle="light-content" />

            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Discover Opportunities</Text>
                <Text style={styles.subTitle}>Explore personalized recommendations tailored just for you.</Text>
            </View>

            <FlatList
                data={recommendations}
                keyExtractor={(item) => item.id}
                refreshing={refreshing}
                onRefresh={onRefresh}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContentContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        activeOpacity={0.8}
                        onPress={() => handleCardPress(item)}
                    >
                        {/* Left section: Icon and Type Badge */}
                        <View style={styles.leftCardSection}>
                            <View style={[styles.iconWrapper, { backgroundColor: item.categoryColor || '#7BC0E3' }]}>
                                <FontAwesome5 name={getIconForType(item.type)} size={20} color="#fff" />
                            </View>
                            <View style={[styles.typeBadge, { borderColor: item.categoryColor || '#7BC0E3' }]}>
                                <Text style={[styles.typeBadgeText, { color: item.categoryColor || '#7BC0E3' }]}>
                                    {item.type}
                                </Text>
                            </View>
                        </View>

                        {/* Middle section: Title and Description */}
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <Text style={styles.cardDescription} numberOfLines={2}>
                                {item.description}
                            </Text>
                        </View>

                        {/* Right section: Action arrow */}
                        <View style={styles.rightCardSection}>
                            <FontAwesome5 name="chevron-right" size={16} color="#A0B3C4" />
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E2EEF9",
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 25,
        backgroundColor: "#E2EEF9",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#193648",
        marginBottom: 6,
        letterSpacing: 0.5,
    },
    subTitle: {
        fontSize: 16,
        color: "#667788",
        lineHeight: 24,
    },
    listContentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
        paddingTop: 10,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 18,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderRadius: 12,
        backgroundColor: "#fff",
        shadowColor: "#193648",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: "#f0f0f0",
    },
    leftCardSection: {
        width: 60,
        alignItems: 'center',
        marginRight: 15,
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 5,
    },
    typeBadge: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 7,
        paddingVertical: 3,
        backgroundColor: 'transparent',
    },
    typeBadgeText: {
        fontSize: 10,
        fontWeight: "bold",
        textTransform: 'uppercase',
    },
    cardContent: {
        flex: 1,
        marginRight: 10,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: "600",
        color: "#193648",
        marginBottom: 4,
        lineHeight: 22,
    },
    cardDescription: {
        fontSize: 13,
        color: "#778899",
        lineHeight: 19,
    },
    rightCardSection: {
        marginLeft: 10,
        alignSelf: 'center',
    },
});

export default RecommendedFeedScreen;