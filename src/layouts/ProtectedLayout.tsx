import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const ProtectedLayout: React.FC = () => {
	const { token } = useAuth();

	if (!token) {
		return <Navigate to="/login" />;
	}

	return <Outlet />;
};

export default ProtectedLayout;
