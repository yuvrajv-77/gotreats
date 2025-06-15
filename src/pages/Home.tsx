import { useState, useEffect } from 'react'

import { Locate, MapPin, Phone, Pin, Star, Quote, Box } from 'lucide-react'
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
import TypewriterText from '../components/TypewriterText';
import ScrollingBanner from '../components/ScrollingBanner';
import { Image } from '@heroui/react';
import { deleteOrdersByCustomerUid } from '@/services/orderService';

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
      img: "/pasta2.jpg",
      link: "/shop/?tag=pasta"
    },
    {
      id: 4,
      name: "Meals",
      img: "meal.jpg",
      link: "/shop/?tag=meals"
    }
  ]
// useEffect(() => {
//   const deleteOrders = async () => {
//     await deleteOrdersByCustomerUid('3IIckUCL9tXmr96y4QxHegYtoas2');
//   };
//   deleteOrders();
// }, []);
  return (
    <main className="min-h-[calc(100vh-64px)] w-full">
      <ScrollingBanner />

      <Link to={'https://zomato.onelink.me/xqzv/ut3cavr1'} target='_blank' className='flex justify-center items-center bg-[#D94148] h-14'>
        <p className='text-white '>We Are Now Available on</p>
        <Image className='w-40 h-10 ' isBlurred
          src='https://cdn.brandfetch.io/idEql8nEWn/theme/light/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B' />
      </Link>

      <section className='bg-[#fff9f2] '>
        <div className="container mx-auto px-4 py-30 md:justify-between  gap-10 md:gap-0  sm:px-30 flex flex-col md:flex-row items-center  ">

          {/* Left Column */}
          <div className="w-full  md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left ">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl lancelot mb-4 text-gray-900 animate-[fadeIn_0.6s_ease-out]">
              <span className="text-green-600">Enjoy Delicious</span> &{' '}
              <span className="text-orange-500">Tasty Meals</span>
            </h1>

            <p className="text-gray-600 text-base sm:text-lg lg:text-2xl mb-6 sm:mb-8 max-w-lg animate-[fadeIn_0.5s_ease-in]">
              <TypewriterText
                text="Order a healthy and well-balanced meal. It's all homemade… 'Ghar ka khana just the way you want.'"
                speed={40}
              />
            </p>
            <div className=''>
              {userDetails?.role === 'admin' ?
                <button className="cssbuttons-io animate-pulse" onClick={() => navigate('/admin/view-all-orders')}>
                  <span className='flex items-center gap-2'>
                    <Box className='animate-bounce' />
                    Manage Orders
                  </span>
                </button>
                :
                <button className="bg-black px-5 cursor-pointer rounded-lg hover:bg-orange-600 transition-all ease-in-out  duration-100 active:scale-95  py-3 text-white " onClick={() => navigate("/shop")}>
                  Order Now
                </button>
              }
            </div>

          </div>

          {/* Right Column */}
          <div className="w-full md:w-2/5 md:mt-0 ">
            <img
              src="/indian-plate.png"
              alt="Blog Hero Image"
              className="object-cover w-full rounded-2xl transition-all duration-300 h-auto hover:scale-105"
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
              <p className='text-lg mt-3 text-gray-700'>Areas Covered</p>
            </div>

            {/* Food Items */}
            <div className='bg-white rounded-xl shadow-md p-8 hover:scale-105 transition'>
              <h3 className='text-6xl font-bold text-green-600'>
                <CountUp end={50} duration={3} />+
              </h3>
              <p className='text-lg mt-3 text-gray-700'>Food Varieties</p>
            </div>

            {/* Customers */}
            <div className='bg-white rounded-xl shadow-md p-8 hover:scale-105 transition'>
              <h3 className='text-6xl font-bold text-green-600'>
                <CountUp end={200} duration={3} separator=',' />+
              </h3>
              <p className='text-lg mt-3 text-gray-700'>Happy Customers</p>
            </div>

            {/* Orders Served (new metric example) */}
            <div className='bg-white rounded-xl shadow-md p-8 hover:scale-105 transition'>
              <h3 className='text-6xl font-bold text-green-600'>
                <CountUp end={2000} duration={3} separator=',' />+
              </h3>
              <p className='text-lg mt-3 text-gray-700'>Orders Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* -------- Offer Zone Section -------- */}
      <section className="py-20 bg-gradient-to-r from-orange-50 to-orange-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 lancelot text-center">
            Special <span className="text-orange-600">Offers</span>
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            {/* Offer Image */}
            <div className="relative w-full md:w-1/2 max-w-lg">
              <img
                src="/indian-plate.png"
                alt="Indian Thali"
                className="w-full h-auto rounded-2xl shadow-lg transform hover:scale-105 transition-duration-300"
              />
              <div className="absolute -top-4 -right-4 bg-red-500 text-white px-6 py-2 rounded-full transform rotate-12 shadow-lg">
                Special Deal!
              </div>
            </div>

            {/* Offer Details */}
            <div className="w-full md:w-1/2 max-w-lg text-center md:text-left">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-green-800">
                Buy 5 Combo Meals, Get 1 Coke <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-md inline-block transform -rotate-2 shadow-lg relative overflow-hidden free-badge">FREE!</span>
              </h3>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <ul className="space-y-4 text-lg text-gray-700 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Order any 5 combo meals
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Get a <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-600 free-text-shine">FREE</span> 200ml Coke
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Valid on all meal options
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Limited time offer - <span className="font-semibold text-red-600">Valid till August 20th</span>
                  </li>
                </ul>
                <button
                  onClick={() => navigate('/shop')}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300 transform hover:scale-105"
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -----reviews----- */}
      <section className='py-20 bg-gradient-to-b from-white to-green-50'>
        <div className='container mx-auto px-4'>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 lancelot">What Our Customers Say</h2>
            <p className="text-gray-600 text-lg">Real feedback from our valued customers</p>
          </div>

          <div className='relative px-4 md:px-10'>
            <button
              className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={30}
              loop={true}
              navigation={{
                prevEl: '.swiper-button-prev-custom',
                nextEl: '.swiper-button-next-custom',
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {reviews.map((review, index) => (
                <SwiperSlide key={index}>
                  <div className='bg-white rounded-2xl shadow-md p-6 md:p-8 h-full flex flex-col transition-transform duration-300 hover:shadow-lg'>
                    <div className='flex items-start mb-6'>
                      <div className='relative'>
                        <div className='w-16 h-16 rounded-full overflow-hidden ring-4 ring-green-500/20'>
                          <img
                            src={review.avatarUrl}
                            alt={review.name}
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <Quote className="absolute -bottom-2 -right-2 text-green-500 w-8 h-8 bg-white rounded-full p-1.5 shadow-md" />
                      </div>
                      <div className='ml-4 flex-1'>
                        <h3 className='text-lg font-semibold text-gray-900'>{review.name}</h3>
                        <p className='text-green-600 text-sm font-medium'>{review.work}</p>
                        <div className='flex gap-1 mt-2'>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className='text-gray-600 flex-1 italic text-base md:text-lg leading-relaxed mb-4'>
                      "{review.review}"
                    </p>

                    <div className='flex items-center text-gray-500 text-sm mt-auto'>
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{review.place}</span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>


      {/* -------info----- */}
      {/* <section className='bg-[#fff9f2] '>
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
      </section> */}

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
            loop={true}
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

            {products?.slice(0, 9).map((item, index) => (
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