// src/config/api.config.ts

const getApiUrl = (): string => {
    // Check if we're in production
    if (process.env.NODE_ENV === 'production') {
      // Use production API URL from environment variable
      return process.env.REACT_APP_API_URL || 'https://bug-tracker-server-d0pg.onrender.com/';
    }
    
    // Use local API URL for development
    return process.env.REACT_APP_LOCAL_API_URL || 'http://localhost:3001/';
  };
  
  export const API_BASE_URL = getApiUrl();
  
  // Ensure URL ends with a slash
  export const getApiEndpoint = (endpoint: string): string => {
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${baseUrl}${cleanEndpoint}`;
  };
  
  export default API_BASE_URL;