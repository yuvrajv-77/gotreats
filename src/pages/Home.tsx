import { useState, useEffect } from 'react'

import { ArrowRight, Flame } from 'lucide-react'
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
import Button from '@/components/Button';

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
      img: "/varities/pav2.png",
      link: "/shop/?tag=paav-bhaaji"
    },
    {
      id: 2,
      name: "Egg Curry",
      img: "/varities/egg.png",
      link: "/shop/?tag=meals"
    },
    {
      id: 3,
      name: "Pasta",
      img: "/varities/pasta.png",
      link: "/shop/?tag=pasta"
    },
    {
      id: 4,
      name: "Meals",
      img: "/varities/thali.png",
      link: "/shop/?tag=meals"
    },
    {
      id: 5,
      name: "Paav Bhaaji",
      img: "/varities/pav2.png",
      link: "/shop/?tag=paav-bhaaji"
    },
    {
      id: 6,
      name: "Egg Curry",
      img: "/varities/egg.png",
      link: "/shop/?tag=meals"
    },
    {
      id: 7,
      name: "Pasta",
      img: "/varities/pasta.png",
      link: "/shop/?tag=pasta"
    },
    {
      id: 8,
      name: "Meals",
      img: "/varities/thali.png",
      link: "/shop/?tag=meals"
    }
  ];

  const colorPalette = ['bg-yellow-300', 'bg-red-300', 'bg-green-300', 'bg-sky-300'];
  // useEffect(() => {
  //   const deleteOrders = async () => {
  //     await deleteOrdersByCustomerUid('3IIckUCL9tXmr96y4QxHegYtoas2');
  //   };
  //   deleteOrders();
  // }, []);
  return (
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-white to-amber-100  w-full">


      {/* <Link to={'https://zomato.onelink.me/xqzv/ut3cavr1'} target='_blank' className='flex justify-center items-center bg-[#D94148] h-14'>
        <span className='size-2 mr-4 block bg-white animate-pulse rounded-full'></span>
        <p className='text-white inline-flex items-center gap-2 '> We Are Now Available on</p>
        <Image className='w-40 h-10 ' isBlurred
          src='https://cdn.brandfetch.io/idEql8nEWn/theme/light/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B' />
        <span className='size-2 block bg-white animate-pulse rounded-full'></span>
      </Link> */}

      <section className=' '>
        <div className="container mx-auto md:px-20 px-2 md:justify-between gap-10 md:gap-0   flex flex-col md:flex-row items-center  ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full  animate-[fadeIn_0.7s_ease-in]">
            <div className=' h-100 md:h-150 bg-[url(/hero1.jpg)] bg-cover bg-center bg-no-repeat rounded-xl '>

            </div>
            <div className=' h-100 md:h-150 bg-sky-300 rounded-xl flex flex-col p-12  justify-between '>

              <div className='flex -space-x-3'>
                {
                  [...Array(4)].map((_, index) => (
                    <div key={index} className='size-10 md:size-12 bg-pink-500 border rounded-full '></div>
                  ))
                }
              </div>
              <h1 className='font-bowlby text-4xl text-sky-950 sm:text-5xl lg:text-7xl '>
                Fuel up your day with out platter!
              </h1>
              <div className='flex gap-3'>
                <Button variant='secondary'>Explore Menu <ArrowRight /></Button>
                <Button
                  variant='primary' >
                  Order Now <ArrowRight className='animate-[shake_0.5s_ease-in-out_infinite]' /></Button>
              </div>
            </div>
          </div>

        </div>
      </section>
      <div className='my-20'>
        <ScrollingBanner />
      </div>

      <section className='mt-20 md:mt-40'>
        <div className="container mx-auto md:px-20 px-2">

          <div className='flex item-center justify-center'>
            <span className='bg-yellow-300 uppercase font-bowlby px-4 py-2 rounded-lg text-orange-900'>
              Green Living
            </span>
          </div>

          <div className='px-4 md:px-30'>
            <h1 className='font-bowlby uppercase text-3xl sm:text-4xl lg:text-7xl text-center  my-15'>
              NURTURE THE BODY WITH <span className='text-orange-500'>farm-fresh</span> INGREDIENTS
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-30">
            <div className=''>
              {
                [...Array(2)].map((_, index) => (
                  <div key={index} className='mb-10 flex flex-col items-center md:items-start gap-y-4'>
                    <Flame size={40} color='green' />
                    <h3 className='font-bowlby uppercase text-2xl text-orange-900'>High In Richness</h3>
                    <p className='text-yellow-900 font-mouse text-justify  text-xl'>BiteBox offers delightful side of healthy
                      living. Our meals prove that nutritional
                      food also can be really tasty.</p>
                  </div>
                ))
              }
            </div>
            <div className='hidden md:block'>
              <div className='bg-[url(/hero2.jpg)] bg-cover bg-center bg-no-repeat h-100 '>

              </div>
            </div>
            <div>
              {
                [...Array(2)].map((_, index) => (
                  <div key={index} className='mb-10 flex flex-col items-center md:items-start gap-y-4'>
                    <Flame size={40} color='green' />
                    <h3 className='font-bowlby uppercase text-2xl text-orange-900 '>High In Richness</h3>
                    <p className='text-yellow-900  font-mouse text-justify  text-xl'>BiteBox offers delightful side of healthy
                      living. Our meals prove that nutritional
                      food also can be really tasty.</p>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </section>

      {/* ------varieties------ */}
      <section className='mt-20 md:mt-40 bg-amber-950 py-30'>
        <div className=''>
          <h1 className='text-white text-center font-bowlby text-5xl md:text-6xl mb-15'>Explore Our Varities</h1>
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={60}
            loop={true}
            navigation={{
              prevEl: '.swiper-button-prev-custom',
              nextEl: '.swiper-button-next-custom',
            }}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            className='flex items-center justify-center'
          >
            {
              varieties.map(variety => (
                <SwiperSlide
                  key={variety.id}
                  onClick={() => navigate(variety.link)}
                  className=' '
                >
                  <div className='cursor-pointer flex flex-col items-center justify-center'>

                    <img className='rounded-full object-cover size-60 md:size-70' src={variety.img} alt={variety.name} />
                    <p className='text-2xl font-semibold font-mouse text-center mt-10 text-white'>{variety.name}</p>
                  </div>

                </SwiperSlide>
              ))
            }

          </Swiper>

        </div>
      </section>


      <section className='mt-20 md:mt-40'>\
        <div className="">
          <div className='flex item-center justify-center'>
            <span className='bg-yellow-300 uppercase font-bowlby px-4 py-2 rounded-lg text-orange-900'>
              Customer Reviews
            </span>
          </div>

          <div className='px-4 md:px-30'>
            <h1 className='font-bowlby uppercase  text-3xl sm:text-4xl lg:text-7xl text-center  my-15'>
              Our Customers <span className='text-orange-500'>Loves us</span>
            </h1>
          </div>

          <div className="overflow-hidden whitespace-nowrap">
            <div className="animate-scroll flex py-4">
              {reviews.map((review, index) => (
                <div key={index} className={`${colorPalette[index % colorPalette.length]} rounded-2xl p-6 md:p-10 min-h-60 md:min-h-100 max-h-80 md:max-h-120 min-w-80 md:min-w-100 flex flex-col transition-transform duration-300 mr-10`} >
                  <div className='flex flex-col items-center justify-between h-full mb-6'>
                    <p className='font-mouse capitalize text-center font-semibold text-3xl md:text-5xl text-wrap'>
                      "{review.review}"
                    </p>
                    <h3 className='text-lg  font-bold text-orange-900'>{review.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='mt-20 md:mt-40 bg-[#123a14] py-30 '>
        <h1 className='text-[#97c93a] text-center font-bowlby text-4xl md:text-6xl mb-15 leading-15 md:leading-20'>
          Prebiotic protein <img src='/varities/thali2.png' className='inline-block size-20 ' alt='' /> platter <br />
          support <img src='/varities/thali.png' className='inline-block size-20 ' alt='' /> digestion, and energy<br />
          with fiber-rich foods <img src='/varities/pav2.png' className='inline-block size-20 ' alt='' />
        </h1>
        <div className='flex gap-3  items-center justify-center'>
          <Button variant='secondary'>Explore Menu <ArrowRight /></Button>
          <Button variant='primary'>Order Bitebox <ArrowRight /></Button>
        </div>
      </section>

      {/* -----popular dishes----- */}
      {/* <section className='bg-[#fff9f2] py-10 md:py-20 mt-10'>
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
      </section> */}
    </main>
  )
}

export default Home