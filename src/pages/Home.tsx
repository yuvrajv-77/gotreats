import React from 'react'
import Button, { IconButton } from '../components/Button'
import { Phone } from 'lucide-react'

const Home = () => {


    return (
        <div className="min-h-[calc(100vh-64px)]">
            <div className='bg-[#fff9f2]'>
                <div className="container mx-auto px-4 pt-30  gap-10 md:gap-0  sm:px-10 flex flex-col md:flex-row items-center  ">

                    {/* Left Column */}
                    <div className="w-full  md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left ">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl lancelot mb-4 text-gray-900 animate-[fadeIn_0.6s_ease-out]">
                            Enjoy Delicious & Tasty

                            Paav Bhaaji
                        </h1>
                        <p className="text-gray-600 text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-lg animate-[fadeIn_0.5s_ease-in]">
                            We offer a wide range of delicious and tasty paav bhaaji, including classic paav bhaaji, spicy paav bhaaji, and vegetarian paav bhaaji.
                        </p>
                        <div className="flex items-center gap-4 animate-[fadeIn_0.6s_ease-in]">
                            <Button>Order Now</Button>
                            <IconButton className='lg:block hidden'><Phone strokeWidth={1} size={20} color='gray' /></IconButton>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="w-full md:w-1/2  md:ml-10 md:mt-0    animate-[fadeIn_0.7s_ease-in]">
                        <img
                            src="/pav2.png"
                            alt="Blog Hero Image"
                            className="object-cover w-full rounded-2xl  hover:scale-101 transition-all duration-500   h-auto"
                        />
                    </div>
                </div>
            </div>

            <div className='bg-white'>
                <div className="container mx-auto px-4 pt-3  gap-10 md:gap-0  sm:px-10 flex flex-col md:flex-row items-center  ">
                    <div className="w-full md:w-1/2     animate-[fadeIn_0.7s_ease-in]">
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
            </div>

            <div className='container mx-auto px-4 my-5'>
                <h1 className='text-center lancelot text-5xl sm:text-6xl lg:text-7xl'>Popular Items</h1>
                <div className='border '>
                    <img src="/pav2.png" alt="" />
                    <h4>Brown Sushi</h4>
                    <p>its a japenese dish</p>
                    <div>

                    </div>
                </div>
            </div>
        </div>

    )
}

export default Home