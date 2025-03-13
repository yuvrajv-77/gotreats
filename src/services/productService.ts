import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { customAlphabet, nanoid } from 'nanoid'


export const getItemsFromFirestore = async () => {

    try {
      const itemCollectionRef = collection(db, 'items');
      const querySnapshot = (await getDocs(itemCollectionRef));
      const allItems = querySnapshot.docs.map(doc => (  // dont use forEach
        {
          id: doc.id,
          productName: doc.data().productName,
          productDescription: doc.data().productDescription,
          isNonVeg: doc.data().isNonVeg,
          isTiffin: doc.data().isTiffin,
          isChocolate: doc.data().isChocolate,
          createdAt: doc.data().createdAt,
          originalPrice: doc.data().originalPrice,
          offerPrice: doc.data().offerPrice,
          imageUrl: doc.data().imageUrl,
          rating: doc.data().rating,
          isAvailable: doc.data().isAvailable
         
        }

      ));
      return allItems;
  
    } catch (e) {
      console.error('Error getting items: ', e);
    }
  }


  // Add new product
export const addProduct = async (productData: any) => {
  try {
    const itemCollectionRef = collection(db, 'items');
    const customId = customAlphabet('1234567890abcdef', 10)();
    const productDoc = doc(itemCollectionRef, customId);
    await setDoc(productDoc, {
      ...productData,
      createdAt: new Date().toISOString()
    });
    console.log("Product added successfully");
    
    return customId;
  } catch (e) {
    console.error('Error adding product: ', e);
    throw e;
  }
}

export const getProductById = async (productId: string) => {
  try {
    const productDoc = doc(db, 'items', productId);
    const productSnapshot = await getDoc(productDoc);
    
    if (productSnapshot.exists()) {
      return {
        id: productSnapshot.id,
        productName: productSnapshot.data().productName,
        productDescription: productSnapshot.data().productDescription,
        isNonVeg: productSnapshot.data().isNonVeg,
        isTiffin: productSnapshot.data().isTiffin,
        isChocolate: productSnapshot.data().isChocolate,
        createdAt: productSnapshot.data().createdAt,
        originalPrice: productSnapshot.data().originalPrice,
        offerPrice: productSnapshot.data().offerPrice,
        imageUrl: productSnapshot.data().imageUrl,
        rating: productSnapshot.data().rating,
        isAvailable: productSnapshot.data().isAvailable,
       
      };
    }
    return null;
  } catch (e) {
    console.error('Error fetching product: ', e);
    throw e;
  }
}

// Delete product
export const deleteProduct = async (productId: string) => {
  try {
    const productDoc = doc(db, 'items', productId);
    await deleteDoc(productDoc);
    console.log("Product deleted successfully");
    
    return true;
  } catch (e) {
    console.error('Error deleting product: ', e);
    throw e;
  }
}

// Edit product
export const updateProduct = async (productId: string, updatedData: any) => {
  try {
    const productDoc = doc(db, 'items', productId);
    await updateDoc(productDoc, updatedData);
    return true;
  } catch (e) {
    console.error('Error updating product: ', e);
    throw e;
  }
}