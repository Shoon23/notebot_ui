import React, { useState } from "react";
import Input from "../components/Input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import authService from "../services/authService";
import { iLogin, iRegister } from "../types/auth";
import { Axios, AxiosError } from "axios";
import {
  IonContent,
  IonIcon,
  IonPage,
  IonRouterLink,
  useIonRouter,
} from "@ionic/react";
import logoGif from "../assets/book.gif";
import {
  IonInput,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonButton,
} from "@ionic/react";
import { lockClosed, mail, person } from "ionicons/icons";
import welcome_img from "../assets/welcome.png";
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
  const { isPending, mutate, isSuccess } = useMutation({
    mutationFn: async () => {
      const { confirm_password, ...others } = formData;

      return await authService.register(others);
    },
    onSuccess(data, variables, context) {
      queryClient.setQueryData(["user"], data);
      router.push("/");

      return data;
    },
    onError(error, variables, context) {
      const axiosError = error as AxiosError;

      const errorResponse =
        (axiosError?.response?.data as any)?.message ?? axiosError.message;

      console.log(errorResponse);
      setErrorMessages([errorResponse]);
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
    console.log("afsa");
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
            backgroundColor: "white",
            height: "100vh",
          }}
        >
          <br />
          <br />

          <img src={welcome_img} alt="" />
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
                Register
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

                        margin: 0, // Remove default margin of <p> tag
                        marginLeft: 5,
                      }}
                    >
                      {" " + error + " "}
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
                onSubmit={handleRegister}
                style={{
                  display: "flex", // flex
                  flexDirection: "column", // flex-col
                  width: "100%", // w-full
                }}
              >
                <IonInput
                  style={{
                    marginBottom: 20,
                  }}
                  color={"dark"}
                  shape="round"
                  label="Email"
                  labelPlacement="stacked"
                  fill="solid"
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
                    marginBottom: 20,
                  }}
                  color={"dark"}
                  shape="round"
                  label="user_name"
                  labelPlacement="stacked"
                  fill="solid"
                  placeholder="Enter Username"
                  name="user_name"
                  type="text"
                  onIonChange={handleOnChange}
                  value={formData.user_name}
                >
                  <IonIcon
                    slot="start"
                    color="warning"
                    style={{ fontSize: "24px" }}
                    icon={person}
                    aria-hidden="true"
                  ></IonIcon>
                </IonInput>
                <IonInput
                  style={{
                    marginBottom: 20,
                  }}
                  color={"dark"}
                  shape="round"
                  label="Password"
                  labelPlacement="stacked"
                  fill="solid"
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
                <IonInput
                  style={{
                    marginBottom: 20,
                  }}
                  color={"dark"}
                  shape="round"
                  label="Confirm password"
                  labelPlacement="stacked"
                  fill="solid"
                  placeholder="Enter Confirm Password"
                  name="confirm_password"
                  type="password"
                  onIonChange={handleOnChange}
                  value={formData.confirm_password}
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
                  Already have an account?{" "}
                  <IonRouterLink routerDirection="forward" routerLink="/login">
                    Login
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

export default Register;
