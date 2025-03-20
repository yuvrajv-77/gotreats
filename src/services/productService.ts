import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../config/firebaseConfig";
import { customAlphabet } from 'nanoid';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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
          category: doc.data().category,
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

export const uploadProductImage = async (file: File, path: string) => {
  try {
    const storageRef = ref(storage, `${path}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (e) {
    console.error('Error uploading image: ', e);
    throw e;
  }
}

// Add this new function for updating just the product image
export const updateProductImage = async (productId: string, newImageFile: File) => {
  try {
    // Upload the new image
    const storageRef = ref(storage, `ProductImages/${productId}_${newImageFile.name}`);
    const snapshot = await uploadBytes(storageRef, newImageFile);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Update the product document with the new image URL
    const productDoc = doc(db, 'items', productId);
    await updateDoc(productDoc, { imageUrl: downloadURL });
    
    return downloadURL;
  } catch (e) {
    console.error('Error updating product image: ', e);
    throw e;
  }
}


export const addProduct = async (productData: any, imageFile?: File) => {
  try {
    const itemCollectionRef = collection(db, 'items');
    const customId = customAlphabet('1234567890abcdef', 10)();
    
    // let imageUrl = productData.imageUrl;
    // let imageUrl = '';
    
    // if (imageFile) {
    //    imageUrl = await uploadProductImage(imageFile, customId);
    // }
    
    const productDoc = doc(itemCollectionRef, customId);
    await setDoc(productDoc, {
      ...productData,
      // imageUrl,
      createdAt: new Date().toISOString()
    });
    
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
        category: productSnapshot.data().category,
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
