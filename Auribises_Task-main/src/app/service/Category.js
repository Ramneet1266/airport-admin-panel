"use server";

import { addDoc, collection, doc, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

const categoryCollection = collection(db, "categories");

export const addCategoryToStore = async (storeId, categoryData) => {
  try {
    const categoriesRef = collection(db, "stores", storeId, "categories");
      const categoryRef = await addDoc(categoriesRef, categoryData);
      console.log("Category added with ID: ", categoryRef.id);
      return categoryRef.id;
  } catch (error) {
      console.error("Error adding category: ", error);
  }
};


export const fetchCategoriesForStore = async (storeId) => {
  try {
      const categoriesSnap = await getDocs(collection(db, "stores", storeId, "categories"));
      const categories = categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return categories;
  } catch (error) {
      console.error("Error fetching categories: ", error);
  }
};