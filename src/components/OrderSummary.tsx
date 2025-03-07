import { CheckCircle, Home, Store } from "lucide-react";
import { IconButton } from "./Button";
import { useState } from "react";

export default function OrderSummary({detailOpen,setDetailOpen}:{detailOpen:boolean,setDetailOpen:Function}) {
    
    return (
        <div onClick={(e) => e.stopPropagation()} className="w-full md:w-1/2 h-full md:h-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-white px-5 py-10 md:p-20 drop-shadow-lg rounded-xl z-50">

            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                    Order <span className="text-gray-600">#188673422455418</span>
                </h2>
                <button className="px-3 py-1 cursor-pointer bg-neutral-200 rounded-lg" onClick={() => setDetailOpen(false)}>x</button>
            </div>

            <div className="mt-4 border-b pb-4">
                <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2"><Store size={19} />gotreats</h3>
                <p className="text-sm text-gray-600">Borivali</p>
                <div className="mt-2 flex flex-col text-sm text-gray-600">
                    <span className="font-semibold text-gray-800 text-lg flex items-center gap-2"><Home size={19} />Home</span>
                    <span className="text-gray-800 font-medium">Raju Rastogi</span>
                    <p>Bhayandar, Shiv Kripa Chawl, Bhayandar East, Mira Bhayandar, Maharashtra, India</p>
                </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle size={16} />
                <p>Delivered on Thu, Nov 26, 2008, 12:04 AM by Osama Bin Laden</p>
            </div>

            <div className="mt-4 border-b pb-4">
                <h3 className="font-medium text-sm text-gray-800">1 ITEM</h3>
                <div className="mt-2 flex justify-between items-center">
                    <p className="text-gray-800">Lucknowi Paneer Subz Biryani - Serves 1 x 2</p>
                    <p className="font-medium">₹538</p>
                </div>
            </div>

            <div className="mt-4 border-b pb-4 text-gray-700 text-sm">
                <div className="flex justify-between py-1">
                    <span>Item Total</span>
                    <span>₹538.00</span>
                </div>
                {/* <div className="flex justify-between py-1">
          <span>Order Packing Charges</span>
          <span>₹25.00</span>
        </div> */}
                {/* <div className="flex justify-between py-1">
          <span>Platform fee</span>
          <span>₹10.00</span>
        </div> */}
                {/* <div className="flex justify-between py-1 text-green-600 font-medium">
          <span>Delivery partner fee</span>
          <span>FREE</span>
        </div> */}
                {/* <div className="flex justify-between py-1 text-red-500 font-medium">
          <span>Discount Applied (BOGO)</span>
          <span>-₹269.00</span>
        </div> */}
                <div className="flex justify-between py-1">
                    <span>Taxes</span>
                    <span>₹16.50</span>
                </div>
            </div>

            <div className="mt-4 flex justify-between text-gray-800 font-semibold text-lg">
                <span>Paid Via Bank</span>
                <span>BILL TOTAL ₹321.00</span>
            </div>
        </div>
    );
}
