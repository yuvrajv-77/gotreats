
import Button, { IconButton } from '../../components/Button'
import { Eye, EyeOff, Pen, Plus, Trash } from 'lucide-react'
import { deleteProduct, getItemsFromFirestore, updateProduct } from '../../services/productService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import VegSymbol from '../../assets/VegSymbol';
import toast from 'react-hot-toast';
import { Tooltip } from '@heroui/react';

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
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product deleted successfully 🗑️');
        }, onError: (error) => {
            toast.error(`Failed to delete product: ${error.message}`)
        }
    })

    const handleProductDelete = (id: string) => {

        if (window.confirm("Really delete this product with id: " + id + "?")) {
            toast.loading('Deleting product...', { id: 'deleteProduct' })
            deleteProductMutation.mutate(id, {
                onSuccess: () => {
                    toast.dismiss('deleteProduct')
                }
            })
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
        <main className='mx-4 w-full'>
            <div className='flex justify-between items-center'>
                <h1 className="md:text-4xl text-3xl font-bold text-center md:text-start lancelot mb-4 md:mb-6 text-white">Manage Items</h1>
                <Button variant='primary' onClick={() => navigate('/admin/product-form')}>
                    <Plus /> Add Product</Button>
            </div>


            <div className="overflow-x-auto my-10">

                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead className="bg-green-500 text-white">
                        <tr>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Image</th>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Price</th>
                            <th className="px-6 py-3">Offer Price</th>
                            <th className="px-6 py-3">Rating</th>
                            <th className="px-6 py-3">Order Count</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>


                    <tbody>

                        {data?.map((product) => (
                            <tr key={product.id} className={`border-b hover:bg-gray-50 ${product.isAvailable ? '' : 'text-neutral-600'}`}>
                                <td className=" ">
                                    <div className='flex items-center justify-center gap-2'>
                                        <VegSymbol isNonVeg={product.isNonVeg} />
                                    </div>
                                </td>
                                <td className=" text-center">
                                    <Tooltip content={
                                        <img src={product.imageUrl} className={`size-60 object-cover rounded-md ${product.isAvailable ? '' : 'grayscale'} `} alt="" />
                                    } placement='right-start'>
                                        <div className='flex justify-center items-center h-full'>
                                            <img src={product.imageUrl} className={`size-12 object-cover ${product.isAvailable ? '' : 'grayscale'} `} alt="" />
                                        </div>
                                    </Tooltip>
                                </td>
                                <td className={`  text-center `}>{product.id}</td>
                                <td className={`  text-center ${product.isAvailable ? '' : ' line-through text-neutral-600'} `}>{product.productName}</td>
                                <td className="  text-center">{product.category}</td>
                                <td className="  text-center">₹{product.originalPrice}</td>
                                <td className="  text-center">₹{product.offerPrice}</td>
                                <td className="  text-center">{product.rating}⭐</td>
                                <td className="  text-center">{product.rating}⭐</td>
                                <td className=" ">
                                    <div className='items-center flex justify-center gap-6'>
                                        <IconButton className='bg-green-200 hover:bg-white hover:border border-green-200 border ' onClick={() => navigate(`/admin/product-form/${product.id}`)}><Pen size={20} className='' /></IconButton>
                                        <IconButton className='bg-orange-300 hover:bg-white hover:border border-orange-300 border ' onClick={() => handleAvailabilityChange(product.id, product.isAvailable)}>
                                            {product.isAvailable ? <Eye size={20} className='' /> : <EyeOff size={20} className='' />}
                                        </IconButton>
                                        <IconButton className='bg-red-400 hover:bg-white hover:border border-red-400 border ' onClick={() => handleProductDelete(product.id)}>
                                            <Trash size={20} className='' />
                                        </IconButton>
                                    </div>
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
