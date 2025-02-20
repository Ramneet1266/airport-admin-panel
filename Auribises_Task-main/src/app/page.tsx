"use client"
import React, { useState } from "react"
import "./login.css"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { loginService } from "./service/login.service"
import { Eye, EyeOff } from "lucide-react"


export default function Page() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const [showPassword, setShowPassword] = useState(false) // Toggle Password Visibility
	const [loading, setLoading] = useState(false) // To prevent multiple clicks

	const router = useRouter()

	// Utility function to set a cookie
	const setCookie = (name: string, value: string, days: number) => {
		const date = new Date()
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
		document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`
	}

	// Utility function to get a cookie
	const getCookie = (name: string) => {
		const cookies = document.cookie.split("; ")
		const foundCookie = cookies.find((row) => row.startsWith(`${name}=`))
		return foundCookie ? foundCookie.split("=")[1] : null
	}

	const handleSuperAdminLogin = async (e: any) => {
		e.preventDefault()
		setError("")
		setLoading(true)

		if (email === "ramneet@gmail.com" && password === "123456") {
			setCookie("user", JSON.stringify({ email }), 1) // Store for 1 day
		}

		const storedUser = getCookie("user")

		if (storedUser) {
			toast.success("Login successful")
			router.push("/dashboard")
		} else {
			setError("Invalid credentials!")
			toast.error("Invalid credentials!")
		}

		setLoading(false)
	}

	const handleStoreAdminLogin = async (e: any) => {
		e.preventDefault()
		setError("")
		setLoading(true)

		try {
			const res = await loginService(email, password)
			if (res) {
				toast.success("Login successful")
				router.push("/storedashboard")
			} else {
				setError("Login failed!")
				toast.error("Invalid credentials!")
			}
		} catch (error) {
			setError("Failed to Login!")
			toast.error("Failed to Login!")
		}

		setLoading(false)
	}

	return (
		<div className="h-[100vh] items-center flex bg-gradient justify-center px-5 lg:px-0">
			<div className="max-w-screen-lg bg-white shadow-2xl sm:rounded-lg flex justify-center flex-1">
				<div className="flex-1 bg-blue-900 rounded-tl-lg rounded-bl-lg text-center hidden md:flex">
					<div
						className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
						style={{
							backgroundImage: `url(https://www.tailwindtap.com/assets/common/marketing.svg)`,
						}}
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
										onChange={(e) => setEmail(e.target.value)}
										placeholder="Enter your email"
										autoFocus
									/>
									
									<div className="relative w-full">
	{/* Remove any left-side icon here if present */}
	<input
		type={showPassword ? "text" : "password"}
		className="w-full px-5 pr-12 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
		value={password}
		onChange={(e) => setPassword(e.target.value)}
		placeholder="Password"
		autoComplete="off"
	/>
	{/* Right-side toggle button */}
	<button
		type="button"
		className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 focus:outline-none"
		onClick={() => setShowPassword(!showPassword)}
	>
		{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
	</button>
</div>


									{/* Super Admin Login Button */}
									<button
										onClick={handleSuperAdminLogin}
										className="mt-5 tracking-wide font-semibold bg-blue-900 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
										disabled={loading}
									>
										{loading ? "Logging in..." : "Super Admin Login"}
									</button>

									{/* Store Admin Login Button */}
									<button
										onClick={handleStoreAdminLogin}
										className="mt-5 tracking-wide font-semibold bg-green-900 text-gray-100 w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
										disabled={loading}
									>
										{loading ? "Logging in..." : "Store Admin Login"}
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
