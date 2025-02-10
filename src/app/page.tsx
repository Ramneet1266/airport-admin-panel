"use client"
import React, { useState } from "react"
import "./login.css"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { loginService } from "./service/login.service"

export default function Page() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const router = useRouter()

	const handleLogin = async (e: any) => {
		e.preventDefault()
		setError("")
		try {
			const res = await loginService(email, password)
			if (res) {
				toast.success("Login successfull")
				router.push("/dashboard")
			}
		} catch (error) {
			toast.error("Failed to Login!")
		}
	}
	return (
		<>
			<div className="h-[100vh] items-center flex bg-gradient justify-center px-5 lg:px-0">
				<div className="max-w-screen-lg bg-white shadow-2xl sm:rounded-lg flex justify-center flex-1">
					<div className="flex-1 bg-blue-900 rounded-tl-lg rounded-bl-lg text-center hidden md:flex">
						<div
							className="m-12 xl:m-16 w-full  bg-contain bg-center bg-no-repeat"
							style={{
								backgroundImage: `url(https://www.tailwindtap.com/assets/common/marketing.svg)`,
							}}
						></div>
					</div>
					<div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
						<div className=" flex flex-col items-center">
							<div className="text-center">
								<h1 className="text-2xl mb-5 xl:text-4xl font-extrabold text-blue-900">
									Admin Sign In
								</h1>
								<p className="text-[16px] text-gray-500">
									Hey enter your details to login
								</p>
							</div>
							<div className="w-full flex-1 mt-8">
								<div className="mx-auto max-w-xs flex flex-col gap-4">
									{error && <p className="text-red-500">{error}</p>}
									<form
										className="flex flex-col mb-10 gap-4"
										onSubmit={handleLogin}
									>
										<input
											className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
											type="email"
											onChange={(e) => setEmail(e.target.value)}
											placeholder="Enter your email"
										/>

										<input
											className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
											type="password"
											onChange={(e) => setPassword(e.target.value)}
											placeholder="Password"
										/>
										<button
											type="submit"
											className="mt-5 tracking-wide font-semibold bg-blue-900 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
										>
											<svg
												className="w-6 h-6 -ml-2"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
												<circle cx="8.5" cy="7" r="4" />
												<path d="M20 8v6M23 11h-6" />
											</svg>
											<span className="ml-3">Sign In</span>
										</button>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
