import AsyncStorage from '@react-native-async-storage/async-storage';

const MOCK_USER = {
    id: 'mock-user-1',
    email: 'demo@flamedate.com',
    name: 'Demo User',
    age: 24,
    bio: 'This is a mocked frontend version for demonstration!',
    gender: 'female',
    location: 'Istanbul, Turkey',
    photos: ['https://randomuser.me/api/portraits/women/44.jpg'],
    interests: ['Music', 'Travel', 'Coding'],
    isPremium: true,
    isOnline: true,
    distance: 5
};

const MOCK_PROFILES = [
    { ...MOCK_USER, id: '2', name: 'Alice', photos: ['https://randomuser.me/api/portraits/women/68.jpg'] },
    { ...MOCK_USER, id: '3', name: 'Bob', gender: 'male', photos: ['https://randomuser.me/api/portraits/men/32.jpg'] },
    { ...MOCK_USER, id: '4', name: 'Charlie', gender: 'male', photos: ['https://randomuser.me/api/portraits/men/46.jpg'] }
];

const MOCK_CONVERSATIONS = [
    { id: 'conv-1', matchId: 'match-1', participants: [MOCK_USER, MOCK_PROFILES[0]], lastMessage: { text: 'Hey there!', createdAt: new Date().toISOString() }, unreadCount: 1 }
];

const MOCK_MESSAGES = [
    { id: 'msg-1', senderId: '2', text: 'Hey there!', createdAt: new Date().toISOString() }
];

const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const createMockResponse = (data: any, status = 200) => ({
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: {}
});

const mockRequest = async (method: string, url: string, data?: any) => {
    await mockDelay(300); // Simulate network latency

    console.log(`[Mock API] ${method} ${url}`, data || '');

    if (url.includes('/auth/login') || url.includes('/auth/register')) {
        return createMockResponse({ token: 'mock-token', refreshToken: 'mock-refresh', user: MOCK_USER });
    }
    if (url.includes('/auth/check')) {
        return createMockResponse({ exists: false });
    }
    if (url.includes('/users/profile') && method === 'GET' && !url.includes('/users/profile/')) {
        return createMockResponse(MOCK_USER);
    }
    if (url.includes('/users/profile') && method === 'PUT') {
        return createMockResponse({ ...MOCK_USER, ...data });
    }
    if (url.includes('/users/profile/')) {
        return createMockResponse(MOCK_PROFILES.find(p => url.includes(p.id)) || MOCK_PROFILES[0]);
    }
    if (url.includes('/users/photos') && method === 'POST') {
        return createMockResponse({ photos: [...MOCK_USER.photos, data.photoUrl || 'https://randomuser.me/api/portraits/lego/1.jpg'] });
    }
    if (url.includes('/users/photos') && method === 'DELETE') {
        return createMockResponse({ photos: [] });
    }
    if (url.includes('/swipes/cards')) {
        return createMockResponse(MOCK_PROFILES);
    }
    if (url.includes('/subscriptions/status')) {
        return createMockResponse({ status: 'active', plan: 'premium', isPremium: true });
    }
    if (url.includes('/matches/likes')) {
        return createMockResponse(MOCK_PROFILES);
    }
    if (url.includes('/matches')) {
        return createMockResponse([]);
    }
    if (url.includes('/chat/conversations')) {
        return createMockResponse(MOCK_CONVERSATIONS);
    }
    if (url.includes('/chat/messages')) {
        if (method === 'POST') {
            return createMockResponse({ id: Math.random().toString(), senderId: 'mock-user-1', text: data?.text || '', createdAt: new Date().toISOString() });
        }
        return createMockResponse(MOCK_MESSAGES);
    }
    if (url.includes('/users/blocked')) {
        return createMockResponse([]);
    }
    
    // Default success for anything else
    return createMockResponse({ success: true });
};

const api = {
    get: (url: string) => mockRequest('GET', url),
    post: (url: string, data?: any) => mockRequest('POST', url, data),
    put: (url: string, data?: any) => mockRequest('PUT', url, data),
    delete: (url: string) => mockRequest('DELETE', url),
    interceptors: {
        request: { use: () => {} },
        response: { use: () => {} }
    }
};

export default api;
