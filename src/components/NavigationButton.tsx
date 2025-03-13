import { ArrowLeft, ArrowRight } from 'lucide-react'

const NavigationButton = ({swiper}) => {
    // const swiper = useSwiper()
    return (
        <div className='flex items-center gap-4 '>
            {/* //left arrow */}
            <button className=' p-2' onClick={() => swiper?.slidePrev()}><ArrowLeft size={30} /></button>
            {/* right-arrow */}
            <button className=' p-2' onClick={() => swiper?.slideNext()}><ArrowRight size={30} /></button>
        </div>
    )
}

export default NavigationButton