export interface UserProfile {
    id: string;
    name: string;
    age: number;
    bio: string;
    photos: string[];
    interests: string[];
    distance: number;
    location: string;
    isOnline: boolean;
    isPremium: boolean;
    gender: 'male' | 'female' | 'other';
}

export interface Match {
    id: string;
    user: UserProfile;
    matchedAt: string;
    lastMessage?: string;
    unreadCount: number;
    isNew: boolean;
}

export interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
    read: boolean;
    type: 'text' | 'image' | 'gif';
    imageUrl?: string;
}

export interface Conversation {
    id: string;
    user: UserProfile;
    lastMessage: Message;
    unreadCount: number;
    isTyping: boolean;
}

const AVATAR_COLORS = ['#FF6B6B', '#A855F7', '#38BDF8', '#4ADE80', '#FBBF24', '#F472B6', '#818CF8', '#34D399'];

const generateAvatar = (name: string, idx: number): string => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${AVATAR_COLORS[idx % AVATAR_COLORS.length].replace('#', '')}&color=fff&size=400&bold=true&format=png`;
};

export const mockProfiles: UserProfile[] = [
    {
        id: '1',
        name: 'Sophia',
        age: 25,
        bio: 'Adventure seeker  Coffee addict  Love dogs ',
        photos: [generateAvatar('Sophia', 0)],
        interests: [' Travel', ' Coffee', ' Dogs', ' Photography'],
        distance: 3,
        location: 'Istanbul',
        isOnline: true,
        isPremium: false,
        gender: 'female',
    },
    {
        id: '2',
        name: 'Emma',
        age: 23,
        bio: 'Yoga lover  Beach vibes  Artist at heart ',
        photos: [generateAvatar('Emma', 1)],
        interests: [' Yoga', ' Beach', ' Art', ' Wine'],
        distance: 5,
        location: 'Ankara',
        isOnline: true,
        isPremium: true,
        gender: 'female',
    },
    {
        id: '3',
        name: 'Olivia',
        age: 27,
        bio: 'Music is my therapy  Gym rat  Foodie ',
        photos: [generateAvatar('Olivia', 2)],
        interests: [' Music', ' Fitness', ' Cooking', ' Podcasts'],
        distance: 8,
        location: 'Izmir',
        isOnline: false,
        isPremium: false,
        gender: 'female',
    },
    {
        id: '4',
        name: 'Ava',
        age: 24,
        bio: 'Cat mom  Bookworm  Netflix addict ',
        photos: [generateAvatar('Ava', 3)],
        interests: [' Cats', ' Reading', ' Movies', ' Coffee'],
        distance: 12,
        location: 'Bursa',
        isOnline: true,
        isPremium: false,
        gender: 'female',
    },
    {
        id: '5',
        name: 'Isabella',
        age: 26,
        bio: 'Dancing through life  Wine lover  Travel bug ',
        photos: [generateAvatar('Isabella', 4)],
        interests: [' Dancing', ' Wine', ' Travel', ' Festivals'],
        distance: 2,
        location: 'Antalya',
        isOnline: false,
        isPremium: true,
        gender: 'female',
    },
    {
        id: '6',
        name: 'Mia',
        age: 22,
        bio: 'Surfer girl  Festival lover  Free spirit ',
        photos: [generateAvatar('Mia', 5)],
        interests: [' Surfing', ' Festivals', ' Vegan', ' Music'],
        distance: 15,
        location: 'Bodrum',
        isOnline: true,
        isPremium: false,
        gender: 'female',
    },
    {
        id: '7',
        name: 'Charlotte',
        age: 28,
        bio: 'Hiking enthusiast  Dog person  Gamer ',
        photos: [generateAvatar('Charlotte', 6)],
        interests: [' Hiking', ' Dogs', ' Gaming', ' Sports'],
        distance: 7,
        location: 'Istanbul',
        isOnline: true,
        isPremium: false,
        gender: 'female',
    },
    {
        id: '8',
        name: 'Luna',
        age: 21,
        bio: 'Guitar player  Photo lover  Coffee snob ',
        photos: [generateAvatar('Luna', 7)],
        interests: [' Guitar', ' Photography', ' Coffee', ' Art'],
        distance: 4,
        location: 'Istanbul',
        isOnline: false,
        isPremium: false,
        gender: 'female',
    },
];

export const mockMatches: Match[] = [
    {
        id: 'm1',
        user: mockProfiles[0],
        matchedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        lastMessage: 'Hey! How are you? ',
        unreadCount: 2,
        isNew: true,
    },
    {
        id: 'm2',
        user: mockProfiles[1],
        matchedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        lastMessage: 'I love that place too!',
        unreadCount: 0,
        isNew: true,
    },
    {
        id: 'm3',
        user: mockProfiles[4],
        matchedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        lastMessage: 'See you tomorrow! ',
        unreadCount: 1,
        isNew: false,
    },
    {
        id: 'm4',
        user: mockProfiles[6],
        matchedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        unreadCount: 0,
        isNew: false,
    },
    {
        id: 'm5',
        user: mockProfiles[7],
        matchedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        lastMessage: 'That guitar riff was amazing!',
        unreadCount: 0,
        isNew: false,
    },
];

export const mockConversations: Conversation[] = [
    {
        id: 'c1',
        user: mockProfiles[0],
        lastMessage: {
            id: 'msg1',
            senderId: '1',
            text: 'Hey! How are you? ',
            timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            read: false,
            type: 'text',
        },
        unreadCount: 2,
        isTyping: false,
    },
    {
        id: 'c2',
        user: mockProfiles[1],
        lastMessage: {
            id: 'msg2',
            senderId: 'me',
            text: 'I love that place too!',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            read: true,
            type: 'text',
        },
        unreadCount: 0,
        isTyping: true,
    },
    {
        id: 'c3',
        user: mockProfiles[4],
        lastMessage: {
            id: 'msg3',
            senderId: '5',
            text: 'See you tomorrow! ',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            read: false,
            type: 'text',
        },
        unreadCount: 1,
        isTyping: false,
    },
    {
        id: 'c4',
        user: mockProfiles[7],
        lastMessage: {
            id: 'msg4',
            senderId: 'me',
            text: 'That guitar riff was amazing!',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
            read: true,
            type: 'text',
        },
        unreadCount: 0,
        isTyping: false,
    },
];

export const mockMessages: Message[] = [
    { id: 'msg10', senderId: '1', text: 'Hi there! ', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: true, type: 'text' },
    { id: 'msg11', senderId: 'me', text: 'Hey! Nice to match with you! ', timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString(), read: true, type: 'text' },
    { id: 'msg12', senderId: '1', text: 'I saw you like traveling too! Where was your last trip?', timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), read: true, type: 'text' },
    { id: 'msg13', senderId: 'me', text: 'I went to Barcelona last summer. It was amazing! 🇪🇸', timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(), read: true, type: 'text' },
    { id: 'msg14', senderId: '1', text: 'Oh wow, I\'ve always wanted to go there! How was the food?', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), read: true, type: 'text' },
    { id: 'msg15', senderId: 'me', text: 'The tapas were incredible!  You should definitely go', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), read: true, type: 'text' },
    { id: 'msg16', senderId: '1', text: 'Maybe we could plan a trip together sometime? ', timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(), read: true, type: 'text' },
    { id: 'msg17', senderId: 'me', text: 'Haha let\'s start with coffee first! ', timestamp: new Date(Date.now() - 1000 * 60 * 6).toISOString(), read: true, type: 'text' },
    { id: 'msg18', senderId: '1', text: 'Deal! When are you free?', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), read: false, type: 'text' },
    { id: 'msg19', senderId: '1', text: 'Hey! How are you? ', timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(), read: false, type: 'text' },
];

export const mockLikesMe: UserProfile[] = [
    mockProfiles[2],
    mockProfiles[3],
    mockProfiles[5],
    mockProfiles[6],
    mockProfiles[7],
];

export const mockCurrentUser: UserProfile = {
    id: 'me',
    name: 'Alex',
    age: 26,
    bio: 'Software developer by day, musician by night \nLove exploring new places and trying new food!',
    photos: [generateAvatar('Alex', 0)],
    interests: [' Music', ' Travel', ' Cooking', ' Gaming', ' Photography', ' Coffee'],
    distance: 0,
    location: 'Istanbul',
    isOnline: true,
    isPremium: false,
    gender: 'male',
};

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
