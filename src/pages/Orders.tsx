import React, { useState } from 'react'
import Button from '../components/Button'
import OrderSummary from '../components/OrderSummary'

const Orders = () => {
    const [detailOpen, setDetailOpen] = useState(false);

    return (
        <div className='md:bg-gray-100 h-screen  '>
            <div className='md:w-2/4 px-5 mx-auto  '>
                <h1 className='text-3xl md:text-4xl font-semibold lancelot py-5 text-gray-700'>Past Orders</h1>
                <div className=' flex flex-col  gap-5  border-green-300'>

                  
                    <div className=' md:p-6 pb-4  bg-white w-full md:border-0 border-b border-neutral-600'>
                        <div className='flex justify-between'>
                            <div>
                                <h4 className='mb-3 text-lg md:text-xl'>Order #134</h4>
                                <span className='font-semibold text-green-600'>Delivered</span>
                                <div className='mt-2'>
                                    <h2 className='text-base '>Butter Chicken Meal  <span className='font-semibold'>X {"2"}</span></h2>
                                    <h2 className='text-base '>Paneer Tikka Masala  <span className='font-semibold'>X {"4"}</span></h2>
                                </div>

                            </div>
                            <div>
                                <p>{"Tuesday 5th May"}</p>
                                <p>{"12:00 PM"}</p>
                            </div>
                        </div>
                        <hr className='my-3 border-gray-300 border-dashed' />
                        <div className='flex justify-between items-center'>
                            <p>Total Paid: <span className='font-semibold'>₹ 400</span></p>
                            <Button onClick={() => setDetailOpen(true)}>View Detail</Button>
                        </div>

                    </div>
                    
                    <div className=' md:p-6  bg-white w-full'>
                        <div className='flex justify-between'>
                            <div>
                                <h4 className='mb-3 text-2xl'>Order #134</h4>
                                <span className='font-semibold text-green-600'>Delivered</span>
                                <div className='mt-2'>
                                    <h2 className='text-base '>Butter Chicken Meal  <span className='font-semibold'>X {"2"}</span></h2>
                                    <h2 className='text-base '>Paneer Tikka Masala  <span className='font-semibold'>X {"4"}</span></h2>
                                </div>

                            </div>
                            <div>
                                <p>{"Tuesday 5th May"}</p>
                                <p>{"12:00 PM"}</p>
                            </div>


                        </div>
                        <hr className='my-3' />
                        <div className='flex justify-between'>
                            <p>Total Paid: <span className='font-semibold'>₹ 400</span></p>
                            <Button>View Detail</Button>
                        </div>

                    </div>

                </div>
            </div>

            {
                detailOpen &&

                <div className=' w-full h-screen fixed backdrop-blur-sm inset-0 z-10 ' onClick={() => setDetailOpen(false)}>
                    <OrderSummary setDetailOpen={setDetailOpen} detailOpen={detailOpen} />
                </div>
            }

        </div>
    )
}

export default Orders