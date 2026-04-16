import { useState, useEffect, useRef } from 'react'
import { ArrowRight, Flame, Star, Clock, Shield, ChevronRight } from 'lucide-react'
import ItemCards from '../components/ItemCards';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { useAuthStore } from '../store/authStore';
import { useProductStore } from '../store/productStore';
import NavigationButton from '../components/NavigationButton';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useQuery } from '@tanstack/react-query';
import ScrollingBanner from '../components/ScrollingBanner';
import { motion, useInView } from 'framer-motion';

interface Review {
  id: string;
  name: string;
  work: string;
  place: string;
  review: string;
  avatarUrl: string;
}

const fetchReviews = async (): Promise<Review[]> => {
  const reviewsCollection = collection(db, 'reviews');
  const reviewSnapshot = await getDocs(reviewsCollection);
  return reviewSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Review[];
};

const FadeUp = ({ children, delay = 0, className = '' }: any) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Home = () => {
  const userDetails = useAuthStore((state) => state.userDetails)
  const navigate = useNavigate()
  const products = useProductStore((state) => state.products)
  const [swiperRef, setSwiperRef] = useState(null);

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews'],
    queryFn: fetchReviews,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  const varieties = [
    { id: 1, name: "Paav Bhaaji", img: "/varities/pav2.png", link: "/shop/?tag=paav-bhaaji" },
    { id: 2, name: "Egg Curry", img: "/varities/egg.png", link: "/shop/?tag=meals" },
    { id: 3, name: "Pasta", img: "/varities/pasta.png", link: "/shop/?tag=pasta" },
    { id: 4, name: "Thali", img: "/varities/thali.png", link: "/shop/?tag=meals" },
  ];

  const stats = [
    { value: '500+', label: 'Happy Customers', icon: '😊' },
    { value: '50+', label: 'Menu Items', icon: '🍱' },
    { value: '1 hr', label: 'Delivery Time', icon: '⚡' },
    { value: '4.9★', label: 'Avg Rating', icon: '⭐' },
  ];

  return (
    <main className="min-h-screen bg-[var(--brand-dark)] overflow-hidden">

      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-dark)] via-[#1a1007] to-[var(--brand-dark)]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--brand-flame)]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--brand-amber)]/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="pill pill-flame mb-6 inline-flex"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-flame)] animate-pulse" />
                Now delivering in Borivali
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="font-heading text-5xl md:text-6xl lg:text-7xl text-[var(--brand-cream)] leading-[1.05] mb-6"
              >
                Real food,
                <br />
                <span className="text-[var(--brand-flame)]">cooked with</span>
                <br />
                <span className="font-display italic">love.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-[var(--brand-cream)]/50 text-lg leading-relaxed mb-10 max-w-md"
              >
                Homemade tiffins, hearty curries, and comfort food — delivered fresh to your door in under an hour.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-wrap gap-3"
              >
                <button
                  onClick={() => navigate('/shop')}
                  className="group flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--brand-flame)] text-white font-heading font-semibold hover:bg-[#C94808] transition-all shadow-[0_0_30px_rgba(232,88,10,0.3)] hover:shadow-[0_0_40px_rgba(232,88,10,0.5)] active:scale-[0.97]"
                >
                  Order Now
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/concept')}
                  className="px-6 py-3.5 rounded-xl border border-[var(--brand-border)] text-[var(--brand-cream)]/70 font-heading font-semibold hover:border-[var(--brand-flame)]/40 hover:text-[var(--brand-cream)] transition-colors"
                >
                  Our Story
                </button>
              </motion.div>

              {/* Trust signals */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex items-center gap-6 mt-10"
              >
                <div className="flex items-center gap-2 text-[var(--brand-cream)]/40 text-sm font-mono">
                  <Clock size={14} className="text-[var(--brand-amber)]" />
                  <span>Under 1 hour</span>
                </div>
                <div className="w-px h-4 bg-[var(--brand-border)]" />
                <div className="flex items-center gap-2 text-[var(--brand-cream)]/40 text-sm font-mono">
                  <Shield size={14} className="text-[var(--brand-amber)]" />
                  <span>FSSAI Certified</span>
                </div>
                <div className="w-px h-4 bg-[var(--brand-border)]" />
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--brand-flame)] to-[var(--brand-amber)] border-2 border-[var(--brand-dark)] flex items-center justify-center text-[10px] font-bold text-white">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                  <div className="w-7 h-7 rounded-full bg-[var(--brand-charcoal)] border-2 border-[var(--brand-dark)] flex items-center justify-center text-[10px] font-mono text-[var(--brand-cream)]/60">
                    +
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right — hero image collage */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden lg:block"
            >
              <div className="relative h-[520px]">
                <div className="absolute inset-0 bg-[url(/hero1.jpg)] bg-cover bg-center rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-dark)]/60 to-transparent" />
                </div>
                {/* Floating card */}
                <div className="absolute bottom-6 left-6 right-6 card-glass rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--brand-flame)]/20 flex items-center justify-center text-xl">
                    🍱
                  </div>
                  <div>
                    <p className="text-[var(--brand-cream)] text-sm font-heading font-semibold">Fresh Tiffin Ready</p>
                    <p className="text-[var(--brand-cream)]/50 text-xs font-mono">Arriving in ~45 min</p>
                  </div>
                  <div className="ml-auto">
                    <span className="pill pill-green text-xs">Live</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Scrolling Banner ── */}
      <div className="border-y border-[var(--brand-border)]">
        <ScrollingBanner />
      </div>

      {/* ── Stats ── */}
      <FadeUp>
        <section className="py-16 max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl border border-[var(--brand-border)] p-6 text-center hover:border-[var(--brand-flame)]/30 transition-colors group"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="font-heading text-2xl text-[var(--brand-cream)] mb-1">{stat.value}</div>
                <div className="font-mono text-xs text-[var(--brand-cream)]/40 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>
      </FadeUp>

      {/* ── Why us ── */}
      <FadeUp>
        <section className="py-20 max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="pill pill-amber mb-4 inline-flex">Farm to Table</span>
            <h2 className="font-heading text-4xl md:text-5xl text-[var(--brand-cream)] mt-4">
              Nurture your body with
              <br />
              <span className="font-display italic text-[var(--brand-flame)]">farm-fresh</span> ingredients
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative overflow-hidden rounded-2xl border border-[var(--brand-border)] h-72 hidden md:block">
              <div className="absolute inset-0 bg-[url(/hero2.jpg)] bg-cover bg-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-dark)]/80 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="pill pill-green text-[10px]">100% Fresh</span>
              </div>
            </div>

            {[0, 1].map((col) => (
              <div key={col} className="flex flex-col gap-6">
                {[0, 1].map((row) => (
                  <div
                    key={row}
                    className="flex gap-4 p-5 rounded-2xl border border-[var(--brand-border)] hover:border-[var(--brand-flame)]/30 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[var(--brand-flame)]/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--brand-flame)]/20 transition-colors">
                      <Flame size={18} className="text-[var(--brand-flame)]" />
                    </div>
                    <div>
                      <h3 className="font-heading text-[var(--brand-cream)] text-base mb-1">
                        {['High in Nutrition', 'Zero Preservatives', 'Made Fresh Daily', 'Chef\'s Recipes'][col * 2 + row]}
                      </h3>
                      <p className="text-[var(--brand-cream)]/40 text-sm leading-relaxed">
                        BiteBox proves that nutritious food can be genuinely delicious.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </FadeUp>

      {/* ── Varieties ── */}
      <section className="py-24 bg-[var(--brand-charcoal)] border-y border-[var(--brand-border)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <FadeUp>
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="pill pill-flame mb-3 inline-flex">Our Menu</span>
                <h2 className="font-heading text-4xl md:text-5xl text-[var(--brand-cream)] mt-3">
                  Explore our varieties
                </h2>
              </div>
              <button
                onClick={() => navigate('/shop')}
                className="hidden md:flex items-center gap-2 text-[var(--brand-flame)] font-mono text-sm uppercase tracking-widest hover-underline"
              >
                View all <ChevronRight size={14} />
              </button>
            </div>
          </FadeUp>

          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={24}
            loop={true}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
          >
            {[...varieties, ...varieties].map((v, i) => (
              <SwiperSlide key={i}>
                <button
                  onClick={() => navigate(v.link)}
                  className="group w-full flex flex-col items-center gap-4 p-6 rounded-2xl border border-[var(--brand-border)] hover:border-[var(--brand-flame)]/40 bg-[var(--brand-dark)] hover:bg-[var(--brand-flame)]/5 transition-all"
                >
                  <div className="w-36 h-36 rounded-full overflow-hidden ring-2 ring-[var(--brand-border)] group-hover:ring-[var(--brand-flame)]/40 transition-all">
                    <img src={v.img} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <span className="font-heading text-[var(--brand-cream)]/80 group-hover:text-[var(--brand-cream)] text-base transition-colors">{v.name}</span>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ── Reviews ── */}
      <FadeUp>
        <section className="py-24 max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <span className="pill pill-amber mb-4 inline-flex">Testimonials</span>
            <h2 className="font-heading text-4xl md:text-5xl text-[var(--brand-cream)] mt-4">
              Our customers <span className="font-display italic text-[var(--brand-flame)]">love us</span>
            </h2>
          </div>

          <div className="overflow-hidden">
            <div className="animate-scroll flex gap-6 py-2">
              {[...reviews, ...reviews].map((review, i) => (
                <div
                  key={i}
                  className="flex-none w-72 md:w-80 rounded-2xl border border-[var(--brand-border)] p-6 bg-[var(--brand-charcoal)] hover:border-[var(--brand-flame)]/30 transition-colors"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={12} fill="var(--brand-amber)" stroke="none" />
                    ))}
                  </div>
                  <p className="font-display italic text-[var(--brand-cream)]/80 text-base leading-relaxed mb-6 line-clamp-4">
                    "{review.review}"
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={review.avatarUrl}
                      alt={review.name}
                      className="w-9 h-9 rounded-full object-cover border border-[var(--brand-border)]"
                    />
                    <div>
                      <p className="font-heading text-[var(--brand-cream)] text-sm">{review.name}</p>
                      <p className="font-mono text-[var(--brand-cream)]/40 text-xs">{review.place}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeUp>

      {/* ── CTA Banner ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--brand-flame)]" />
        <div className="absolute inset-0 bg-[url(/varities/thali2.png)] bg-cover bg-center opacity-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-24 text-center">
          <h2 className="font-heading text-4xl md:text-6xl text-white mb-4">
            Ready to eat well?
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-md mx-auto">
            Fresh homemade meals, delivered hot and on time.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/shop')}
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[var(--brand-flame)] font-heading font-bold text-base hover:bg-[var(--brand-cream)] transition-colors active:scale-[0.97]"
            >
              Browse Menu <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-4 rounded-xl border border-white/30 text-white font-heading font-semibold hover:bg-white/10 transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

    </main>
  )
}

export default Home