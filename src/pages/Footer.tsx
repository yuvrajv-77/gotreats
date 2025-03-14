
import React from 'react';

import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-neutral-900 text-white pt-12 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                            <li><Link to="/about" className="text-gray-400 hover:text-white">Terms and Conditions</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                        <ul className="text-gray-400 space-y-2">
                            <li>123 Shopping Street</li>
                            <li>New York, NY 10001</li>
                            <li>Phone: (555) 123-4567</li>
                            <li>Email: info@shophub.com</li>
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
