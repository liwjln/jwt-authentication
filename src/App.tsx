import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import useAuth from "@/hooks/useAuth";
import Profile from "@/pages/Profile";

const App: React.FC = () => {
	const { token } = useAuth();

	return (
		<Router>
			<Routes>
				<Route path="/" element={token ? <Navigate to="/home" /> : <Navigate to="/login" />} />
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={token ? <Navigate to="/home" /> : <Login />} />
				<Route path="/home" element={<Home />} />
				<Route path="/profile" element={<Profile />} />
			</Routes>
			<Toaster />
		</Router>
	);
};

export default App;
