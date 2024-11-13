import React, { useState } from "react";
import Input from "../components/Input";
import logo from "../assets/logo_transparent.png";
import { iLogin, iRegister } from "../types/auth";
import { useIonRouter } from "@ionic/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import authService from "../services/authService";
import { AxiosError } from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";

const Login: React.FC = () => {
  const [formData, setFormData] = useState<iLogin>({
    email: "",
    password: "",
  });
  const router = useIonRouter();

  const [errorMessages, setErrorMessages] = useState<string[]>([]); // State to hold validation errors
  const [isError, setIsError] = useState(false);
  const queryClient = useQueryClient();

  const { isPending, mutate, isSuccess } = useMutation({
    mutationFn: async () => {
      return await authService.login(formData);
    },
    onSuccess(data, variables, context) {
      queryClient.setQueryData(["user"], data);
      router.push("/");

      return data;
    },
    onError(error, variables, context) {
      const axiosError = error as AxiosError;
      console.log(axiosError);

      const errorResponse =
        (axiosError?.response?.data as any)?.message ?? axiosError.message;

      setErrorMessages([errorResponse]);
      setIsError(true);
    },
  });
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessages([]);
    setIsError(false);

    const { email, password } = formData;

    const newErrors: string[] = [];

    // Basic validation checks
    if (!email) {
      newErrors.push("Email is required.");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.push("Email is invalid.");
    }

    if (!password) {
      newErrors.push("Password is required.");
    }

    if (newErrors.length > 0) {
      setErrorMessages(newErrors);
      setIsError(true);
      return;
    }

    mutate();
  };
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="flex items-center justify-center h-screen">
      <Card className="w-[350px] ">
        <CardHeader>
          <CardTitle className="text-center ">Login</CardTitle>
        </CardHeader>
        {isError && (
          <CardDescription className="mx-3 rounded-md bg-red-500 text-center mb-2">
            <div className="p-3 flex text-white flex-wrap">
              {errorMessages.map((error, idx) => (
                <p key={idx} className=" text-base font-bold mr-3">
                  {" " + error}
                </p>
              ))}
            </div>
          </CardDescription>
        )}
        <CardContent className="w-full">
          <form onSubmit={handleLogin} className="flex flex-col w-full">
            <Input
              className="mb-2 "
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleOnChange}
              value={formData.email}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70 fill-base-100"
                >
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
              }
            />
            <Input
              className="mb-2"
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleOnChange}
              value={formData.password}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4  opacity-70 fill-base-100"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />

            <Button disabled={isPending} type="submit" className="w-full ">
              Login
            </Button>
            <Button
              variant={"link"}
              className="w-full "
              onClick={() => {
                router.push("/register");
              }}
            >
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default Login;
