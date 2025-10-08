import { request } from "../../utils/api";

// CREATE
export const createTicket = async (body: object) => {
    return request("createTicket", { method: "POST", body });
};

// READ
export const getAllTickets = async () => {
    return request("getAllTickets");
};

export const getTicketById = async (id: string) => {
    return request(`getTicket/${id}`);
};

// UPDATE
export const updateTicket = async (body: {
    id: string;
    title?: string;
    description?: string;
    priority?: string;
    type?: string;
    estimatedTime?: number;
    project?: string;
}) => {
    return request("updateTicket", { method: "POST", body });
};

export const updateStatus = async (body: { id: string; status: string }) => {
    return request("updateStatus", { method: "POST", body });
};

export const addDevs = async (body: { id: string; newDev: string }) => {
    return request("addDevs", { method: "POST", body });
};

export const removeDev = async (body: { id: string; devEmail: string }) => {
    return request("removeDev", { method: "POST", body });
};

export const addComment = async (body: { id: string; comment: string }) => {
    return request("addComment", { method: "POST", body });
};

export const deleteComment = async (body: { id: string; commentIndex: number }) => {
    return request("deleteComment", { method: "POST", body });
};

// DELETE
export const deleteTicket = async (body: { id: string }) => {
    return request("deleteTicket", { method: "POST", body });
};

// frontend/service.ts

export const getProjectById = async (id: string) => {
    return request(`getProject/${id}`);
};
