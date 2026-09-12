import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://telegram-summarizer-3axw.onrender.com"
});

export const { 
  signIn, 
  signUp, 
  signOut, 
  useSession 
} = authClient;
