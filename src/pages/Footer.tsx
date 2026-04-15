import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MapPin, Mail, Phone, Clock, PartyPopper, Bike, Home, ShoppingBag, ScrollText, Lightbulb, Info, PhoneCall } from 'lucide-react';
import { BrandLogo } from '@/components/Navbar';

const Footer = () => {
  
  return (
    <footer className="bg-[#3d1313] text-white mt-20 pt-12 pb-8  translate-y-5 animate-fade-in">
      <div className="container mx-auto md:px-20 px-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Company Info */}
          <div>
            <BrandLogo/>
            <p className="text-gray-400 font-mouse text-2xl dark:text-gray-300 mt-4">
              Ghar ka khana just the way you want.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/', label: 'Home', Icon: Home },
                // { to: '/shop', label: 'Products', Icon: ShoppingBag },
                { to: '/terms-and-conditions', label: 'Terms & Conditions', Icon: ScrollText },
                { to: '/concept', label: 'Concept', Icon: Lightbulb },
                { to: '/about', label: 'About', Icon: Info },
                { to: '/contact', label: 'Contact', Icon: PhoneCall },
              ].map(({ to, label, Icon }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-gray-400 dark:text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-4 group"
                  >
                    <Icon className="text-orange-500 group-hover:scale-110 transition-transform" size={20} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-4 group transition-all duration-300 hover:translate-x-1">
                <MapPin className="text-orange-500 mt-1 group-hover:scale-110 transition-transform" size={20} />
                <span className="text-gray-400 dark:text-gray-300 group-hover:text-white transition-colors leading-relaxed">
                  <strong className="text-white">Office Address:</strong><br />

                  Saibaba Nagar<br />
                  Borivali West, Mumbai,<br />
                  Maharashtra – 400092
                </span>
              </li>
              <li className="flex items-center gap-4 group hover:translate-x-1 transition-all duration-300">
                <Mail className="text-orange-500 group-hover:scale-110 transition-transform" size={20} />
                <a href="mailto:govindashah603@gmail.com" className="text-gray-400 dark:text-gray-300 group-hover:text-white transition-colors">
                  govindashah603@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-4 group hover:translate-x-1 transition-all duration-300">
                <Phone className="text-orange-500 group-hover:scale-110 transition-transform" size={20} />
                <a href="tel:+917045617506" className="text-gray-400 dark:text-gray-300 group-hover:text-white transition-colors">
                  +91 7045617506
                </a>
              </li>
            </ul>
          </div>

          {/* Timing & Party Orders */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Business Hours</h4>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-4 group transition-all duration-300">
                <Clock className="text-orange-500 mt-1 group-hover:scale-110 transition-transform" size={20} />
                <div className="text-gray-400 dark:text-gray-300 leading-relaxed">
                  <p className="text-white font-semibold mb-2">Delivery Timings:</p>
                  <p>Morning: 11:00 AM - 2:00 PM</p>
                  <p>Evening: 8:00 PM - 12:00 AM</p>
                </div>
              </li>
              <li className="flex items-start gap-4 group transition-all duration-300">
                <PartyPopper className="text-orange-500 mt-1 group-hover:scale-110 transition-transform" size={20} />
                <div className="text-gray-400 dark:text-gray-300 leading-relaxed">
                  <p className="text-white font-semibold mb-2">Party Orders:</p>
                  <p>We accept bulk & party orders!</p>
                  <a
                    href="tel:+917045617506"
                    className="inline-block mt-1 text-orange-500 hover:text-orange-400 transition-colors"
                  >
                    Contact us for details →
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 dark:text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} BITEBOX. No rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
