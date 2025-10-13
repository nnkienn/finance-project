"use client";

import { useState } from "react";
import AddSavingModel from "./AddSavingModel";
import { SavingGoalResponse } from "@/service/savingService";

type Props = {
  saving: SavingGoalResponse;
  onSave: (payload: {
    id: number;
    name?: string;
    targetAmount?: number;
    startDate?: string | null;
    endDate?: string | null;
    description?: string | null;
  }) => Promise<void> | void;
  onClose: () => void;
  isOpen: boolean;
};

/**
 * EditSavingModal
 * - hiển thị modal chỉnh sửa mục tiêu tiết kiệm (name, target, description, start/end date)
 * - tự prefill dữ liệu hiện tại
 * - nếu user không chỉnh thì giữ nguyên giá trị cũ
 */
export default function EditSavingModal({ saving, onSave, onClose, isOpen }: Props) {
  // convert start/end date ISO -> yyyy-MM-dd cho input type="date"
  const normalizeDate = (d?: string | null) => {
    if (!d) return null;
    try {
      return d.split("T")[0]; // "2025-06-30T00:00:00" -> "2025-06-30"
    } catch {
      return null;
    }
  };

  const [formData, setFormData] = useState({
    name: saving.name ?? "",
    targetAmount: saving.targetAmount?.toString() ?? "",
    startDate: normalizeDate(saving.startDate),
    endDate: normalizeDate(saving.endDate),
    description: saving.description ?? "",
  });

  const handleSave = async (data: any) => {
    const merged = {
      id: saving.id,
      name: data.name ?? formData.name,
      targetAmount: Number(data.targetAmount ?? formData.targetAmount),
      startDate: data.startDate ?? formData.startDate,
      endDate: data.endDate ?? formData.endDate,
      description: data.description ?? formData.description,
    };

    await onSave(merged);
  };

  return (
    <AddSavingModel
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      initialData={{
        id: saving.id,
        name: formData.name,
        targetAmount: formData.targetAmount,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description,
      }}
    />
  );
}
