import React, { useState } from 'react';
import { FontFamily } from '../../utils/theme';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSizes, FontWeights, Spacing } from '../../utils/theme';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuthStore } from '../../store/authStore';

export const RegisterScreen = ({ navigation }: any) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [dob, setDob] = useState('');
    const { register, isLoading } = useAuthStore();

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) return;
        if (password !== confirmPassword) return;
        // Calculate age from DOB or default to 25
        let age = 25;
        if (dob) {
            const parts = dob.split('/');
            if (parts.length === 3) {
                const birthYear = parseInt(parts[2]);
                const currentYear = new Date().getFullYear();
                age = currentYear - birthYear;
            }
        }
        try {
            await register(name, email, password, age, 'other');
            navigation.navigate('ProfileSetup');
        } catch (error: any) {
            alert(error.message || 'Registration failed');
        }
    };

    return (
        <LinearGradient
            colors={[Colors.background, '#1a0a2e', Colors.background]}
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.backBtn}>← Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>
                            Join Flame and find your perfect match
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <Input
                            label="Full Name"
                            placeholder="Enter your full name"
                            value={name}
                            onChangeText={setName}
                            icon={<Text style={styles.icon}>👤</Text>}
                        />
                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            icon={<Text style={styles.icon}>✉️</Text>}
                        />
                        <Input
                            label="Date of Birth"
                            placeholder="DD/MM/YYYY"
                            value={dob}
                            onChangeText={setDob}
                            keyboardType="numeric"
                            icon={<Text style={styles.icon}>📅</Text>}
                        />
                        <Input
                            label="Password"
                            placeholder="Create a password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            icon={<Text style={styles.icon}>🔒</Text>}
                        />
                        <Input
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            icon={<Text style={styles.icon}>🔒</Text>}
                        />

                        <Button
                            title="Create Account"
                            onPress={handleRegister}
                            variant="primary"
                            size="large"
                            fullWidth
                            loading={isLoading}
                        />

                        <Text style={styles.terms}>
                            By creating an account, you agree to our{' '}
                            <Text style={styles.link}>Terms of Service</Text> and{' '}
                            <Text style={styles.link}>Privacy Policy</Text>
                        </Text>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.footerLink}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: Spacing.lg,
        paddingTop: Spacing.xxl + Spacing.lg,
    },
    header: {
        marginBottom: Spacing.xl,
    },
    backBtn: {
        color: Colors.primary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        fontWeight: FontWeights.medium,
        marginBottom: Spacing.md,
    },
    title: {
        fontSize: FontSizes.xxxl,
        fontFamily: FontFamily.heading,
        fontWeight: FontWeights.bold,
        color: Colors.textPrimary,
        marginBottom: Spacing.xs,
    },
    subtitle: {
        color: Colors.textSecondary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
    },
    form: {
        gap: Spacing.xs,
    },
    icon: {
        fontSize: 18,
        fontFamily: FontFamily.body,
    },
    terms: {
        color: Colors.textMuted,
        fontSize: FontSizes.sm,
        fontFamily: FontFamily.small,
        textAlign: 'center',
        marginTop: Spacing.sm,
        lineHeight: 18,
    },
    link: {
        color: Colors.primary,
        fontWeight: FontWeights.medium,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Spacing.xl,
    },
    footerText: {
        color: Colors.textSecondary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
    },
    footerLink: {
        color: Colors.primary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        fontWeight: FontWeights.semiBold,
    },
});
