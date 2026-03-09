/**
 * Product Service
 * ===============
 * This service handles all product-related operations with Firebase.
 * It provides CRUD operations for products:
 * - Create: Add new products with images
 * - Read: Fetch all products or single product
 * - Update: Modify existing product details
 * - Delete: Remove products from database
 * 
 * Also handles image uploads to Firebase Storage.
 */

import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    getDoc,
    query,
    orderBy,
    where
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';

// Collection reference for products
const productsCollection = collection(db, 'products');

/**
 * Upload product image to Firebase Storage
 * @param {File} file - The image file to upload
 * @param {string} productId - The product ID for naming the file
 * @returns {Promise<string>} - The download URL of the uploaded image
 */
export const uploadProductImage = async (file, productId) => {
    try {
        // Create a unique filename using product ID and timestamp
        const fileName = `products/${productId}_${Date.now()}_${file.name}`;
        const storageRef = ref(storage, fileName);

        // Upload the file
        const snapshot = await uploadBytes(storageRef, file);

        // Get and return the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

/**
 * Delete an image from Firebase Storage
 * @param {string} imageUrl - The URL of the image to delete
 */
export const deleteProductImage = async (imageUrl) => {
    try {
        if (imageUrl) {
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        // Don't throw - image might already be deleted
    }
};

/**
 * Add a new product to the database
 * @param {Object} productData - The product data to add
 * @param {File} imageFile - Optional image file to upload
 * @returns {Promise<Object>} - The created product with ID
 */
export const addProduct = async (productData, imageFile = null) => {
    try {
        // Add product to Firestore first to get the ID
        const docRef = await addDoc(productsCollection, {
            ...productData,
            imageUrl: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        let imageUrl = null;

        // If image file is provided, upload it
        if (imageFile) {
            imageUrl = await uploadProductImage(imageFile, docRef.id);
            // Update the product with the image URL
            await updateDoc(docRef, { imageUrl });
        }

        return {
            id: docRef.id,
            ...productData,
            imageUrl
        };
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
};

/**
 * Get all products from the database
 * @returns {Promise<Array>} - Array of all products
 */
export const getAllProducts = async () => {
    try {
        const q = query(productsCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

/**
 * Get a single product by ID
 * @param {string} productId - The ID of the product to fetch
 * @returns {Promise<Object|null>} - The product object or null if not found
 */
export const getProductById = async (productId) => {
    try {
        const productDoc = await getDoc(doc(db, 'products', productId));

        if (productDoc.exists()) {
            return {
                id: productDoc.id,
                ...productDoc.data()
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};

/**
 * Get products by brand
 * @param {string} brand - The brand name to filter by
 * @returns {Promise<Array>} - Array of products from the specified brand
 */
export const getProductsByBrand = async (brand) => {
    try {
        const q = query(productsCollection, where('brand', '==', brand));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching products by brand:', error);
        throw error;
    }
};

/**
 * Update an existing product
 * @param {string} productId - The ID of the product to update
 * @param {Object} productData - The updated product data
 * @param {File} newImageFile - Optional new image file
 * @returns {Promise<Object>} - The updated product
 */
export const updateProduct = async (productId, productData, newImageFile = null) => {
    try {
        const productRef = doc(db, 'products', productId);

        let updateData = {
            ...productData,
            updatedAt: new Date().toISOString()
        };

        // If new image is provided, upload it
        if (newImageFile) {
            const newImageUrl = await uploadProductImage(newImageFile, productId);
            updateData.imageUrl = newImageUrl;
        }

        await updateDoc(productRef, updateData);

        return {
            id: productId,
            ...updateData
        };
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

/**
 * Delete a product from the database
 * @param {string} productId - The ID of the product to delete
 * @param {string} imageUrl - Optional image URL to delete from storage
 */
export const deleteProduct = async (productId, imageUrl = null) => {
    try {
        // Delete the product document
        await deleteDoc(doc(db, 'products', productId));

        // Delete the associated image if exists
        if (imageUrl) {
            await deleteProductImage(imageUrl);
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

/**
 * Search products by name or brand
 * @param {string} searchTerm - The search term
 * @returns {Promise<Array>} - Array of matching products
 */
export const searchProducts = async (searchTerm) => {
    try {
        // Get all products and filter client-side
        // (Firestore doesn't support full-text search natively)
        const allProducts = await getAllProducts();
        const lowerSearchTerm = searchTerm.toLowerCase();

        return allProducts.filter(product =>
            product.name.toLowerCase().includes(lowerSearchTerm) ||
            product.brand.toLowerCase().includes(lowerSearchTerm) ||
            product.description?.toLowerCase().includes(lowerSearchTerm)
        );
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};
