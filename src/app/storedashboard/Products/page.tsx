"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { addProductToCategory, fetchProductsForStore } from "../../service/ProductService";
import { fetchCategoriesForStore } from "@/app/service/category";

interface Product {
  id?: string;
  catalogueProductName?: string;
  productDescription?: string;
  productImageUrl?: string;
  catalogueCategoryId?: string;
  catalogueCategoryName?: string;
}

interface Category {
  catalogueCategoryId: string;
  catalogueCategoryName: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    catalogueProductName: "",
    productDescription: "",
    productImageUrl: "",
    catalogueCategoryId: "",
    catalogueCategoryName: "",
  });

  useEffect(() => {
    const storedStoreId = localStorage.getItem("storeId");
    if (storedStoreId) {
      setStoreId(storedStoreId);
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!storeId) return;

      try {
        const fetchedCategories = await fetchCategoriesForStore(storeId);
        const formattedCategories = fetchedCategories?.map(cat => ({
          catalogueCategoryId: cat.id,
          catalogueCategoryName: (cat as any).catalogueCategoryName || "Unnamed Category",
        })) || [];

        setCategories(formattedCategories);
        localStorage.setItem("categories", JSON.stringify(formattedCategories));

        if (formattedCategories.length > 0) {
          setSelectedCategoryId(formattedCategories[0].catalogueCategoryId);
          fetchProducts(formattedCategories[0].catalogueCategoryId);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data.");
      }
    }

    fetchData();
  }, [storeId]);

  const fetchProducts = async (categoryId: string) => {
    if (!storeId) return;
    try {
      const fetchedProducts = await fetchProductsForStore(storeId);
      setProducts(fetchedProducts ?? []);
    } catch (error) {
      toast.error("Failed to fetch products.");
    }
  };

  const handleAddProduct = async () => {
    if (!storeId || !formData.catalogueProductName.trim() || !formData.catalogueCategoryId) {
      toast.error("Store ID, product name, and category are required!");
      return;
    }
    try {
      const newProduct = {
        ...formData,
        catalogueCategoryName: categories.find(
          (cat) => cat.catalogueCategoryId === formData.catalogueCategoryId
        )?.catalogueCategoryName,
      };
      await addProductToCategory(storeId, formData.catalogueCategoryId, newProduct);
      toast.success("Product added successfully!");
      setIsProductModalOpen(false);

      setFormData({
        catalogueProductName: "",
        productDescription: "",
        productImageUrl: "",
        catalogueCategoryId: "",
        catalogueCategoryName: "",
      });

      fetchProducts(formData.catalogueCategoryId);
    } catch (error) {
      toast.error("Failed to add product.");
    }
  };

  const handleCategoryChange = async (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    if (storeId) {
      try {
        const fetchedProducts = await fetchProductsForStore(storeId);
        const filteredProducts = fetchedProducts.filter(
          (product: Product) => product.catalogueCategoryId === categoryId
        );
        setProducts(filteredProducts); // Now only products from selected category will be shown
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products.");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-5xl">Manage Products</h2>
        <button
          onClick={() => setIsProductModalOpen(true)}
          className="bg-blue-700 text-white px-6 py-3 rounded-md hover:opacity-75"
        >
          + Add Product
        </button>
      </div>

      <div className="mt-6">
      <select
  value={selectedCategoryId || ""}
  onChange={(e) => handleCategoryChange(e.target.value)}
  className="border-2 w-full p-2 rounded-lg mb-2"
>
  <option value="">Select Category</option>
  {categories.map((category) => (
    <option key={category.catalogueCategoryId} value={category.catalogueCategoryId}>
      {category.catalogueCategoryName}
    </option>
  ))}
</select>
      </div>

      <div className="bg-white rounded-lg p-5 mt-4">
        <h3 className="text-3xl font-semibold mb-4">Products</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Category Name</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="border-t text-center">
                  <td className="px-4 py-2">{product.catalogueProductName}</td>
                  <td className="px-4 py-2">{product.productDescription}</td>
                  <td className="px-4 py-2">
                    <img src={product.productImageUrl} alt={product.catalogueProductName} className="h-12 w-12 rounded-lg" />
                  </td>
                  <td className="px-4 py-2">{product.catalogueCategoryName}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                  No products added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Add Product</h2>
              <X className="cursor-pointer" onClick={() => setIsProductModalOpen(false)} />
            </div>
            <input
              type="text"
              value={formData.catalogueProductName}
              onChange={(e) => setFormData({ ...formData, catalogueProductName: e.target.value })}
              placeholder="Product Name"
              className="border-2 w-full p-2 rounded-lg mb-2"
            />
            <button
              onClick={handleAddProduct}
              className="w-full bg-indigo-700 text-white py-2 rounded-lg mt-4 hover:opacity-75"
            >
              Add Product
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
