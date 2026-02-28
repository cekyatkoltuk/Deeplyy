import { usePremiumStore } from '../store/premiumStore';
import { Alert } from 'react-native';

export const usePremiumGuard = () => {
    const isPremium = usePremiumStore((state) => state.isPremium);

    const guardFeature = (featureName: string, callback: () => void): void => {
        if (isPremium) {
            callback();
        }
        // Modal will be shown by the component using PremiumModal
    };

    const requiresPremium = !isPremium;

    return { isPremium, guardFeature, requiresPremium };
};
