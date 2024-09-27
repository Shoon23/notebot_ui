import authAxiosInstance from "../lib/authAxiosInstance";
import { iRegister, iLogin } from "../types/auth";
async function login(user_credentials: iLogin) {
  const response = await authAxiosInstance.get("/auth/login");
  return response.data;
}

async function register(user_credentials: iRegister) {
  const response = await authAxiosInstance.get("/auth/register");
  return response.data;
}

export default {
  login,
  register,
};
