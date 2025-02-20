"use server"
import {
	addDoc,
	collection,
	getDocs,
	query,
	where,
} from "firebase/firestore"
import { db } from "../lib/firebase"

// Check if email and agent ID are unique
export async function isUnique(email, agentId) {
	const agentRef = collection(db, "agents")

	// Query Firestore for existing email
	const emailQuery = query(agentRef, where("email", "==", email))
	const emailSnapshot = await getDocs(emailQuery)

	// Query Firestore for existing agent ID
	const idQuery = query(agentRef, where("agentId", "==", agentId))
	const idSnapshot = await getDocs(idQuery)

	// True if both are unique
	return emailSnapshot.empty && idSnapshot.empty
}

// Function to generate a unique email if one already exists
async function generateUniqueEmail(baseEmail) {
	let email = baseEmail
	let counter = 1

	while (true) {
		const emailQuery = query(
			collection(db, "agents"),
			where("email", "==", email)
		)
		const emailSnapshot = await getDocs(emailQuery)

		if (emailSnapshot.empty) break // Email is unique, exit loop
		email = `${baseEmail.split("@")[0]}${counter}@${
			baseEmail.split("@")[1]
		}`
		counter++
	}

	return email
}

// Function to generate a unique password
async function generateUniquePassword() {
	let password
	let isUnique = false

	while (!isUnique) {
		password = Math.random().toString(36).slice(-10) // Generate random password

		// Check if password already exists in Firestore
		const passwordQuery = query(
			collection(db, "agents"),
			where("password", "==", password)
		)
		const passwordSnapshot = await getDocs(passwordQuery)

		if (passwordSnapshot.empty) isUnique = true // Ensure password is unique
	}

	return password
}

export async function addAgent(agentData) {
    // Generate a unique email
    const uniqueEmail = await generateUniqueEmail(agentData.email);

    // Generate a unique password
    const uniquePassword = await generateUniquePassword();

    // Update agent data with unique email & password
    agentData.email = uniqueEmail;
    agentData.password = uniquePassword;

    if (!(await isUnique(agentData.email, agentData.agentId))) {
        throw new Error("Agent ID already exists!");
    }

    try {
        await addDoc(collection(db, "agents"), agentData);

        // ✅ Fix: Use absolute URL for the API request
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL
            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/send-email`
            : "http://localhost:3000/api/send-email"; // Default to localhost in dev

        await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                toEmail: agentData.personalEmail, // Send to personal email
                storeEmail: uniqueEmail,
                storePassword: uniquePassword,
            }),
        });

        return { success: true };
    } catch (error) {
        console.log("Error adding agent:", error);
        throw new Error("Failed to add agent.");
    }
}


export async function getAgents() {
	const agentRef = collection(db, "agents")
	const snapshot = await getDocs(agentRef)
	const agents = snapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	}))
	return agents
}
