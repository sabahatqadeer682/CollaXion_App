import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    SafeAreaView,
    Share,
    Platform,
    Linking,
} from "react-native";
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // Make sure react-navigation is installed
import * as Animatable from 'react-native-animatable'; // Make sure react-native-animatable is installed

const ProjectDetailsScreen = ({ route }: any) => {
    const defaultProject = {
        title: "AI-Based Resume Analyzer",
        company: "CollaXion Labs",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
        domain: "Artificial Intelligence",
        difficulty: "Advanced",
        description:
            "This project aims to develop an intelligent resume analyzer using advanced AI and Machine Learning techniques. It will parse resumes, extract key information, and provide insightful feedback on resume quality, relevance to job descriptions, and suggestions for improvement. The goal is to streamline the hiring process for recruiters and empower job seekers.",
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
        projectLink: "https://github.com/example/ai-resume-analyzer",
    };

    const project = route.params?.project || defaultProject;
    const navigation = useNavigation();

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: `Check out this exciting project: "${project.title}" by ${project.company}!\n\nDomain: ${project.domain}\nDifficulty: ${project.difficulty}\n\n${project.projectLink ? `View Project: ${project.projectLink}` : ''}`,
                url: project.projectLink || 'https://www.example.com/project-details-link',
                title: `Project: ${project.title}`,
            });
            if (result.action === Share.sharedAction) {
                console.log('Project shared successfully!');
            } else if (result.action === Share.dismissedAction) {
                console.log('Share dismissed.');
            }
        } catch (error: any) {
            Alert.alert("Sharing Error", error.message);
        }
    };

    const handleCollaborate = () => {
        Alert.alert(
            "Collaboration Request",
            `You are about to send a collaboration request for "${project.title}".\n\nThe project owner at ${project.company} will review your profile and respond soon.\n\nDo you want to proceed?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Send Request",
                    onPress: () => Alert.alert(
                        "Request Sent!",
                        `Your request to collaborate on "${project.title}" has been sent.\n\nWe'll notify you of any updates.`
                    ),
                },
            ],
            { cancelable: true }
        );
    };

    const handleProjectLink = async () => {
        if (project.projectLink) {
            const supported = await Linking.canOpenURL(project.projectLink);
            if (supported) {
                await Linking.openURL(project.projectLink);
            } else {
                Alert.alert("Error", `Cannot open URL: ${project.projectLink}`);
            }
        } else {
            Alert.alert("No Link", "No external project link available for this project.");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F9FC" }}>
            <ScrollView style={styles.container}>
                {/* Header: Back Button and Share */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()} // Changed to goBack() for generic navigation
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={26} color="#2C3E50" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onShare} style={styles.shareButton}>
                        <Ionicons name="share-social-outline" size={26} color="#2C3E50" />
                    </TouchableOpacity>
                </View>

                {/* Project Image */}
                <Animatable.View animation="fadeIn" delay={200} style={styles.imageContainer}>
                    <Image
                        source={{ uri: project.image }}
                        style={styles.projectImage}
                    />
                </Animatable.View>

                {/* Project Title and Company */}
                <Animatable.View animation="fadeInUp" delay={300} style={styles.titleSection}>
                    <Text style={styles.projectTitle}>{project.title}</Text>
                    <Text style={styles.projectCompany}>
                        <FontAwesome5 name="building" size={14} color="#7F8C8D" />{" "}
                        {project.company}
                    </Text>
                    <View style={styles.tagBadge}>
                        <Text style={styles.tagText}>{project.domain}</Text>
                    </View>
                </Animatable.View>

                {/* Overview Section */}
                <Animatable.View animation="fadeInUp" delay={400} style={styles.sectionCard}>
                    <Text style={styles.sectionHeader}>Project Overview</Text>
                    <Text style={styles.descriptionText}>
                        {project.description}
                    </Text>
                    <View style={styles.detailRow}>
                        <FontAwesome5 name="chart-line" size={16} color="#3498DB" />
                        <Text style={styles.detailText}>Difficulty: <Text style={styles.highlightText}>{project.difficulty}</Text></Text>
                    </View>
                    <View style={styles.detailRow}>
                        <FontAwesome5 name="users" size={16} color="#3498DB" />
                        <Text style={styles.detailText}>Team Size: <Text style={styles.highlightText}>{project.teamSize}</Text></Text>
                    </View>
                    <View style={styles.detailRow}>
                        <FontAwesome5 name="calendar-alt" size={16} color="#3498DB" />
                        <Text style={styles.detailText}>Duration: <Text style={styles.highlightText}>{project.duration}</Text></Text>
                    </View>
                    <View style={styles.detailRow}>
                        <FontAwesome5 name="play-circle" size={16} color="#3498DB" />
                        <Text style={styles.detailText}>Start Date: <Text style={styles.highlightText}>{project.startDate}</Text></Text>
                    </View>

                    {/* Added: View Project Link Button if available */}
                    {project.projectLink && (
                        <TouchableOpacity style={styles.viewLinkButton} onPress={handleProjectLink}>
                            <FontAwesome5 name="external-link-alt" size={16} color="#fff" />
                            <Text style={styles.viewLinkButtonText}>View External Project</Text>
                        </TouchableOpacity>
                    )}
                </Animatable.View>

                {/* Skills Section */}
                <Animatable.View animation="fadeInUp" delay={500} style={styles.sectionCard}>
                    <Text style={styles.sectionHeader}>Required Skills</Text>
                    <View style={styles.skillsContainer}>
                        {project.requiredSkills.map(
                            (skill: string, index: number) => (
                                <View key={index} style={styles.skillBadge}>
                                    <MaterialCommunityIcons name="check-circle-outline" size={14} color="#27AE60" />
                                    <Text style={styles.skillText}>{skill}</Text>
                                </View>
                            )
                        )}
                    </View>
                </Animatable.View>

                {/* Responsibilities Section */}
                <Animatable.View animation="fadeInUp" delay={600} style={styles.sectionCard}>
                    <Text style={styles.sectionHeader}>Key Responsibilities</Text>
                    {project.responsibilities.map(
                        (responsibility: string, index: number) => (
                            <View key={index} style={styles.responsibilityItem}>
                                <Ionicons name="arrow-forward-circle-outline" size={18} color="#5DADE2" />
                                <Text style={styles.responsibilityText}>{responsibility}</Text>
                            </View>
                        )
                    )}
                </Animatable.View>

                {/* Action Button */}
                <Animatable.View animation="bounceIn" delay={700}>
                    <TouchableOpacity style={styles.collaborateButton} onPress={handleCollaborate}>
                        <MaterialCommunityIcons name="handshake-outline" size={24} color="#fff" />
                        <Text style={styles.collaborateButtonText}>Join</Text>
                    </TouchableOpacity>
                </Animatable.View>

                <View style={{ height: 50 }} /> {/* Spacer at the bottom */}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F9FC",
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 10,
        marginBottom: 10,
    },
    backButton: {
        padding: 8,
    },
    shareButton: {
        padding: 8,
    },
    imageContainer: {
        width: '100%',
        height: 220,
        backgroundColor: '#EAECEF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        overflow: 'hidden',
    },
    projectImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    titleSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    projectTitle: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#2C3E50",
        marginBottom: 8,
    },
    projectCompany: {
        fontSize: 16,
        color: "#7F8C8D",
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    tagBadge: {
        backgroundColor: "#E8F6F3",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginTop: 5,
    },
    tagText: {
        fontSize: 13,
        color: "#27AE60",
        fontWeight: "bold",
    },
    sectionCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        marginHorizontal: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
    },
    sectionHeader: {
        fontSize: 19,
        fontWeight: "bold",
        color: "#34495E",
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EAECEF',
        paddingBottom: 10,
    },
    descriptionText: {
        fontSize: 15,
        color: "#555",
        lineHeight: 22,
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailText: {
        fontSize: 14,
        color: "#555",
        marginLeft: 10,
    },
    highlightText: {
        fontWeight: '600',
        color: '#2C3E50',
    },
    skillsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 5,
    },
    skillBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#ECF0F1",
        borderRadius: 20,
        paddingVertical: 7,
        paddingHorizontal: 12,
        marginRight: 10,
        marginBottom: 10,
    },
    skillText: {
        fontSize: 13,
        color: "#34495E",
        marginLeft: 5,
        fontWeight: '500',
    },
    responsibilityItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    responsibilityText: {
        fontSize: 15,
        color: "#555",
        marginLeft: 10,
        flex: 1,
    },
    collaborateButton: {
        flexDirection: "row",
        backgroundColor: "#193648",
        borderRadius: 15,
        paddingVertical: 15,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 18,
        marginTop: 20,
        shadowColor: "#3498DB",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 10,
    },
    collaborateButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 18,
        marginLeft: 10,
    },
    viewLinkButton: {
        flexDirection: 'row',
        backgroundColor: '#193648',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        shadowColor: '#5DADE2',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    viewLinkButtonText: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 15,
        fontWeight: '600',
    },
});

export default ProjectDetailsScreen;