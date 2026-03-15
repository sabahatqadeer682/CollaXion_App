// CollaXionApp/src/components/SectionHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Local Common styles for this component
const Colors = {
    primary: '#193648',
    text: '#193648',
};

const Spacing = {
    small: 8,
    medium: 16,
    large: 24,
};

interface SectionHeaderProps {
    title: string;
    onPressViewAll?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onPressViewAll }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {onPressViewAll && (
                <TouchableOpacity onPress={onPressViewAll} style={styles.viewAllButton}>
                    <Text style={styles.viewAllText}>View All</Text>
                    <MaterialIcons name="arrow-forward-ios" size={14} color={Colors.primary} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.medium,
        marginTop: Spacing.large,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.text,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewAllText: {
        color: Colors.primary,
        fontSize: 14,
        marginRight: Spacing.small / 2,
        fontWeight: '600',
    },
});

export default SectionHeader;