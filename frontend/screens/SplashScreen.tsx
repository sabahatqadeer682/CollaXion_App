import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { RootStackParamList } from '../App';

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export default function SplashScreen() {
    const navigation = useNavigation<SplashScreenNavigationProp>();

    const logoOpacity = useRef(new Animated.Value(1)).current;
    const collaxionOpacities = useState(
        Array.from({ length: 'CollaXion'.length }, () => new Animated.Value(0))
    )[0];
    const taglineOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const timer = setTimeout(() => {
            Animated.timing(logoOpacity, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }).start(() => {
                const animations = 'CollaXion'.split('').map((_, i) =>
                    Animated.timing(collaxionOpacities[i], {
                        toValue: 1,
                        duration: 150,
                        useNativeDriver: true,
                    })
                );
                Animated.stagger(100, animations).start(() => {
                    Animated.timing(taglineOpacity, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }).start(() => {
                        setTimeout(() => navigation.replace('SplashScreen2'), 1500);
                    });
                });
            });
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <LinearGradient
            colors={['#EAF3FF', '#CDE1F7', '#B7D1F0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <Animated.Image
                source={require('../assets/images/logo.png')}
                style={[styles.logo, { opacity: logoOpacity }]}
                resizeMode="contain"
            />

            <View style={styles.wordContainer}>
                {'CollaXion'.split('').map((char, i) => (
                    <Animated.Text
                        key={i}
                        style={[styles.fullText, { opacity: collaxionOpacities[i] }]}
                    >
                        {char}
                    </Animated.Text>
                ))}
            </View>

            <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
                Where Collaboration Meets Innovation
            </Animated.Text>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 0,
        position: 'absolute',
    },
    wordContainer: {
        flexDirection: 'row',
    },
    fullText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#193648',
        letterSpacing: 1,
    },
    tagline: {
        fontSize: 16,
        color: '#193648',
        marginTop: 10,
        letterSpacing: 0.5,
        fontStyle: 'italic',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});
