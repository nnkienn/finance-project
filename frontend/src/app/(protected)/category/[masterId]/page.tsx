"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hook/useAppDispatch";
import { getMasterCategoryById } from "@/service/masterCategoryService";
import { addUserCategory } from "@/store/slice/userCategorySlice";

export default function UserCategoryPage() {
  const params = useParams();
  const masterId = Number(params.masterId); // 👈 lấy từ URL
  const dispatch = useAppDispatch();

  const [master, setMaster] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (masterId) {
      getMasterCategoryById(masterId).then(setMaster);
    }
  }, [masterId]);

  const handleCreate = async () => {
    if (!master) return;
    setLoading(true);
    try {
      await dispatch(
        addUserCategory({
          name: master.name,
          icon: master.icon,
          masterCategoryId: master.id,
        })
      ).unwrap();

      alert("✅ User category created!");
    } catch (err) {
      console.error("Create user category failed", err);
      alert("❌ Failed to create user category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-lg font-bold">Category #{masterId}</h1>
      {master && (
        <div>
          <p className="flex items-center gap-2">
            <span className="text-2xl">{master.icon}</span>
            <span>{master.name}</span>
          </p>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg mt-4 hover:bg-pink-600 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add to My Categories"}
          </button>
        </div>
      )}
    </div>
  );
}
