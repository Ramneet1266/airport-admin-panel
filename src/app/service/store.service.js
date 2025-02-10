"use server"

import { addDoc, collection, getDocs } from "firebase/firestore"
import { db } from "../lib/firebase"

export async function addStore(agentData) {
	try {
		await addDoc(collection(db, "stores"), agentData)
		return { success: true }
	} catch (error) {
		console.log("Error adding agent:", error)
		throw new Error("Failed to add agent.")
	}
}
export async function getStores() {
	const storeRef = collection(db, "stores")
	const snapshot = await getDocs(storeRef)
	const stores = snapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	}))
	return stores
}
export async function fetchCategoryAndStoreNumber() {
	const storeRef = collection(db, "stores")
	const snapshot = await getDocs(storeRef)
	const storesList = snapshot.docs.map((doc) => ({
		storeNumber: doc.data().storeNumber,
		category: doc.data().category,
	}))
	return storesList
}
export async function importUsersFromFirestore() {
	const storeRef = collection(db, "stores") // Use 'collection' instead of 'db.collection'
	const snapshot = await getDocs(storeRef)

	if (snapshot.empty) {
		console.log("No store documents found!")
		return
	}

	// Loop through each document in the "Stores" collection
	snapshot.forEach(async (doc) => {
		const storeData = doc.data() // Fetch JSON data

		// Ensure email and password exist in the document
		if (storeData.email && storeData.password) {
			try {
				// Create user in Firebase Authentication (client-side)
				const userCredential = await createUserWithEmailAndPassword(
					auth,
					storeData.email,
					storeData.password
				)

				console.log(`User created: ${userCredential.user.email}`)
			} catch (error) {
				console.error(`Error adding user ${storeData.email}:`, error)
			}
		} else {
			console.log(`Skipping ${doc.id}, missing email or password.`)
		}
	})
}
