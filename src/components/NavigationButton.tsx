import { ArrowLeft, ArrowRight } from 'lucide-react'

const NavigationButton = ({swiper}:{swiper:any}) => {
    // const swiper = useSwiper()
    return (
        <div className='flex items-center gap-4'>
            {/* Left arrow */}
            <div className="group relative">
                <button 
                    className='p-2 transition-transform duration-300 hover:scale-110 cursor-thumb' 
                    onClick={() => swiper?.slidePrev()}
                >
                    <ArrowLeft size={30} />
                </button>
                <span className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-white py-1.5 text-sm font-semibold text-black shadow-md transition-all duration-300 ease-in-out group-hover:scale-100">
                    Previous
                </span>
            </div>
            
            {/* Right arrow */}
            <div className="group relative">
                <button 
                    className='p-2 transition-transform duration-300 hover:scale-110 cursor-thumb' 
                    onClick={() => swiper?.slideNext()}
                >
                    <ArrowRight size={30} />
                </button>
                <span className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-white py-1.5 text-sm font-semibold text-black shadow-md transition-all duration-300 ease-in-out group-hover:scale-100">
                    Next
                </span>
            </div>
        </div>
    )
}

export default NavigationButton