import React, { useState, useEffect } from "react";
import { updateUserAddress, getUserFromDb } from "../services/authService";
import { useAuthStore } from "../store/authStore";
import Button from "./Button";
import toast from "react-hot-toast";
import { Home } from "lucide-react";

interface Address {
    flatNumber: string;
    buildingName: string;
    streetAddress: string;
    landmark?: string;
    area: string;
    pincode: string;
}

interface AddressSectionProps {
    uid: string;
}

const AddressSection: React.FC<AddressSectionProps> = ({ uid }) => {
    const [address, setAddress] = useState<Address>({
        flatNumber: "",
        buildingName: "",
        streetAddress: "",
        landmark: "",
        area: "",
        pincode: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchAddress = async () => {
        try {
            const userDetails = await getUserFromDb(uid);
            if (userDetails?.address) {
                setAddress(userDetails.address);
            }
        } catch (error) {
            console.error("Failed to fetch address:", error);
        }
    };

    useEffect(() => {
        if (uid) {
            fetchAddress();
        }
    }, [uid]);

    const handleSaveAddress = async () => {
        const { flatNumber, buildingName, streetAddress, area, pincode } = address;

        if (!flatNumber || !buildingName || !streetAddress || !area || !pincode) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setLoading(true);
            await updateUserAddress(uid, address);
            toast.success("Address updated successfully!");
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update address:", error);
            toast.error("Failed to save address. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-sm text-orange-500 font-semibold">Delivery Address</h2>
                <button
                    onClick={() => setIsEditing(true)}
                    className=" text-sm text-orange-500 hover:text-orange-600 transition-colors font-medium"
                >
                    Edit Address
                </button>
            </div>
            {isEditing ? (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Flat/House Number*
                        </label>
                        <input
                            type="text"
                            value={address.flatNumber}
                            onChange={(e) =>
                                setAddress((prev) => ({ ...prev, flatNumber: e.target.value }))
                            }
                            className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="e.g., Flat 123, Shop 45"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Building/Society Name*
                        </label>
                        <input
                            type="text"
                            value={address.buildingName}
                            onChange={(e) =>
                                setAddress((prev) => ({ ...prev, buildingName: e.target.value }))
                            }
                            className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="e.g., Sunshine Apartments"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address*
                        </label>
                        <input
                            type="text"
                            value={address.streetAddress}
                            onChange={(e) =>
                                setAddress((prev) => ({ ...prev, streetAddress: e.target.value }))
                            }
                            className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="e.g., MG Road, 4th Cross"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Landmark
                        </label>
                        <input
                            type="text"
                            value={address.landmark}
                            onChange={(e) =>
                                setAddress((prev) => ({ ...prev, landmark: e.target.value }))
                            }
                            className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="e.g., Near Post Office"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Area*
                        </label>
                        <input
                            type="text"
                            value={address.area}
                            onChange={(e) =>
                                setAddress((prev) => ({ ...prev, area: e.target.value }))
                            }
                            className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="e.g., Borivali West"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pincode*
                        </label>
                        <input
                            type="text"
                            value={address.pincode}
                            onChange={(e) =>
                                setAddress((prev) => ({
                                    ...prev,
                                    pincode: e.target.value.replace(/\D/g, ""),
                                }))
                            }
                            className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="e.g., 400092"
                            maxLength={6}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <Button
                            onClick={() => {
                                setIsEditing(false);
                                fetchAddress(); // Reset to the original address
                            }}
                            variant="secondary"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveAddress}
                            disabled={loading}
                            variant="success"
                        >
                            {loading ? "Saving..." : "Save Address"}
                        </Button>
                    </div>
                </div>
            ) : (
                <div>
                    {address.flatNumber ? (
                        <div className="bg-gray-100 flex gap-3 px-5 py-4 rounded-xl">
                            <Home size={20}/>
                            <p className="text-gray-800 text-sm md:text-base whitespace-pre-wrap">
                                {`${address.flatNumber}, ${address.buildingName}, ${address.streetAddress}, ${address.landmark ? address.landmark + ", " : ""
                                    }${address.area}, ${address.pincode}`}
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-gray-600">No address found. Please add your address.</p>
                            <Button
                                onClick={() => setIsEditing(true)}
                                variant="primary" size="sm"
                            >
                                Add Address
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AddressSection;