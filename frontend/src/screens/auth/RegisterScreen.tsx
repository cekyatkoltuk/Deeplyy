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

    const handleDobChange = (text: string) => {
        // Remove non-numeric characters
        let cleaned = text.replace(/[^0-9]/g, '');

        // Limit to 8 digits
        if (cleaned.length > 8) {
            cleaned = cleaned.slice(0, 8);
        }

        // --- Range Validation ---
        let day = cleaned.slice(0, 2);
        let month = cleaned.slice(2, 4);
        let year = cleaned.slice(4, 8);

        // Force Day (01-31)
        if (day.length === 2) {
            const d = parseInt(day);
            if (d > 31) day = '31';
            else if (d === 0) day = '01';
        }

        // Force Month (01-12)
        if (month.length === 2) {
            const m = parseInt(month);
            if (m > 12) month = '12';
            else if (m === 0) month = '01';
        }

        // Force Year (19XX-20XX)
        if (year.length > 0) {
            const firstDigit = year[0];
            if (firstDigit !== '1' && firstDigit !== '2') {
                year = ''; // Only allow 1 or 2 as the first digit
            } else if (year.length >= 2) {
                const prefix = year.slice(0, 2);
                if (prefix !== '19' && prefix !== '20') {
                    year = firstDigit; // If 2nd digit makes it not 19 or 20, revert to 1st digit
                }
            }
        }

        // Reconstruct cleaned string with validated parts
        cleaned = day + month + year;

        // Apply formatting (DD/MM/YYYY)
        let formatted = '';
        if (cleaned.length > 0) {
            formatted = cleaned.slice(0, 2);
            if (cleaned.length > 2) {
                formatted += '/' + cleaned.slice(2, 4);
                if (cleaned.length > 4) {
                    formatted += '/' + cleaned.slice(4, 8);
                }
            }
        }
        setDob(formatted);
    };

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Validate password: min 8 chars, at least one number, at least one uppercase
        if (password.length < 8) {
            alert('Password must be at least 8 characters long');
            return;
        }
        if (!/[0-9]/.test(password)) {
            alert('Password must contain at least one number');
            return;
        }
        if (!/[A-Z]/.test(password)) {
            alert('Password must contain at least one uppercase letter');
            return;
        }

        // Validate passwords match exactly
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (dob.length < 10) {
            alert('Please enter a valid Date of Birth (DD/MM/YYYY)');
            return;
        }

        // Calculate age from DOB
        let age = 25;
        const parts = dob.split('/');
        if (parts.length === 3) {
            const d = parseInt(parts[0]);
            const m = parseInt(parts[1]);
            const y = parseInt(parts[2]);
            
            // Check if date is valid (e.g. Feb 30th)
            const dateObj = new Date(y, m - 1, d);
            if (dateObj.getFullYear() !== y || dateObj.getMonth() !== m - 1 || dateObj.getDate() !== d) {
                alert('Please enter a valid date');
                return;
            }

            const currentYear = new Date().getFullYear();
            age = currentYear - y;
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
                            label="Your Name"
                            placeholder="Enter your full name"
                            value={name}
                            onChangeText={setName}
                            icon={<Text style={styles.icon}></Text>}
                        />
                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            icon={<Text style={styles.icon}></Text>}
                        />
                        <Input
                            label="Date of Birth"
                            placeholder="DD/MM/YYYY"
                            value={dob}
                            onChangeText={handleDobChange}
                            keyboardType="numeric"
                            maxLength={10}
                            icon={<Text style={styles.icon}></Text>}
                        />
                        <Input
                            label="Password"
                            placeholder="Create a password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            icon={<Text style={styles.icon}></Text>}
                        />
                        <Input
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            icon={<Text style={styles.icon}></Text>}
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
