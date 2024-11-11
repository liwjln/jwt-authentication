import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Home: React.FC = () => {
	const navigate = useNavigate();
	const { token, setToken } = useAuth();
	const [email, setEmail] = useState<string | null>(null);

	const handleLogout = useCallback(() => {
		setToken(null);
		navigate("/login");
	}, [setToken, navigate]);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				if (token) {
					const response = await axios.get(`${BACKEND_URL}/user/profile`, {
						headers: { Authorization: `Bearer ${token}` },
					});
					setEmail(response.data.user.email);
				}
			} catch (error) {
				console.error(error);
				handleLogout();
			}
		};
		fetchProfile();
	}, [token, handleLogout]);

	return (
		<div className="w-screen flex flex-col items-center justify-between h-screen py-16 bg-zinc-50">
			<div className="flex flex-col items-center gap-8">
				<h1 className="font-semibold text-4xl">
					<span className="text-cyan-700">Home</span> / <button onClick={() => navigate("/profile")}>Profile</button>
				</h1>
				{token ? (
					<div className="flex flex-col items-center gap-2">
						{email && <p>Welcome, {email}.</p>}
						<p>This is your dashboard after logging in successfully.</p>
					</div>
				) : (
					<p>
						Please{" "}
						<button className="underline text-cyan-700" onClick={() => navigate("/login")}>
							login
						</button>{" "}
						to access more features.
					</p>
				)}
			</div>
			{token && (
				<Button onClick={handleLogout} variant="destructive">
					Logout
				</Button>
			)}
		</div>
	);
};

export default Home;
