import { Link } from 'react-router-dom';
import { Instagram, MapPin, Mail, Phone, Clock, PartyPopper, Home, ScrollText, Lightbulb, Info, PhoneCall } from 'lucide-react';
import { BrandLogo } from '@/components/Navbar';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-[var(--brand-charcoal)] border-t border-[var(--brand-border)] mt-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* Brand */}
                    <div className="md:col-span-1">
                        <BrandLogo />
                        <p className="font-mono text-[var(--brand-cream)]/40 text-sm mt-4 leading-relaxed">
                            Ghar ka khana,<br />just the way you want.
                        </p>
                        <div className="flex gap-3 mt-6">
                            <a
                                href="https://wa.me/917045617506"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-xl border border-[var(--brand-border)] flex items-center justify-center text-[var(--brand-cream)]/40 hover:border-[var(--brand-flame)]/40 hover:text-[var(--brand-flame)] transition-colors"
                            >
                                <svg width="15" height="15" fill="currentColor" viewBox="0 0 448 512">
                                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <p className="font-mono text-[10px] text-[var(--brand-cream)]/30 uppercase tracking-widest mb-5">Navigation</p>
                        <ul className="space-y-3">
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/terms-and-conditions', label: 'Terms & Conditions' },
                                { to: '/concept', label: 'Concept' },
                                { to: '/about', label: 'About' },
                                { to: '/contact', label: 'Contact' },
                            ].map(({ to, label }) => (
                                <li key={label}>
                                    <Link
                                        to={to}
                                        className="text-[var(--brand-cream)]/50 hover:text-[var(--brand-cream)] text-sm font-body transition-colors hover-underline inline-block"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <p className="font-mono text-[10px] text-[var(--brand-cream)]/30 uppercase tracking-widest mb-5">Contact</p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin size={14} className="text-[var(--brand-flame)] mt-0.5 shrink-0" />
                                <span className="text-[var(--brand-cream)]/50 text-sm leading-relaxed">
                                    Saibaba Nagar, Borivali West,<br />Mumbai — 400092
                                </span>
                            </li>
                            <li>
                                <a href="mailto:govindashah603@gmail.com" className="flex items-center gap-3 text-[var(--brand-cream)]/50 hover:text-[var(--brand-cream)] text-sm transition-colors group">
                                    <Mail size={14} className="text-[var(--brand-flame)] shrink-0" />
                                    govindashah603@gmail.com
                                </a>
                            </li>
                            <li>
                                <a href="tel:+917045617506" className="flex items-center gap-3 text-[var(--brand-cream)]/50 hover:text-[var(--brand-cream)] text-sm transition-colors">
                                    <Phone size={14} className="text-[var(--brand-flame)] shrink-0" />
                                    +91 7045617506
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Hours */}
                    <div>
                        <p className="font-mono text-[10px] text-[var(--brand-cream)]/30 uppercase tracking-widest mb-5">Hours</p>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Clock size={14} className="text-[var(--brand-flame)] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-[var(--brand-cream)]/70 text-sm font-heading mb-1">Delivery Windows</p>
                                    <p className="text-[var(--brand-cream)]/40 text-xs font-mono">Morning · 11 AM – 2 PM</p>
                                    <p className="text-[var(--brand-cream)]/40 text-xs font-mono">Evening · 8 PM – 12 AM</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <PartyPopper size={14} className="text-[var(--brand-flame)] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-[var(--brand-cream)]/70 text-sm font-heading mb-1">Party Orders</p>
                                    <a href="tel:+917045617506" className="text-[var(--brand-flame)] text-xs font-mono hover:underline">
                                        Call for bulk orders →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom bar */}
                <div className="border-t border-[var(--brand-border)] mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="font-mono text-[var(--brand-cream)]/25 text-xs">
                        © {year} Bitebox · No rights reserved.
                    </p>
                    <div className="flex gap-6">
                        {[
                            { to: '/privacy-policy', label: 'Privacy' },
                            { to: '/refund-policy', label: 'Refunds' },
                            { to: '/terms-and-conditions', label: 'Terms' },
                        ].map(({ to, label }) => (
                            <Link key={to} to={to} className="font-mono text-xs text-[var(--brand-cream)]/25 hover:text-[var(--brand-cream)]/50 transition-colors">
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;