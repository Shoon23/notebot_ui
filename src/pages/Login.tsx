import React, { useState } from "react";
import Input from "../components/Input";
import logo from "../assets/logo_transparent.png";
import { iLogin, iRegister } from "../types/auth";
import { useIonRouter } from "@ionic/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import authService from "../services/authService";
import { AxiosError } from "axios";
const Login: React.FC = () => {
  const [formData, setFormData] = useState<iLogin>({
    email: "",
    password: "",
  });
  const router = useIonRouter();

  const [errorMessages, setErrorMessages] = useState<string[]>([]); // State to hold validation errors
  const [isError, setIsError] = useState(false);
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      return await authService.login(formData);
    },
    onSuccess(data, variables, context) {
      queryClient.setQueryData(["user"], data);

      router.push("/");
    },
    onError(error, variables, context) {
      const axiosError = error as AxiosError;

      const errorResponse =
        (axiosError?.response?.data as any) || axiosError.message;

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
    <section className="bg-neutral flex items-center justify-center h-screen">
      <div className="flex flex-col bg-neutral items-center card shadow-xl p-10 md:p-20">
        <h1 className="text-2xl mb-5 text-white">Login Notebot</h1>
        {isError && (
          <div className="mb-2 border-2 border-error-content card bg-red-500 text-primary-content w-[100%]">
            <div className="p-3 flex text-white flex-wrap">
              {errorMessages.map((error, idx) => (
                <h2 key={idx} className="card-title text-base font-bold mr-3">
                  {" " + error}
                </h2>
              ))}
            </div>
          </div>
        )}
        <form onSubmit={handleLogin} className="flex flex-col w-80 ">
          <Input
            className="mb-2"
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
            className="btn btn-success text-white w-full "
          >
            Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
