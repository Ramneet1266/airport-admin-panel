"use server";

import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

const productCollection = collection(db, "products");

export const addProductToCategory = async (storeId, categoryId, productData) => {
  try {
    const docRef = await addDoc(
      collection(db, "stores", storeId, "categories", categoryId, "products"),
      productData
    );
    console.log("Product added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding product to category:", error);
    return null;
  }
};

export const fetchProductsForCategory = async (storeId, categoryId) => {
  try {
    console.log("Fetching products for Store:", storeId, "Category:", categoryId);
    const productsSnap = await getDocs(collection(db, "stores", storeId, "categories", categoryId, "products"));
    console.log("Snapshot Size:", productsSnap.size);
    const products = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Fetched Products:", products);
    return products;
  } catch (error) {
    console.error("Error fetching products: ", error);
  }
};
