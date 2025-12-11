import axios from "axios";
import { AuthModel, UserModel } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;


// ✅ CORRECT: Laravel user info route
export const GET_USER_URL = `${API_URL}/api/me`;

export const LOGIN_URL = `${API_URL}/api/login`;
export const REGISTER_URL = `${API_URL}/api/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}/api/forgot_password`;

// --- LOGIN ---
export function login(email: string, password: string) {
  return axios.post<AuthModel>(LOGIN_URL, {
    email,
    password,
  });
}

// --- REGISTER ---
export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    email,
    first_name: firstname,
    last_name: lastname,
    password,
    password_confirmation,
  });
}

// --- RESET PASSWORD ---
export function requestPassword(email: string) {
  return axios.post<{ result: boolean }>(REQUEST_PASSWORD_URL, {
    email,
  });
}

// --- GET USER USING TOKEN ---
export function getUserByToken(token: string) {
  return axios.get<UserModel>(GET_USER_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
