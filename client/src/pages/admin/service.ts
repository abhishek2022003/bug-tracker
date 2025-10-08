import { request } from "../../utils/api";

// READ
export const getUsers = async () => {
    return request("getUsers");
};

export const getUserById = async (id: string) => {
    return request(`getUser/${id}`);
};

// CREATE
export const createUser = async (body: {
    email: string;
    password: string;
    role: string;
}) => {
    return request("createUser", { method: "POST", body });
};

// UPDATE
export const updateUser = async (body: {
    id: string;
    email?: string;
    role?: string;
}) => {
    return request("updateUser", { method: "POST", body });
};

export const changeUserPassword = async (body: {
    id: string;
    newPassword: string;
}) => {
    return request("changeUserPassword", { method: "POST", body });
};

export const changeUserRole = async (body: {
    id: string;
    role: string;
}) => {
    return request("changeUserRole", { method: "POST", body });
};

// DELETE
export const deleteUser = async (body: { id: string }) => {
    return request("deleteUser", { method: "POST", body });
};

// BAN/UNBAN
export const banUser = async (body: { ip: string }) => {
    return request("banUser", { method: "POST", body });
};

export const unbanUser = async (body: { ip: string }) => {
    return request("unbanUser", { method: "POST", body });
};

export const getBannedIPs = async () => {
    return request("getBannedIPs");
};