
import { BadgePercent, Candy, Drumstick, Salad } from 'lucide-react'
import { useEffect, useState } from 'react'
import ItemCards from '../components/ItemCards'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { shopItems } from '../assets/Items'

import { Item } from '../types/ItemsTypes';
import { getItemsFromFirestore } from '../services/productService'




const Shop = () => {

    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const tag = searchParams.get('tag');
    const [items, setItems] = useState<Item[]>([]);

    const fetchItemsFromFirestore = async () => {
        try {
          const getitems = await getItemsFromFirestore();
          
          if (getitems) {
            setItems(getitems);
          }
        } catch (error) {
          console.error('Error fetching items from Firestore:', error);
        }
      };

    useEffect(()  => {
        navigate('/shop/?tag=top-picks');
        fetchItemsFromFirestore();
    }, [])
    console.log(items);
    
    return (
        <div className='bg-[#fff9f2]'>

            <div className='container  mx-auto'>
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

                        {tag == 'top-picks' && shopItems.map((item, index) => <ItemCards key={index} item={item} />)}
                        {tag == 'veg-meal' && shopItems.filter(item => item.veg).map((item, index) => <ItemCards key={index} item={item} />)}
                        {tag == 'non-veg-meal' && shopItems.filter(item => !item.veg).map((item, index) => <ItemCards key={index} item={item} />)}
                        {tag == 'chocolates' && shopItems.filter(item => item.chocolate).map((item, index) => <ItemCards key={index} item={item} />)}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Shop