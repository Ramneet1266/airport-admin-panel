"use server";

import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

const categoryCollection = collection(db, "categories");

export async function addCategory(categoryData) {
  try {
    const docRef = await addDoc(categoryCollection, {
      catalogueCategoryName: categoryData.catalogueCategoryName,
      catalogueCategoryId: `CAT-${Date.now()}`,
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding category:", error);
    throw new Error("Failed to add category.");
  }
}

export async function getCategories() {
  try {
    const snapshot = await getDocs(categoryCollection);
    return snapshot.docs.map((doc) => ({
      catalogueCategoryId: doc.data().catalogueCategoryId,
      catalogueCategoryName: doc.data().catalogueCategoryName,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories.");
  }
}
