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
    Image,
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
                        <Image
                            source={require('../../../assets/icons/connect_deeplyy_white.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
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
                            icon={<Text style={styles.inputIcon}></Text>}
                        />
                        <Input
                            label="Password"
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            icon={<Text style={styles.inputIcon}></Text>}
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
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Onboarding')}>
                            <Text style={styles.footerLink}>Create Account</Text>
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
        marginBottom: Spacing.xl,
    },
    logoImage: {
        width: '100%',
        height: 160,
        transform: [{ scale: 1.3 }],
    },
    form: {
        gap: Spacing.xs,
    },
    inputIcon: {
        fontSize: 18,
        fontFamily: FontFamily.body,
    },
    forgotBtn: {
        alignSelf: 'flex-end',
        marginBottom: Spacing.md,
    },
    forgotText: {
        color: Colors.primary,
        fontSize: FontSizes.sm,
        fontFamily: FontFamily.small,
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
