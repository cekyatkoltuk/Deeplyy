export const APP_NAME = 'Deeplyy';
export const APP_VERSION = '1.0.0';

export const SWIPE_THRESHOLD = 120;
export const SWIPE_VELOCITY_THRESHOLD = 800;
export const CARD_ROTATION_ANGLE = 15;

export const MAX_PHOTOS = 6;
export const MIN_AGE = 18;
export const MAX_AGE = 65;
export const MIN_DISTANCE = 1;
export const MAX_DISTANCE = 160;
export const DEFAULT_AGE_RANGE: [number, number] = [18, 35];
export const DEFAULT_DISTANCE = 50;

export const INTERESTS = [
    'Music',
    'Movies',
    'Reading',
    'Travel',
    'Cooking',
    'Fitness',
    'Gaming',
    'Photography',
    'Art',
    'Dogs',
    'Cats',
    'Beach',
    'Hiking',
    'Gym',
    'Yoga',
    'Dancing',
    'Wine',
    'Coffee',
    'Sports',
    'Podcasts',
    'Vegan',
    'Festivals',
    'Surfing',
    'Guitar',
];

export const PREMIUM_FEATURES = [
    { icon: '', title: 'Advanced Filters', description: 'Filter by age, distance, interests & more' },
    { icon: '', title: 'Rewind Swipes', description: 'Undo your last swipe and try again' },
    { icon: '', title: 'Reset Dislikes', description: 'Give everyone a second chance' },
    { icon: '', title: 'Priority Profile', description: 'Get seen by more people' },
    { icon: '', title: 'Premium Badge', description: 'Stand out with a special badge' },
];

export const GENDER_OPTIONS = [
    { value: 'male' as const, label: 'Male' },
    { value: 'female' as const, label: 'Female' },
    { value: 'other' as const, label: 'Other' },
];

export const MBTI_OPTIONS = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

export const ENNEAGRAM_OPTIONS = [
    '1w2', '1w9', '2w1', '2w3', '3w2', '3w4',
    '4w3', '4w5', '5w4', '5w6', '6w5', '6w7',
    '7w6', '7w8', '8w7', '8w9', '9w8', '9w1',
    'Type 1', 'Type 2', 'Type 3', 'Type 4',
    'Type 5', 'Type 6', 'Type 7', 'Type 8', 'Type 9'
];

export const LOOKING_FOR_OPTIONS = [
    { value: 'Friendship', icon: 'people-outline' },
    { value: 'Romance / Dating', icon: 'heart-outline' },
    { value: 'Marriage', icon: 'rose-outline' },
    { value: 'Casual / Fun', icon: 'beer-outline' }
];
