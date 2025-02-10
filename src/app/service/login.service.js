import { toast } from "react-toastify"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
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
			localStorage.setItem(
				"user",
				JSON.stringify({
					uid: user.uid,
					email: user.email,
					token: await user.getIdToken(),
				})
			)
			return userCredential
		}
	} catch (error) {
		toast.error(error.message)
	}
}

export default auth
