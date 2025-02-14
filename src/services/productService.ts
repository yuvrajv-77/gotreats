import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export const getItemsFromFirestore = async () => {

    try {
      const itemCollectionRef = collection(db, 'items');
      const querySnapshot = (await getDocs(itemCollectionRef));
      const allItems = querySnapshot.docs.map(doc => (  // dont use forEach
        {
          id: doc.id,
          name: doc.data().name,
          veg: doc.data().veg,
          description: doc.data().description,
          chocolate: doc.data().chocolate,
          createdAt: doc.data().createdAt,
          rating: doc.data().rating,
          price: doc.data().price,
          offerPrice: doc.data().offerPrice,
          image: doc.data().image,
        }

      ));
      return allItems;
  
    } catch (e) {
      console.error('Error getting items: ', e);
    }
  }