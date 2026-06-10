import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
    Modal,
    FlatList,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import {
    FontFamily,
    Colors, FontSizes, FontWeights, Spacing, BorderRadius, Shadows,
} from '../../utils/theme';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { InterestTag } from '../../components/InterestTag';
import { WheelPicker } from '../../components/WheelPicker';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import { INTERESTS } from '../../utils/constants';
import { COUNTRY_CODES } from '../../utils/countries';
import { isValidPhoneNumber } from 'libphonenumber-js/min';
import api from '../../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TOTAL_STEPS = 13;

const STEP_TITLES = [
    'What is your name?',
    'When is your birthday?',
    'I identify as...',
    'What are you looking for?',
    'Your Location',
    'Add Your Photos',
    'About You',
    'Your Interests',
    'Your MBTI',
    'Your Enneagram',
    'What is your email?',
    'What is your phone number?',
    'Create a password',
];
const STEP_SUBTITLES = [
    'This is how you will appear in the app',
    'You must be at least 18 to use Deeplyy',
    'Select your gender identity',
    'We will help you find the right people',
    'Let people nearby discover you',
    'Show the world the real you',
    'Write a bio that shows your personality',
    'Pick up to 6 things you love',
    'What is your personality type?',
    'What is your core motivation?',
    'We will use this to keep your account safe',
    'For account security and verification',
    'Make it strong and secure',
];

import { GENDER_OPTIONS, MBTI_OPTIONS, ENNEAGRAM_OPTIONS, LOOKING_FOR_OPTIONS } from '../../utils/constants';

const days = Array.from({ length: 31 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 }));
const months = [
    { label: 'Jan', value: 1 }, { label: 'Feb', value: 2 }, { label: 'Mar', value: 3 },
    { label: 'Apr', value: 4 }, { label: 'May', value: 5 }, { label: 'Jun', value: 6 },
    { label: 'Jul', value: 7 }, { label: 'Aug', value: 8 }, { label: 'Sep', value: 9 },
    { label: 'Oct', value: 10 }, { label: 'Nov', value: 11 }, { label: 'Dec', value: 12 }
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1930 + 1 }, (_, i) => {
    const y = currentYear - i;
    return { label: `${y}`, value: y };
});

