// CollaXionApp/src/components/IndustryCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Industry } from '../types';

// Local Common styles for this component
const Colors = {
    primary: '#193648',
    secondary: '#E2EEF9',
    subText: '#555',
    white: '#fff',
    text: '#193648',
};

const Spacing = {
    small: 8,
    medium: 16,
};

const Shadows = {
    card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
};

interface IndustryCardProps {
    industry: Industry;
    onPress: (industry: Industry) => void;
}

const IndustryCard: React.FC<IndustryCardProps> = ({ industry, onPress }) => {
    return (
        <TouchableOpacity style={[styles.card, Shadows.card]} onPress={() => onPress(industry)}>
            <Image source={industry.logo} style={styles.logo} />
            <View style={styles.content}>
                <Text style={styles.name}>{industry.name}</Text>
                <View style={styles.distanceContainer}>
                    <MaterialCommunityIcons name="map-marker-distance" size={14} color={Colors.subText} />
                    <Text style={styles.distance}>{industry.distance}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: 15,
        padding: Spacing.medium,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: Spacing.medium,
        width: 220, // Fixed width for horizontal scroll
    },
    logo: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: Spacing.medium,
        backgroundColor: Colors.secondary,
    },
    content: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.small / 2,
    },
    distanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    distance: {
        fontSize: 14,
        color: Colors.subText,
        marginLeft: Spacing.small / 2,
    },
});

export default IndustryCard;