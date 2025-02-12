"use server";

import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

const productCollection = collection(db, "products");

export async function addProduct(productData) {
  try {
    const docRef = await addDoc(productCollection, {
      catalogueProductId: `PROD-${Date.now()}`,
      catalogueProductName: productData.catalogueProductName,
      productDescription: productData.productDescription,
      productImageUrl: productData.productImageUrl,
      catalogueCategoryId: productData.catalogueCategoryId,
      catalogueCategoryName: productData.catalogueCategoryName,
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error("Failed to add product.");
  }
}

export async function getProducts() {
    try {
      const snapshot = await getDocs(collection(db, "products"));
      return snapshot.docs.map((doc) => ({
        catalogueProductId: doc.id, // Assign Firestore document ID
        catalogueProductName: doc.data().catalogueProductName || "",
        productDescription: doc.data().productDescription || "",
        productImageUrl: doc.data().productImageUrl || "",
        catalogueCategoryId: doc.data().catalogueCategoryId || "",
        catalogueCategoryName: doc.data().catalogueCategoryName || "",
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products.");
    }
  }