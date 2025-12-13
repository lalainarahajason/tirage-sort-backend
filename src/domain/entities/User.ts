export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

export interface User {
    id: string;
    email: string;
    password?: string; // Optional because we might pass User properties without pwd around
    name: string;
    role: UserRole;
    createdAt: Date;
}
