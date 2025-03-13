import  {  useState } from 'react'
import Button, { IconButton } from '../components/Button'
import { Phone } from 'lucide-react'
import ItemCards from '../components/ItemCards';
import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
import { Autoplay, Navigation } from 'swiper/modules';
import { useAuthStore } from '../store/authStore';
import { useProductStore } from '../store/productStore';

import { reviewData } from '../content/Review_Data';
import NavigationButton from '../components/NavigationButton';
import { Link, useNavigate } from 'react-router-dom';





const Home = () => {


    const userDetails = useAuthStore((state) => state.userDetails)
    const navigate = useNavigate()
    // const { data } = useQuery({
    //     queryKey: ['products'],
    //     queryFn: getItemsFromFirestore
    // })



    const products = useProductStore((state) => state.products)


    const [swiperRef, setSwiperRef] = useState(null);


    const varieties = [
        {
            id: 1,
            name: "Veg Thali",
            img: "https://img.sndimg.com/food/image/upload/f_auto,c_thumb,q_55,w_450,ar_4:3/v1/img/recipes/22/13/7/v8NXUJbzQwCB6nL15eWt_PR%25204%2520final%2520-%2520pot%2520roast.jpg"
        },
        {
            id: 2,
            name: "Biryani",
            img: "https://img.sndimg.com/food/image/upload/f_auto,c_thumb,q_55,w_450,ar_4:3/v1/img/recipes/22/13/7/v8NXUJbzQwCB6nL15eWt_PR%25204%2520final%2520-%2520pot%2520roast.jpg"
        },
        {
            id: 3,
            name: "Chocolate",
            img: "https://img.sndimg.com/food/image/upload/f_auto,c_thumb,q_55,w_450,ar_4:3/v1/img/recipes/22/13/7/v8NXUJbzQwCB6nL15eWt_PR%25204%2520final%2520-%2520pot%2520roast.jpg"
        },
        {
            id: 4,
            name: "Non Veg",
            img: "https://img.sndimg.com/food/image/upload/f_auto,c_thumb,q_55,w_450,ar_4:3/v1/img/recipes/22/13/7/v8NXUJbzQwCB6nL15eWt_PR%25204%2520final%2520-%2520pot%2520roast.jpg"
        }
    ]



    console.log("userDetails", userDetails);

    return (
        <main className="min-h-[calc(100vh-64px)] w-full">

            <section className='bg-[#fff9f2] '>
                <div className="container mx-auto px-4 py-30 md:justify-between  gap-10 md:gap-0  sm:px-30 flex flex-col md:flex-row items-center  ">

                    {/* Left Column */}
                    <div className="w-full  md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left ">
                        <h1 className="text-6xl sm:text-7xl lg:text-8xl lancelot mb-4 text-gray-900 animate-[fadeIn_0.6s_ease-out]">
                            Enjoy Delicious & Tasty

                            Meals
                        </h1>
                        <p className="text-gray-600 text-base sm:text-lg lg:text-2xl mb-6 sm:mb-8 max-w-lg animate-[fadeIn_0.5s_ease-in]">
                            Order a healthy and well-balanced meal. It’s all homemade… "Ghar ka khana just the way you want.".
                        </p>
                        <div className="flex items-center gap-4 animate-[fadeIn_0.6s_ease-in]">
                            <Button>Order Now</Button>
                            <IconButton className='lg:block hidden'><Phone strokeWidth={1} size={20} color='gray' /></IconButton>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="w-full md:w-2/5  md:mt-0  animate-[fadeIn_0.7s_ease-in]">
                        <img
                            src="/indian-plate.png"
                            alt="Blog Hero Image"
                            className="object-cover w-full rounded-2xl  hover:scale-101 transition-all duration-500   h-auto"
                        />
                    </div>
                </div>
            </section>

            {/* -----reviews----- */}
            <section className='bg-white mt-20 w-full '>
                <div className='container mx-auto py-14  md:py-20'>
                    <h1 className='text-center mb-10 lancelot text-5xl sm:text-6xl lg:text-7xl flex items-center justify-center'>Happy Customers</h1>
                    <Swiper
                        modules={[Autoplay, Navigation]}
                        spaceBetween={10}
                        centeredSlides={true}
                        loop={true}

                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}

                        >

                        {reviewData.map((review, index) => (
                            <SwiperSlide key={index}>
                                <div className='flex flex-col items-center justify-center md:mx-50 mx-3 bg-green-50 p-10'>

                                    <img src={review.image} className='size-20 md:size-20 object-cover rounded-full' alt="" />
                                    <h2 className='text-lg md:text-xl font'>{review.name}</h2>
                                    <p className='text-gray-600 font-light'>{review.role}</p>

                                    <h1 className='text-2xl md:text-3xl tracking-wide lancelot text-center font-bold text-slate-800 my-10 leading-normal'>" {review.quote} "</h1>
                                    <div className='flex items-center gap-5'>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
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
                                <Link to={'/veg-thali'}>
                                    <div className=' p-2 flex flex-col items-center gap-4'>
                                        <div className='hover:scale-105 transition-all duration-300 ease-in'>
                                            <img className='rounded-full object-cover size-40 md:size-44' src={variety.img} alt="" />
                                        </div>
                                        <p className='text-2xl font-semibold lancelot'>{variety.name}</p>
                                    </div>
                                </Link>
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
                        // slidesPerView={2}

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
                    <div className='flex justify-center w-full'>
                        <Button onClick={() => navigate('/shop')} className='w-1/2 md:w-36'>Shop All</Button>
                    </div>
                </div>
            </section>
           
        </main>

    )
}

export default Home