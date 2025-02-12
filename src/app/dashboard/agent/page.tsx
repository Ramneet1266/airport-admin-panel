"use client"
import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { addAgent, getAgents } from "../../service/agent.service" // Adjust as per the correct path
import { fetchCategoryAndStoreNumber } from "@/app/service/store.service"
import { X } from "lucide-react"

export default function Page() {
	interface Store {
		category: string
		storeNumber: string
	}

	interface Agent {
		agentId: string
		agentName: string
		mobileNumber: string
		image?: string
		email: string
		password: string
		status: string
		category: string
		storeNumber: string
	}

	const [agentName, setAgentName] = useState("")
	const [mobileNumber, setMobileNumber] = useState("")
	const [category, setCategory] = useState("Clothing")
	const [storeNumber, setStoreNumber] = useState("101")
	const [loading, setLoading] = useState(false)
	const [isOpen, setIsOpen] = useState(false)
	const [fileName, setFileName] = useState("")
	const [status, setStatus] = useState("Active")

	// Fetch data
	const [agents, setAgents] = useState<Agent[]>([])
	const [storeList, setStoreList] = useState<Store[]>([])
	const [isFetching, setIsFetching] = useState(true)

	// Fetch agents
	const fetchAgents = async () => {
		setIsFetching(true)
		try {
			const data = await getAgents()
			setAgents(data as [])
			console.log(data)
		} catch (error) {
			toast.error("Unable to Fetch Data!!")
		} finally {
			setIsFetching(false)
		}
	}

	// Fetch store data
	const fetchStoreData = async () => {
		try {
			const data = await fetchCategoryAndStoreNumber()
			setStoreList(data as Store[])
			console.log(data)
		} catch (error) {
			toast.error("Unable to Fetch Store Data!!")
		}
	}

	useEffect(() => {
		fetchAgents()
		fetchStoreData()
	}, [])

	// Function to generate unique values for Agent ID, Email, and Password
	const generateValues = () => {
		const timeStamp = Date.now()
		const agentId = `${category
			.substring(0, 3)
			.toUpperCase()}-${storeNumber}-${timeStamp}`
		const email = `${agentName
			.toLowerCase()
			.replace(
				/\s+/g,
				""
			)}-${storeNumber}@${category.toLowerCase()}.com`
		const password = Math.random().toString(36).slice(-10)

		return { agentId, email, password }
	}

	// Handle Image Upload (Base64 conversion)
	const handleImageUpload = (e: any) => {
		const file = e.target.files[0]
		if (file) {
			const reader = new FileReader()
			reader.onloadend = () => {
				setFileName(reader.result as string) // Store Base64
			}
			reader.readAsDataURL(file)
		}
	}

	// Handle Form Submission
	const handleSubmit = async (e: any) => {
		e.preventDefault()
		setLoading(true)

		const { agentId, email, password } = generateValues()

		// Add agent data and handle response
		try {
			const res = await addAgent({
				agentId,
				agentName,
				mobileNumber,
				status,
				category,
				storeNumber,
				email,
				password,
				image: fileName,
			})
			if (res) {
				toast.success("Agent added Successfully")
				setIsOpen(false)
				clearFormFields() // Clear the form fields on success
				await fetchAgents()
			}
		} catch (error) {
			toast.error("Unable to add Agent!!")
		} finally {
			setLoading(false)
		}
	}

	// Clear all form fields
	const clearFormFields = () => {
		setAgentName("")
		setMobileNumber("")
		setCategory("Clothing")
		setStoreNumber("101")
		setFileName("")
		setStatus("Active")
	}

	// Close the modal and clear fields
	const handleCloseModal = () => {
		setIsOpen(false)
		clearFormFields()
	}

	// Remove duplicate categories
	const uniqueCategories = Array.from(
		new Set(storeList.map((store) => store.category))
	)

	return (
		<div>
			<div className="flex justify-between items-center">
				<h2 className="font-semibold text-5xl">Tables</h2>
				<div className="flex gap-20 items-center font-semibold">
					<button
						onClick={() => setIsOpen(true)}
						className="bg-blue-700 text-white px-6 py-3 rounded-md cursor-pointer hover:opacity-75 transition-all"
					>
						+ Add Agent
					</button>
					<div className="flex gap-1">
						<h4>Dashboard /</h4>
						<span className="text-blue-700">Agent</span>
					</div>
				</div>
			</div>

			{/* Table Section */}
			<div className="flex bg-white rounded-lg p-5 mt-10">
				{isFetching ? (
					<div className="w-full flex justify-center items-center text-lg font-semibold">
						Loading agents...
					</div>
				) : (
					<table className="w-full border-collapse">
						<thead>
							<tr className="bg-gray-100">
								<th className="px-4 py-2">Agent ID</th>
								<th className="px-4 py-2">Agent Name</th>
								<th className="px-4 py-2">Mobile Number</th>
								<th className="px-4 py-2">Image URL</th>
								<th className="px-4 py-2">Store Category</th>
								<th className="px-4 py-2">Store Number</th>
								<th className="px-4 py-2">Email</th>
								<th className="px-4 py-2">Password</th>
								<th className="px-4 py-2">Status</th>
							</tr>
						</thead>
						{agents.map((agent) => (
							<tbody key={agent.agentId}>
								<tr className="border-t text-center">
									<td className="px-4 py-2">{agent.agentId}</td>
									<td className="px-4 py-2">{agent.agentName}</td>
									<td className="px-4 py-2">{agent.mobileNumber}</td>
									<td className="px-4 py-2">
										<img
											src={agent.image}
											alt={agent.agentName}
											className="w-16 relative left-4 h-16 rounded-full shadow-lg"
										/>
									</td>
									<td className="px-4 py-2">{agent.category}</td>
									<td className="px-4 py-2">{agent.storeNumber}</td>
									<td className="px-4 py-2">{agent.email}</td>
									<td className="px-4 py-2">{agent.password}</td>
									<td>
										<div
											className={`px-4 py-2 font-semibold 
                        ${
													agent.status === "Active"
														? "bg-green-500 text-white rounded-lg"
														: ""
												} 
                        ${
													agent.status === "Inactive"
														? "bg-yellow-500 text-white rounded-lg"
														: ""
												} 
                        ${
													agent.status === "Suspended"
														? "bg-red-600 text-white rounded-lg"
														: ""
												}`}
										>
											{agent.status}
										</div>
									</td>
								</tr>
							</tbody>
						))}
					</table>
				)}
			</div>

			{/* Modal Section */}
			{isOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="flex flex-col items-center justify-center mt-10 ml-20">
						<div className="w-full bg-white rounded-lg">
							<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
								<div className="flex items-center justify-between">
									<h2 className="text-4xl font-semibold">
										Add Agent
									</h2>
									<X
										className="hover:text-red-600 cursor-pointer"
										onClick={handleCloseModal}
									/>
								</div>
								<form className="space-y-4" onSubmit={handleSubmit}>
									<div className="flex gap-4">
										<div className="flex-grow">
											<input
												type="text"
												name="agentName"
												value={agentName}
												onChange={(e) => setAgentName(e.target.value)}
												placeholder="Agent Name"
												required
												className="border-2 border-stroke outline-indigo-700 rounded-lg w-full p-2.5"
											/>
										</div>
										<div className="flex-grow">
											<input
												type="text"
												value={mobileNumber}
												onChange={(e) =>
													setMobileNumber(e.target.value)
												}
												name="MobileNumber"
												placeholder="Mobile Number"
												required
												className="border-2 border-stroke outline-indigo-700 text-gray-900 rounded-lg w-full p-2.5"
											/>
										</div>
									</div>
									<div className="flex flex-col gap-5">
										<select
											className="w-full border border-gray-300 rounded-md p-3 outline-indigo-700"
											onChange={(e) => setStatus(e.target.value)}
											value={status}
										>
											<option>Status</option>
											<option value="Active">Active</option>
											<option value="Inactive">Inactive</option>
											<option value="Suspended">Suspended</option>
										</select>

										<select
											className="w-full border border-gray-300 rounded-md p-3 outline-indigo-700"
											onChange={(e) => setCategory(e.target.value)}
											value={category}
										>
											<option value="">Select Store Category</option>
											{uniqueCategories.map((category, index) => (
												<option key={index} value={category}>
													{category}
												</option>
											))}
										</select>

										<select
											className="w-full border border-gray-300 rounded-md p-3 outline-indigo-700"
											onChange={(e) => setStoreNumber(e.target.value)}
											value={storeNumber}
										>
											<option>Store Number</option>
											{storeList
												.filter(
													(store) => store.category === category
												)
												.map((store, index) => (
													<option
														key={index}
														value={store.storeNumber}
													>
														{store.storeNumber}
													</option>
												))}
										</select>
									</div>
									<div>
										<input
											type="file"
											accept="image/*"
											onChange={handleImageUpload}
											required
											className="bg-gray-50 border outline-indigo-700 border-gray-300 text-gray-900 rounded-lg w-full p-2.5"
										/>
									</div>

									{/* Preview Selected Image */}
									{fileName && (
										<img
											src={fileName}
											alt="Selected"
											className="mt-4 ml-20 w-full max-w-xs rounded-lg shadow-lg"
										/>
									)}

									<button
										type="submit"
										className="w-full text-white bg-indigo-700 hover:opacity-75 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
									>
										{loading ? "Saving..." : "Add Agent"}
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
