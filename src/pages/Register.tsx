import React, { useState } from "react";
import Input from "../components/Input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import authService from "../services/authService";
import { iLogin, iRegister } from "../types/auth";
import { Axios, AxiosError } from "axios";
import { useIonRouter } from "@ionic/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";

const Register: React.FC = () => {
  const [formData, setFormData] = useState<
    iRegister & { confirm_password: string }
  >({
    email: "",
    password: "",
    user_name: "",
    confirm_password: "",
  });
  const router = useIonRouter();
  const queryClient = useQueryClient();

  const [errorMessages, setErrorMessages] = useState<string[]>([]); // State to hold validation errors
  const [isError, setIsError] = useState(false);
  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      const { confirm_password, ...others } = formData;

      return await authService.register(others);
    },
    onSuccess(data, variables, context) {
      queryClient.setQueryData(["user"], data);

      router.push("/");
    },
    onError(error, variables, context) {
      const errorResponse = (error as AxiosError).response?.data as any;
      setErrorMessages([errorResponse.message as string]);
      setIsError(true);
    },
  });

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessages([]);
    setIsError(false);

    const { email, password, user_name, confirm_password } = formData;

    const newErrors: string[] = [];

    // Basic validation checks
    if (!email) {
      newErrors.push("Email is required.");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.push("Email is invalid.");
    }

    if (!user_name) {
      newErrors.push("Username is required.");
    }

    if (!password) {
      newErrors.push("Password is required.");
    } else if (password.length < 8) {
      newErrors.push("Password must be at least 8 characters long.");
    }

    if (!confirm_password) {
      newErrors.push("Confirm Password is required.");
    } else if (password !== confirm_password) {
      newErrors.push("Passwords do not match.");
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
      {/* <div className="flex flex-col bg-neutral  items-center card  shadow-xl p-10 md:p-20">
        <h1 className="text-2xl mb-5 text-white">Register</h1>
        {isError && (
          <div className="mb-5 border-2 border-error-content card bg-red-500 text-primary-content w-[100%]">
            <div className="p-3 flex  text-white flex-wrap">
              {errorMessages.map((error, idx) => (
                <h2 key={idx} className="card-title text-base font-bold mr-3">
                  {error}
                </h2>
              ))}
            </div>
          </div>
        )}
        <form onSubmit={handleRegister} className="flex flex-col  w-80">
          <Input
            className="mb-3"
            name="email"
            type="text"
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
            className="mb-3"
            name="user_name"
            type="text"
            placeholder="Username"
            onChange={handleOnChange}
            value={formData.user_name}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70 fill-base-100"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
            }
          />
          <Input
            className="mb-3"
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
                className="h-4 w-4 opacity-70 fill-base-100"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
          <Input
            className="mb-3"
            name="confirm_password"
            type="password"
            placeholder="Confirm Password"
            onChange={handleOnChange}
            value={formData.confirm_password}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70 fill-base-100"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
          <button
            disabled={isPending}
            type="submit"
            className="btn btn-primary w-full"
          >
            Login
          </button>
        </form>
      </div> */}
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-center">Register</CardTitle>
        </CardHeader>
        {isError && (
          <CardDescription className="mx-3 rounded-md bg-red-500 text-center mb-2">
            <div className="p-3 flex text-white flex-wrap">
              {errorMessages.map((error, idx) => (
                <h2 key={idx} className=" text-base font-bold mr-3">
                  {" " + error}
                </h2>
              ))}
            </div>
          </CardDescription>
        )}
        <CardContent>
          <form onSubmit={handleRegister} className="flex flex-col  w-full">
            <Input
              className="mb-3"
              name="email"
              type="text"
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
              className="mb-3"
              name="user_name"
              type="text"
              placeholder="Username"
              onChange={handleOnChange}
              value={formData.user_name}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70 fill-base-100"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
              }
            />
            <Input
              className="mb-3"
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
                  className="h-4 w-4 opacity-70 fill-base-100"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />
            <Input
              className="mb-3"
              name="confirm_password"
              type="password"
              placeholder="Confirm Password"
              onChange={handleOnChange}
              value={formData.confirm_password}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70 fill-base-100"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />

            <Button disabled={isPending} type="submit" className=" w-full">
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default Register;
