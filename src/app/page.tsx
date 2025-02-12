"use client"
import React, { useState } from "react"
import "./login.css"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { loginService } from "./service/login.service"
import { NextResponse } from "next/server"
import { Eye, EyeOff } from "lucide-react";

export default function Page() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const [showPassword, setShowPassword] = useState(false)
	const router = useRouter()

	const handleSuperAdminLogin = (e: any) => {
		e.preventDefault()
		setError("")

		if (email === "ramneet@gmail.com" && password === "123456") {
			document.cookie = `user=${JSON.stringify({ email, password })}; path=/;`
		}

		const storedUser = document.cookie
			.split(";")
			.find((cookie) => cookie.trim().startsWith("user="))

		if (storedUser) {
			toast.success("Login successful")
			router.push("/dashboard")
		} else {
			toast.error("Invalid credentials!")
		}
	}

	const handleStoreAdminLogin = async (e: any) => {
		e.preventDefault()
		setError("")
		try {
			const res = await loginService(email, password)
			if (res) {
				toast.success("Login successful")
				router.push("/storedashboard")
			}
		} catch (error) {
			toast.error("Failed to Login!")
		}
	}

	return (
		<div className="h-[100vh] items-center flex bg-gradient justify-center px-5 lg:px-0">
			<div className="max-w-screen-lg bg-white shadow-2xl sm:rounded-lg flex justify-center flex-1">
				<div className="flex-1 bg-blue-900 rounded-tl-lg rounded-bl-lg text-center hidden md:flex">
					<div
						className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
						style={{ backgroundImage: `url(https://www.tailwindtap.com/assets/common/marketing.svg)` }}
					></div>
				</div>
				<div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
					<div className="flex flex-col items-center">
						<div className="text-center">
							<h1 className="text-2xl mb-5 xl:text-4xl font-extrabold text-blue-900">
								Admin Sign In
							</h1>
							<p className="text-[16px] text-gray-500">Hey, enter your details to login</p>
						</div>
						<div className="w-full flex-1 mt-8">
							<div className="mx-auto max-w-xs flex flex-col gap-4">
								{error && <p className="text-red-500">{error}</p>}
								<form className="flex flex-col mb-10 gap-4">
									<input
										type="email"
										className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="Enter your email"
									/>
									<div className="relative w-full">
										<input
											type={showPassword ? "text" : "password"}
											className="w-full px-5 pr-12 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											placeholder="Password"
											autoComplete="off"
										/>
										<button
											type="button"
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 focus:outline-none"
											onClick={() => setShowPassword(!showPassword)}
										>
											{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
										</button>
									</div>
									<button onClick={handleSuperAdminLogin} className="mt-5 tracking-wide font-semibold bg-blue-900 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
										<span className="ml-3">Super Admin Login</span>
									</button>
									<button onClick={handleStoreAdminLogin} className="mt-5 tracking-wide font-semibold bg-green-900 text-gray-100 w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
										<span className="ml-3">Store Admin Login</span>
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}