export const OnboardingScreen = ({ navigation }: any) => {
    const [step, setStep] = useState(0);
    
    // Auth Fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState(COUNTRY_CODES[2]); // Default Turkey
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [dobDay, setDobDay] = useState<number>(1);
    const [dobMonth, setDobMonth] = useState<number>(1);
    const [dobYear, setDobYear] = useState<number>(2000);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // Profile Fields
    const [gender, setGender] = useState<'male' | 'female' | 'other' | null>(null);
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [photos, setPhotos] = useState<string[]>([]);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [mbti, setMbti] = useState<string | null>(null);
    const [enneagram, setEnneagram] = useState<string | null>(null);
    const [lookingFor, setLookingFor] = useState<string | null>(null);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);

    const { updateProfile, uploadPhoto } = useUserStore();
    const { register, setAuthenticated } = useAuthStore();

    // Animations
    const progressAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: (step + 1) / TOTAL_STEPS,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [step]);

    const animateTransition = (direction: 'forward' | 'back', callback: () => void) => {
        const exitValue = direction === 'forward' ? -30 : 30;
        const enterValue = direction === 'forward' ? 30 : -30;

        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: exitValue, duration: 150, useNativeDriver: true }),
        ]).start(() => {
            callback();
            slideAnim.setValue(enterValue);
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
                Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
            ]).start();
        });
    };

    const calculateAge = () => {
        let age = currentYear - dobYear;
        const currentMonth = new Date().getMonth() + 1;
        const currentDay = new Date().getDate();
        if (currentMonth < dobMonth || (currentMonth === dobMonth && currentDay < dobDay)) {
            age--;
        }
        return age;
    };

    const validateStep = () => {
        if (step === 1) {
            const age = calculateAge();
            if (age < 18) {
                alert('You must be at least 18 years old to use Deeplyy');
                return false;
            }
        }
        if (step === 10) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return false;
            }
        }
        if (step === 11) {
            const combinedPhone = countryCode.dialCode + phone.replace(/\D/g, '');
            try {
                if (!isValidPhoneNumber(combinedPhone, countryCode.code as any)) {
                    alert('Please enter a valid phone number for ' + countryCode.name);
                    return false;
                }
            } catch (e) {
                alert('Please enter a valid phone number');
                return false;
            }
        }
        if (step === 12) {
            if (password.length < 8 || !/[0-9]/.test(password) || !/[A-Z]/.test(password)) {
                alert('Password must be at least 8 chars, 1 number, 1 uppercase');
                return false;
            }
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return false;
            }
        }
        return true;
    };

    const goNext = () => {
        if (!canProceed()) return;
        if (!validateStep()) return;

        if (step < TOTAL_STEPS - 1) {
            animateTransition('forward', () => setStep(step + 1));
        } else {
            handleComplete();
        }
    };

    const goBack = () => {
        if (step > 0) {
            animateTransition('back', () => setStep(step - 1));
        } else {
            navigation.goBack(); // Back to login
        }
    };

    const canProceed = (): boolean => {
        switch (step) {
            case 0: return name.trim().length >= 2;
            case 1: return calculateAge() >= 18;
            case 2: return gender !== null;
            case 3: return lookingFor !== null;
            case 4: return location.trim().length >= 2;
            case 5: return photos.length >= 1;
            case 6: return bio.trim().length >= 10;
            case 7: return selectedInterests.length >= 1;
            case 8: return mbti !== null;
            case 9: return enneagram !== null;
            case 10: return email.trim().length >= 5 && email.includes('@');
            case 11: {
                try {
                    return isValidPhoneNumber(countryCode.dialCode + phone.replace(/\D/g, ''), countryCode.code as any);
                } catch {
                    return false;
                }
            }
            case 12: return password.length >= 8 && password === confirmPassword;
            default: return false;
        }
    };

    const skipStep = async () => {
        if (step === 8) setMbti(null);
        if (step === 9) setEnneagram(null);

        // Check if email already exists
        if (step === 10) {
            try {
                const res = await api.post('/auth/check', { email: email.trim() });
                if (res.data.exists) {
                    alert(res.data.message);
                    return;
                }
            } catch (error: any) {
                console.error('Error checking email:', error);
                alert(error.message || 'Error connecting to server. Please try again.');
                return;
            }
        }

        // Check if phone number already exists
        if (step === 11) {
            try {
                const combinedPhone = countryCode.dialCode + phone.replace(/\D/g, '');
                const res = await api.post('/auth/check', { phone_number: combinedPhone });
                if (res.data.exists) {
                    alert(res.data.message);
                    return;
                }
            } catch (error: any) {
                console.error('Error checking phone:', error);
                alert(error.message || 'Error connecting to server. Please try again.');
                return;
            }
        }
        
        if (step < TOTAL_STEPS - 1) {
            animateTransition('forward', () => setStep(step + 1));
        } else {
            handleComplete();
        }
    };

    const toggleInterest = (interest: string) => {
        setSelectedInterests((prev) =>
            prev.includes(interest)
                ? prev.filter((i) => i !== interest)
                : prev.length < 6
                    ? [...prev, interest]
                    : prev
        );
    };

    const handleAddPhoto = async () => {
        if (photos.length >= 6) {
            alert('Maximum 6 photos allowed');
            return;
        }

        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("You've refused to allow this app to access your photos!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.8,
            base64: true,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            const mimeType = asset.mimeType || 'image/jpeg';
            // Use uri if base64 is missing, otherwise construct data URI
            const imageUrl = asset.base64 ? `data:${mimeType};base64,${asset.base64}` : asset.uri;
            setPhotos((prev) => [...prev, imageUrl]);
        }
    };

    const handleRemovePhoto = (index: number) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAutoLocation = async () => {
        setIsFetchingLocation(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLocation('Istanbul, Turkey');
                alert('Tarayıcınız HTTP bağlantısında güvenliği sağlamak için konumu otomatik engelledi. Test için varsayılan konum (İstanbul) eklendi.');
                setIsFetchingLocation(false);
                return;
            }

            const locationPromise = Location.getCurrentPositionAsync({});
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Location request timed out')), 6000)
            );

            let locationData = await Promise.race([locationPromise, timeoutPromise]) as Location.LocationObject;

            let geocode = await Location.reverseGeocodeAsync({
                latitude: locationData.coords.latitude,
                longitude: locationData.coords.longitude
            });

            if (geocode && geocode.length > 0) {
                const place = geocode[0];
                const city = place.city || place.subregion || place.region || '';
                const country = place.country || '';
                
                const formattedLocation = [city, country].filter(Boolean).join(', ');
                setLocation(formattedLocation || 'Istanbul, Turkey');
            } else {
                setLocation('Istanbul, Turkey');
            }
        } catch (error) {
            console.error('Error fetching location:', error);
            setLocation('Istanbul, Turkey');
            alert('Telefonunuzdan konum alınamadı. Test edebilmeniz için varsayılan konum eklendi.');
        } finally {
            setIsFetchingLocation(false);
        }
    };

    const handleComplete = async () => {
        setIsSubmitting(true);
        try {
            const combinedPhone = countryCode.dialCode + phone.replace(/\D/g, '');
            // Create account and save all profile details in one single, safe step
            await register(
                name.trim(), email.trim(), password, calculateAge(), gender || 'other', combinedPhone,
                {
                    bio: bio.trim(),
                    location: location.trim(),
                    photos,
                    interests: selectedInterests,
                    mbti: mbti || undefined,
                    enneagram: enneagram || undefined,
                    lookingFor: lookingFor || undefined,
                }
            );

            setAuthenticated(true);
        } catch (error: any) {
            setIsSubmitting(false);
            const msg = error?.message || 'Something went wrong. Please try again.';
            if (typeof window !== 'undefined') {
                alert(msg);
            } else {
                Alert.alert('Error', msg);
            }
        }
    };

    // ─── Step Content Renderers ──────────────────────────────────

    const renderNameStep = () => (
        <View style={styles.stepContent}>
            <Input
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                autoFocus
                autoCapitalize="words"
                maxLength={16}
            />
        </View>
    );

    const renderEmailStep = () => (
        <View style={styles.stepContent}>
            <Input
                placeholder="Enter your email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoFocus
            />
        </View>
    );

    const renderPhoneStep = () => (
        <View style={styles.stepContent}>
            <View style={styles.phoneInputContainer}>
                <TouchableOpacity 
                    style={styles.countryPickerBtn}
                    onPress={() => setShowCountryPicker(true)}
                >
                    <Text style={styles.countryFlag}>{countryCode.flag}</Text>
                    <Text style={styles.countryDialCode}>{countryCode.dialCode}</Text>
                    <Ionicons name="chevron-down" size={16} color={Colors.white} />
                </TouchableOpacity>
                <TextInput
                    style={styles.phoneInput}
                    placeholder="555 123 4567"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    maxLength={15}
                    autoFocus
                />
            </View>
            <Text style={styles.passwordHint}>We won't share your number with anyone.</Text>
        </View>
    );

    const renderDobStep = () => (
        <View style={styles.stepContent}>
            <View style={styles.dobContainer}>
                <View style={styles.dobColumn}>
                    <Text style={styles.dobColumnLabel}>Day</Text>
                    <WheelPicker
                        items={days}
                        selectedValue={dobDay}
                        onValueChange={(val) => setDobDay(val as number)}
                        visibleItems={5}
                        itemHeight={44}
                    />
                </View>
                <View style={styles.dobColumn}>
                    <Text style={styles.dobColumnLabel}>Month</Text>
                    <WheelPicker
                        items={months}
                        selectedValue={dobMonth}
                        onValueChange={(val) => setDobMonth(val as number)}
                        visibleItems={5}
                        itemHeight={44}
                    />
                </View>
                <View style={styles.dobColumn}>
                    <Text style={styles.dobColumnLabel}>Year</Text>
                    <WheelPicker
                        items={years}
                        selectedValue={dobYear}
                        onValueChange={(val) => setDobYear(val as number)}
                        visibleItems={5}
                        itemHeight={44}
                    />
                </View>
            </View>
            <Text style={styles.dobHint}>Age: {calculateAge()}</Text>
            {calculateAge() < 18 && (
                <Text style={styles.errorText}>
                    You must be at least 18 years old to use Deeplyy
                </Text>
            )}
        </View>
    );

    const renderPasswordStep = () => (
        <View style={styles.stepContent}>
            <Input
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoFocus
                rightIcon={<Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={Colors.textSecondary} />}
                onRightIconPress={() => setShowPassword(!showPassword)}
                containerStyle={{ marginBottom: Spacing.md }}
            />
            <Input
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                rightIcon={<Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={Colors.textSecondary} />}
                onRightIconPress={() => setShowPassword(!showPassword)}
            />
            <Text style={styles.passwordHint}>
                Min 8 characters, 1 number, 1 uppercase letter
            </Text>
        </View>
    );

    const renderGenderStep = () => (
        <View style={styles.stepContent}>
            <View style={styles.genderGrid}>
                {GENDER_OPTIONS.map((opt) => {
                    const isSelected = gender === opt.value;
                    return (
                        <TouchableOpacity
                            key={opt.value}
                            style={[styles.genderCard, isSelected && styles.genderCardSelected]}
                            onPress={() => setGender(opt.value)}
                            activeOpacity={0.7}
                        >
                            {isSelected && (
                                <LinearGradient
                                    colors={[Colors.primaryGradientStart + '25', Colors.primaryGradientEnd + '10']}
                                    style={StyleSheet.absoluteFill}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                />
                            )}
                            <Text style={[styles.genderLabel, isSelected && styles.genderLabelSelected]}>
                                {opt.label}
                            </Text>
                            {isSelected && (
                                <View style={styles.genderCheck}>
                                    <Text style={styles.genderCheckText}>✓</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );

    const renderBioStep = () => (
        <View style={styles.stepContent}>
            <View style={styles.bioContainer}>
                <TextInput
                    style={styles.bioInput}
                    value={bio}
                    onChangeText={setBio}
                    placeholder="Tell people what makes you unique..."
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    multiline
                    maxLength={300}
                    textAlignVertical="top"
                    autoFocus
                />
                <View style={styles.bioFooter}>
                    <Text style={[
                        styles.bioCharCount,
                        bio.length >= 10 && styles.bioCharCountValid,
                    ]}>
                        {bio.length}/300
                    </Text>
                    {bio.length < 10 && (
                        <Text style={styles.bioHint}>Minimum 10 characters</Text>
                    )}
                </View>
            </View>
            <View style={styles.bioTips}>
                <Text style={styles.bioTipsTitle}>Tips for a great bio</Text>
                <Text style={styles.bioTipItem}>• Mention your hobbies and passions</Text>
                <Text style={styles.bioTipItem}>• Share what you're looking for</Text>
                <Text style={styles.bioTipItem}>• Be authentic and fun!</Text>
            </View>
        </View>
    );

    const renderLocationStep = () => (
        <View style={styles.stepContent}>
            {location ? (
                <View style={styles.locationDetectedBox}>
                    <Ionicons name="location-sharp" size={24} color={Colors.primary} />
                    <Text style={styles.locationDetectedText}>{location}</Text>
                </View>
            ) : null}
            <TouchableOpacity 
                style={styles.autoLocationBtn} 
                onPress={handleAutoLocation}
                disabled={isFetchingLocation}
            >
                {isFetchingLocation ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                    <>
                        <Ionicons name="location-outline" size={18} color={Colors.primary} />
                        <Text style={styles.autoLocationText}>
                            {location ? 'Update my location' : 'Fetch my location'}
                        </Text>
                    </>
                )}
            </TouchableOpacity>
            <Text style={styles.locationHint}>
                This is required to show you people nearby.
            </Text>
        </View>
    );

    const renderPhotosStep = () => (
        <View style={styles.stepContent}>
            <View style={styles.photoAddRow}>
                <TouchableOpacity
                    style={styles.photoGalleryBtn}
                    onPress={handleAddPhoto}
                >
                    <Ionicons name="images-outline" size={20} color={Colors.white} />
                    <Text style={styles.photoGalleryBtnText}>Add from Gallery</Text>
                </TouchableOpacity>
            </View>

            {/* Photo Grid */}
            <View style={styles.photoGrid}>
                {photos.map((url, idx) => (
                    <View key={idx} style={styles.photoSlot}>
                        <View style={styles.photoThumb}>
                            <Image source={{ uri: url }} style={[StyleSheet.absoluteFill, { borderRadius: BorderRadius.lg }]} resizeMode="cover" />
                            {idx === 0 && (
                                <View style={styles.mainBadge}>
                                    <Text style={styles.mainBadgeText}>Main</Text>
                                </View>
                            )}
                        </View>
                        <TouchableOpacity
                            style={styles.photoRemoveBtn}
                            onPress={() => handleRemovePhoto(idx)}
                        >
                            <Text style={styles.photoRemoveText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                {Array.from({ length: Math.max(0, 6 - photos.length) }).map((_, idx) => (
                    <TouchableOpacity 
                        key={`empty-${idx}`} 
                        style={[styles.photoSlot, styles.photoSlotEmpty]}
                        onPress={handleAddPhoto}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.photoSlotPlus}>+</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Text style={styles.photoHint}>
                {photos.length === 0
                    ? 'You can add photos later from your profile too'
                    : `${photos.length}/6 photos added`}
            </Text>
        </View>
    );

    const renderInterestsStep = () => (
        <View style={styles.stepContent}>
            <View style={styles.interestCountBadge}>
                <Text style={styles.interestCountText}>
                    {selectedInterests.length}/6 selected
                </Text>
            </View>
            <View style={styles.interestsGrid}>
                {INTERESTS.map((interest) => (
                    <InterestTag
                        key={interest}
                        label={interest}
                        selected={selectedInterests.includes(interest)}
                        onPress={() => toggleInterest(interest)}
                    />
                ))}
            </View>
        </View>
    );

    const renderMbtiStep = () => (
        <View style={styles.stepContent}>
            <View style={styles.interestsGrid}>
                {MBTI_OPTIONS.map((item) => (
                    <InterestTag
                        key={item}
                        label={item}
                        selected={mbti === item}
                        onPress={() => setMbti(item)}
                    />
                ))}
            </View>
        </View>
    );

    const renderEnneagramStep = () => (
        <View style={styles.stepContent}>
            <View style={styles.interestsGrid}>
                {ENNEAGRAM_OPTIONS.map((item) => (
                    <InterestTag
                        key={item}
                        label={item}
                        selected={enneagram === item}
                        onPress={() => setEnneagram(item)}
                    />
                ))}
            </View>
        </View>
    );

    const renderLookingForStep = () => (
        <View style={styles.stepContent}>
            <View style={styles.genderGrid}>
                {LOOKING_FOR_OPTIONS.map((opt) => {
                    const isSelected = lookingFor === opt.value;
                    return (
                        <TouchableOpacity
                            key={opt.value}
                            style={[styles.genderCard, isSelected && styles.genderCardSelected]}
                            onPress={() => setLookingFor(opt.value)}
                            activeOpacity={0.7}
                        >
                            {isSelected && (
                                <LinearGradient
                                    colors={[Colors.primaryGradientStart + '25', Colors.primaryGradientEnd + '10']}
                                    style={StyleSheet.absoluteFill}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                />
                            )}
                            <Text style={[styles.genderLabel, isSelected && styles.genderLabelSelected]}>
                                {opt.value}
                            </Text>
                            {isSelected && (
                                <View style={styles.genderCheck}>
                                    <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );

    const stepRenderers = [
        renderNameStep,
        renderDobStep,
        renderGenderStep,
        renderLookingForStep,
        renderLocationStep,
        renderPhotosStep,
        renderBioStep,
        renderInterestsStep,
        renderMbtiStep,
        renderEnneagramStep,
        renderEmailStep,
        renderPhoneStep,
        renderPasswordStep,
    ];

    const getButtonLabel = () => {
        if (step === TOTAL_STEPS - 1) return "Create Account & Start";
        if (!canProceed()) {
            switch (step) {
                case 0: return 'Enter your name';
                case 2: return 'Select your gender';
                case 3: return 'Select what you are looking for';
                case 4: return 'Fetch location';
                case 5: return 'Add at least 1 photo';
                case 6: return 'Write a bit more...';
                case 7: return 'Pick at least 1 interest';
                case 8: return 'Select an MBTI';
                case 9: return 'Select an Enneagram';
                case 10: return 'Enter a valid email';
                case 11: return 'Enter a valid phone';
                case 12: return 'Check your passwords';
                default: return 'Continue';
            }
        }
        return 'Continue';
    };

    return (
        <LinearGradient
            colors={[Colors.background, '#1a0a2e', '#0d0b1a', Colors.background]}
            locations={[0, 0.3, 0.7, 1]}
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Progress Bar */}
                    <View style={styles.progressContainer}>
                        <View style={styles.progressTrack}>
                            <Animated.View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: progressAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0%', '100%'],
                                        }),
                                    },
                                ]}
                            >
                                <LinearGradient
                                    colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={StyleSheet.absoluteFill}
                                />
                            </Animated.View>
                        </View>
                        <Text style={styles.progressLabel}>
                            Step {step + 1} of {TOTAL_STEPS}
                        </Text>
                    </View>

                    {/* Center Wrapper for content and header */}
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        {/* Step Header */}
                        <Animated.View
                            style={[
                                styles.stepHeader,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateX: slideAnim }],
                                },
                            ]}
                        >
                            <Text style={styles.stepTitle}>{STEP_TITLES[step]}</Text>
                            <Text style={styles.stepSubtitle}>{STEP_SUBTITLES[step]}</Text>
                        </Animated.View>

                        {/* Step Content */}
                        <Animated.View
                            style={{
                                opacity: fadeAnim,
                                transform: [{ translateX: slideAnim }],
                            }}
                        >
                            {stepRenderers[step]()}
                        </Animated.View>
                    </View>

                    {/* Navigation Buttons */}
                    <View style={styles.navRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <Text style={styles.backButtonText}>← Back</Text>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <Button
                                title={getButtonLabel()}
                                onPress={goNext}
                                variant="primary"
                                size="large"
                                fullWidth
                                disabled={!canProceed() || isSubmitting}
                                loading={isSubmitting}
                            />
                        </View>
                    </View>

                    {/* Skip Button for optional steps */}
                    {(step === 8 || step === 9) && (
                        <TouchableOpacity style={styles.skipBtn} onPress={skipStep}>
                            <Text style={styles.skipBtnText}>Skip for now →</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>

                {/* Country Picker Modal */}
                <Modal visible={showCountryPicker} animationType="slide" transparent>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Select Country</Text>
                                <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                                    <Ionicons name="close" size={24} color={Colors.white} />
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={COUNTRY_CODES}
                                keyExtractor={(item) => item.code}
                                renderItem={({ item }) => (
                                    <TouchableOpacity 
                                        style={styles.countryListItem}
                                        onPress={() => {
                                            setCountryCode(item);
                                            setShowCountryPicker(false);
                                        }}
                                    >
                                        <Text style={styles.countryListFlag}>{item.flag}</Text>
                                        <Text style={styles.countryListName}>{item.name}</Text>
                                        <Text style={styles.countryListDialCode}>{item.dialCode}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </Modal>
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
        paddingTop: Spacing.xxl + Spacing.md,
        paddingBottom: Spacing.xxl,
    },
    progressContainer: {
        marginBottom: Spacing.md,
    },
    progressTrack: {
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.08)',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressLabel: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: FontSizes.xs,
        fontFamily: FontFamily.small,
        textAlign: 'right',
        marginTop: Spacing.xs,
    },
    stepHeader: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    stepTitle: {
        fontSize: FontSizes.xxl,
        fontFamily: FontFamily.heading,
        fontWeight: FontWeights.bold,
        color: Colors.textPrimary,
        textAlign: 'center',
        marginBottom: Spacing.xs,
    },
    stepSubtitle: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        textAlign: 'center',
    },
    stepContent: {
        marginBottom: Spacing.xl,
    },
    
    // DOB Step
    dobContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: BorderRadius.xl,
        padding: Spacing.md,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    dobColumn: {
        flex: 1,
        alignItems: 'center',
    },
    dobColumnLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontFamily: FontFamily.small,
        fontSize: FontSizes.sm,
        marginBottom: Spacing.xs,
    },
    dobHint: {
        color: 'rgba(255,255,255,0.5)',
        fontFamily: FontFamily.small,
        fontSize: FontSizes.sm,
        marginTop: Spacing.md,
        textAlign: 'center',
    },
    errorText: {
        color: Colors.error,
        fontFamily: FontFamily.small,
        fontSize: FontSizes.sm,
        marginTop: Spacing.sm,
        textAlign: 'center',
        fontWeight: FontWeights.semiBold,
    },
    
    passwordHint: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: FontSizes.xs,
        fontFamily: FontFamily.small,
        marginTop: Spacing.sm,
        textAlign: 'center',
    },

    // Gender
    genderGrid: {
        gap: Spacing.md,
    },
    genderCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
        borderRadius: BorderRadius.xl,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.08)',
        overflow: 'hidden',
    },
    genderCardSelected: {
        borderColor: Colors.primary,
        ...Shadows.glow(Colors.primary),
    },
    genderLabel: {
        flex: 1,
        fontSize: FontSizes.lg,
        fontFamily: FontFamily.heading,
        fontWeight: FontWeights.semiBold,
        color: 'rgba(255,255,255,0.6)',
    },
    genderLabelSelected: {
        color: Colors.textPrimary,
    },
    genderCheck: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    genderCheckText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: FontWeights.bold,
    },

    // Bio
    bioContainer: {
        borderRadius: BorderRadius.xl,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.08)',
        overflow: 'hidden',
    },
    bioInput: {
        color: Colors.textPrimary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        padding: Spacing.lg,
        minHeight: 140,
        textAlignVertical: 'top',
    },
    bioFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.md,
    },
    bioCharCount: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: FontSizes.sm,
        fontFamily: FontFamily.small,
    },
    bioCharCountValid: {
        color: Colors.success,
    },
    bioHint: {
        color: Colors.warning,
        fontSize: FontSizes.xs,
        fontFamily: FontFamily.small,
    },
    bioTips: {
        marginTop: Spacing.lg,
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    bioTipsTitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: FontSizes.md,
        fontFamily: FontFamily.heading,
        fontWeight: FontWeights.semiBold,
        marginBottom: Spacing.sm,
    },
    bioTipItem: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: FontSizes.sm,
        fontFamily: FontFamily.small,
        marginBottom: 4,
    },

    // Location
    locationInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: BorderRadius.xl,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.08)',
        paddingHorizontal: Spacing.lg,
    },
    locationInput: {
        flex: 1,
        color: Colors.textPrimary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        paddingVertical: Spacing.lg,
    },
    locationHint: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: FontSizes.xs,
        fontFamily: FontFamily.small,
        marginTop: Spacing.md,
        textAlign: 'center',
    },
    locationDetectedBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.md,
        backgroundColor: 'rgba(100,200,100,0.1)',
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: 'rgba(100,200,100,0.3)',
        marginBottom: Spacing.md,
        gap: Spacing.sm,
    },
    locationDetectedText: {
        color: Colors.white,
        fontSize: FontSizes.md,
        fontFamily: FontFamily.body,
        fontWeight: FontWeights.semiBold,
    },
    autoLocationBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacing.md,
        gap: Spacing.xs,
        padding: Spacing.sm,
        backgroundColor: 'rgba(235,50,35,0.1)',
        borderRadius: BorderRadius.md,
        alignSelf: 'center',
    },
    autoLocationText: {
        color: Colors.primary,
        fontSize: FontSizes.sm,
        fontFamily: FontFamily.small,
        fontWeight: FontWeights.semiBold,
    },
    
    // Photos
    photoAddRow: {
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    photoGalleryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.full,
        gap: Spacing.sm,
    },
    photoGalleryBtnText: {
        color: Colors.white,
        fontFamily: FontFamily.heading,
        fontWeight: FontWeights.bold,
        fontSize: FontSizes.md,
    },
    photoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    photoSlot: {
        width: '30%',
        aspectRatio: 0.8,
        borderRadius: BorderRadius.lg,
        backgroundColor: 'rgba(235,50,35,0.08)',
        borderWidth: 1.5,
        borderColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    photoSlotEmpty: {
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderColor: 'rgba(255,255,255,0.08)',
        borderStyle: 'dashed',
    },
    photoSlotPlus: {
        fontSize: 28,
        color: 'rgba(255,255,255,0.2)',
        fontFamily: FontFamily.heading,
    },
    photoThumb: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(235,50,35,0.1)',
    },
    mainBadge: {
        position: 'absolute',
        bottom: 6,
        left: 6,
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.xs,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    mainBadgeText: {
        color: Colors.white,
        fontSize: 9,
        fontFamily: FontFamily.heading,
        fontWeight: FontWeights.bold,
    },
    photoRemoveBtn: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: 'rgba(0,0,0,0.7)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    photoRemoveText: {
        color: Colors.white,
        fontSize: 11,
        fontWeight: FontWeights.bold,
    },
    photoHint: {
        color: 'rgba(255,255,255,0.35)',
        fontSize: FontSizes.sm,
        fontFamily: FontFamily.small,
        marginTop: Spacing.md,
        textAlign: 'center',
    },

    // Interests
    interestCountBadge: {
        alignSelf: 'center',
        backgroundColor: 'rgba(235,50,35,0.12)',
        borderRadius: BorderRadius.full,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: 'rgba(235,50,35,0.25)',
    },
    interestCountText: {
        color: Colors.primary,
        fontSize: FontSizes.sm,
        fontFamily: FontFamily.small,
        fontWeight: FontWeights.semiBold,
    },
    interestsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
        justifyContent: 'center',
    },

    // Nav
    navRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        marginTop: Spacing.lg,
    },
    backButton: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md,
    },
    backButtonText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        fontWeight: FontWeights.medium,
    },
    skipBtn: {
        alignSelf: 'center',
        paddingVertical: Spacing.md,
        marginTop: Spacing.sm,
    },
    skipBtnText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: FontSizes.md,
        fontFamily: FontFamily.small,
    },

    // Phone
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    countryPickerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: BorderRadius.lg,
        paddingHorizontal: Spacing.md,
        height: 56,
        gap: Spacing.xs,
    },
    countryFlag: {
        fontSize: FontSizes.xl,
    },
    countryDialCode: {
        color: Colors.textPrimary,
        fontSize: FontSizes.md,
        fontFamily: FontFamily.body,
        fontWeight: FontWeights.semiBold,
        marginLeft: Spacing.xs,
    },
    phoneInput: {
        flex: 1,
        height: 56,
        color: Colors.textPrimary,
        fontSize: FontSizes.lg,
        fontFamily: FontFamily.body,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: BorderRadius.lg,
        paddingHorizontal: Spacing.md,
    },
    
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1a0a2e',
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        height: '70%',
        padding: Spacing.lg,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        paddingBottom: Spacing.md,
    },
    modalTitle: {
        color: Colors.white,
        fontSize: FontSizes.xl,
        fontFamily: FontFamily.heading,
        fontWeight: FontWeights.bold,
    },
    countryListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    countryListFlag: {
        fontSize: 24,
        marginRight: Spacing.md,
    },
    countryListName: {
        flex: 1,
        color: Colors.white,
        fontSize: FontSizes.md,
        fontFamily: FontFamily.body,
    },
    countryListDialCode: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: FontSizes.md,
        fontFamily: FontFamily.body,
    },
});
