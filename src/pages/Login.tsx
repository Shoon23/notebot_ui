import React, { useState } from "react";
import { iLogin } from "../types/auth";
import {
  IonContent,
  IonIcon,
  IonPage,
  IonRouterLink,
  useIonRouter,
} from "@ionic/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import authService from "../services/authService";
import { AxiosError } from "axios";

import {
  IonInput,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonButton,
} from "@ionic/react";
import logoGif from "../assets/book.gif";
import { lockClosed, mail } from "ionicons/icons";

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
  const handleOnChange = (e: CustomEvent) => {
    const name = (e.target as HTMLInputElement).name;
    const value = (e.target as HTMLInputElement).value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <IonPage>
      <IonContent>
        <div
          style={{
            backgroundColor: "white", // Navy blue color
            height: "100vh",
          }}
        >
          <br />
          <br />
          <br />

          <h1
            style={{
              fontSize: "3rem",
              color: "black",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Welcome Back!
          </h1>
          <div>
            <img src={logoGif} alt="Notebot Logo" className="book" />
          </div>
          <IonCard
            style={{
              borderRadius: "3.2rem 3.2rem 0 0", // Rounded only at the top
              boxShadow: "0 25px 50px rgba(0, 0, 0, .5)",
              border: "2px solid #333", // Dark border color
              margin: 0,
              height: "70%", // Adjust height as required
              backgroundColor: "white",
            }}
          >
            <IonCardHeader>
              <IonCardTitle
                style={{
                  textAlign: "center",
                  fontSize: "1.875rem",
                }}
              >
                Login
              </IonCardTitle>
            </IonCardHeader>
            {isError && (
              <IonCardSubtitle
                style={{
                  marginLeft: "0.75rem", // mx-3
                  marginRight: "0.75rem", // mx-3
                  borderRadius: "0.375rem", // rounded-md
                  backgroundColor: "#f87171", // bg-red-500 (red-500 color from Tailwind)
                  textAlign: "center", // text-center
                  marginBottom: "0.5rem", // mb-2
                  border: "2px solid #333", // Dark border color
                }}
              >
                <div
                  style={{
                    padding: "0.75rem", // p-3
                    display: "flex",
                    color: "white", // text-white
                    flexWrap: "wrap", // flex-wrap
                  }}
                >
                  {errorMessages.map((error, idx) => (
                    <p
                      key={idx}
                      style={{
                        fontSize: "1rem", // text-base
                        fontWeight: "700", // font-bold
                        marginRight: "0.75rem", // mr-3
                      }}
                    >
                      {" " + error}
                    </p>
                  ))}
                </div>
              </IonCardSubtitle>
            )}
            <IonCardContent
              style={{
                width: "100%", // w-full
                paddingLeft: "1.75rem", // px-7 (padding-x is 1.75rem for Tailwind's 7 class)
                paddingRight: "1.75rem", // px-7
              }}
            >
              <form
                onSubmit={handleLogin}
                style={{
                  display: "flex", // flex
                  flexDirection: "column", // flex-col
                  width: "100%", // w-full
                  gap: 20,
                }}
              >
                <IonInput
                  style={{
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)", // shadow-sm
                  }}
                  color={"dark"}
                  shape="round"
                  label="Email"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Enter Email"
                  name="email"
                  type="email"
                  onIonChange={handleOnChange}
                  value={formData.email}
                >
                  <IonIcon
                    slot="start"
                    color="warning"
                    style={{ fontSize: "24px" }}
                    icon={mail}
                    aria-hidden="true"
                  ></IonIcon>
                </IonInput>
                <IonInput
                  style={{
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)", // shadow-sm
                  }}
                  color={"dark"}
                  shape="round"
                  label="Password"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Enter Password"
                  name="password"
                  type="password"
                  onIonChange={handleOnChange}
                  value={formData.password}
                >
                  <IonIcon
                    color="warning"
                    slot="start"
                    style={{ fontSize: "24px" }}
                    icon={lockClosed}
                    aria-hidden="true"
                  ></IonIcon>
                </IonInput>

                <IonButton
                  color={"warning"}
                  shape="round"
                  disabled={isPending}
                  type="submit"
                  style={{
                    border: "2px solid #333", // Dark border color
                    borderRadius: "50px", // Ensures the rounded corners are preserved with the border
                  }}
                >
                  Login
                </IonButton>
                <p
                  style={{
                    textAlign: "center",
                  }}
                >
                  Don’t have an account?{" "}
                  <IonRouterLink
                    routerDirection="forward"
                    routerLink="/register"
                  >
                    Register
                  </IonRouterLink>
                  .
                </p>
              </form>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
