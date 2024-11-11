import { createContext } from "react";

export interface AuthContextType {
	token: string | null;
	setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
