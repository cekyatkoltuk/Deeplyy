export const socketService = {
    connect: async () => {
        console.log('[Socket] Mock connect');
    },
    disconnect: () => {
        console.log('[Socket] Mock disconnect');
    },
    getSocket: () => ({
        on: () => {},
        emit: () => {},
        off: () => {}
    }),
};
