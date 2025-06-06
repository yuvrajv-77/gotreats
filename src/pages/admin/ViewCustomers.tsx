import { db } from '@/config/firebaseConfig';
import { getAllCustomersFromDb } from '@/services/authService';
import { Button, Popover, PopoverContent, PopoverTrigger, Snippet, Tooltip } from '@heroui/react';
import { collection, getDocs } from 'firebase/firestore';
import { Eye, UserRoundCog } from 'lucide-react';
import React, { useEffect } from 'react'

type Customer = {
	id?: string;
	role?: 'customer' | 'admin';
	displayName?: string;
	phoneNumber?: string;
	email?: string;
	address?: {
		flatNumber?: string;
		buildingName?: string;
		streetAddress?: string;
		area?: string;
		pincode?: string;
	};
	// add other properties as needed
};

const ViewCustomers = () => {

	const [isLoading, setIsLoading] = React.useState(false);
	const [customers, setCustomers] = React.useState<Customer[]>([]);
	const [orderCounts, setOrderCounts] = React.useState<Record<string, number>>({});

	const fetchOrderCountsByCustomer = async (): Promise<Record<string, number>> => {
    const snapshot = await getDocs(collection(db, 'orders'));
    const counts: Record<string, number> = {};
    snapshot.forEach(doc => {
        const data = doc.data();
        const customerId = data.customer?.uid; // adjust as per your Firestore structure
        if (customerId) {
            counts[customerId] = (counts[customerId] || 0) + 1;
        }
    });
    return counts;
};

	useEffect(() => {
		const fetchCustomers = async () => {
			setIsLoading(true);
			const res = await getAllCustomersFromDb();
			if (res) {
				const customersArray = Object.values(res).filter((customer) => (customer as Customer).role !== 'admin') as Customer[]; // Exclude admin users
				setCustomers(customersArray);
				setIsLoading(false);
			} else {
				console.error("No customers found or error fetching customers");
				setIsLoading(false);
			}
		};
		fetchCustomers();
	}, [])

    useEffect(() => {
        const getOrderCounts = async () => {
            const counts = await fetchOrderCountsByCustomer();
            setOrderCounts(counts);
        };
        getOrderCounts();
    }, []);

	return (


		<main className='mx-4 w-full'>
			<h1 className="md:text-4xl text-3xl font-bold text-center md:text-start lancelot mb-4 md:mb-6 text-white">Customers</h1>


			<div className="overflow-x-auto my-10">
				{isLoading ? (
					<p className='text-center lancelot animate-pulse my-10'>Loading customers...</p>
				) : (
					<table className="min-w-full bg-white shadow-md rounded-lg">
						<thead className="bg-orange-500 text-white rounded-t-lg">
							<tr>
								<th className="px-6 py-3 border-r">#</th>
								<th className="px-6 py-3  border-r">ID</th>
								<th className="px-6 py-3  border-r ">Name</th>
								<th className="px-6 py-3  border-r">Number</th>
								<th className="px-6 py-3  border-r">Email</th>
								<th className="px-6 py-3  border-r">Address</th>
								<th className="px-6 py-3  border-r">Orders Count</th>
							</tr>
						</thead>
						<tbody className=' overflow-y-auto'>
							{customers.map((customer, index) => {

								const address = `${customer.address?.flatNumber}, ${customer.address?.buildingName}, ${customer.address?.streetAddress}, ${customer.address?.area}, ${customer.address?.pincode}`;

								return (
									<tr key={customer.id} className={` border-b text-sm  `}>

										<td className="px-6  text-center border-r">
											{index + 1}
										</td>
										<td className="px-6  text-center border-r">
											<Tooltip content={customer.id} placement='right' className="cursor-pointer">
												{customer.id.slice(-4)}
											</Tooltip>
										</td>

										{/* customer Code  */}
										<td className="px-6  text-center border-r">
											<div className='flex items-center gap-2 justify-center'>
												{customer?.role === 'admin' && <UserRoundCog size={18} />}
												{customer?.displayName}
											</div>
										</td>
										<td className="px-6  text-center border-r">
											<div>
												<Snippet className=' bg-white' hideSymbol variant='flat' size='sm'>
													<p className='text-sm font-medium '>
														{customer?.phoneNumber}
													</p>

												</Snippet>
											</div>
										</td>
										<td className="px-6  text-center border-r">
											{customer?.email}
										</td>

										<td className="px-6 flex items-center border-r justify-center">
											<Popover placement='bottom'>
												<PopoverTrigger className="cursor-pointer">
													<Button isIconOnly variant="light" className="p-2">
														<Eye size={20} />
													</Button>
												</PopoverTrigger>
												<PopoverContent>
													{
														address ? (
															<p className='w-[200px] '>{address}</p>
														) : (
															<p className='text-red-500'>Address not available</p>
														)
													}
												</PopoverContent>
											</Popover>
										</td>

										<td className="px-6  text-center border-r">
											{orderCounts[customer.id ?? ''] ?? 0}
										</td>

									</tr>
								)
							})}
						</tbody>
					</table>
				)}

			</div>



		</main>
	)
}

export default ViewCustomers