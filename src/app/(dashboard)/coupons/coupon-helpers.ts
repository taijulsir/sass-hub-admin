import { useState, useCallback } from "react";
import { toast } from "sonner";
import api from "@/lib/api";

export const useCouponHandlers = (refresh: () => void) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);

  const handleViewCoupon = useCallback((coupon: any) => {
    setSelectedCoupon(coupon);
    setIsViewModalOpen(true);
  }, []);

  const handleEditCoupon = useCallback((coupon: any) => {
    setSelectedCoupon(coupon);
    setIsEditModalOpen(true);
  }, []);

  const handleDeleteCoupon = useCallback(async (coupon: any) => {
    if (!confirm(`Are you sure you want to delete coupon ${coupon.code}?`)) return;
    try {
      await api.delete(`/coupons/${coupon._id}`);
      toast.success("Coupon deleted successfully");
      refresh();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete coupon");
    }
  }, [refresh]);

  const handleToggleCoupon = useCallback(async (coupon: any) => {
    try {
      await api.patch(`/coupons/${coupon._id}/toggle-status`, { active: !coupon.isActive });
      toast.success(`Coupon ${coupon.isActive ? "paused" : "activated"} successfully`);
      refresh();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    }
  }, [refresh]);

  return {
    isViewModalOpen,
    setIsViewModalOpen,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    selectedCoupon,
    handleViewCoupon,
    handleEditCoupon,
    handleDeleteCoupon,
    handleToggleCoupon,
  };
};
