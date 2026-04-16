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
        return <Check className="h-3 w-3" />;
      case "preparing":
        return <Loader className="h-3 w-3 animate-spin" />;
      case "out for delivery":
        return <Truck className="h-3 w-3" />;
      case "delivered":
        return <Circle className="h-3 w-3" />;
      case "cancelled":
        return <X className="h-3 w-3" />;
      case "pending":
        return <Loader className="h-3 w-3 animate-spin" />;
      case "failed":
        return <TriangleAlert className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "received":
        return "bg-orange-500/15 text-orange-400 border border-orange-500/30";
      case "preparing":
        return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30";
      case "out for delivery":
        return "bg-blue-500/15 text-blue-400 border border-blue-500/30";
      case "delivered":
        return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
      case "cancelled":
        return "bg-red-500/15 text-red-400 border border-red-500/30";
      case "pending":
        return "bg-[var(--brand-muted)]/15 text-[var(--brand-muted)] border border-[var(--brand-muted)]/30";
      case "failed":
        return "bg-red-400/15 text-red-400 border border-red-400/30";
      default:
        return "bg-[var(--brand-border)] text-[var(--brand-cream)]/50 border border-[var(--brand-border)]";
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
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase ${getStatusColor()} ${className}`}
    >
      {getStatusIcon()}
      <span>{getStatusLabel()}</span>
    </div>
  );
}