import { useState, useEffect } from "react";
import { transactionService } from "@/service/transactionService";

export function useTimeseries(initialFrom: string, initialTo: string) {
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [data, setData] = useState<{date: string; income: number; expense: number; net: number;}[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await transactionService.getTimeseries({ from, to, granularity: "DAILY" });
      setData(res.points);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [from, to]);

  return { from, to, setFrom, setTo, data, loading };
}
