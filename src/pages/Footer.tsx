
import React from 'react';

import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-neutral-900 text-white mt-20 pt-12 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className=''>
                        <Link to={'/'}><p className='comfortaa font-bold tracking-tighter text-2xl lg:text-3xl text-orange-600'><span className='text-green-500'>go</span>treats</p></Link>

                        <p className="text-gray-400 mt-4">
                            Ghar ka khana just the way you want.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                            <li><Link to="/products" className="text-gray-400 hover:text-white">Products</Link></li>
                            <li><Link to="/terms-and-conditions" className="text-gray-400 hover:text-white">Terms and Conditions</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                        <ul className="text-gray-400 space-y-2">
                            <li>Room No.6,Ratnabai Chawl</li>
                            <li>Saibaba Nagar,Behind Nehru Garden,</li>
                            <li>Borivali West, Mumbai</li>
                            <li>Maharashtra, PIN: 400092</li>
                            <li>govindashah603@gmail.com</li>
                            <li>+91-7045617506</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Delivery Service</h4>
                        <ul className="text-gray-400 space-y-2">
                            <li>Kandivali</li>
                            <li>Borivali</li>
                            <li>Dahisar</li>
                            <li>Malad</li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} GoTreats. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
