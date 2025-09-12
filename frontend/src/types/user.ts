export interface User {
    id: string;
    username: string | null;
    name: string | null;
    email: string;
    provider: AuthProvider;
    rating: number;
    createdAt: Date;
    lastLogin: Date | null;
}

enum AuthProvider{
    GOOGLE,
    EMAIL,
    GUEST
}