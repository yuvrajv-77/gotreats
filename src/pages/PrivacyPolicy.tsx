import React, { useEffect } from 'react'

const PrivacyPolicy = () => {

    useEffect(() => window.scrollTo(0, 0), [])
    return (
        <div className='max-w-full'>
            <div className='bg-orange-500 text-center py-10'>
                <h1 className='lancelot text-5xl text-white'>Privacy Policy</h1>
            </div>
            <div className='container mx-auto px-4 md:px-8 lg:px-16 flex flex-col justify-center gap-5 text-sm py-8'>
                <p><strong>Last Updated: May 10, 2025</strong></p>
                <p>
                    At GoTreats, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our online food ordering and delivery services.
                </p>
                <h2 className='text-lg font-bold'>Information We Collect:</h2>
                <ul className='list-disc list-inside space-y-2'>
                    <li><strong>Personal Identification Information:</strong> This may include your name, email address, phone number, and delivery address.</li>
                    <li><strong>Payment Information:</strong> We collect necessary payment details (e.g., credit/debit card information, UPI details) to process your orders. This information is securely processed by our payment gateway providers (RazorPay) and is not stored by us.</li>
                    <li><strong>Order Information:</strong> Details of the food items you order, order history, and any special instructions.</li>
                    <li><strong>Device and Usage Information:</strong> We may collect information about your device (e.g., IP address, browser type, operating system) and how you interact with our website or mobile application (e.g., pages visited, time spent).</li>
                    <li><strong>Communications:</strong> Records of your communication with us, including inquiries and feedback.</li>
                </ul>
                <h2 className='text-lg font-bold'>How We Use Your Information:</h2>
                <ul className='list-disc list-inside space-y-2'>
                    <li>To process and fulfill your orders, including delivery of your Go Treats.</li>
                    <li>To manage your account and provide customer support related to your Go Treats orders.</li>
                    <li>To personalize your experience and offer relevant Go Treats recommendations.</li>
                    <li>To communicate with you about your orders, promotions, and updates from Go Treats (with your consent where required).</li>
                    <li>To improve our Services and develop new Go Treats offerings.</li>
                    <li>To detect and prevent fraud and ensure the security of our Go Treats platform.</li>
                    <li>To comply with legal obligations.</li>
                </ul>
                <h2 className='text-lg font-bold'>Disclosure of Your Information:</h2>
                <ul className='list-disc list-inside space-y-2'>
                    <li><strong>Service Providers:</strong> Third-party vendors who assist us in providing the Services, such as payment processors. These providers are contractually obligated to protect your information.</li>
                    <li><strong>Legal Authorities:</strong> If required by law or legal process, we may disclose your information to government authorities or law enforcement agencies.</li>
                </ul>
                <h2 className='text-lg font-bold'>Data Security:</h2>
                <p>
                    We implement reasonable security measures to protect your personal information from unauthorized access, use, or disclosure. These measures include encryption and firewalls. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
                </p>
                <h2 className='text-lg font-bold'>Your Rights:</h2>
                <p>You may have certain rights regarding your personal information, including the right to:</p>
                <ul className='list-disc list-inside space-y-2'>
                    <li>Access the personal information we hold about you.</li>
                    <li>Request correction of inaccurate or incomplete information.</li>
                    <li>Request deletion of your personal information (subject to legal limitations).</li>
                    <li>Object to the processing of your personal information for certain purposes.</li>
                    <li>Withdraw your consent to marketing communications from Go Treats at any time.</li>
                </ul>
                <p>
                    To exercise these rights, please contact us at <a href="mailto:govindashah603@gmail.com" className='text-blue-500'>govindashah603@gmail.com</a> or call us at <a href="tel:7045617506" className='text-blue-500'>7045617506</a>.
                </p>
            </div>
        </div>
    )
}

export default PrivacyPolicy