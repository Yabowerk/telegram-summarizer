import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://telegram-summarizer-sage.vercel.app"
});

export const { 
  signIn, 
  signUp, 
  signOut, 
  useSession 
} = authClient;
