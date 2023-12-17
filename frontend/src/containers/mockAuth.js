export const mockAuthenticate = () => {
    return {
        isAuthenticated: true,
        user: {
            id: '1',
            name: 'mockUser',
            role: 'tier2',
            email: 'mockEmail@gmail.com'
        },
    };
};
