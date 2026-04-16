import { IndianRupee, Truck, Star, UtensilsCrossed, ShieldCheck } from 'lucide-react';

const ScrollingBanner = () => {
    const bannerItems = [
        { text: "Affordable Pricing", icon: <IndianRupee size={14} strokeWidth={2.5} /> },
        { text: "Delivered in 1 Hour", icon: <Truck size={14} strokeWidth={2.5} /> },
        { text: "Best Quality", icon: <Star size={14} strokeWidth={2.5} /> },
        { text: "Fresh Every Day", icon: <UtensilsCrossed size={14} strokeWidth={2.5} /> },
        { text: "FSSAI Certified", icon: <ShieldCheck size={14} strokeWidth={2.5} /> },
        { text: "Free Delivery nearby", icon: <Truck size={14} strokeWidth={2.5} /> },
    ];

    const tripled = [...bannerItems, ...bannerItems, ...bannerItems];

    return (
        <div className="bg-[var(--brand-charcoal)] overflow-hidden whitespace-nowrap py-3">
            <div className="animate-scroll flex">
                {tripled.map((item, i) => (
                    <span
                        key={i}
                        className="inline-flex items-center gap-2.5 text-[var(--brand-cream)]/50 font-mono text-xs uppercase tracking-widest mx-8"
                    >
                        <span className="text-[var(--brand-flame)]">{item.icon}</span>
                        {item.text}
                        <span className="w-1 h-1 rounded-full bg-[var(--brand-border)] ml-4" />
                    </span>
                ))}
            </div>
        </div>
    );
};

export default ScrollingBanner;