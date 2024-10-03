import React, { useEffect, useLayoutEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import useUserSession from "../hooks/useUserSession";
import { useIonRouter, useIonViewWillEnter } from "@ionic/react";
import { isTokenExpired } from "../utils/jwt-utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import authService from "../services/authService";
import { queryClient } from "@/App";

interface AuthMiddlewareProps {
  children: React.ReactNode;
}

const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
  const user = useUserSession();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const { isError, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const refreshedUser = await authService.refreshToken();
      return refreshedUser;
    },
    enabled: !user || isTokenExpired(user?.access_token),
  });

  if (isLoading) {
    return <div className="">Loading....</div>;
  }

  // useLayoutEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       console.log(user);
  //       if () {

  //         queryClient.setQueryData(["user"], refreshedUser);
  //       }
  //       setIsAuthenticated(true);
  //     } catch (error) {
  //       console.log(error);
  //       setIsAuthenticated(false);
  //     }
  //   };
  //   checkAuth();
  // }, []);

  // console.log("OutSide: ", isAuthenticated);

  return !isError ? <>{children}</> : <Redirect to="/login" />;
};

export default AuthMiddleware;
