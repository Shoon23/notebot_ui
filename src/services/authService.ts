import authAxiosInstance from "../lib/authAxiosInstance";
import { iRegister, iLogin } from "../types/auth";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { isTokenExpired } from "../utils/jwt-utils";

async function login(userCredentials: iLogin) {
  const response = await authAxiosInstance.post("/auth/login", userCredentials);
  return response.data;
}

async function register(userCredentials: iRegister) {
  const response = await authAxiosInstance.post(
    "/auth/register",
    userCredentials
  );
  return response.data;
}

async function refreshToken() {
  const response = await authAxiosInstance.get("/auth/refresh-token");

  return response.data;
}

export default {
  login,
  register,
  refreshToken,
};
