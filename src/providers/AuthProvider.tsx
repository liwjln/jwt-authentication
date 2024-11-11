import React, { useState, ReactNode, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
	useEffect(() => {
		if (token) {
			localStorage.setItem("token", token);
		} else {
			localStorage.removeItem("token");
		}
	}, [token]);
	return <AuthContext.Provider value={{ token, setToken }}>{children}</AuthContext.Provider>;
};
