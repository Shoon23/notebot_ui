export interface iLogin {
  email: string;
  password: string;
}

export interface iRegister {
  email: string;
  user_name: string;
  password: string;
}

export interface iUserSession {
  access_token: string;
  email: string;
  user_id: string;
  user_name: string;
}
