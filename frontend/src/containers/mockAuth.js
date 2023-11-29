export const mockAuthenticate = () => {
    return {
        isAuthenticated: true,
        user: {
            id: '1',
            name: 'mockUser',
            role: 'tier3',
            email: 'mockEmail@gmail.com'
        },
    };
};
