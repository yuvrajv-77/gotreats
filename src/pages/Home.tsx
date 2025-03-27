import { useState, useEffect } from 'react'
import Button, { IconButton } from '../components/Button'
import { Locate, MapPin, Phone, Pin } from 'lucide-react'
import ItemCards from '../components/ItemCards';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { useAuthStore } from '../store/authStore';
import { useProductStore } from '../store/productStore';
import CountUp from 'react-countup';
import NavigationButton from '../components/NavigationButton';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useQuery } from '@tanstack/react-query';

// Define the Review interface
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

const Home = () => {
    const userDetails = useAuthStore((state) => state.userDetails)
    const navigate = useNavigate()
    const products = useProductStore((state) => state.products)
    const [swiperRef, setSwiperRef] = useState(null);

    const [loading, setLoading] = useState(true);

    const { data: reviews = [], isLoading, error } = useQuery({
        queryKey: ['reviews'],
        queryFn: fetchReviews,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false
    });


    const varieties = [
        {
            id: 1,
            name: "Paav Bhaaji",
            img: "/paavai.webp",
            link: "/shop/?tag=paav-bhaaji"
        },
        {
            id: 2,
            name: "Egg Curry",
            img: "egg.jpg",
            link: "/shop/?tag=meals"
        },
        {
            id: 3,
            name: "Pasta",
            img: "/pasta.jpg",
            link: "/shop/?tag=pasta"
        },
        {
            id: 4,
            name: "Meals",
            img: "meal.jpg",
            link: "/shop/?tag=meals"
        }
    ]

    return (
        <main className="min-h-[calc(100vh-64px)] w-full">

            <section className='bg-[#fff9f2] '>
                <div className="container mx-auto px-4 py-30 md:justify-between  gap-10 md:gap-0  sm:px-30 flex flex-col md:flex-row items-center  ">

                    {/* Left Column */}
                    <div className="w-full  md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left ">
                        <h1 className="text-6xl sm:text-7xl lg:text-8xl lancelot mb-4 text-gray-900 animate-[fadeIn_0.6s_ease-out]">
                            <span className="text-green-600">Enjoy Delicious</span> &{' '}
                            <span className="text-orange-500">Tasty Meals</span>
                        </h1>

                        <p className="text-gray-600 text-base sm:text-lg lg:text-2xl mb-6 sm:mb-8 max-w-lg animate-[fadeIn_0.5s_ease-in]">
                            Order a healthy and well-balanced meal. It's all homemade… "Ghar ka khana just the way you want.".
                        </p>
                        <button className="cssbuttons-io" onClick={() => navigate("/shop")}>
                            <span>
                                {/* Optional SVG icon */}
                                {/* <svg ... /> */}
                                Order Now
                            </span>
                        </button>

                    </div>

                    {/* Right Column */}
                    <div className="w-full md:w-2/5 md:mt-0 animate-[fadeIn_0.7s_ease-in]">
                        <img
                            src="/indian-plate.png"
                            alt="Blog Hero Image"
                            className="object-cover w-full rounded-2xl transition-all duration-500 h-auto rotate-infinite"
                        />
                    </div>

                </div>
            </section>

            {/* -------- Impact / Metrics Section -------- */}
            <section className='bg-gradient-to-br from-green-50 to-green-100 py-20 mt-20 w-full'>
                <div className='container mx-auto text-center px-4'>
                    <h2 className='text-4xl sm:text-5xl font-bold lancelot mb-12 text-green-800'>
                        Our Growing Presence
                    </h2>

                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10'>
                        {/* Countries */}
                        <div className='bg-white rounded-xl shadow-md p-8 hover:scale-105 transition'>
                            <h3 className='text-6xl font-bold text-green-600'>
                                <CountUp end={24} duration={3} />+
                            </h3>
                            <p className='text-lg mt-3 text-gray-700'>Countries Served</p>
                        </div>

                        {/* Food Items */}
                        <div className='bg-white rounded-xl shadow-md p-8 hover:scale-105 transition'>
                            <h3 className='text-6xl font-bold text-green-600'>
                                <CountUp end={150} duration={3} />+
                            </h3>
                            <p className='text-lg mt-3 text-gray-700'>Food Varieties</p>
                        </div>

                        {/* Customers */}
                        <div className='bg-white rounded-xl shadow-md p-8 hover:scale-105 transition'>
                            <h3 className='text-6xl font-bold text-green-600'>
                                <CountUp end={2000} duration={3} separator=',' />+
                            </h3>
                            <p className='text-lg mt-3 text-gray-700'>Happy Customers</p>
                        </div>

                        {/* Orders Served (new metric example) */}
                        <div className='bg-white rounded-xl shadow-md p-8 hover:scale-105 transition'>
                            <h3 className='text-6xl font-bold text-green-600'>
                                <CountUp end={5000} duration={3} separator=',' />+
                            </h3>
                            <p className='text-lg mt-3 text-gray-700'>Orders Served</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* -----reviews----- */}
            <section className='bg-white mt-20 w-full'>
                <div className='container mx-auto py-14 md:py-20'>
                    <h1 className='text-center mb-10 lancelot text-5xl sm:text-6xl lg:text-7xl flex items-center justify-center'>
                        Happy Customers
                    </h1>


                    {/* Navigation Arrows */}
                    <div className='relative'>
                        <div className='absolute left-0 top-1/2 -translate-y-1/2 z-10'>
                            <button className="swiper-button-prev-custom bg-green-600 hover:bg-green-700 text-white text-2xl px-4 py-2 rounded-full shadow-lg transition duration-300 ease-in-out hover:scale-110">
                                &lt;
                            </button>
                        </div>
                        <div className='absolute right-0 top-1/2 -translate-y-1/2 z-10'>
                            <button className="swiper-button-next-custom bg-green-600 hover:bg-green-700 text-white text-2xl px-4 py-2 rounded-full shadow-lg transition duration-300 ease-in-out hover:scale-110">
                                &gt;
                            </button>
                        </div>

                        <Swiper
                            modules={[Autoplay, Navigation]}
                            spaceBetween={10}
                            loop={true}
                            navigation={{
                                prevEl: '.swiper-button-prev-custom',
                                nextEl: '.swiper-button-next-custom',
                            }}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                            }}
                        >
                            {reviews.map((review, index) => (
                                <SwiperSlide key={index}>
                                    <div className='flex flex-col items-center justify-center md:mx-50 mx-3 bg-green-50 p-10 rounded-xl shadow-lg'>
                                        <img src={review.avatarUrl} className='size-28 border-2 border-green-600 p-1 md:size-30 object-cover rounded-full' alt="" />
                                        <h2 className='text-xl md:text-2xl my-3 font-semibold'>{review.name}</h2>
                                        <p className='text-gray-600'>{review.work}</p>
                                        <h1 className='text-2xl md:text-3xl tracking-wide lancelot text-center font-bold text-slate-800 my-8 leading-normal'>
                                            " {review.review} "
                                        </h1>
                                        <div className='flex items-center gap-5'>
                                            <p className='text-orange-500 flex items-center gap-2'><MapPin /> {review.place}</p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </section>


            {/* -------info----- */}
            <section className='bg-[#fff9f2] '>
                <div className="container mx-auto px-4 pt-3 mt-12 gap-10 md:gap-0  sm:px-30 md:justify-between flex flex-col md:flex-row items-center  ">
                    <div className="w-full md:w-2/5     animate-[fadeIn_0.7s_ease-in]">
                        <img
                            src="/pav2.png"
                            alt="Blog Hero Image"
                            className="object-cover w-full rounded-2xl  hover:scale-101 transition-all duration-500   h-auto"
                        />
                    </div>

                    <div className="w-full  md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left ">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl lancelot mb-4 text-gray-900 animate-[fadeIn_0.6s_ease-out]">
                            We Provide
                            Healthy food
                        </h1>
                        <p className="text-gray-600 text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-lg animate-[fadeIn_0.5s_ease-in]">
                            Food For Us Comes From Our Relatives, Whether They
                            Have Wings Or Fins Or Roots. That IS How We Consider
                            Food. Food Has A Culture. It Has A History, It Has A
                            Story. It Has Relationships
                        </p>
                    </div>
                </div>
            </section>

            {/* ------varieties------ */}
            <section>
                <div className='container mx-auto py-14  md:py-20'>
                    <h1 className='text-center my-13 lancelot text-5xl sm:text-6xl lg:text-7xl flex items-center justify-center'>Explore Our Varities</h1>
                    <div className=' grid grid-cols-2 md:grid-cols-4 gap-5'>
                        {
                            varieties.map(variety => (
                                <div
                                    key={variety.id}
                                    onClick={() => navigate(variety.link)}
                                    className='p-2 flex flex-col items-center gap-4 cursor-pointer'
                                >
                                    <div className='hover:scale-105 transition-all duration-300 ease-in'>
                                        <img className='rounded-full object-cover size-40 md:size-44' src={variety.img} alt={variety.name} />
                                    </div>
                                    <p className='text-2xl font-semibold lancelot'>{variety.name}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>

            {/* -----popular dishes----- */}
            <section className='bg-[#fff9f2] py-10 md:py-20 mt-10'>
                <h1 className='text-center my-10 lancelot text-5xl sm:text-6xl lg:text-7xl flex items-center justify-center'>Popular Dishes</h1>
                <div className='mx-2 md:mx-40'>
                    <Swiper className=''
                        spaceBetween={40}
                        modules={[Navigation, Autoplay]}
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: true,
                        }}
                        breakpoints={{
                            // when window width is >= 768px (md)
                            768: {
                                slidesPerView: 3
                            },
                            // when window width is < 768px
                            0: {
                                slidesPerView: 1
                            }
                        }}
                        onSwiper={setSwiperRef}>

                        {products?.slice(0, 5).map((item, index) => (
                            <SwiperSlide key={index}>
                                <ItemCards item={item} key={index} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className='flex justify-center my-5'>
                        <NavigationButton swiper={swiperRef} />
                    </div>
                    <div className="flex justify-center w-full">
                        <button onClick={() => navigate('/shop')} className="shop-all-btn w-1/2 md:w-36">
                            Check All
                        </button>
                    </div>

                </div>
            </section>
        </main>
    )
}

export default Home