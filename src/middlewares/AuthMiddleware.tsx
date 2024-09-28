import React, { useEffect, useLayoutEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import useUserSession from "../hooks/useUserSession";
import { useIonRouter, useIonViewWillEnter } from "@ionic/react";
import { isTokenExpired } from "../utils/jwt-utils";
import { useQueryClient } from "@tanstack/react-query";
import authService from "../services/authService";

interface AuthMiddlewareProps {
  children: React.ReactNode;
}

const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
  const user = useUserSession();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useLayoutEffect(() => {
    const checkAuth = async () => {
      try {
        if (!user || isTokenExpired(user?.access_token)) {
          const refreshedUser = await authService.refreshToken();
          queryClient.setQueryData(["user"], refreshedUser);
        }
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // console.log("OutSide: ", isAuthenticated);

  return isAuthenticated ? <>{children}</> : <Redirect to="/login" />;
};

export default AuthMiddleware;
