export const mockAuthenticate = () => {
    return {
        isAuthenticated: false,
        user: {
            id: '1',
            name: 'mockUser',
            role: 'tier1',
            email: 'mockEmail@gmail.com'
        },
    };
};
