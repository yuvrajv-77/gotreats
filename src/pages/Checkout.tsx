  import { useEffect, useState } from 'react'
  import Button, { IconButton } from '../components/Button';
  import { Cart } from '../components/Cart';
  import { useCartStore } from '../store/cartStore';
  import { useNavigate } from 'react-router-dom';
  import { useAuthStore } from '../store/authStore';
  import { handleCheckout } from '../services/orderService';
  import { updateUserAddress } from '../services/authService';
  import toast from 'react-hot-toast';
  import { Trash } from 'lucide-react';







  const DELIVERY_PRICE = 40;
  const TAX_RATE = 0.18;




  const Checkout = () => {
      const { items, grossTotalPrice, totalPrice, calculateGrossTotalPrice, calculateTotalPrice } = useCartStore()
      const navigate = useNavigate()
      const userDetails = useAuthStore((state) => state.userDetails)
      const [address, setAddress] = useState(userDetails?.address || '');
      const [isEditingAddress, setIsEditingAddress] = useState(false);
      const [loading, setLoading] = useState(false);
      const [note, setNote] = useState('');



      useEffect(() => {
          calculateGrossTotalPrice();
          calculateTotalPrice(DELIVERY_PRICE, TAX_RATE);
      }, [items, calculateGrossTotalPrice, calculateTotalPrice]);


      useEffect(() => {
          // Update address when userDetails changes
          if (userDetails?.address) {
              setAddress(userDetails.address);
          }
      }, [userDetails]);

      const handleAddressSubmit = async () => {
          try {
              setLoading(true);
              if (userDetails?.uid) {
                  await updateUserAddress(userDetails.uid, address);
                  setIsEditingAddress(false);
                  toast.success('Address updated successfully');
              }
          } catch (error) {
              console.error("Failed to update address:", error);
              toast.error('Failed to update address');
          }
          setLoading(false);
      }





      const handlePaymentClick = async () => {
          const {user, userDetails } = useAuthStore.getState();


          if (!user || !address || !userDetails.phoneNumber) {
              toast.error('Cannot Process Payment Without Address and Phone Number');
              return;
          }

          const orderDetails = {
              items: items,
              totalAmount: totalPrice,
              deliveryAddress: address,
              customer: userDetails,
              note: note
          };



          const success = await handleCheckout(orderDetails);

          if (success) {
              useCartStore.getState().clearCart();
              toast.success('Order placed successfully');
              navigate('/');
          }
      };





      if (items.length === 0) {
          return (
              <div className='flex md:bg-gray-100 items-center justify-center h-[80vh] '>
                  <div className='flex flex-col gap-5 '>
                      <img src="/shopping.png" className='w-2/3 mx-auto' alt="" />
                      <p className='text-2xl font-semibold text-center'>Your cart is empty.</p>
                      <Button onClick={() => navigate('/shop')}>Go to Shop</Button>
                  </div>
              </div>
          );
      }
      return (
          <div className='md:bg-gray-100 pb-20'>
              <div className='md:w-2/4 px-5 mx-auto'>
                  <h1 className='text-3xl md:text-4xl font-semibold lancelot py-5 text-gray-700'>Checkout</h1>
                  <div className='flex flex-col gap-5 border-green-300'>






                      {/* box 1 */}
                      <div className='md:p-6 bg-white w-full'>
                          <div className='flex items-center justify-between'>
                              <h3 className='text-xl font-bold'>Cart ({items.reduce((total, item) => total + item.quantity, 0)})</h3>
                              <IconButton onClick={() => useCartStore.getState().clearCart()}><Trash /></IconButton>
                          </div>
                          <Cart />
                      </div>
                      <hr className='md:hidden block' />
                      <div className='md:p-6 bg-white w-full'>
                          <div className='flex items-center justify-between'>
                             <input type="text" value={note} onChange={(e) => setNote(e.target.value)}
                             className={`border border-gray-300 rounded-xl p-2 w-full bg-white`} placeholder='Add Cooking Note' />
                          </div>
                      </div>
                      <hr className='md:hidden block' />

                      {/* box 2 */}
                      <div className='md:p-6 bg-white w-full'>
                          <div className='flex mb-2 items-center justify-between'>
                              <h3 className='text-xl mb-2 font-bold'>Deliver To</h3>
                              {address && (
                                  <Button onClick={() => {
                                      if (isEditingAddress) {
                                          handleAddressSubmit();
                                      } else {
                                          setIsEditingAddress(!isEditingAddress);
                                      }
                                  }} disabled={loading}>
                                      {isEditingAddress ? 'Save Address' : 'Edit Address'}
                                  </Button>
                              )}
                          </div>


                          {/* Addresses */}
                          <div className="flex md:flex-row flex-col gap-2 flex-wrap">
                              <div className="flex items-start w-full">
                                  <div className='w-full'>
                                      {!address && !userDetails?.phoneNumber ? (
                                          <div className="space-y-4">
                                              <p className="text-gray-600">No address found. Please Complete Your Profile.</p>
                                              <p className="text-gray-600">No Phone Number found.</p>
                                              <Button onClick={() => navigate('/profile')}>Complete Profile</Button>
                                          </div>
                                      ) : !address && !isEditingAddress ? (
                                          <div className="space-y-4">
                                              <p className="text-gray-600">No address found. Please add your address.</p>
                                              <Button onClick={() => setIsEditingAddress(true)}>Add Address</Button>
                                          </div>
                                      ) : (
                                          <div className='w-full'>
                                              <textarea
                                                  value={address}
                                                  disabled={!isEditingAddress}
                                                  onChange={(e) => setAddress(e.target.value)}
                                                  className={`border border-gray-300 rounded-xl p-2 w-full ${!isEditingAddress ? 'bg-gray-50' : 'bg-white'}`}
                                                  placeholder='Enter your Full Address'
                                              />
                                              {isEditingAddress && (
                                                  <Button
                                                      className="mt-4 mr-2"
                                                      disabled={loading}
                                                      onClick={handleAddressSubmit}
                                                  >
                                                      Save Address
                                                  </Button>
                                              )}
                                              {isEditingAddress && (
                                                  <Button
                                                      className="mt-4"
                                                      onClick={() => {
                                                          setIsEditingAddress(false);
                                                          setAddress(userDetails?.address || '');
                                                      }}
                                                  >
                                                      Cancel
                                                  </Button>
                                              )}
                                          </div>
                                      )}
                                  </div>
                              </div>
                          </div>
                      </div>
                      <hr className='md:hidden block' />
                      {/* box 3 */}
                      <div className='md:p-6 bg-white w-full mb-10'>
                          <h3 className='text-xl mb-4 font-bold'>Bill Details</h3>
                          <div className='px-10 md:px-20 text-gray-600 text-sm md:text-base space-y-2'>
                              <div className='flex justify-between'>
                                  <p>Total Items </p>
                                  <p>{items.reduce((total, item) => total + item.quantity, 0)}</p>
                              </div>
                              <div className='flex justify-between'>
                                  <p>Gross Total </p>
                                  <p>₹{grossTotalPrice}</p>
                              </div>
                              <div className='flex justify-between'>
                                  <p>GST </p>
                                  <p>₹{(grossTotalPrice * TAX_RATE).toFixed(2)}</p>
                              </div>
                              <div className='flex justify-between'>
                                  <p>Delivery Charge</p>
                                  <p>₹{DELIVERY_PRICE}</p>
                              </div>
                              <hr className='my-2' />
                              <div className='flex justify-between text-2xl text-black my-5 md:font-bold'>
                                  <p>To Pay</p>
                                  <p>₹{totalPrice}</p>
                              </div>


                              <Button onClick={handlePaymentClick} className='w-full'>Continue to Payment</Button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )
  }







  declare global {
      interface Window {
          Razorpay: any
      }
  }

















































































































































  export default Checkout