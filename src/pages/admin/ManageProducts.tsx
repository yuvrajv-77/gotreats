
import Button, { IconButton } from '../../components/Button'
import { Eye, EyeOff, Pen, Plus, Trash} from 'lucide-react'
import { deleteProduct, getItemsFromFirestore, updateProduct } from '../../services/productService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import VegSymbol from '../../assets/VegSymbol';

export default function ManageProducts() {
    const queryClient = useQueryClient()
    const navigate = useNavigate();

    const { data } = useQuery({
        queryKey: ['products'],
        queryFn: getItemsFromFirestore
    })




    const deleteProductMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        }
    })

    const handleProductDelete = (id: string) => {

        if (window.confirm("Really delete this product with id: " + id + "?")) {
            deleteProductMutation.mutate(id)
        }
    };

// Add this mutation near your other mutations
const toggleAvailabilityMutation = useMutation({
    mutationFn: ({ productId, updatedData }: { productId: string, updatedData: any }) => 
        updateProduct(productId, updatedData),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] })
    }
});

// Replace the handleAvailabilityChange function with this:
const handleAvailabilityChange = (id: string, isAvailable: boolean) => {
    toggleAvailabilityMutation.mutate({
        productId: id,
        updatedData: { isAvailable: !isAvailable }
    });
};


    return (
        <main>
            <div className='flex justify-between items-center'>
                <h2 className='text-2xl'>Manage Products</h2>
                <Button onClick={() => navigate('/admin/product-form')}><Plus /> Add Product</Button>
            </div>


            <div className="overflow-x-auto my-10">

                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Image</th>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Price</th>
                            <th className="px-6 py-3">Offer Price</th>
                            <th className="px-6 py-3">Rating</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>


                    <tbody>

                        {data?.map((product) => (
                            <tr key={product.id} className={`border-b hover:bg-gray-50 ${product.isAvailable ? '' : 'text-neutral-600'}`}>
                                <td className={`px-6 py- text-center `}>{product.id}</td>
                                <td className="px-2 py- text-center"><img src={product.imageUrl} className={`size-20 object-cover ${product.isAvailable ? '' : 'grayscale'} `} alt="" /></td>
                                <td className={`px-6 py- text-center `}>{product.productName}</td>
                                <td className="px-6 py-6  flex  items-center justify-center">
                                    <VegSymbol isNonVeg={product.isNonVeg} />
                                </td>
                                <td className="px-6 py- text-center">₹{product.originalPrice}</td>
                                <td className="px-6 py- text-center">₹{product.offerPrice}</td>
                                <td className="px-6 py- text-center">{product.rating}⭐</td>
                                <td className="px-6 py-6 flex justify-center gap-6">
                                    <IconButton className='bg-green-200 hover:bg-white hover:border border-green-200 border ' onClick={() => navigate(`/admin/product-form/${product.id}`)}><Pen size={20} className='' /></IconButton>
                                    <IconButton className='bg-orange-300 hover:bg-white hover:border border-orange-300 border ' onClick={() => handleAvailabilityChange(product.id, product.isAvailable)}>
                                       {product.isAvailable ? <Eye size={20} className='' /> : <EyeOff size={20} className='' />} 
                                    </IconButton>
                                    <IconButton className='bg-red-400 hover:bg-white hover:border border-red-400 border ' onClick={() => handleProductDelete(product.id)}>
                                        <Trash size={20} className='' />
                                    </IconButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {
                    data?.length === 0 &&
                    <p className='comfortaa text-2xl text-gray-600 animate-bounce font-bold my-20 text-center'>🤑 Kuchh to Bech Le 🤑</p>
                }
            </div>



        </main>
    )
}
