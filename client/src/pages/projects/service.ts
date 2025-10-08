import { request } from "../../utils/api";

// CREATE
export const createProject = async (body: object) => {
    return request("createProject", { method: "POST", body });
};

// READ
export const getAllProjects = async () => {
    return request("getAllProjects");
};

export const getProjectById = async (id: string) => {
    return request(`getProject/${id}`);
};

export const getMyProjects = async () => {
    return request("getMyProjects");
};

export const searchProjects = async (query: string) => {
    return request(`searchProjects?query=${encodeURIComponent(query)}`);
};

export const getProjectStats = async (id: string) => {
    return request(`getProjectStats/${id}`);
};

// UPDATE
export const updateProject = async (body: { id: string; title?: string; description?: string }) => {
    return request("updateProject", { method: "POST", body });
};

export const addTeamMember = async (body: { id: string; memberEmail: string }) => {
    return request("addTeamMember", { method: "POST", body });
};

export const removeTeamMember = async (body: { id: string; memberEmail: string }) => {
    return request("removeTeamMember", { method: "POST", body });
};

// DELETE
export const deleteProject = async (body: { id: string }) => {
    return request("deleteProject", { method: "POST", body });
};