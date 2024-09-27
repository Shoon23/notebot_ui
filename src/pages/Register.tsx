import React, { useState } from "react";
import Input from "../components/Input";
import { useMutation } from "@tanstack/react-query";
import authService from "../services/authService";
import { iLogin, iRegister } from "../types/auth";

const Register: React.FC = () => {
  const [formData, setFormData] = useState<iRegister>({
    email: "",
    password: "",
    user_name: "",
  });
  const { isError, isPending, mutate } = useMutation({
    gcTime: Infinity,
    mutationKey: ["user"],
    mutationFn: async () => {
      return await authService.login(formData);
    },
    onError(error, variables, context) {},
  });

  const handle_register = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate();
  };

  return (
    <section className="flex items-center justify-center h-screen">
      <div className="flex flex-col gap-5 items-center card bg-base-100 shadow-xl p-10 md:p-20">
        <h1>Register</h1>

        <form onSubmit={handle_register} className="flex flex-col gap-3 w-80">
          <Input
            type="text"
            placeholder="Email"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
            }
          />
          <Input
            type="text"
            placeholder="Username"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
            }
          />
          <Input
            type="password"
            placeholder="Password"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;
