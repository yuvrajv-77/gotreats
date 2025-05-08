export interface CartItem {
  id: string;
  productName: string;
  imageUrl: string;
  offerPrice: number;
  quantity: number;
  
  addedAt: Date; // To track when the item was added to the cart
}