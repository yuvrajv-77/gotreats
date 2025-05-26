import React, { useEffect, useState } from 'react'
import Button from '../../components/Button'
import VegSymbol from '../../assets/VegSymbol'
import { Star, Upload } from 'lucide-react'
import { Item } from '../../types/ItemsTypes'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addProduct, getProductById, updateProduct, updateProductImage, uploadProductImage } from '../../services/productService'
import { useNavigate, useParams } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'


const FOOD_CATEGORIES = [
    "Meals",
    "Snacks",
    "Desserts",
    "Paav Bhaaji",
    "Maggi",
    "Pasta",
    "Drinks",
    "Pickles"
]

const ProductFrom = () => {
    const { productId } = useParams()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [formData, setFormData] = useState<Item>({
        id: '',
        productName: '',
        productDescription: '',
        isNonVeg: false,
        isTiffin: false,
        category: '',
        originalPrice: 0,
        offerPrice: 0,
        imageUrl: '',
        rating: 0,
        isAvailable: true
    })
    useEffect(() => {
        const fetchProduct = async () => {
            if (productId) {
                const product = await getProductById(productId)
                if (product) {
                    setFormData(product)
                    if (product.imageUrl) {
                        setImagePreview(product.imageUrl)
                    }
                }
            }
        }
        fetchProduct()
    }, [productId])



    const validateAllFields = (data: Item) => {
        return (
            data.productName &&
            data.productDescription &&
            data.originalPrice > 0 &&
            data.offerPrice > 0 &&
            // data.imageUrl &&
            data.rating !== 0 &&
            data.category
        )
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);

            // Create a preview URL for the image
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);

            // Set the imageUrl field to the preview URL

        }
    }
    const productMutation = useMutation({
        mutationFn: async (data: Item) => {
            if (productId) {
                // If updating an existing product
                let updatedData = { ...data };

                // Handle image update separately if there's a new file
                if (selectedFile) {
                    const newImageUrl = await updateProductImage(productId, selectedFile);
                    updatedData.imageUrl = newImageUrl;
                }

                // Remove imageUrl from updatedData to avoid overwriting it if no new image
                // if (!selectedFile) {
                //     const { imageUrl, ...dataWithoutImage } = updatedData;
                //     updatedData = dataWithoutImage;
                // }

                const result = await updateProduct(productId, updatedData);
                return result ? 'Product updated successfully' : 'Failed to update product';
            } else {
                // If adding a new product
                if (selectedFile) {
                    const imageDownloadUrl = await uploadProductImage(selectedFile, 'ProductImages');
                    data.imageUrl = imageDownloadUrl;
                }

                const result = await addProduct(data);
                return result ? 'Product added successfully' : 'Failed to add product';
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });

            navigate('/admin/view-all-products');
        }
    })
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateAllFields(formData)) {
            toast.error('Please fill in all fields.')
            return
        }

        // Use toast.promise with your mutation
        toast.promise(
            new Promise((resolve, reject) => {
                productMutation.mutate(formData, {
                    onSuccess: () => resolve(null),
                    onError: (error) => reject(error)
                })
            }),
            {
                loading: 'Saving...',
                success: productId ? 'Product updated successfully!' : 'Product added successfully!',
                error: 'Could not save product.'
            }
        )
    }


    return (
        <div className='mx-4'>
           
            <h2 className='md:text-4xl text-3xl font-bold text-center md:text-start lancelot mb-4 md:mb-6 text-white'> {productId ? `Update Product ${productId}` : 'Add Product'}</h2>
            <div className='grid grid-cols-2 gap-10 px-20'>
                <form onSubmit={handleSubmit} className='mt-4 sm:mt-10 space-y-2 sm:space-y-6 w-full '>
                    <p className='bg-green-500 p-2 text-white text-center rounded-xl'>Product Info</p>

                    <div>
                        <p className='mb-2 text-orange-400 text-sm'>Product Name</p>
                        <input
                            type="text"
                            name="productName"
                            value={formData.productName}
                            onChange={handleChange}
                            className='border border-gray-300 text-white bg-neutral-700 focus:ring-orange-400 outline-0 ring-1 rounded-xl p-2 w-full'
                            placeholder='Khaane Ka Naam'
                        />
                    </div>

                    <div>
                        <p className='mb-2 text-orange-400 text-sm'>Product Description</p>
                        <input
                            type="text"
                            name="productDescription"
                            value={formData.productDescription}
                            onChange={handleChange}
                            className='border border-gray-300 rounded-xl p-2 w-full  text-white bg-neutral-700 focus:ring-orange-400 outline-0 ring-1'
                            placeholder='Khaane ki Jaankaari - 2 lines'
                        />
                    </div>

                    <div>
                        <p className='mb-2 text-orange-400 text-sm'>Food Category</p>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className='border border-gray-300 rounded-xl p-2 w-full  text-white bg-neutral-700 focus:ring-orange-400 outline-0 ring-1'
                        >
                            <option value="">Select a category</option>
                            {FOOD_CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='flex justify-between formDatas-center'>
                        <p className='mb-2 text-orange-400 text-sm'>Non-Vegitarian</p>
                        <label htmlFor="nonveg-toggle" className="relative inline-block w-11 h-6 cursor-pointer">
                            <input
                                type="checkbox"
                                id="nonveg-toggle"
                                name="isNonVeg"
                                checked={formData.isNonVeg}
                                onChange={handleChange}
                                className="peer sr-only"
                            />
                            <span className="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 peer-disabled:opacity-50 peer-disabled:pointer-events-none"></span>
                            <span className="absolute top-1/2 start-0.5 -translate-y-1/2 size-5 bg-white rounded-full shadow-xs transition-transform duration-200 ease-in-out peer-checked:translate-x-full"></span>
                        </label>
                    </div>

                    <div className='flex justify-between formDatas-center'>
                        <p className='mb-2 text-orange-400 text-sm'>Tiffin Meal</p>
                        <label htmlFor="tiffin-toggle" className="relative inline-block w-11 h-6 cursor-pointer">
                            <input
                                type="checkbox"
                                id="tiffin-toggle"
                                name="isTiffin"
                                checked={formData.isTiffin}
                                onChange={handleChange}
                                className="peer sr-only"
                            />
                            <span className="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 peer-disabled:opacity-50 peer-disabled:pointer-events-none"></span>
                            <span className="absolute top-1/2 start-0.5 -translate-y-1/2 size-5 bg-white rounded-full shadow-xs transition-transform duration-200 ease-in-out peer-checked:translate-x-full"></span>
                        </label>
                    </div>


                    <div className='flex justify-between formDatas-center'>
                        <p className='mb-2 text-orange-400 text-sm'>Availiblity</p>
                        <label htmlFor="availibility-toggle" className="relative inline-block w-11 h-6 cursor-pointer">
                            <input
                                type="checkbox"
                                id="availibility-toggle"
                                name="isAvailable"
                                checked={formData.isAvailable}
                                onChange={handleChange}
                                className="peer sr-only"
                            />
                            <span className="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 peer-disabled:opacity-50 peer-disabled:pointer-events-none"></span>
                            <span className="absolute top-1/2 start-0.5 -translate-y-1/2 size-5 bg-white rounded-full shadow-xs transition-transform duration-200 ease-in-out peer-checked:translate-x-full"></span>
                        </label>
                    </div>
                    <div className='flex justify-between formDatas-center gap-5'>
                        <div className='w-full'>
                            <p className='mb-2 text-orange-400 text-sm'>Product Image</p>
                            <div className="flex items-center gap-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="border border-gray-300 rounded-xl p-2 w-full  text-white bg-neutral-700 focus:ring-orange-400 outline-0 ring-1"
                                />
                                <Upload size={20} className="text-blue-500" />
                            </div>
                        </div>
                        <div className='w-full'>
                            <p className='mb-2 text-orange-400 text-sm'>Rating ⭐</p>
                            <input
                                type="number"
                                name="rating"
                                value={formData.rating}
                                onChange={handleChange}
                                className='border border-gray-300 rounded-xl p-2 w-full  text-white bg-neutral-700 focus:ring-orange-400 outline-0 ring-1'
                                placeholder='1.0 - 5.0'
                            />
                        </div>
                    </div>

                    <p className='bg-green-500 p-2 text-white text-center rounded-xl'>Product Pricing</p>

                    <div className='flex justify-between'>
                        <div>
                            <p className='mb-2 text-orange-400 text-sm'>Original Price</p>
                            <input
                                type="number"
                                name="originalPrice"
                                value={formData.originalPrice}
                                onChange={handleChange}
                                className='border border-gray-300 rounded-xl p-2 w-full  text-white bg-neutral-700 focus:ring-orange-400 outline-0 ring-1'
                                placeholder='$ Are Baap Re 😨'
                            />
                        </div>
                        <div>
                            <p className='mb-2 text-orange-400 text-sm'>Offer Price</p>
                            <input
                                type="number"
                                name="offerPrice"
                                value={formData.offerPrice}
                                onChange={handleChange}
                                className='border border-gray-300 rounded-xl p-2 w-full  text-white bg-neutral-700 focus:ring-orange-400 outline-0 ring-1'
                                placeholder='$ Waaah 🤑'
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant='primary'
                        className="w-full bg-blue-500 text-white py-2 transition-colors"
                    >
                        {productId ? 'Update Product' : 'Add Product'}
                    </Button>
                </form>
                <div className='mt-10 mx-auto'>
                    <p className='bg-green-500 p-2 text-white text-center rounded-xl mb-5'>Product Preview</p>
                    <div>
                        <div className='md:flex gap-2 flex-col hidden group w-64 lg:w-76 bg-pink-50 p-6 rounded-3xl shadow-xs cursor-pointer hover:bg-green-50 transition-color duration-500 border-orange-50'>
                            <img
                                src={imagePreview || 'https://via.placeholder.com/300'}
                                alt="Product preview"
                                className='mb-5 size-64 object-cover rounded-3xl group-hover:scale-102 transition-all duration-500'
                            />
                            <VegSymbol isNonVeg={formData.isNonVeg} />
                            <h4 className='lancelot text-2xl lg:text-3xl font-medium'>{formData.productName}</h4>
                            <p className='comfortaa text-sm text-green-700 font-bold flex formDatas-center gap-1 items-center'><Star fill='green' size={13} />{formData.rating}</p>

                            <p className='text-gray-500 text-sm lg:text:base leading-5 line-clamp-2'>{formData.productDescription}</p>
                            <div className='flex justify-between formDatas-center mt-5'>

                                <button className='h-9 flex justify-between formDatas-center p-2 text-green-600 text-sm font-semibold bg-green-100 rounded-lg'>
                                    Add To Cart
                                </button>

                                <div className='inline-flex formDatas-center gap-2'>
                                    <p className='comfortaa text-lg line-through '> ₹{formData.originalPrice} </p>
                                    <span className='px-[3px] py-[1px] flex formDatas-center text-lg shadow-3xl bg-yellow-500 animate-bounce'>₹{formData.offerPrice}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <pre className="bg-white p-4 rounded-xl shadow-sm overflow-auto">
                        {JSON.stringify(formData, null, 2)}
                    </pre> */}
                </div>
            </div>
            {/* <Toaster/> */}
        </div>
    )
}
export default ProductFrom;
