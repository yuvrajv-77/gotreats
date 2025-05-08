import { CheckCircle, Home, Store } from "lucide-react";


export default function OrderSummary({detailOpen, setDetailOpen, order}: {detailOpen: boolean, setDetailOpen: Function, order?: any}) {
    // Group items by category if available
    let groupedItems: Record<string, any[]> = {};
    if (order && order.items && order.items.length > 0) {
        order.items.forEach((item: any) => {
            const cat = item.category || 'Other';
            if (!groupedItems[cat]) groupedItems[cat] = [];
            groupedItems[cat].push(item);
        });
    }
    return (
        <div onClick={(e) => e.stopPropagation()} className="w-full md:w-1/2 h-full md:h-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-white px-5 py-10 md:p-20 drop-shadow-lg rounded-xl z-50">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                    Order <span className="text-gray-600">#{order ? order.id.slice(-6) : '188673422455418'}</span>
                </h2>
                <button className="px-3 py-1 cursor-pointer bg-neutral-200 rounded-lg" onClick={() => setDetailOpen(false)}>x</button>
            </div>
            <div className="mt-4 border-b pb-4">
                <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2"><Store size={19} />gotreats</h3>
                <p className="text-sm text-gray-600">{order?.addressDetails?.area || 'Borivali'}</p>
                <div className="mt-2 flex flex-col text-sm text-gray-600">
                    <span className="font-semibold text-gray-800 text-lg flex items-center gap-2"><Home size={19} />Home</span>
                    <span className="text-gray-800 font-medium">Customer: {order?.customer?.displayName || order?.customer?.name || 'N/A'}</span>
                    <p>{order?.deliveryAddress || 'Bhayandar, Shiv Kripa Chawl, Bhayandar East, Mira Bhayandar, Maharashtra, India'}</p>
                </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle size={16} />
                <p>{order ? `Paid on ${new Date(order.orderDate).toLocaleString()}` : 'Delivered on Thu, Nov 26, 2008, 12:04 AM by Osama Bin Laden'}</p>
            </div>
            <div className="mt-4 border-b pb-4">
                <h3 className="font-medium text-sm text-gray-800">Order Items</h3>
                <div className="mt-2 flex flex-col gap-2">
                    {order && Object.keys(groupedItems).length > 0 ? (
                        Object.entries(groupedItems).map(([cat, items]) => (
                            <div key={cat} className="mb-2">
                                <div className="font-semibold text-orange-600 text-sm mb-1">{cat}</div>
                                {items.map((item: any) => (
                                    <div key={item.id} className="flex justify-between items-center pl-2">
                                        <span>{item.productName} x {item.quantity}</span>
                                        <span>₹{item.offerPrice * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <div className="flex justify-between items-center">
                            <p className="text-gray-800">No items found</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-4 border-b pb-4 text-gray-700 text-sm">
                <div className="flex justify-between py-1">
                    <span>Item Total</span>
                    <span>₹{order ? order.grossTotalPrice || order.totalAmount : '538.00'}</span>
                </div>
                <div className="flex justify-between py-1">
                    <span>Taxes</span>
                    <span>₹{order ? ((order.grossTotalPrice || order.totalAmount) * 0.18).toFixed(2) : '16.50'}</span>
                </div>
            </div>
            <div className="mt-4 flex justify-between text-gray-800 font-semibold text-lg">
                <span>Paid Via Razorpay</span>
                <span>BILL TOTAL ₹{order ? order.totalAmount : '321.00'}</span>
            </div>
        </div>
    );
}
