import { jwtDecode, JwtPayload } from "jwt-decode";

export const isTokenExpired = (token: string) => {
  const decodedToken = jwtDecode(token) as JwtPayload;
  const token_expiration = new Date(
    1000 * Number(decodedToken.exp)
  ).toLocaleString();
  const current_time = new Date().toLocaleString();

  return current_time > token_expiration;
};
