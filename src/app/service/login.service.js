import { toast } from "react-toastify"
import {
	getAuth,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth"
import { app } from "../lib/firebase"

const auth = getAuth(app)

// Login function
export const loginService = async (email, password) => {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		)

		if (userCredential) {
			const user = userCredential.user
			document.cookie = "user=authenticated; path=/; max-age=3600" // Set a cookie that expires in 1 hour
			return userCredential
		}
	} catch (error) {
		toast.error(error.message)
	}
}

// Logout function
export const logoutService = async () => {
	try {
		// Sign out the user from Firebase
		await signOut(auth)

		// Remove the authentication cookie
		document.cookie = "user=; path=/; max-age=0" // Remove the cookie by setting its expiration to 0

		// Optionally clear localStorage or any other session data if necessary
		// localStorage.removeItem("user");
	} catch (error) {
		console.log(error)
		toast.error("Error logging out")
	}
}

export default auth
