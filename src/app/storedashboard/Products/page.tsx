"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { addProduct, getProducts } from "../../service/ProductService";
import { getCategories } from "../../service/Category";
interface Product {
  catalogueProductId: string;
  catalogueProductName: string;
  productDescription: string;
  productImageUrl: string;
  catalogueCategoryId: string;
  catalogueCategoryName: string;
}

interface Category {
  catalogueCategoryId: string;
  catalogueCategoryName: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    catalogueProductName: "",
    productDescription: "",
    productImageUrl: "",
    catalogueCategoryId: "",
    catalogueCategoryName: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        toast.error("Failed to fetch data.");
      }
    }
    fetchData();
  }, []);

  const handleAddProduct = async () => {
    if (!formData.catalogueProductName.trim() || !formData.catalogueCategoryId) {
      toast.error("Product name and category are required!");
      return;
    }

    try {
      await addProduct(formData);
      toast.success("Product added successfully!");
      setIsProductModalOpen(false);
      setProducts(await getProducts());
    } catch (error) {
      toast.error("Failed to add product.");
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

      {/* Product List Table */}
      <div className="bg-white rounded-lg p-5 mt-10">
        <h3 className="text-3xl font-semibold mb-4">Products</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Product ID</th>
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Category ID</th>
              <th className="px-4 py-2">Category Name</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.catalogueProductId} className="border-t text-center">
                  <td className="px-4 py-2">{product.catalogueProductId}</td>
                  <td className="px-4 py-2">{product.catalogueProductName}</td>
                  <td className="px-4 py-2">{product.productDescription}</td>
                  <td className="px-4 py-2">
                    <img src={product.productImageUrl} alt={product.catalogueProductName} className="h-12 w-12 rounded-lg" />
                  </td>
                  <td className="px-4 py-2">{product.catalogueCategoryId}</td>
                  <td className="px-4 py-2">{product.catalogueCategoryName}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-2 text-center text-gray-500">
                  No products added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding Product */}
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
              required
            />
            <input
              type="text"
              value={formData.productDescription}
              onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
              placeholder="Product Description"
              className="border-2 w-full p-2 rounded-lg mb-2"
            />
            <input
              type="text"
              value={formData.productImageUrl}
              onChange={(e) => setFormData({ ...formData, productImageUrl: e.target.value })}
              placeholder="Product Image URL"
              className="border-2 w-full p-2 rounded-lg mb-2"
            />
            <select
              value={formData.catalogueCategoryId}
              onChange={(e) => {
                const selectedCategory = categories.find(cat => cat.catalogueCategoryId === e.target.value);
                setFormData({
                  ...formData,
                  catalogueCategoryId: e.target.value,
                  catalogueCategoryName: selectedCategory?.catalogueCategoryName || "",
                });
              }}
              className="border-2 w-full p-2 rounded-lg mb-2"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.catalogueCategoryId} value={category.catalogueCategoryId}>
                  {category.catalogueCategoryName}
                </option>
              ))}
            </select>
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
