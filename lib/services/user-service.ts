import { PersonalDetails, PasswordUpdatePayload } from "@/types/user.types";

// Hardcoded explicit base URL to completely bypass any Next.js .env caching
const API_URL = "http://localhost:5000/api/v1/users";

const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // 1. Try to use the token passed directly from NextAuth
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } 
  // 2. Fallback: Local storage
  else if (typeof window !== 'undefined') {
    const localToken = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (localToken) {
      headers['Authorization'] = `Bearer ${localToken}`;
    }
  }

  return headers;
};

export const fetchPersonalDetails = async (token?: string): Promise<PersonalDetails> => {
  const response = await fetch(`${API_URL}/me`, {
    headers: getHeaders(token),
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch profile. Status: ${response.status}`);
  }
  return response.json();
};

export const updatePersonalDetails = async (data: Partial<PersonalDetails>, token?: string): Promise<PersonalDetails> => {
  const response = await fetch(`${API_URL}/me`, {
    method: 'PUT',
    headers: getHeaders(token),
    credentials: 'include',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update profile");
  }
  return response.json();
};

export const updatePassword = async (data: PasswordUpdatePayload, token?: string): Promise<{message: string}> => {
  const response = await fetch(`${API_URL}/me/password`, {
    method: 'PUT',
    headers: getHeaders(token),
    credentials: 'include',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update password");
  }
  return response.json();
};