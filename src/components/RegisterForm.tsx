import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";

type ErrorResponse = {
	response: {
		data: {
			message: string;
		};
	};
};

type FormValues = {
	email: string;
	password: string;
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const RegisterForm: React.FC = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>();
	const navigate = useNavigate();
	const { toast } = useToast();

	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		try {
			const response = await axios.post(`${BACKEND_URL}/user/register`, data);
			navigate("/login");
			toast({
				description: response.data.message,
			});
		} catch (error) {
			const err = error as ErrorResponse;
			toast({
				description: err.response.data.message,
			});
		}
	};

	return (
		<Card className="mx-auto">
			<CardHeader>
				<CardTitle className="text-2xl">Sign Up</CardTitle>
				<CardDescription>Enter your details below to create a new account</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" placeholder="m@example.com" {...register("email", { required: "Email is required" })} required />
						{errors.email && <p>{errors.email.message}</p>}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">Password</Label>
						<Input id="password" type="password" {...register("password", { required: "Password is required" })} required />
						{errors.password && <p>{errors.password.message}</p>}
					</div>
					<Button type="submit" className="w-full">
						Sign Up
					</Button>
				</form>
				<div className="mt-4 text-center text-sm">
					Already have an account?{" "}
					<Link to="/login" className="underline text-cyan-700">
						Login
					</Link>
				</div>
			</CardContent>
		</Card>
	);
};

export default RegisterForm;
