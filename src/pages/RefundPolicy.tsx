import React, { useEffect } from 'react'

const RefundPolicy = () => {

    useEffect(() => window.scrollTo(0, 0), [])
    return (
        <div className='max-w-full'>
            <div className='bg-orange-500 text-center py-10'>
                <h1 className='lancelot text-5xl text-white'>Cancellation and Refund Policy</h1>
            </div>
            <div className='container mx-auto px-4 md:px-8 lg:px-16 flex flex-col justify-center gap-5 text-sm py-8'>
                <p><strong>Effective Date: May 10, 2025</strong></p>
                <p>
                    This Cancellation and Refund Policy outlines the terms and conditions regarding order cancellations and refunds for online food orders placed through GoTreats (the "Services").
                </p>
                <h2 className='text-lg font-bold'>Cancellation Policy:</h2>
                <ul className='list-disc list-inside space-y-2'>
                    <li><strong>Customer Cancellation:</strong> You may be able to cancel your Go Treats order before it has been prepared or dispatched. The specific timeframe for cancellation may vary depending on the preparation time and delivery logistics. Please check the order confirmation or contact our customer support immediately at <a href="tel:7045617506" className='text-blue-500'>7045617506</a> to inquire about cancellation.</li>
                    <li><strong>Our Cancellation:</strong> We reserve the right to cancel your Go Treats order for reasons including, but not limited to:
                        <ul className='list-disc list-inside ml-5 space-y-2'>
                            <li>Unavailability of certain menu items.</li>
                            <li>Delivery limitations to your area.</li>
                            <li>Technical issues or errors in order processing.</li>
                            <li>Suspicion of fraudulent activity.</li>
                            <li>Events outside our control (e.g., extreme weather conditions).</li>
                        </ul>
                        If we cancel your Go Treats order, we will attempt to notify you and provide a full refund of the order amount.
                    </li>
                </ul>
                <h2 className='text-lg font-bold'>Refund Policy:</h2>
                <h3 className='text-md font-semibold'>Eligibility for Refund:</h3>
                <ul className='list-disc list-inside space-y-2'>
                    <li><strong>Order Cancellation by Us:</strong> If we cancel your GoTreats order before delivery.</li>
                    <li><strong>Incorrect Order:</strong> If you receive a Go Treats order that is significantly different from what you ordered. Please notify us immediately with photographic evidence.</li>
                    <li><strong>Damaged or Spoilage:</strong> If your Go Treats are delivered in a damaged condition or are spoiled upon arrival. Please notify us immediately with photographic evidence.</li>
                    <li><strong>Missing Items:</strong> If any items from your Go Treats order are missing. Please notify us immediately.</li>
                </ul>
                <h3 className='text-md font-semibold'>Non-Eligibility for Refund:</h3>
                <ul className='list-disc list-inside space-y-2'>
                    <li>Minor discrepancies in the order (e.g., slight variations in quantity or presentation).</li>
                    <li>Change of mind after the order has been prepared or dispatched.</li>
                    <li>Incorrect delivery address provided by the customer.</li>
                    <li>Food that has been consumed partially or fully.</li>
                </ul>
                <h2 className='text-lg font-bold'>Refund Process:</h2>
                <p>
                    To request a refund for your Go Treats order, please contact our customer support within <strong>[Specify Timeframe, e.g., 1 hour]</strong> of receiving your order at <a href="tel:7045617506" className='text-blue-500'>7045617506</a> or <a href="mailto:govindashah603@gmail.com" className='text-blue-500'>govindashah603@gmail.com</a> with details of the issue and supporting evidence (e.g., photographs).
                </p>
                <p>
                    We will review your request and may require further information. If your refund request is approved, we will process the refund within <strong>[Specify Timeframe, e.g., 5-7 business days]</strong>. The refund will be processed using the original payment method. Please note that it may take additional time for the refund to reflect in your account depending on your bank or payment provider (RazorPay).
                </p>
                <h2 className='text-lg font-bold'>Contact Us:</h2>
                <p>
                    If you have any questions or concerns about our Cancellation and Refund Policy for GoTreats, please contact us at:
                </p>
                <address className='not-italic'>
                    GoTreats<br />
                    Saibaba Nagar, Borivali West, Mumbai - 400092<br />
                    Email: <a href="mailto:govindashah603@gmail.com" className='text-blue-500'>govindashah603@gmail.com</a><br />
                    Phone: <a href="tel:7045617506" className='text-blue-500'>7045617506</a>
                </address>
            </div>
        </div>
    )
}

export default RefundPolicy