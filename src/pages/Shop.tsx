
import { BadgePercent, Candy, Drumstick, Salad } from 'lucide-react';
import { useEffect } from 'react';
import ItemCards from '../components/ItemCards';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useProductStore } from '../store/productStore';



const Shop = () => {

    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const tag = searchParams.get('tag');
   
    // const { items, addItem, updateQuantity } = useCartStore()
    const products = useProductStore((state) => state.products)



    
    
    
    useEffect(()  => {
        navigate('/shop/?tag=top-picks');
        
    }, [])

   
    

    
    return (
        <div className='bg-[#fff9f2] flex'>

            <div className='container  mx-auto '>
                <div className='py-10'>
                    <h1 className=' text-4xl md:text-5xl text-center lancelot text-gray-800 '>Shop our Homemade Products</h1>
                    <div className='mt-8'>
                        <div className=' text justify-center flex items-center flex-wrap gap-2 lg:gap-10 select-none'>
                            <span className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-lg ${tag == 'top-picks' ? 'bg-orange-600 text-white hover:text-white' : 'bg-white'}  hover:text-orange-600 inline-flex items-center shadow-xs transition-colors duration-100 ease-in  gap-2`}
                                onClick={() => navigate('/shop/?tag=top-picks')}>
                                <BadgePercent strokeWidth={1.5} />Top Picks
                            </span>
                            <span className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-lg ${tag == 'veg-meal' ? 'bg-orange-600 text-white hover:text-white' : 'bg-white'}  hover:text-orange-600 inline-flex items-center shadow-xs gap-2 transition-colors duration-100 ease-in`}
                                onClick={() => navigate('/shop/?tag=veg-meal')}>
                                <Salad strokeWidth={1.5} />Veg Meal
                            </span>
                            <span className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-lg ${tag == 'non-veg-meal' ? 'bg-orange-600 text-white hover:text-white' : 'bg-white'}  hover:text-orange-600 inline-flex items-center shadow-xs gap-2 transition-colors duration-100 ease-in`}
                                onClick={() => navigate('/shop/?tag=non-veg-meal')}>
                                <Drumstick strokeWidth={1.5} />Non-Veg Meal
                            </span>
                            <span className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-lg ${tag == 'chocolates' ? 'bg-orange-600 text-white hover:text-white' : 'bg-white'}  hover:text-orange-600 inline-flex items-center shadow-xs gap-2 transition-colors duration-100 ease-in`}
                                onClick={() => navigate('/shop/?tag=chocolates')}>
                                <Candy strokeWidth={1.5} /> Chocolates
                            </span>
                        </div>
                    </div>

                    {/* items container */}
                    <div className='flex flex-wrap lg:gap-10 gap-4 mt-10  justify-center '>
                        {tag == 'top-picks' && products?.map((item, index) => <ItemCards key={index} item={item} />)}
                        {tag == 'veg-meal' && products?.filter(item => !item.isNonVeg).map((item, index) => <ItemCards key={index} item={item} />)}
                        {tag == 'non-veg-meal' && products?.filter(item => item.isNonVeg).map((item, index) => <ItemCards key={index} item={item} />)}
                        {tag == 'chocolates' && products?.filter(item => item.isChocolate).map((item, index) => <ItemCards key={index} item={item} />)}
                    </div>
                </div>
            </div> 
        </div>
    )
}
export default Shop