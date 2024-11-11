import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { FilePenLine, Save } from "lucide-react";

import useAuth from "@/hooks/useAuth";

import { User } from "@/types/user";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Profile: React.FC = () => {
	const navigate = useNavigate();
	const { token, setToken } = useAuth();
	const [userData, setUserData] = useState<User>();
	const [tempUserData, setTempUserData] = useState<User>();
	const [isUserEditing, setIsUserEditing] = useState(false);

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
					setUserData(response.data.user);
					setTempUserData(response.data.user);
				}
			} catch (error) {
				console.error(error);
				handleLogout();
			}
		};
		fetchProfile();
	}, [token, handleLogout]);

	const handleUserEditClick = async () => {
		if (isUserEditing) {
			try {
				await axios.put(`${BACKEND_URL}/user/profile`, tempUserData, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setUserData(tempUserData);
			} catch (error) {
				console.error("Error updating user data:", error);
			}
		} else {
			setTempUserData(userData);
		}
		setIsUserEditing(!isUserEditing);
	};

	const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setTempUserData(
			(prevData) =>
				({
					...prevData,
					[id]: value || "",
				} as User)
		);
	};

	const userFields = [
		{ label: "Full Name", id: "fullName", type: "text", value: tempUserData?.fullName },
		{ label: "Username", id: "username", type: "text", value: tempUserData?.username },
		{ label: "Email", id: "email", type: "email", value: tempUserData?.email },
		{ label: "Phone Number", id: "phoneNumber", type: "text", value: tempUserData?.phoneNumber },
	];

	return (
		<div className="w-screen flex items-center flex-col justify-between h-screen py-16 bg-zinc-50">
			<div className="flex flex-col items-center gap-8 container">
				<h1 className="font-semibold text-4xl">
					<button onClick={() => navigate("/home")}>Home</button> / <span className="text-cyan-700">Profile</span>
				</h1>
				{!token ? (
					<p>
						Please{" "}
						<button className="underline text-cyan-700" onClick={() => navigate("/login")}>
							login
						</button>{" "}
						to access more features.
					</p>
				) : userData ? (
					<Card className="rounded-lg border-none mt-6 w-full">
						<CardContent className="p-6">
							<div className="flex justify-between">
								<div className="font-semibold text-lg">Personal Data</div>
								<Button variant="outline" className="flex items-center gap-1 w-24" onClick={handleUserEditClick}>
									<div>{isUserEditing ? "Save" : "Edit"}</div> {isUserEditing ? <Save className="h-4 w-4" /> : <FilePenLine className="h-4 w-4" />}
								</Button>
							</div>
							<div className="grid grid-cols-2 gap-4">
								{userFields.map((field) => (
									<div key={field.id}>
										<Label htmlFor={field.id}>{field.label}</Label>
										<Input
											className={`max-w-96 ${isUserEditing ? "bg-white" : ""}`}
											type={field.type}
											id={field.id}
											placeholder={field.label}
											value={field.value || ""}
											disabled={field.id == "email" ? true : !isUserEditing}
											onChange={handleUserDataChange}
										/>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				) : (
					<p>Loading...</p>
				)}
			</div>
			<Button onClick={handleLogout} variant="destructive">
				Logout
			</Button>
		</div>
	);
};

export default Profile;
