import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";

type FormValues = {
	email: string;
	password: string;
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function LoginForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>();
	const navigate = useNavigate();
	const { toast } = useToast();
	const { setToken } = useAuth();

	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		try {
			const response = await axios.post(`${BACKEND_URL}/user/login`, data);
			const token = response.data.token;

			setToken(token);

			toast({
				description: response.data.message,
			});
			navigate("/home");
		} catch (error) {
			const err = error as { response: { data: { message: string } } };
			toast({
				description: err.response.data.message,
			});
		}
	};

	return (
		<Card className="mx-auto">
			<CardHeader>
				<CardTitle className="text-2xl">Login</CardTitle>
				<CardDescription>Enter your email below to login to your account</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" placeholder="m@example.com" {...register("email", { required: "Email is required" })} required />
						{errors.email && <p>{errors.email.message}</p>}
					</div>
					<div className="grid gap-2">
						<div className="flex items-center">
							<Label htmlFor="password">Password</Label>
						</div>
						<Input id="password" type="password" {...register("password", { required: "Password is required" })} required />
						{errors.password && <p>{errors.password.message}</p>}
					</div>
					<Button type="submit" className="w-full">
						Login
					</Button>
				</form>
				<div className="mt-4 text-center text-sm">
					Don&apos;t have an account?{" "}
					<Link to="/register" className="underline text-cyan-700">
						Sign up
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
