import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
    Platform, // Added for potential platform-specific styles
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { FontAwesome5, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";

// Define the type for an Industry object
type Industry = {
    id: string;
    name: string;
    type: string;
    location: string;
    image: string;
    description: string; // Added description
};

// Define the type for route parameters
type RouteParams = {
    industry: Industry;
};

const IndustryDetailsScreen = () => {
    // Use useRoute hook to access route parameters
    const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
    const { industry } = route.params; // Destructure industry from route.params

    const [bookmarked, setBookmarked] = useState(false); // State for bookmarking

    // Dummy data for internships (specific to this industry)
    const internships = [
        {
            id: "1",
            title: "Frontend Developer Intern",
            duration: "2 months",
            skills: "React, JavaScript, CSS, HTML",
            stipend: "PKR 15,000/month",
        },
        {
            id: "2",
            title: "AI Research Assistant",
            duration: "3 months",
            skills: "Python, TensorFlow, Data Analysis, Machine Learning",
            stipend: "PKR 20,000/month",
        },
        {
            id: "3",
            title: "UI/UX Design Intern",
            duration: "1.5 months",
            skills: "Figma, Adobe XD, Prototyping, User Research",
            stipend: "PKR 12,000/month",
        },
        {
            id: "4",
            title: "Backend Developer Intern",
            duration: "2 months",
            skills: "Node.js, Express, MongoDB, API Development",
            stipend: "PKR 18,000/month",
        },
    ];

    // Public URL for a generic placeholder image (same as NearbyIndustryScreen)
    const placeholderImageUri = 'https://via.placeholder.com/200x200?text=Industry+Cover';

    // Handler for sending CV
    const handleCVSend = () => {
        Alert.alert(
            "Success ",
            `Your CV has been sent to ${industry.name} recruitment team. They will contact you if your profile matches their requirements.`,
            [{ text: "OK" }]
        );
        // In a real application, you would integrate with an API to send the CV
        console.log(`CV sent to ${industry.name}`);
    };

    // Handler for applying to an internship
    const handleApply = (internshipTitle: string) => {
        Alert.alert(
            "Applied ",
            `You have successfully applied for the "${internshipTitle}" internship at ${industry.name}. Good luck!`,
            [{ text: "OK" }]
        );
        // In a real application, you would integrate with an API to record the application
        console.log(`Applied for ${internshipTitle} at ${industry.name}`);
    };

    // Handler for toggling bookmark status
    const toggleBookmark = () => {
        setBookmarked((prev) => !prev);
        Alert.alert(
            bookmarked ? "Removed" : "Bookmarked 💼",
            `${industry.name} has been ${bookmarked ? "removed from" : "added to"} your bookmark list.`,
            [{ text: "OK" }]
        );
        // In a real application, you would save/remove the bookmark in persistent storage or an API
        console.log(`${industry.name} bookmark status: ${!bookmarked}`);
    };

    return (
        <ScrollView style={styles.container}>
            {/* Cover Image */}
            <Image
                source={{ uri: industry.image || placeholderImageUri }}
                style={styles.coverImage}
                onError={(e) => console.log('Cover image failed to load:', e.nativeEvent.error)}
            />

            {/* Industry Info */}
            <View style={styles.headerSection}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{industry.name}</Text>
                    <Text style={styles.type}>{industry.type}</Text>
                    <View style={styles.locationRow}>
                        <Entypo name="location-pin" size={14} color="#777" />
                        <Text style={styles.location}>{industry.location}</Text>
                    </View>
                </View>

                {/* Bookmark Button */}
                <TouchableOpacity onPress={toggleBookmark} style={styles.bookmarkButton}>
                    <FontAwesome5
                        name="bookmark"
                        size={26} // Slightly larger bookmark icon
                        color={bookmarked ? "#193648" : "#A9A9A9"} // Darker gray when not bookmarked
                        solid={bookmarked}
                    />
                </TouchableOpacity>
            </View>

            {/* Overview */}
            <Text style={styles.sectionTitle}>📄 Overview</Text>
            <View style={styles.sectionContentCard}>
                <Text style={styles.overviewText}>
                    {industry.description ||
                        `No detailed description available for ${industry.name}. This company is a leader in ${industry.type} and offers a dynamic environment for learning and growth.`}
                </Text>
            </View>


            {/* Internship Openings */}
            <Text style={styles.sectionTitle}>  Internship Openings</Text>
            {internships.length > 0 ? (
                internships.map((internship) => (
                    <View key={internship.id} style={styles.internshipCard}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.internshipTitle}>{internship.title}</Text>
                            <View style={styles.internshipDetailRow}>
                                <FontAwesome5 name="clock" size={12} color="#4A6572" />
                                <Text style={styles.duration}> {internship.duration}</Text>
                            </View>
                            <View style={styles.internshipDetailRow}>
                                <MaterialCommunityIcons name="currency-usd" size={14} color="#4A6572" />
                                <Text style={styles.stipend}> {internship.stipend}</Text>
                            </View>
                            <Text style={styles.skills}>Skills: {internship.skills}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.applyButton}
                            onPress={() => handleApply(internship.title)}
                        >
                            <MaterialCommunityIcons name="send" size={18} color="#fff" />
                            <Text style={styles.applyText}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                ))
            ) : (
                <View style={styles.sectionContentCard}>
                    <Text style={styles.noInternshipsText}>No internships currently available. Check back soon!</Text>
                </View>
            )}

            {/* Send CV Button */}
            <TouchableOpacity style={styles.cvButton} onPress={handleCVSend}>
                {/* <MaterialCommunityIcons name="email-send" size={20} color="#fff" /> */}
                <Text style={styles.cvButtonText}>Send Your CV</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F9FC", // Light background for consistency
    },
    coverImage: {
        width: "100%",
        height: 220, // Slightly taller cover image
        resizeMode: 'cover',

    },
    headerSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20, // Increased padding
        backgroundColor: "#fff",
        borderBottomLeftRadius: 25, // More rounded
        borderBottomRightRadius: 25, // More rounded
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 5,
            },
        }),
        marginBottom: 10, // Add some space below header
    },
    title: {
        fontSize: 24, // Larger title
        fontWeight: "bold",
        color: "#193648",
        marginBottom: 3,
    },
    type: {
        fontSize: 16, // Slightly larger type text
        color: "#666",
        marginTop: 2,
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
    },
    location: {
        fontSize: 14, // Slightly larger location text
        color: "#777",
        marginLeft: 5,
    },
    bookmarkButton: {
        padding: 8, // More generous touch area
    },
    sectionTitle: {
        fontSize: 20, // Larger section titles
        fontWeight: "bold",
        color: "#193648",
        marginTop: 30, // More space
        marginHorizontal: 20, // Increased horizontal margin
        marginBottom: 10, // Space below title
    },
    sectionContentCard: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        borderRadius: 15,
        padding: 20,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    overviewText: {
        color: "#444",
        fontSize: 15, // Slightly larger overview text
        lineHeight: 24, // Better readability
    },
    internshipCard: {
        flexDirection: "row",
        backgroundColor: "#fff",
        marginHorizontal: 20, // Increased horizontal margin
        marginTop: 15,
        borderRadius: 15, // Consistent rounded corners
        padding: 18, // Increased padding
        alignItems: "center",
        justifyContent: 'space-between', // Distribute content
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 5,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    internshipTitle: {
        fontSize: 17, // Larger title
        fontWeight: "bold",
        color: "#193648",
        marginBottom: 5,
    },
    internshipDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
        marginBottom: 2, // Space between rows
    },
    duration: {
        fontSize: 13,
        color: "#555",
        marginLeft: 8, // More space from icon
    },
    stipend: {
        fontSize: 13,
        color: "#555",
        marginLeft: 8, // More space from icon
    },
    skills: {
        fontSize: 13,
        color: "#666",
        marginTop: 8, // More space above skills
        lineHeight: 18,
    },
    applyButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#193648", // A more prominent "Apply" button color (e.g., green)
        paddingVertical: 10, // Increased padding
        paddingHorizontal: 15, // Increased padding
        borderRadius: 10, // More rounded
        marginLeft: 15,
        minWidth: 90, // Ensure button has a minimum width
        justifyContent: 'center',
    },
    applyText: {
        color: "#fff",
        marginLeft: 6, // More space from icon
        fontSize: 14, // Slightly larger text
        fontWeight: '600',
    },
    cvButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#193648",
        marginHorizontal: 20, // Increased horizontal margin
        marginVertical: 40, // More vertical space
        paddingVertical: 16, // Increased padding
        borderRadius: 15, // More rounded
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.2,
                shadowRadius: 10,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    cvButtonText: {
        color: "#fff",
        fontSize: 17, // Larger text
        fontWeight: "600",
        marginLeft: 10, // More space from icon
    },
    noInternshipsText: {
        color: "#777",
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: 10,
    }
});

export default IndustryDetailsScreen;