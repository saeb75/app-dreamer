export interface IUser {
  id: string;
  email: string;
  username: string;
  imageCredit: number;
  isPro: boolean;
  picture: string;
  name: string;
  avatar: string;
}

export interface AuthStore {
  user: IUser | null;
  token: string | null;
  setToken: (token: string | null) => void;
  setUser: (user: IUser | null) => void;
  loginGoogle: (idToken: string) => Promise<void>;
  loginApple: (identityToken: string) => Promise<void>;
  setStorage: (token: string) => Promise<void>;
  getStorage: () => Promise<string | null>;
  getUser: () => Promise<void | null>;
  logout: () => Promise<void>;
}
