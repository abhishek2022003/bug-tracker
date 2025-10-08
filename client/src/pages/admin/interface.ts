export interface UserModel {
    _id?: string;
    email?: string;
    role?: "admin" | "developer" | "project manager";
    dateRegistered?: string;
    ipAddress?: string;
}