import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    RefreshControl,
    Platform,
    FlatList,
    Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// Dummy data with reliable placeholder images
const industriesData = [
    {
        id: "1",
        name: "SoftLab Solutions",
        type: "Software Development",
        location: "Lahore, Punjab",
        image: "data:image/jpeg;base64,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",
    },
    {
        id: "2",
        name: "TechNova Systems",
        type: "AI & Machine Learning",
        location: "Islamabad, Pakistan",
        image: "data:image/jpeg;base64,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",
    },
    {
        id: "3",
        name: "PixelEdge Studios",
        type: "UI/UX & Web Design",
        location: "Karachi, Sindh",
        image: "data:image/jpeg;base64,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",
    },
    {
        id: "4",
        name: "DataDrive Analytics",
        type: "Data Science & Big Data",
        location: "Lahore, Punjab",
        image: "data:image/png;base64,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",
    },
    {
        id: "5",
        name: "CloudBridge Technologies",
        type: "Cloud Computing & DevOps",
        location: "Islamabad, Pakistan",
        image: "data:image/png;base64,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",
    },
];

const NearbyIndustryScreen = () => {
    const navigation = useNavigation<any>();
    const [searchQuery, setSearchQuery] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    const filteredIndustries = industriesData.filter(
        (industry) =>
            industry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            industry.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            industry.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    }, []);

    const renderIndustryCard = ({ item }: { item: typeof industriesData[0] }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("IndustryDetails", { industry: item })}
            activeOpacity={0.8}
        >
            <Image
                source={{ uri: item.image }}
                style={styles.image}
                onError={(e) => console.log("Image failed to load:", e.nativeEvent.error)}
            />
            <View style={styles.cardContent}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.type}>{item.type}</Text>
                <View style={styles.locationRow}>
                    <Entypo name="location-pin" size={14} color="#555" />
                    <Text style={styles.location}>{item.location}</Text>
                </View>
                <View style={styles.viewDetailsTextContainer}>
                    <Text style={styles.viewDetailsText}>View Details</Text>
                    <MaterialCommunityIcons
                        name="chevron-right"
                        size={18}
                        color="#193648"
                        style={{ marginLeft: 5 }}
                    />
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.outerContainer}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#193648" />
                }
            >
                {/* Header */}
                <Text style={styles.header}>Nearby Industries</Text>
                <Text style={styles.subHeader}>
                    Explore top industries near your city and start collaborating!
                </Text>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Entypo name="magnifying-glass" size={20} color="#666" style={{ marginRight: 10 }} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search industries, type, or location..."
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearSearchButton}>
                            <MaterialCommunityIcons name="close-circle" size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Horizontal Scroll of Industry Cards */}
                {filteredIndustries.length > 0 ? (
                    <FlatList
                        data={filteredIndustries}
                        horizontal
                        keyExtractor={(item) => item.id}
                        renderItem={renderIndustryCard}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingVertical: 10 }}
                        snapToAlignment="start"
                        decelerationRate="fast"
                        snapToInterval={width * 0.75 + 20} // card width + margin
                    />
                ) : (
                    <View style={styles.noResultsContainer}>
                        <MaterialCommunityIcons name="database-search" size={60} color="#D0D0D0" />
                        <Text style={styles.noResultsText}>No industries match your search.</Text>
                        <Text style={styles.noResultsSubText}>Try a different keyword or check for typos.</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: "#F0F4F7",
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: Platform.OS === "android" ? 30 : 50,
        paddingBottom: 30,
    },
    header: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#193648",
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    subHeader: {
        fontSize: 16,
        color: "#555",
        marginBottom: 25,
        lineHeight: 22,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 15,
        height: 55,
        borderRadius: 12,
        marginBottom: 20,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#193648",
        paddingVertical: 10,
    },
    clearSearchButton: {
        padding: 5,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 15,
        marginRight: 20,
        width: width * 0.75,
        overflow: "hidden",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    image: {
        width: "100%",
        height: 150,
        resizeMode: "cover",
    },
    cardContent: {
        padding: 15,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#193648",
        marginBottom: 4,
    },
    type: {
        fontSize: 14,
        color: "#777",
        marginBottom: 8,
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    location: {
        color: "#555",
        fontSize: 13,
        marginLeft: 6,
    },
    viewDetailsTextContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    viewDetailsText: {
        color: "#193648",
        fontSize: 14,
        fontWeight: "600",
    },
    noResultsContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
        marginTop: 30,
        backgroundColor: "#fff",
        borderRadius: 15,
        marginHorizontal: 10,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    noResultsText: {
        fontSize: 19,
        color: "#888",
        marginTop: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    noResultsSubText: {
        fontSize: 15,
        color: "#aaa",
        marginTop: 8,
        textAlign: "center",
        paddingHorizontal: 25,
        lineHeight: 22,
    },
});

export default NearbyIndustryScreen;
