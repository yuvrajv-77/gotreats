import { BadgePercent, ChevronRight, Drumstick, Salad, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import ItemCards from '../components/ItemCards';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
    { tag: 'top-picks', label: 'Top Picks', icon: '🔥' },
    { tag: 'meals', label: 'Meals', icon: '🍱' },
    { tag: 'paav-bhaaji', label: 'Pav Bhaji', icon: '🧈' },
    { tag: 'pasta', label: 'Pasta', icon: '🍝' },
    { tag: 'maggi', label: 'Maggi', icon: '🍜' },
    { tag: 'desserts', label: 'Desserts', icon: '🍮' },
    { tag: 'snacks', label: 'Snacks', icon: '🥨' },
    { tag: 'drinks', label: 'Drinks', icon: '🧃' },
    { tag: 'pickles', label: 'Pickles', icon: '🫙' },
];

const Shop = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const tag = searchParams.get('tag');
    const [foodType, setFoodType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const products = useProductStore((state) => state.products);
    const itemQuantity = useCartStore((state) => state.itemCount);

    useEffect(() => {
        if (!tag) navigate('/shop/?tag=top-picks');
        window.scrollTo(0, 0);
    }, []);

    const toggleFoodType = (type: string) => {
        setFoodType(prev => prev === type ? 'all' : type);
    };

    const getFilteredProducts = () => {
        let filtered = products;
        if (foodType === 'veg') filtered = products?.filter(i => !i.isNonVeg);
        else if (foodType === 'non-veg') filtered = products?.filter(i => i.isNonVeg);

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            return filtered?.filter(i =>
                i.productName.toLowerCase().includes(q) ||
                i.category.toLowerCase().includes(q) ||
                i.productDescription.toLowerCase().includes(q)
            );
        }

        if (tag === 'top-picks') return filtered;
        return filtered?.filter(i => {
            const catMap: Record<string, string> = {
                meals: 'Meals', pasta: 'Pasta', maggi: 'Maggi',
                'paav-bhaaji': 'Paav Bhaaji', desserts: 'Desserts',
                snacks: 'Snacks', drinks: 'Drinks', pickles: 'Pickles'
            };
            return catMap[tag!] ? i.category === catMap[tag!] : true;
        });
    };

    const currentCat = CATEGORIES.find(c => c.tag === tag);

    return (
        <div className="min-h-screen bg-[var(--brand-dark)] flex">
            {/* ── Sidebar (desktop) ── */}
            <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-[var(--brand-border)] sticky top-16 h-[calc(100vh-64px)] pt-8 pb-6 px-4">
                <p className="font-mono text-[10px] text-[var(--brand-cream)]/30 uppercase tracking-widest mb-4 px-2">Categories</p>
                <nav className="flex flex-col gap-1">
                    {CATEGORIES.map(({ tag: t, label, icon }) => (
                        <button
                            key={t}
                            onClick={() => navigate(`/shop/?tag=${t}`)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${tag === t
                                    ? 'bg-[var(--brand-flame)]/15 text-[var(--brand-flame)] border border-[var(--brand-flame)]/25'
                                    : 'text-[var(--brand-cream)]/50 hover:text-[var(--brand-cream)] hover:bg-white/4'
                                }`}
                        >
                            <span className="text-base">{icon}</span>
                            <span className="font-heading text-sm">{label}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-[var(--brand-border)]">
                    <p className="font-mono text-[10px] text-[var(--brand-cream)]/30 uppercase tracking-widest mb-3 px-2">Diet</p>
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={() => toggleFoodType('veg')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-heading transition-colors ${foodType === 'veg' ? 'bg-green-500/15 text-green-400 border border-green-500/25' : 'text-[var(--brand-cream)]/50 hover:bg-white/4'}`}
                        >
                            <Salad size={14} /> Veg Only
                        </button>
                        <button
                            onClick={() => toggleFoodType('non-veg')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-heading transition-colors ${foodType === 'non-veg' ? 'bg-red-500/15 text-red-400 border border-red-500/25' : 'text-[var(--brand-cream)]/50 hover:bg-white/4'}`}
                        >
                            <Drumstick size={14} /> Non-Veg
                        </button>
                    </div>
                </div>
            </aside>

            {/* ── Main ── */}
            <div className="flex-1 min-w-0">
                {/* Top bar */}
                <div className="sticky top-16 z-30 bg-[var(--brand-dark)]/95 backdrop-blur border-b border-[var(--brand-border)] px-4 md:px-8 py-4">
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="relative flex-1 max-w-sm">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--brand-cream)]/30" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search dishes..."
                                className="w-full pl-9 pr-8 py-2 bg-[var(--brand-charcoal)] border border-[var(--brand-border)] rounded-xl text-sm text-[var(--brand-cream)] placeholder-[var(--brand-cream)]/30 focus:outline-none focus:border-[var(--brand-flame)]/50 font-body transition-colors"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--brand-cream)]/30 hover:text-[var(--brand-cream)]">
                                    <X size={13} />
                                </button>
                            )}
                        </div>

                        {/* Mobile category pills */}
                        <div className="flex lg:hidden gap-2 overflow-x-auto hide-scrollbar">
                            {CATEGORIES.map(({ tag: t, label }) => (
                                <button
                                    key={t}
                                    onClick={() => navigate(`/shop/?tag=${t}`)}
                                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-heading transition-colors ${tag === t ? 'bg-[var(--brand-flame)] text-white' : 'border border-[var(--brand-border)] text-[var(--brand-cream)]/60 hover:border-[var(--brand-flame)]/30'}`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Mobile diet filter */}
                        <div className="hidden md:flex lg:hidden gap-2">
                            <button
                                onClick={() => toggleFoodType('veg')}
                                className={`px-3 py-1.5 rounded-full text-xs font-heading transition-colors ${foodType === 'veg' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'border border-[var(--brand-border)] text-[var(--brand-cream)]/50'}`}
                            >
                                <Salad size={12} />
                            </button>
                            <button
                                onClick={() => toggleFoodType('non-veg')}
                                className={`px-3 py-1.5 rounded-full text-xs font-heading transition-colors ${foodType === 'non-veg' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'border border-[var(--brand-border)] text-[var(--brand-cream)]/50'}`}
                            >
                                <Drumstick size={12} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 md:px-8 py-8">
                    {/* Heading */}
                    {!searchQuery && (
                        <div className="mb-8">
                            <h1 className="font-heading text-3xl md:text-4xl text-[var(--brand-cream)]">
                                {currentCat?.icon} {currentCat?.label ?? 'All Items'}
                            </h1>
                            <p className="text-[var(--brand-cream)]/40 text-sm font-mono mt-1">
                                {getFilteredProducts()?.length ?? 0} items
                                {foodType !== 'all' && ` · ${foodType} only`}
                            </p>
                        </div>
                    )}

                    {searchQuery && (
                        <div className="mb-8">
                            <h2 className="font-heading text-2xl text-[var(--brand-cream)]">
                                Results for "<span className="text-[var(--brand-flame)]">{searchQuery}</span>"
                            </h2>
                            <p className="text-[var(--brand-cream)]/40 text-sm font-mono mt-1">{getFilteredProducts()?.length ?? 0} found</p>
                        </div>
                    )}

                    {/* Empty state */}
                    {getFilteredProducts()?.length === 0 && (
                        <div className="text-center py-24">
                            <div className="text-5xl mb-4">🍽️</div>
                            <p className="font-heading text-[var(--brand-cream)]/60 text-xl mb-2">Nothing found</p>
                            <p className="font-mono text-[var(--brand-cream)]/30 text-sm">Try a different search or category</p>
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="mt-6 text-[var(--brand-flame)] text-sm font-mono hover:underline">
                                    Clear search
                                </button>
                            )}
                        </div>
                    )}

                    {/* Desktop grid */}
                    <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        <AnimatePresence mode="popLayout">
                            {getFilteredProducts()?.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.96 }}
                                    transition={{ delay: i * 0.04, duration: 0.3 }}
                                >
                                    <ItemCards item={item} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Mobile list */}
                    <div className="md:hidden -mx-4">
                        <AnimatePresence mode="popLayout">
                            {getFilteredProducts()?.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: i * 0.04, duration: 0.25 }}
                                >
                                    <ItemCards item={item} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* ── Floating cart CTA ── */}
            <AnimatePresence>
                {itemQuantity > 0 && (
                    <motion.button
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        onClick={() => { navigate('/checkout'); window.scrollTo(0, 0); }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-[var(--brand-flame)] text-white shadow-[0_8px_32px_rgba(232,88,10,0.4)] hover:bg-[#C94808] transition-all active:scale-[0.97]"
                    >
                        <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-mono text-xs font-bold">{itemQuantity}</span>
                        <span className="font-heading font-semibold">View Cart</span>
                        <ChevronRight size={16} className="opacity-70" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Shop;