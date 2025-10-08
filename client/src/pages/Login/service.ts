// src/service/index.ts or src/service.ts
import axios from "axios";
import { getApiEndpoint } from "../../config/api.config";

export const register = async (body: object) => {
    const response = await axios.post(
        getApiEndpoint("register"),
        body
    );
    return response.data;
};

export const login = async (body: object) => {
    const response = await axios.post(
        getApiEndpoint("login"),
        body
    );
    return response.data;
};

export const pingServer = async () => {
    try {
        const response = await axios.get(
            getApiEndpoint("pingServer")
        );
        return response.data;
    } catch (error) {
        console.error("Error pinging server:", error);
        return null;
    }
};