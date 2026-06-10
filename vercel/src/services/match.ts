import { delay, mockMatches, Match } from '../utils/mockData';

export const matchService = {
    getMatches: async (): Promise<Match[]> => {
        await delay(500);
        return mockMatches;
    },

    removeMatch: async (matchId: string): Promise<void> => {
        await delay(300);
    },
};
