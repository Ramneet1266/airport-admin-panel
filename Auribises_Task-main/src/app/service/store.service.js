"use server";

import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import auth from "./login.service";
import { sendStoreCredentials } from "./sendStoreCredentials"; // ✅ Correct import

export const addStore = async (storeData) => {
    try {
        const storeRef = await addDoc(collection(db, "stores"), storeData);
        console.log("✅ Store added with ID:", storeRef.id);
        return storeRef.id;
    } catch (error) {
        console.error("❌ Error adding store:", error);
    }
};

export const fetchStores = async () => {
    try {
        const storesSnap = await getDocs(collection(db, "stores"));
        const stores = storesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return stores;
    } catch (error) {
        console.error("❌ Error fetching stores:", error);
    }
};

export async function importUsersFromFirestore() {
    const storeRef = collection(db, "stores");
    const snapshot = await getDocs(storeRef);

    if (snapshot.empty) {
        console.log("⚠️ No store documents found!");
        return;
    }

    for (const doc of snapshot.docs) {
        const storeData = doc.data();
        console.log(`🔍 Checking store: ${storeData.email}`);

        if (storeData.email && storeData.password && storeData.storeHeadEmail) {
            try {
                // 🔹 Step 1: Check if email already exists in Firebase Auth
                const signInMethods = await fetchSignInMethodsForEmail(auth, storeData.email);

                if (signInMethods.length > 0) {
                    console.warn(`⚠️ User with email ${storeData.email} already exists. Skipping...`);
                    continue;
                }

                // 🔹 Step 2: Create new user only if email is not registered
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    storeData.email,
                    storeData.password
                );

                console.log(`✅ User created: ${userCredential.user.email}`);

                // 🔹 Step 3: Send store credentials via email
                const emailStatus = await sendStoreCredentials(
                    storeData.storeHeadEmail,
                    storeData.email,
                    storeData.password
                );

                console.log("📧 Email status:", emailStatus);
            } catch (error) {
                if (error.code === "auth/email-already-in-use") {
                    console.warn(`⚠️ User ${storeData.email} already exists. Ignoring...`);
                } else {
                    console.error(`❌ Error adding user ${storeData.email}:`, error);
                }
            }
        } else {
            console.log(`⚠️ Skipping ${doc.id}, missing email, password, or store head email.`);
        }
    }
}
