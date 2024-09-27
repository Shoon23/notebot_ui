import authAxiosInstance from "../lib/authAxiosInstance";
import { iRegister, iLogin } from "../types/auth";
async function login(user_credentials: iLogin) {
  const response = await authAxiosInstance.post(
    "/auth/login",
    user_credentials
  );
  return response.data;
}

async function register(user_credentials: iRegister) {
  const response = await authAxiosInstance.post(
    "/auth/register",
    user_credentials
  );
  return response.data;
}

export default {
  login,
  register,
};
