// CollaXionApp/src/components/Card.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';

// Local Common styles for this component
const Colors = {
    primary: '#193648',
    secondary: '#E2EEF9',
    text: '#193648',
    subText: '#555',
    white: '#fff',
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

interface CardProps {
    title?: string;
    description?: string;
    onPress?: () => void;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    icon?: React.ReactNode;
    titleStyle?: StyleProp<TextStyle>;
    descriptionStyle?: StyleProp<TextStyle>;
}

const Card: React.FC<CardProps> = ({
    title,
    description,
    onPress,
    children,
    style,
    icon,
    titleStyle,
    descriptionStyle,
}) => {
    const content = (
        <View style={[styles.card, Shadows.card, style]}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <View style={styles.contentContainer}>
                {title && <Text style={[styles.cardTitle, titleStyle]}>{title}</Text>}
                {description && <Text style={[styles.cardDescription, descriptionStyle]}>{description}</Text>}
                {children}
            </View>
        </View>
    );

    return onPress ? <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity> : content;
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.medium,
        borderRadius: 15,
        backgroundColor: Colors.white,
        marginBottom: Spacing.medium,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 15,
        backgroundColor: Colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.medium,
    },
    contentContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
    },
    cardDescription: {
        fontSize: 14,
        color: Colors.subText,
    },
});

export default Card;