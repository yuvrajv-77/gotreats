import React from "react";
import { Check, Loader, Truck, Circle, X, TriangleAlert } from "lucide-react";

interface StatusBadgeProps {
  status: "received" | "preparing" | "out for delivery" | "delivered" | "cancelled" | "pending" | "failed";
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "received":
        return <Check className="h-3.5 w-3.5" />;
      case "preparing":
        return <Loader className="h-3.5 w-3.5 animate-spin" />;
      case "out for delivery":
        return <Truck className="h-3.5 w-3.5" />;
      case "delivered":
        return <Circle className="h-3.5 w-3.5" />;
      case "cancelled":
        return <X className="h-3.5 w-3.5" />;
      case "pending":
        return <Loader className="h-3.5 w-3.5 animate-spin" />;
      case "failed":
        return <TriangleAlert className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "received":
        return "bg-orange-500 text-white";
      case "preparing":
        return "bg-yellow-500 text-white";
      case "out for delivery":
        return "bg-blue-500 text-white";
      case "delivered":
        return "bg-green-700 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      case "pending":
        return "bg-gray-400 text-white";
      case "failed":
        return "bg-red-400 text-white";
      default:
        return "bg-gray-300 text-gray-800";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "received":
        return "Received";
      case "preparing":
        return "Preparing";
      case "out for delivery":
        return "Out for Delivery";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Canceled";
      case "pending":
        return "Pending";
      case "failed":
        return "Failed";
      default:
        return "Unknown";
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${getStatusColor()} ${className}`}
    >
      {getStatusIcon()}
      <span>{getStatusLabel()}</span>
    </div>
  );
}