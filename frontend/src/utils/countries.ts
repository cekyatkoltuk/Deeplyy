export const COUNTRY_CODES = [
    { name: 'United States', dialCode: '+1', code: 'US', flag: '🇺🇸' },
    { name: 'Canada', dialCode: '+1', code: 'CA', flag: '🇨🇦' },
    { name: 'Mexico', dialCode: '+52', code: 'MX', flag: '🇲🇽' },
    { name: 'Turkey', dialCode: '+90', code: 'TR', flag: '🇹🇷' },
    { name: 'Russia', dialCode: '+7', code: 'RU', flag: '🇷🇺' },
    { name: 'United Kingdom', dialCode: '+44', code: 'GB', flag: '🇬🇧' },
    { name: 'Germany', dialCode: '+49', code: 'DE', flag: '🇩🇪' },
    { name: 'France', dialCode: '+33', code: 'FR', flag: '🇫🇷' },
    { name: 'Italy', dialCode: '+39', code: 'IT', flag: '🇮🇹' },
    { name: 'Spain', dialCode: '+34', code: 'ES', flag: '🇪🇸' },
    { name: 'Netherlands', dialCode: '+31', code: 'NL', flag: '🇳🇱' },
    { name: 'Sweden', dialCode: '+46', code: 'SE', flag: '🇸🇪' },
    { name: 'Switzerland', dialCode: '+41', code: 'CH', flag: '🇨🇭' },
    { name: 'Poland', dialCode: '+48', code: 'PL', flag: '🇵🇱' },
    { name: 'Greece', dialCode: '+30', code: 'GR', flag: '🇬🇷' },
    { name: 'Belgium', dialCode: '+32', code: 'BE', flag: '🇧🇪' },
    { name: 'Portugal', dialCode: '+351', code: 'PT', flag: '🇵🇹' },
    { name: 'Austria', dialCode: '+43', code: 'AT', flag: '🇦🇹' },
    { name: 'United Arab Emirates', dialCode: '+971', code: 'AE', flag: '🇦🇪' },
    { name: 'Saudi Arabia', dialCode: '+966', code: 'SA', flag: '🇸🇦' },
    { name: 'Qatar', dialCode: '+974', code: 'QA', flag: '🇶🇦' },
    { name: 'Egypt', dialCode: '+20', code: 'EG', flag: '🇪🇬' },
    { name: 'Japan', dialCode: '+81', code: 'JP', flag: '🇯🇵' },
    { name: 'South Korea', dialCode: '+82', code: 'KR', flag: '🇰🇷' },
    { name: 'Philippines', dialCode: '+63', code: 'PH', flag: '🇵🇭' },
    { name: 'Indonesia', dialCode: '+62', code: 'ID', flag: '🇮🇩' },
    { name: 'Thailand', dialCode: '+66', code: 'TH', flag: '🇹🇭' },
    { name: 'China', dialCode: '+86', code: 'CN', flag: '🇨🇳' },
    { name: 'India', dialCode: '+91', code: 'IN', flag: '🇮🇳' },
    { name: 'Australia', dialCode: '+61', code: 'AU', flag: '🇦🇺' },
    { name: 'Brazil', dialCode: '+55', code: 'BR', flag: '🇧🇷' },
    { name: 'Argentina', dialCode: '+54', code: 'AR', flag: '🇦🇷' },
];

const CITY_TO_COUNTRY: Record<string, string> = {
    'istanbul': 'TR', 'ankara': 'TR', 'izmir': 'TR', 'bursa': 'TR',
    'antalya': 'TR', 'bodrum': 'TR', 'trabzon': 'TR', 'adana': 'TR',
    'new york': 'US', 'los angeles': 'US', 'chicago': 'US', 'miami': 'US',
    'san francisco': 'US', 'seattle': 'US', 'boston': 'US', 'houston': 'US',
    'london': 'GB', 'manchester': 'GB', 'birmingham': 'GB', 'edinburgh': 'GB',
    'paris': 'FR', 'lyon': 'FR', 'marseille': 'FR', 'nice': 'FR',
    'berlin': 'DE', 'munich': 'DE', 'hamburg': 'DE', 'frankfurt': 'DE',
    'rome': 'IT', 'milan': 'IT', 'naples': 'IT', 'florence': 'IT',
    'madrid': 'ES', 'barcelona': 'ES', 'seville': 'ES', 'valencia': 'ES',
    'amsterdam': 'NL', 'rotterdam': 'NL', 'the hague': 'NL',
    'moscow': 'RU', 'saint petersburg': 'RU',
    'tokyo': 'JP', 'osaka': 'JP', 'kyoto': 'JP',
    'seoul': 'KR', 'busan': 'KR',
    'dubai': 'AE', 'abu dhabi': 'AE',
    'sydney': 'AU', 'melbourne': 'AU', 'brisbane': 'AU',
    'toronto': 'CA', 'vancouver': 'CA', 'montreal': 'CA',
    'sao paulo': 'BR', 'rio de janeiro': 'BR',
    'buenos aires': 'AR',
    'bangkok': 'TH', 'phuket': 'TH',
    'cairo': 'EG', 'alexandria': 'EG',
    'stockholm': 'SE', 'gothenburg': 'SE',
    'zurich': 'CH', 'geneva': 'CH', 'bern': 'CH',
    'vienna': 'AT', 'salzburg': 'AT',
    'warsaw': 'PL', 'krakow': 'PL',
    'athens': 'GR', 'thessaloniki': 'GR',
    'brussels': 'BE', 'antwerp': 'BE',
    'lisbon': 'PT', 'porto': 'PT',
    'doha': 'QA', 'riyadh': 'SA', 'jeddah': 'SA',
    'manila': 'PH', 'jakarta': 'ID', 'bali': 'ID',
    'shanghai': 'CN', 'beijing': 'CN', 'mumbai': 'IN', 'delhi': 'IN',
    'mexico city': 'MX', 'cancun': 'MX',
};

export const getFlagForLocation = (location?: string | null): string => {
    if (!location) return '';
    
    const locationLower = location.toLowerCase().trim();

    // Check city mapping first
    for (const [city, code] of Object.entries(CITY_TO_COUNTRY)) {
        if (locationLower.includes(city)) {
            const country = COUNTRY_CODES.find(c => c.code === code);
            if (country) return country.flag;
        }
    }
    
    // Check country name
    for (const country of COUNTRY_CODES) {
        if (locationLower.includes(country.name.toLowerCase())) {
            return country.flag;
        }
    }
    
    return '';
};
