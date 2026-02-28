import React, { useState } from 'react';
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
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '../../utils/theme';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuthStore } from '../../store/authStore';

export const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading } = useAuthStore();

    const handleLogin = async () => {
        if (!email || !password) return;
        try {
            await login(email, password);
        } catch (error: any) {
            alert(error.message || 'Login failed');
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
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoIcon}>🔥</Text>
                        <Text style={styles.logoText}>Flame</Text>
                        <Text style={styles.tagline}>Find your perfect match</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            icon={<Text style={styles.inputIcon}>✉️</Text>}
                        />
                        <Input
                            label="Password"
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            icon={<Text style={styles.inputIcon}>🔒</Text>}
                        />

                        <TouchableOpacity style={styles.forgotBtn}>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <Button
                            title="Sign In"
                            onPress={handleLogin}
                            variant="primary"
                            size="large"
                            fullWidth
                            loading={isLoading}
                        />

                        {/* Divider */}
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Social Login */}
                        <Button
                            title="Continue with Google"
                            onPress={() => { }}
                            variant="secondary"
                            size="large"
                            fullWidth
                            icon={<Text style={styles.socialIcon}>🔵</Text>}
                        />

                        <Button
                            title="Continue with Apple"
                            onPress={() => { }}
                            variant="secondary"
                            size="large"
                            fullWidth
                            icon={<Text style={styles.socialIcon}>🍎</Text>}
                        />
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.footerLink}>Sign Up</Text>
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
        justifyContent: 'center',
        padding: Spacing.lg,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: Spacing.xxl,
    },
    logoIcon: {
        fontSize: 64,
        marginBottom: Spacing.sm,
    },
    logoText: {
        fontSize: FontSizes.hero,
        fontWeight: FontWeights.extraBold,
        color: Colors.primary,
        letterSpacing: 2,
    },
    tagline: {
        color: Colors.textSecondary,
        fontSize: FontSizes.body,
        marginTop: Spacing.xs,
    },
    form: {
        gap: Spacing.xs,
    },
    inputIcon: {
        fontSize: 18,
    },
    forgotBtn: {
        alignSelf: 'flex-end',
        marginBottom: Spacing.md,
    },
    forgotText: {
        color: Colors.primary,
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.medium,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Spacing.md,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border,
    },
    dividerText: {
        color: Colors.textMuted,
        paddingHorizontal: Spacing.md,
        fontSize: FontSizes.sm,
    },
    socialIcon: {
        fontSize: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Spacing.xl,
    },
    footerText: {
        color: Colors.textSecondary,
        fontSize: FontSizes.body,
    },
    footerLink: {
        color: Colors.primary,
        fontSize: FontSizes.body,
        fontWeight: FontWeights.semiBold,
    },
});
