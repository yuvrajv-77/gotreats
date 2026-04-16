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
    
    // Custom input classes for reuse
    const inputClass = "w-full bg-[var(--brand-dark)] border border-[var(--brand-border)] rounded-xl px-4 py-3 text-sm text-[var(--brand-cream)] placeholder-[var(--brand-cream)]/20 focus:outline-none focus:border-[var(--brand-flame)]/50 font-body transition-colors";
    const labelClass = "font-mono text-xs text-[var(--brand-cream)]/40 uppercase tracking-widest block mb-2";

    return (
        <div className="">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm text-[var(--brand-cream)]/50 font-mono tracking-widest uppercase">Delivery Address</h2>
                <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-[var(--brand-flame)] hover:text-[#C94808] transition-colors font-mono uppercase tracking-widest"
                >
                    Edit Address
                </button>
            </div>
            {isEditing ? (
                <div className="space-y-4">
                    <div>
                        <label className={labelClass}>
                            Flat/House Number*
                        </label>
                        <input
                            type="text"
                            value={address.flatNumber}
                            onChange={(e) =>
                                setAddress((prev) => ({ ...prev, flatNumber: e.target.value }))
                            }
                            className={inputClass}
                            placeholder="e.g., Flat 123, Shop 45"
                            required
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
                            Building/Society Name*
                        </label>
                        <input
                            type="text"
                            value={address.buildingName}
                            onChange={(e) =>
                                setAddress((prev) => ({ ...prev, buildingName: e.target.value }))
                            }
                            className={inputClass}
                            placeholder="e.g., Sunshine Apartments"
                            required
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
                            Street Address*
                        </label>
                        <input
                            type="text"
                            value={address.streetAddress}
                            onChange={(e) =>
                                setAddress((prev) => ({ ...prev, streetAddress: e.target.value }))
                            }
                            className={inputClass}
                            placeholder="e.g., MG Road, 4th Cross"
                            required
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
                            Landmark
                        </label>
                        <input
                            type="text"
                            value={address.landmark}
                            onChange={(e) =>
                                setAddress((prev) => ({ ...prev, landmark: e.target.value }))
                            }
                            className={inputClass}
                            placeholder="e.g., Near Post Office"
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
                            Area*
                        </label>
                        <input
                            type="text"
                            value={address.area}
                            onChange={(e) =>
                                setAddress((prev) => ({ ...prev, area: e.target.value }))
                            }
                            className={inputClass}
                            placeholder="e.g., Borivali West"
                            required
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
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
                            className={inputClass}
                            placeholder="e.g., 400092"
                            maxLength={6}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
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
                            variant="primary"
                        >
                            {loading ? "Saving..." : "Save Address"}
                        </Button>
                    </div>
                </div>
            ) : (
                <div>
                    {address.flatNumber ? (
                        <div className="flex gap-4 p-4 rounded-xl border border-[var(--brand-border)] bg-[var(--brand-dark)]">
                            <div className="mt-1 shrink-0">
                                <Home size={18} className="text-[var(--brand-flame)]" />
                            </div>
                            <p className="text-[var(--brand-cream)]/70 text-sm font-body leading-relaxed whitespace-pre-wrap">
                                {`${address.flatNumber}, ${address.buildingName}, ${address.streetAddress}, ${address.landmark ? address.landmark + ", " : ""}${address.area}, ${address.pincode}`}
                            </p>
                        </div>
                    ) : (
                        <div className="p-5 border border-dashed border-[var(--brand-border)] rounded-xl flex flex-col items-center gap-3">
                            <p className="text-[var(--brand-cream)]/40 text-sm font-mono">No address found. Please add your delivery address.</p>
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